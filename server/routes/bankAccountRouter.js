import {Router} from "express";
const router = Router();
import bankAccountController from "../controllers/bankAccountController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import blockMiddleware from "../middleware/CheckUserBlockMiddleware.js";
import verifyPinMiddleware from "../middleware/PinTokenMiddleware.js";

router.use(authMiddleware)
router.use(blockMiddleware)
router.use(verifyPinMiddleware)

router.post("/", bankAccountController.createAccount)

router.get("/me", bankAccountController.getMyAccounts)
router.get("/:id", bankAccountController.getById)
router.get("/:accountId/transactions", bankAccountController.getTransactions)

router.patch("/:id/close", bankAccountController.closeAccountRequest)
router.patch("/:id/nickname", bankAccountController.updateNickName)

export default router;