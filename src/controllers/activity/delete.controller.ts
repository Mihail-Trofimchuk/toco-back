import { MESSAGE } from "@/consts";
import { NotFoundError, UnauthorizedError } from "@/errors";
import { activityService } from "@/services";
import { CommonRequest } from "@/types/authReq.type";
import { errorHandlerWrapper } from "@/utils";
import { Response } from "express";
import httpStatus from "http-status";

export const deleteActivityHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  const { uuid } = req.body;
  const user = req.user;

  // Only company users can delete activities
  if (user.role !== "tocos") {
    throw new UnauthorizedError("You are not authorized to perform this action");
  }

  // Check if the activity exists and belongs to the user
  const activity = await activityService.getActivityById(uuid);
  if (!activity) {
    throw new NotFoundError("Resource not found");
  }

  // Verify that the activity belongs to the user making the request
  if (activity.client.uuid !== user.uuid) {
    throw new UnauthorizedError("You are not authorized to perform this action");
  }

  const deleted = await activityService.deleteActivity(uuid);
  if (!deleted) {
    throw new NotFoundError("Resource not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Activity deleted successfully",
  });
};

export const deleteActivityController = errorHandlerWrapper(deleteActivityHandler);
