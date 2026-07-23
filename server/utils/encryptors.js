import crypto from "crypto"
import ApiError from "../error/ApiError.js";

class CardEncryption {
    encryptCardNumber(cardNumber) {
        if (!cardNumber) {throw ApiError.badRequest("Card number is required")}

        const key = Buffer.from(process.env.CARD_ENCRYPTION_KEY, "hex")
        const iv = (crypto.randomBytes(12))

        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, {authTagLength: 16})

        const encrypted = Buffer.concat([
            cipher.update(cardNumber, "utf8"),
            cipher.final()
        ])
        const authTag = cipher.getAuthTag()

        return [
            iv.toString("hex"),
            authTag.toString("hex"),
            encrypted.toString("hex")
        ].join(":")
    }

    decryptCardNumber(encryptedCardNumber) {
        if (!encryptedCardNumber) {throw ApiError.badRequest("Encrypted card number is required")}

        const [ivHex, authTagHex, encryptedHex] = encryptedCardNumber.split(":")
        if (!ivHex || !authTagHex || !encryptedHex) {throw ApiError.badRequest("Invalid encrypt format")}

        const key = Buffer.from(process.env.CARD_ENCRYPTION_KEY, "hex")
        const iv = Buffer.from(ivHex, "hex")
        const authTag = Buffer.from(authTagHex, "hex")
        const encrypted = Buffer.from(encryptedHex, "hex")

        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
        decipher.setAuthTag(authTag)

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ])
        return decrypted.toString("utf8")
    }
}

export default new CardEncryption()