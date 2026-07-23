import ApiError from "../error/ApiError.js"
import tokenService from "../service/tokenService.js"

export default function (req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return next(ApiError.unauthorized())
        }
        const [bearer, accessToken] = header.split(" ")
        if (bearer !== "Bearer" || !accessToken) {
            return next(ApiError.unauthorized())
        }

        const payload = tokenService.validateAccessToken(accessToken)
        if (!payload) {
            return next(ApiError.unauthorized())
        }

        req.user = payload

        return next()
    } catch (e) {
        return next(e)
    }
}