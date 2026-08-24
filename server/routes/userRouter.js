import {Router} from "express";
const router = Router();
import authController from "../controllers/authController.js"
import userController from "../controllers/userController.js"
import {registrationValidation, pinValidation} from "../middleware/validators/index.js"
import blockMiddleware from "../middleware/CheckUserBlockMiddleware.js"
import authMiddleware from "../middleware/AuthMiddleware.js"
import verifyPinMiddleware from "../middleware/PinTokenMiddleware.js";

// Публичные
router.post("/registration", ...registrationValidation, authController.registration)
router.post("/login", authController.login) // Проверка на блок пользователя внутри
router.post("/refresh", authController.refresh)
router.get("/activate/:link", authController.userActivation)


// Нужна авторизация
router.use(authMiddleware)

router.post("/logout", authController.logout)
router.post("/deactivation-request", userController.deactivationRequest) // Сделаешь пометку обработки через причину в userBlock, а при одобрении сменять isActive на true


// Нужна авторизация + отсутствие блокировки
router.use(blockMiddleware)

router.post("/pin", ...pinValidation, userController.pinCreate)
router.post("/pin/verify", ...pinValidation, authController.pinVerify)
router.post("/pin/check", userController.pinCheck)

// Нужна авторизация + отсутствие блокировки + подтверждение личности
router.use(verifyPinMiddleware)

router.get("/me", userController.getMe)
router.get("/:id", userController.getById) // Для админки, позже отдельный роутер будет

router.patch("/profile", userController.updateProfile)
router.patch("/password", userController.changePassword)
router.patch("/pin", userController.changePin)

export default router;