import { Router } from "express";
import authRouter from "./auth.router";
import activityRouter from "./activity.router";
import walletRouter from "./wallet.router";
const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/activity", activityRouter);
appRouter.use("/wallet", walletRouter);

export default appRouter;