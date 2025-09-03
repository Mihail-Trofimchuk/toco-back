import { activityService } from "@/services";
import { CommonRequest } from "@/types/authReq.type";
import { errorHandlerWrapper } from "@/utils";
import { Response } from "express";
import httpStatus from "http-status";

export const getActivitiesHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  const user = req.user;
  
  // Get activities based on user role
  // If user is company (tocos), fetch activities where they are the client
  // If user is regular user, fetch activities where they are the participant
  const activities = await activityService.getActivities(user);

  res.status(httpStatus.OK).json({
    success: true,
    data: activities,
  });
};

export const getAvailableActivitiesHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  // Get all activities that don't have a participant yet (available for bidding)
  const activities = await activityService.getAvailableActivities();

  res.status(httpStatus.OK).json({
    success: true,
    data: activities,
  });
};

export const getActivitiesController = errorHandlerWrapper(getActivitiesHandler);
export const getAvailableActivitiesController = errorHandlerWrapper(getAvailableActivitiesHandler);