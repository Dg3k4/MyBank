import jwt from "jsonwebtoken";
import {RefreshToken} from "../models/index.js"
import bcrypt from "bcrypt";
import UserDTO from "../dtos/userDto.js";
import ApiError from "../error/ApiError.js"

class TokenService {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });
        const hashRefresh = await bcrypt.hash(refreshToken, Number(process.env.BCRYPT_SALT))
        console.log("Всё работает - Генерация и хеширование токена пользователя")
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            hashRefresh: hashRefresh
        }
    }

    async saveToken(userId, tokenHash, sessionId) {
        if (sessionId) {
            const tokenData = await RefreshToken.findOne({where: {id: sessionId}})
            if (tokenData) {
                tokenData.tokenHash = tokenHash
                console.log("Всё работает - Сохранение токена")
                return tokenData.save()
            }
        }
        const token = await RefreshToken.create({tokenHash: tokenHash, userId: userId})
        return token
    }

    async refreshUserToken(newUserData, oldUserData) {
        const userDto = new UserDTO(newUserData, oldUserData.roles, oldUserData.sessionId)
        const token = await this.generateTokens({...userDto});
        await this.saveToken(userDto.id, token.hashRefresh, userDto.sessionId)
        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            user: userDto
        }
    }

    async removeToken(refreshToken) {
        const {tokenData} = await this.validateRefreshToken(refreshToken)
        await RefreshToken.destroy({where: {id: tokenData.id}})
        return tokenData
    }

    async createUserTokens(user) {
        const roles = await user.getRoles()
        const session = await RefreshToken.create({userId: user.id, tokenHash: "pending"})
        const userDto = new UserDTO(user, roles, session.id) // id, email, isActivated, roles
        const tokens = await this.generateTokens({...userDto})

        await this.saveToken(userDto.id, tokens.hashRefresh, userDto.sessionId)

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userDto,
        }
    }

    async validateRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized()
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        if (!payload) {
            throw ApiError.unauthorized()
        }
        const tokenData = await RefreshToken.findOne({where: {id: payload.sessionId}});
        if (!tokenData) {
            throw ApiError.forbidden("Incorrect access")
        }
        const isValid = await bcrypt.compare(refreshToken, tokenData.tokenHash)
        if (!isValid) {
            throw ApiError.forbidden("Incorrect access")
        }
        console.log("Всё работает - Валидация рефреш токена")
        return {payload: payload, tokenData: tokenData}
    }

    validateAccessToken(accessToken) {
        try {
            if (!accessToken) {
                return null;
            }
            const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            return payload;
        } catch (e) {
            return null;
        }
    }

    async removeRefreshToken(refreshToken) {
        if (!refreshToken) {
            console.log("Refresh token is missing")
            return;
        }
        try {
            await this.removeToken(refreshToken);
        } catch (e) {
            console.log("Invalid token. Failed to remove refresh token")
        }
    }

    async deleteAllRefreshTokens(userId) {
        return await RefreshToken.destroy({where: {userId: userId}})
    }
}

export default new TokenService();