import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js"
import userService from "./userService.js";
import securityService from "./securityService.js";

class PinService {
    async createPin(pinCode, refreshToken) {
        const {user, payload} = await userService.findUserFromRefreshToken(refreshToken)
        if (!user) {
            throw ApiError.notFound("User is not found")
        }
        const sessionId = payload.sessionId

        if (user.pinHash) {
            throw ApiError.badRequest("PIN already exists", [])
        }
        const pinToken = await this.generatePinToken(user, sessionId)
        const pinHash = await this.hashPin(pinCode)
        user.pinHash = pinHash;
        await user.save()

        return {pinToken: pinToken}
    }

    async generatePinToken(user, sessionId) {
        return jwt.sign({id: user.id, sessionId: sessionId, type: "PIN_VERIFIED"}, process.env.JWT_PIN_SECRET, {expiresIn: "3m"});
    }

    async hashPin(pinCode) {
        return bcrypt.hash(pinCode, Number(process.env.BCRYPT_SALT))
    }

    async verifyPin(pinCode, refreshToken) {
        const {user, payload} = await userService.findUserFromRefreshToken(refreshToken)

        if (!user) {
            throw ApiError.unauthorized()
        }
        if (!user.pinHash) {
            throw ApiError.badRequest("PIN is not created", [{code: "PIN_REQUIRED"}])
        }
        if (!pinCode) {
            throw ApiError.forbidden("PIN is missing")
        }

        await securityService.checkUserPinBlock(user.id)

        const dbPinCode = user.pinHash;
        const isValid = await bcrypt.compare(pinCode, dbPinCode)
        if (!isValid) {
            const securityState = await securityService.registerPinAttempt(user.id, false)
            const attemptsLeft = (securityState.pinFailedAttempts === 0 ? 0 : 5 - securityState.pinFailedAttempts) // pinFailedAttempts сбрасывается в 0 только при достижении лимита.
            throw ApiError.badRequest("Wrong PIN", [{attemptsLeft: attemptsLeft}]) // Поэтому после неудачной попытки 0 означает, что это была 5-я попытка и пользователь заблочен.
        }
        const pinToken = await this.generatePinToken(user, payload.sessionId)

        await securityService.registerPinAttempt(user.id, true)
        return {pinToken: pinToken}
    }

    async verifyPinToken(pinToken, userId, sessionId) {
        if (!pinToken) {
            throw ApiError.forbidden("PIN is missing", [])
        }
        const payload = jwt.verify(pinToken, process.env.JWT_PIN_SECRET)

        if (!payload) {
            throw ApiError.forbidden("Identity not approved by pin", [])
        }
        if (userId !== payload.id) {
            throw ApiError.forbidden("Invalid PIN", [])
        }
        if (sessionId !== payload.sessionId) {
            throw ApiError.forbidden("Invalid PIN session", [])
        }

        return payload
    }

    async updatePin(newPinCode, oldPinCode, refreshToken) {
        const {user} = await userService.findUserFromRefreshToken(refreshToken)
        const checkPin = await this.verifyPin(oldPinCode, refreshToken)
        const pinToken = checkPin.pinToken
        const pinHash = await this.hashPin(newPinCode)

        user.pinHash = pinHash
        await user.save()

        return {pinToken: pinToken}
    }
}

export default new PinService()