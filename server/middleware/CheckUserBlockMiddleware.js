import securityService from "../service/securityService.js";

export default async function (req, res, next) {
    try {
        const userId = req.user.id;

        await securityService.checkUserBlock(userId);

        return next()
    } catch (e) {
        return next(e)
    }
}