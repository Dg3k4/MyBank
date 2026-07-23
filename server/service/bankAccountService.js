import {BankAccount, Transaction, Card} from "../models/index.js";
import ApiError from "../error/ApiError.js"
import {generateAccountNumber} from "../utils/generators.js"
import {Op} from "sequelize";

class BankAccountService {
    async createBankAccount({userId, currency, type, nickName, t} = {}) {
        const errors = [!userId && "User is required", !currency && "Currency is required", !type && "Type is required"].filter(Boolean);
        if (errors.length) {
            throw ApiError.badRequest("Required data is missing", errors)
        }

        let accountNumber = generateAccountNumber()
        const checkCollision = async () => {
            const check = await BankAccount.findOne({where: {accountNumber: accountNumber}})
            if (check) {
                accountNumber = generateAccountNumber();
                return await checkCollision()
            }
        }
        await checkCollision();
        const createAccount = await BankAccount.create({userId: userId, currency: currency, type: type, accountNumber: accountNumber,
            ...(nickName && {nickName: nickName})
        }, {
            ...(t && {transaction: t}) // Счёт можно создать отдельно, без карты. Поэтому проверка на транзакцию
        })
        return createAccount
    }

    async getAllUserAccounts(userId) {
        return await BankAccount.findAll({where: {userId: userId}});
    }

    async getAccountById(userId, accountId) {
        const account = await BankAccount.findOne({where: {id: accountId, userId: userId}})

        if (!account) {
            throw ApiError.notFound("Bank account is not found")
        }
        return account
    }

    async getAccountCandidate({userId, currency, type} = {}) {
        const errors = [!userId && "User id is required", !currency && "Bank currency is required", !type && "Bank account type is required"].filter(Boolean);
        if (errors.length) {throw ApiError.badRequest("Insufficient data to check bank account", errors)}
        return await BankAccount.findOne({where: {currency: currency, userId: userId, type: type}})
    }

    async getTransactionsPagination({userId, accountId, page = 1, limit = 30}) {
        await this.getAccountById(userId, accountId)

        limit = Number.isInteger(limit) && limit >= 10 ? Math.min(limit, 100) : 30 // Чтоб не было запроса на миллион строк
        const offset = (page - 1) * limit

        const transaction = await Transaction.findAll({
            where: {
                [Op.or]: [
                    {fromAccountId: accountId},
                    {toAccountId: accountId},
                ]
            },
            include: [
                {model: Card},
                {model: BankAccount, as: "FromAccount"},
                {model: BankAccount, as: "ToAccount"},
            ],
            order: [["createdAt", "DESC"]],
            limit: limit,
            offset: offset,
        })

        return transaction
    }

    async doCloseRequest(userId, accountId) {
        const account = await this.getAccountById(userId, accountId)
        if (account.status !== "active") {
            throw ApiError.badRequest("This account cannot be closed", [{code:"ACCOUNT_NOT_ACTIVE", status: account.status}])
        }

        account.status = "pending"
        return await account.save()
    }

    async changeNickName(userId, accountId, nickName) {
        const account = await this.getAccountById(userId, accountId)

        account.nickName = nickName
        return await account.save()
    }
}

export default new BankAccountService()