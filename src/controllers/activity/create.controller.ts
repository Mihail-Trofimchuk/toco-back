import { MESSAGE } from "@/consts";
import { UnauthorizedError } from "@/errors";
import { activityService } from "@/services";
import { CommonRequest } from "@/types/authReq.type";
import { errorHandlerWrapper } from "@/utils";
import { Response } from "express";
import httpStatus from "http-status";

export const createActivityHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  const { title, description, reward, status } = req.body;
  const user = req.user;

  // Only company users can create activities
  if (user.role !== "tocos") {
    throw new UnauthorizedError("You are not authorized to perform this action");
  }

  const activity = await activityService.createActivity({
    title,
    description,
    reward,
    client: user,
    status,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Activity created successfully",
    data: activity,
  });
};

export const createActivityController = errorHandlerWrapper(createActivityHandler);
