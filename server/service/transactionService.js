import sequelize from "../db.js"
import {BankAccount, Card, CardLimitUsage, Transaction} from "../models/index.js"
import ApiError from "../error/ApiError.js"

class TransactionService {
    async getUserCard(cardId, userId, t) {
        const card = await Card.findOne({
            where: {id: cardId},
            include: [{
                model: BankAccount,
                where: {userId: userId},
            }],
            transaction: t,
            lock: t.LOCK.UPDATE
        })
        if (!card) {
            throw ApiError.notFound("Card not found")
        }
        return card
    }

    async getCard(cardId, t) {
        const card = await Card.findOne({
            where: {id: cardId},
            include: [BankAccount],
            transaction: t,
            lock: t.LOCK.UPDATE
        })
        if (!card) {
            throw ApiError.notFound("Card not found")
        }
        return card
    }

    async ensureTransferAllowed({card, account, t, isSender = false, amount = null}) {
        if (isSender) {
            if (!["active", "pending"].includes(account.status)) {throw ApiError.badRequest("Operation is not allowed")}
            if (!["active", "pending"].includes(card.status)) {throw ApiError.badRequest("Operation is not allowed")}
            if (Number(account.balance) < Number(amount)) {throw ApiError.badRequest("Insufficient funds on balance")}
            if (Number(card.spendingLimit) < Number(amount)) {throw ApiError.badRequest("Insufficient funds on balance")}
            if (card.dailyLimit !== null || card.monthlyLimit!== null) {await this.checkLimitUsage(card, amount, t)}
        } else {
            if (!["active", "frozen", "pending"].includes(account.status)) {throw ApiError.badRequest("Operation is not allowed")}
            if (!["active", "frozen", "pending"].includes(card.status)) {throw ApiError.badRequest("Operation is not allowed")}
        }
    }

    async checkLimitUsage(card, amount, t) {
        const today = new Date()

        const [limitData, created] = await CardLimitUsage.findOrCreate({where: {cardId: card.id}, defaults: {
            monthlyPeriod: today,
            dailyPeriod: today,
        },
            transaction: t, lock: t.LOCK.UPDATE
        })
        await limitData.reload({transaction: t, lock: t.LOCK.UPDATE})

        if (card.dailyLimit !== null) {
            const dailyUsage = limitData.dailyPeriod

            if (dailyUsage.getDate() !== today.getDate() || dailyUsage.getMonth() !== today.getMonth() || dailyUsage.getFullYear() !== today.getFullYear()) {
                limitData.dailyPeriod = today
                limitData.dailySpent = 0
            }
            const dailySpent = Number(limitData.dailySpent)

            if (Number(card.dailyLimit) - dailySpent < amount) {
                throw ApiError.badRequest("Reached funds limit")
            }
            limitData.dailySpent = dailySpent + amount
        }

        if (card.monthlyLimit !== null) {
            const monthlyUsage = limitData.monthlyPeriod

            if (monthlyUsage.getMonth() !== today.getMonth() || monthlyUsage.getFullYear() !== today.getFullYear()) {
                limitData.monthlyPeriod = today
                limitData.monthlySpent = 0
            }
            const monthlySpent = Number(limitData.monthlySpent)

            if (Number(card.monthlyLimit) - monthlySpent < amount) {
                throw ApiError.badRequest("Reached funds limit")
            }
            limitData.monthlySpent = monthlySpent + amount
        }

        await limitData.save({transaction: t})
    }

    async makeTransfer({userId, fromCardId, toCardId, amount, description}) {
        amount = Number(amount)

        return await sequelize.transaction(async (t) => {
            const fromCard = await this.getUserCard(fromCardId, userId, t);
            const toCard = await this.getCard(toCardId, t);

            if (fromCard.bankAccount.currency !== toCard.bankAccount.currency) {
                throw ApiError.badRequest("Currency mismatch")
            }
            if (fromCard.id === toCard.id) {
                throw ApiError.badRequest("Cannot transfer to the same card")
            }

            await this.ensureTransferAllowed({card: fromCard, account: fromCard.bankAccount, isSender: true, amount: amount, t: t}) // Отправитель
            await this.ensureTransferAllowed({card: toCard, account: toCard.bankAccount, t: t}) // Получатель
            await this.applyBalanceChange({fromCard: fromCard, toCard: toCard, fromAccount: fromCard.bankAccount, toAccount: toCard.bankAccount, amount: amount, t: t})

            return await Transaction.create({
                operationType: "transfer",
                operationAmount: amount,
                operationCurrency: fromCard.bankAccount.currency,
                operationStatus: "success",
                fromAccountId: fromCard.bankAccount.id,
                toAccountId: toCard.bankAccount.id,
                fromCardId: fromCard.id,
                toCardId: toCard.id,
                description: description,
            }, {transaction: t})
        })
    }

    async applyBalanceChange({fromCard, toCard, fromAccount, toAccount, amount, t}) {
        // Отправитель
        fromCard.spendingLimit = Number(fromCard.spendingLimit) - amount
        fromAccount.balance = Number(fromAccount.balance) - amount
        // Получатель
        toCard.spendingLimit = Number(toCard.spendingLimit) + amount
        toAccount.balance = Number(toAccount.balance) + amount

        await fromCard.save({transaction: t})
        await fromAccount.save({transaction: t})
        await toCard.save({transaction: t})
        await toAccount.save({transaction: t})
    }
}

export default new TransactionService()