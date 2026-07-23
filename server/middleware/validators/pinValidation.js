import {body} from "express-validator"

export const pinValidation = [
    body("pinCode").matches(/^\d{6}$/).withMessage("PIN must contain exactly 6 digits")
];