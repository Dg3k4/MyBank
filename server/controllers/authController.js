import userService from "../service/userService.js"
import {validationResult} from "express-validator"
import ApiError from "../error/ApiError.js";
import tokenService from "../service/tokenService.js";
import pinService from "../service/pinService.js";

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("Do not pass validation", errors.array()))
            }
            const newUser = await userService.registrationUser(req.body) //email, password, firstName, lastName, phoneNumber, middleName, birthday
            res.cookie("refreshToken", newUser.user.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: "strict"})
            return res.json({body: newUser.user, message: "Registration successful"});
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const oldRefreshToken = req.cookies.refreshToken
            const ip = req.ip
            const userAgent = req.get("User-Agent")
            if (oldRefreshToken) {
                await tokenService.removeRefreshToken(oldRefreshToken) // Удаляю старый токен из базы
            }

            const userData = await userService.login({email: email, password: password, ip: ip, userAgent: userAgent})
            res.cookie("refreshToken", userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: "strict"})
            return res.json({accessToken: userData.accessToken, user: userData.user, message: "Logged in successfully"})
        } catch (e) {
            if (e.errors?.[0]?.code === "USER_BLOCKED") {
                res.clearCookie("refreshToken")
            }
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie("refreshToken")
            console.log("Всё работает - Аутх контроллер/выход из аккаунта")
            return res.json({message: "Logout successfully", clearedTokenData: token.toJSON()})
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            console.log(userData)

            res.cookie("refreshToken", userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: "strict"})

            console.log("Всё работает - Аутх контроллер/Рефреш успешен")
            return res.json({accessToken: userData.accessToken, user: userData.user, message: "Refreshed successfully"})
        } catch (e) {
            if (e.errors?.[0]?.code === "USER_BLOCKED") {
                res.clearCookie("refreshToken")
            }

            next(e)
        }
    }

    async userActivation(req, res, next) {
        try {
            await userService.activate(req.params.link);
            return res.redirect(process.env.CLIENT_API)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async pinVerify(req, res, next) {
        try {
            const {pinCode} = req.body
            const {refreshToken} = req.cookies

            const verify = await pinService.verifyPin(pinCode, refreshToken)
            res.cookie("pinToken", verify.pinToken, {httpOnly: true, maxAge: 3 * 60 * 1000, sameSite: "strict"})
            return res.json({message: "PIN is correct"})
        } catch (e) {
            if (e.errors?.some(error => error.code === "PIN_BLOCKED")) {
                res.clearCookie("pinToken")
            }
            next(e)
        }
    }
}

export default new AuthController()