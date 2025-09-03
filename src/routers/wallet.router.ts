import { walletController } from "@/controllers/auth/wallet.controller";
import { checkAuth } from "@/utils/checkAuth";
import { Router } from "express";

const walletRouter = Router();
walletRouter.patch(
  "/address",
  checkAuth,
  walletController.updateWalletAddress
);

export default walletRouter;
