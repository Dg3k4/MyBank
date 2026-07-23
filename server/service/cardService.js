import {BankAccount, Card} from "../models/index.js"
import ApiError from "../error/ApiError.js"
import {generateCardNumber, cardEncryption} from "../utils/index.js"
import bankAccountService from "./bankAccountService.js"
import sequelize from "../db.js"
import crypto from "crypto"

class CardService {
    async createCard({firstName, secondName, cardType, bankAccountId = null, parentCardId = null, userId, currency, type, nickName}) {
        if (!firstName || !secondName) {
            throw ApiError.badRequest("First name and second name is required")
        }

        const holderName = `${firstName.toUpperCase()} ${secondName.toUpperCase()}`
        const cardNumber = generateCardNumber()
        const cardNumberEncrypted = cardEncryption.encryptCardNumber(cardNumber.join(""))
        const cardNumberHash = crypto.createHmac("sha256", process.env.SHA256_SECRET_KEY).update(cardNumber.join("")).digest("hex")

        if (cardType === "main" ) {
            return this.issueMainCard({
                userId: userId, currency: currency, type: type, nickName: nickName, // Для создания счёта
                holderName: holderName, cardType: cardType, cardNumber: cardNumber, cardNumberEncrypted: cardNumberEncrypted, cardNumberHash: cardNumberHash // Для создания карты
            })
        }
        if (cardType === "additional") {
            return await this.issueAdditionalCard({
                parentCardId: parentCardId, userId: userId, bankAccountId: bankAccountId,
                holderName: holderName, cardNumber: cardNumber, cardNumberEncrypted: cardNumberEncrypted, cardNumberHash: cardNumberHash
            })
        }
        if (cardType === "shared") {
            return await this.createSharedCard()
        }
    }

    async issueMainCard({userId, currency, type, nickName, holderName, cardNumber, cardNumberEncrypted, cardNumberHash}) {
        return await sequelize.transaction(async (t) => {
            let bankAccount = await bankAccountService.getAccountCandidate({userId: userId, currency: currency, type: type})
            if (bankAccount) {
                await this.checkMainCardCandidate(bankAccount.id)
            } else {
                bankAccount = await bankAccountService.createBankAccount({
                    userId: userId, currency: currency, type: type, nickName: nickName, t: t
                })
            }

            return await this.createMainCard({
                holderName: holderName, cardNumber: cardNumber, cardNumberEncrypted: cardNumberEncrypted, cardNumberHash: cardNumberHash, bankAccountId: bankAccount.id, t: t
            })
        })
    }

    async checkMainCardCandidate(bankAccountId) {
        const card = await Card.findOne({where: {bankAccountId: bankAccountId, cardType: "main"}})
        if (card) {
            throw ApiError.badRequest("This account already have a main card")
        }
    }

    async createMainCard({bankAccountId, holderName, cardNumber, cardNumberEncrypted, cardNumberHash, t}) {
        this.cardDataCheck({
            cardNumber: cardNumber, cardNumberEncrypted: cardNumberHash, cardNumberHash: cardNumberHash, holderName: holderName, bankAccountId: bankAccountId
        })

        const expirationDate = new Date()
        expirationDate.setFullYear(expirationDate.getFullYear() + 4)

        return await Card.create({
            cardNumberEncrypted: cardNumberEncrypted, cardNumberHash:cardNumberHash, cardNumberLast4: cardNumber[3], holderName: holderName,
            expirationDate: expirationDate, cardType: "main", status: "active", bankAccountId: bankAccountId
        }, {transaction: t})
    }

    async issueAdditionalCard({parentCardId, userId, bankAccountId, holderName, cardNumber, cardNumberEncrypted, cardNumberHash} = {}) {
        const bankAccount = await bankAccountService.getAccountById(userId, bankAccountId) // Для проверки принадлежности счёта пользователю
        let parentCard = null
        if (parentCardId) {parentCard = await this.getCardByAccountId({cardId: parentCardId, bankAccountId: bankAccount.id})}
        return await this.createAdditionalCard({
            parentCard: parentCard, bankAccountId: bankAccount.id, holderName: holderName, cardNumber: cardNumber, cardNumberEncrypted: cardNumberEncrypted, cardNumberHash: cardNumberHash
        })
    }

    async createAdditionalCard({parentCard, bankAccountId, holderName, cardNumber, cardNumberEncrypted, cardNumberHash} = {}) {
        this.cardDataCheck({
            cardNumber: cardNumber, cardNumberEncrypted: cardNumberHash, cardNumberHash: cardNumberHash, holderName: holderName, bankAccountId: bankAccountId
        })

        let expirationDate = new Date()
        if (parentCard !== null) {
            expirationDate = parentCard.expirationDate
        } else {
            expirationDate.setFullYear(expirationDate.getFullYear() + 4)
        }

        return await Card.create({
            parentCardId: parentCard.id, cardNumberEncrypted: cardNumberEncrypted, cardNumberHash: cardNumberHash, cardNumberLast4: cardNumber[3], holderName: holderName,
            expirationDate: expirationDate, cardType: "additional", status: "active", bankAccountId: bankAccountId
        })
    }

    async createSharedCard() {
        return "Нет времени на логику. Доделаю в будущем, как будет готов основной фронтенд."
    }

    async getCardByAccountId({cardId, bankAccountId} = {}) {
        const errors = [!bankAccountId && "bankAccountId id is required", !cardId && "Card id is required"].filter(Boolean);
        if (errors.length) {throw ApiError.badRequest("Insufficient data to find bank account", errors)}
        const card = await Card.findOne({
            where: {id: cardId, bankAccountId: bankAccountId},
        })
        if (!card) {throw ApiError.notFound("Card not found")}
        return card
    }

    async getCardById(cardId) {
        if (!cardId) {throw ApiError.notFound("Card id is required")}
        const card = await Card.findByPk(cardId)
        if (!card) {throw ApiError.notFound("Card not found")}
        return card
    }

    cardDataCheck({cardNumber, cardNumberEncrypted, cardNumberHash, holderName, bankAccountId} = {}) {
        const errorsInternal = [!cardNumber && "Failed to generate card number", !cardNumberEncrypted && "Failed to generate card encrypt", !cardNumberHash && "Failed to generate card hash"].filter(Boolean);
        const errors = [!holderName && "holderName is required", !bankAccountId && "bankAccountId is required"].filter(Boolean);
        if (errorsInternal.length) {
            throw ApiError.internal()
        }
        if (errors.length) {
            throw ApiError.badRequest("Required data is missing", errors)
        }
    }
}

export default new CardService();