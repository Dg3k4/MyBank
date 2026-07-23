import {User, ActivationToken, Role, UserBlocked} from "../models/index.js"
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import mailService from "./mailService.js";
import tokenService from "./tokenService.js";
import securityService from "./securityService.js";
import UserDTO from "../dtos/userDto.js"
import ApiError from "../error/ApiError.js"

class UserService {
    async registrationUser({email, password, firstName, lastName, phoneNumber, middleName = null, birthday = null }) {
        const candidate = await User.findOne({where: {email: email}})
        if (candidate) {
            throw ApiError.badRequest(`${email} is already registered`, [])
        }
        const hashPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT))
        const user = await User.create({email: email, passwordHash: hashPassword, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, middleName: middleName, birthday: birthday})
        await securityService.createSecurityState(user.id)

        let clientRole = await Role.findOne({where: {role: "CLIENT"}})
        if (!clientRole) {
            clientRole = await Role.create({role: "CLIENT"})
        }
        await user.addRole(clientRole)

        const activationToken = uuidv4();
        const activationLink = `${process.env.API_URL}/api/user/activate/${activationToken}`
        await ActivationToken.create({token: activationToken, userId: user.id})

        await mailService.sendActivationMail(email, activationLink)

        const createTokens = await tokenService.createUserTokens(user)

        return {user: createTokens}
    }

    async login({email, password, ip, userAgent}) {
        const user = await User.findOne({wrehe: {email: email}});

        if (!user) {
            throw ApiError.notFound(`User with ${email} not found`)
        }
        await securityService.checkUserBlock(user.id)

        const isPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isPassword) {
            await securityService.registerLoginAttempt({userId: user.id, isSuccess: false, ip: ip, userAgent: userAgent})
            throw ApiError.badRequest(`Incorrect password`)
        }

        await securityService.registerLoginAttempt({userId: user.id, isSuccess: true, ip: ip, userAgent: userAgent})
        return tokenService.createUserTokens(user)
    }

    async logout(refreshToken) {
        console.log("Всё работает - Юзер сервис")
        return await tokenService.removeToken(refreshToken)
    }

    async activate(activationToken) {
        const activationCheck = await ActivationToken.findOne({where: {token: activationToken}})
        if (!activationCheck) {
            throw new ApiError(`Invalid activation token`, [])
        }
        const user = await User.findOne({where: {id: activationCheck.userId}})
        if (!user) {
            throw new ApiError(`Failed to activate account`, [])
        }
        user.isActivated = true;
        await user.save()

        await activationCheck.destroy()
        const userDto = new UserDTO(user, ["CLIENT"]) // id, email, isActivated, roles

        return {user: userDto}
    }

    async refresh(refreshToken) {
        const validateRefreshToken = await tokenService.validateRefreshToken(refreshToken) // payload, hashTokenData
        const user = await User.findByPk(validateRefreshToken.payload.id)
        try {
            await securityService.checkUserBlock(user.id)
        } catch (e) {
            if (e.errors?.[0]?.code === "USER_BLOCKED") {
                const closeAllSessions = await tokenService.deleteAllRefreshTokens(user.id)
                console.log(closeAllSessions)
            }

            throw e
        }

        return await tokenService.refreshUserToken(user, validateRefreshToken.payload) // access, refresh
    }

    async findUserFromRefreshToken(refreshToken) {
        const userData = (await tokenService.validateRefreshToken(refreshToken)).payload
        const user = await User.findByPk(userData.id);
        await securityService.checkUserBlock(user.id)
        return {user: user, payload: userData}
    }

    // Точно доступно только после мидлов

    async getUserById(userId) {
        const userData = await User.findByPk(userId)
        if (!userData) {
            throw ApiError.notFound("User is not found")
        }

        return userData
    }

    async doCloseRequest({userId}) {
        return await UserBlocked.create({userId: userId, reason: "pending", comment: "block request", isActive: false})
    }
}

export default new UserService()