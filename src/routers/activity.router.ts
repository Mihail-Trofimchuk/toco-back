import { activityController } from "@/controllers";
import { checkAuth } from "@/utils/checkAuth";
import { Router } from "express";

const activityRouter = Router();
/**
 * @swagger
 * /api/auth/he
 */
activityRouter.post(
  "/",
  checkAuth,
  activityController.createActivityController
);

activityRouter.put(
  "/",
  checkAuth,
  activityController.updateActivityController
);

activityRouter.get(
  "/",
  checkAuth,
  activityController.getActivitiesController
);

activityRouter.get(
  "/available",
  checkAuth,
  activityController.getAvailableActivitiesController
);

activityRouter.delete(
  "/",
  checkAuth,
  activityController.deleteActivityController
);

export default activityRouter;
