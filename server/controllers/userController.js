import ApiError from "../error/ApiError.js"
import userService from "../service/userService.js";
import pinService from "../service/pinService.js"
import {validationResult} from "express-validator";

class UserController {
    async getMe(req, res, next){
        try {
            const {id} = req.user

            const user = await userService.getUserById(id)
            return res.json({body: user})
        } catch(e) {
            next(e)
        }
    }

    async getById(req, res, next){
        try {

        } catch(e) {

        }
    }

    async deactivationRequest(req, res, next){
        try {
            const {id} = req.params

            const request = await userService.doCloseRequest({userId: id})
            return res.json({message: "Request was made successfully", body: request})
        } catch(e) {
            next(e)
        }
    }

    async updateProfile(req, res, next){
        try {

        } catch(e) {

        }
    }

    async changePassword(req, res, next){
        try {

        } catch(e) {

        }
    }

    async changePin(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("Validation error", errors.array()))
            }
            const {pinCode, oldPinCode} = req.body
            const {refreshToken} = req.cookies

            const changePin = await pinService.updatePin(pinCode, oldPinCode, refreshToken)
            res.cookie("pinToken", changePin.pinToken, {httpOnly: true, maxAge: 3 * 60 * 1000, sameSite: "strict"})
            return res.json({message: "PIN has been changed successfully"})
        } catch(e) {
            next(e)
        }
    }

    async pinCreate(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("Validation error", errors.array()))
            }
            const {pinCode} = req.body // Ожидает строку
            const {refreshToken} = req.cookies

            const createUserPin = await pinService.createPin(pinCode, refreshToken);
            res.cookie("pinToken", createUserPin.pinToken, {httpOnly: true, maxAge: 3 * 60 * 1000, sameSite: "strict"})
            return res.json({message: "PIN has been set successfully"})
        } catch(e) {
            next(e)
        }
    }

    async pinCheck(req, res, next) {
        try {
            const {pinToken} = req.cookies
            const {id, sessionId} = req.user

            const refreshPin = await pinService.refreshPin({pinToken: pinToken, userId: id, sessionId: sessionId})
            res.cookie("pinToken", refreshPin.newPinToken, {httpOnly: true, maxAge: 3 * 60 * 1000, sameSite: "strict"})
            return res.json({message: "PIN has been checked successfully"})
        } catch(e) {
            next(e)
        }
    }
}

export default new UserController();