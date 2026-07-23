import {body} from "express-validator"

export const registrationValidation = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min: 6, max: 32}).withMessage("Password must be at least 6 character long, and less than 32 character"),
    body("firstName").isLength({max: 32}).withMessage("Max length is 32 character"),
    body("lastName").isLength({max: 32}).withMessage("Max length is 32 character"),
    body("middleName").optional().isLength({max: 32}).withMessage("Max length is 32 character"),
    body("phoneNumber").matches(/^\+?[0-9]+$/).withMessage("Phone number must contain only numbers").isLength({ min: 6, max: 20 }).withMessage("It's not a phone number"),
    body("birthDay").optional().isDate().withMessage("Wrong or invalid date")
];