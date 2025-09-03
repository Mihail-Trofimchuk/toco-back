import { authController } from "@/controllers";
import { checkAuth } from "@/utils/checkAuth";
import { authValidator } from "@/validators";
import { Router } from "express";

const authRouter = Router();
/**
 * @swagger
 * /api/auth/he
 */
authRouter.post(
  "/login",
  authValidator.loginValidator(),
  authController.loginController
);

authRouter.post(
  "/register",
  authValidator.registerValidator(),
  authController.registerController
);

authRouter.get(
  "/logout",
  checkAuth,
  authController.logoutController
);

export default authRouter;
