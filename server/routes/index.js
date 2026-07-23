import {Router} from "express";
const router = Router();
import userRouter from "./userRouter.js"
import bankAccountRouter from "./bankAccountRouter.js"
import cardRouter from "./cardRouter.js";
import blockMiddleware from "../middleware/CheckUserBlockMiddleware.js"

router.use("/user", userRouter);
router.use("/card", cardRouter);
router.use("/accountBank", bankAccountRouter);

export default router;