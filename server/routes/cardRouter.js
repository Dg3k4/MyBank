import {Router} from "express";
const router = Router();
import cardController from "../controllers/cardController.js"

router.post("/", cardController.createCard)

router.get("/my", cardController.getMe)
router.get("/:id", cardController.getById)
router.get("/:id/transactions", cardController.getTransactions)

router.patch("/:id/status", cardController.changeStatusRequest)

export default router;