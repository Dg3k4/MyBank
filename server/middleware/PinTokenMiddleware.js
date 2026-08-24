import pinService from "../service/pinService.js";
import ApiError from "../error/ApiError.js"

export default async function (req, res, next) {
    try {
        const user = req.user
        const {pinToken} = req.cookies
        if (!user) {
            return next(ApiError.unauthorized(""))
        }
        if (!pinToken) {
            return next(ApiError.forbidden("Identity not approved by pin", []))
        }

        await pinService.verifyPinToken({pinToken: pinToken, userId: user.id, sessionId: user.sessionId})
        const newPinToken = await pinService.generatePinToken(user, user.sessionId)

        res.cookie("pinToken", newPinToken, {httpOnly: true, sameSite: "strict", maxAge: 3 * 60 * 1000})

        return next()
    } catch (e) {
        return next(e)
    }
}