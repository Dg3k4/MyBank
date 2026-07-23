import {UserBlocked, UserLoginAttempt, UserSecurityState} from "../models/index.js"
import ApiError from "../error/ApiError.js"

class SecurityService {
    async createSecurityState(userId) {
        return UserSecurityState.findOrCreate({where: {userId: userId}, defaults: {userId: userId}}) // defaults является именно информацией для создания, при отсутствии записи. В данном случае userId дублируется намеренно для наглядности
    }

    async findSecurityState(userId) {
        let securityState = await UserSecurityState.findOne({where: {userId: userId}})
        if (!securityState) {
            securityState = await UserSecurityState.create({userId: userId})
        }
        return securityState
    }

    async registerPinAttempt(userId, isSuccess) {
        let securityState = await this.findSecurityState(userId)
        if (isSuccess) {
            securityState.pinFailedAttempts = 0
            securityState.pinBlockedUntil = null
            securityState.pinBlockLevel = 0
        } else {
            securityState.pinFailedAttempts += 1

            if (securityState.pinFailedAttempts >= 5) {
                securityState.pinFailedAttempts = 0

                const blockedTime = 15 * 60 * 1000 * 2**securityState.pinBlockLevel
                securityState.pinBlockedUntil = new Date(Date.now() + blockedTime)
                securityState.pinBlockLevel += 1
            }
        }
        return await securityState.save();
    }

    async checkUserPinBlock(userId) {
        const securityState = await this.findSecurityState(userId)
        if (securityState.pinBlockedUntil && securityState.pinBlockedUntil > Date.now()) {
            const timeLeft = securityState.pinBlockedUntil - Date.now()
            throw ApiError.forbidden("PIN is temporarily blocked", [{code: "PIN_BLOCKED", msLeft: timeLeft, blockedUntil: securityState.pinBlockedUntil}])
        }
    }

    async blockUser({userId, reason, blockedUntil, comment = null, blockedByAdminId = null}) {
        if (userId == null) {
            throw ApiError.badRequest("User id is required")
        }
        if (typeof reason === "string" && !reason?.trim()) {
            throw ApiError.badRequest("Reason is required")
        }
        if (!(blockedUntil instanceof Date) || Number.isNaN(blockedUntil.getTime())) {
            throw ApiError.badRequest("Invalid date data")
        }

        const doBlock = await UserBlocked.create({userId: userId, comment: comment, reason: reason, blockedUntil: blockedUntil, blockedByAdminId: blockedByAdminId})
        return doBlock
    }

    async archiveLoginAttempt({userId, ip, success, userAgent}) {
        const createPost = await UserLoginAttempt.create({userId: userId, ip: ip, success: success, userAgent: userAgent})
        return createPost
    }

    async registerLoginAttempt({userId, isSuccess, ip = null, userAgent = null}) {
        let securityState = await this.findSecurityState(userId)
        if (isSuccess) {
            securityState.loginFailedAttempts = 0
            securityState.loginBlockedUntil = null
            securityState.loginBlockLevel = 0

            await this.archiveLoginAttempt({userId: userId, ip: ip, userAgent: userAgent, success: true});
        } else {
            securityState.loginFailedAttempts += 1
            await this.archiveLoginAttempt({userId: userId, ip: ip, userAgent: userAgent, success: false});

            if (securityState.loginFailedAttempts >= 3) {
                securityState.loginFailedAttempts = 0

                const blockedTime = 60 * 60 * 1000 * 2**securityState.loginBlockLevel
                securityState.loginBlockedUntil = new Date(Date.now() + blockedTime)
                securityState.loginBlockLevel += 1

                await this.blockUser({userId: userId, reason: "EXCEEDED_LOGIN_ATTEMPTS", blockedUntil: securityState.loginBlockedUntil,
                                                                                 comment: "Autoblock due to exceeded login attempts."})
            }
        }
        return await securityState.save();
    }

    async checkUserBlock(userId) {
        const blockInfo = await UserBlocked.findOne({where: {userId: userId, isActive: true}, order: [["createdAt", "DESC"]]})
        if (!blockInfo) {
            return null;
        }

        if (blockInfo.blockedUntil <= new Date()) {
            blockInfo.isActive = false
            return await blockInfo.save();
        }

        const timeLeft = blockInfo.blockedUntil - Date.now()
        throw ApiError.forbidden("User is temporarily blocked", [{code: "USER_BLOCKED", msLeft: timeLeft, blockedUntil: blockInfo.blockedUntil, reason: blockInfo.reason}])
    }

    async checkLoginBlock(userId) {
        const securityState = await this.findSecurityState(userId)
        if (securityState.loginBlockedUntil && securityState.loginBlockedUntil > new Date()) {
            const timeLeft = securityState.loginBlockedUntil - Date.now()
            throw ApiError.forbidden("User is temporarily blocked", [{code: "USER_BLOCKED", msLeft: timeLeft, blockedUntil: securityState.loginBlockedUntil}])
        }
    } // Пока не уверен в его надобности. Скорее всего на удаление
}

export default new SecurityService()