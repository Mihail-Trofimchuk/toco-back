import { NotFoundError, UnauthorizedError } from "@/errors";
import { activityService } from "@/services";
import { CommonRequest } from "@/types/authReq.type";
import { errorHandlerWrapper } from "@/utils";
import { Logger } from "@/utils/logger";
import { Response } from "express";
import httpStatus from "http-status";

export const updateActivityHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  try {
    const { uuid } = req.body;
    const user = req.user;

    Logger.info(`Processing activity update for UUID: ${uuid} by user: ${user.uuid}`);

    // Check if the activity exists
    const activity = await activityService.getActivityById(uuid);
    if (!activity) {
      Logger.error(`Activity not found with UUID: ${uuid}`);
      throw new NotFoundError("Resource not found");
    }

    // Verify that the activity belongs to the user making the request if they are a company
    // or they are the participant if they are a regular user
    if (user.role === "tocos" && activity.client.uuid !== user.uuid) {
      Logger.error(`Unauthorized access: User ${user.uuid} attempted to update activity ${uuid} they don't own`);
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }

    if (
      user.role === "user" &&
      activity.participant &&
      activity.participant?.uuid !== user.uuid
    ) {
      Logger.error(`Unauthorized access: User ${user.uuid} attempted to update activity ${uuid} they're not participating in`);
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }

    let updatedActivity;

    // Handle different update scenarios based on user role
    if (user.role === "tocos") {
      Logger.info(`Company user ${user.uuid} completing activity ${uuid}`);
      try {
        // For company users, we'll complete the activity (mark as closed)
        // This works for both "pending" and "finished" status activities
        updatedActivity = await activityService.completeActivity(uuid);
        
        if (!updatedActivity) {
          Logger.error(`Failed to complete activity ${uuid}`);
          throw new NotFoundError("Failed to complete activity. Make sure the activity has a participant and is in the correct status.");
        }
        
        Logger.info(`Activity ${uuid} completed successfully by company user ${user.uuid}`);
      } catch (error: any) {
        Logger.error(`Error completing activity ${uuid}: ${error?.message || 'Unknown error'}`, error);
        throw error;
      }
    } else {
      // Regular users can bid on activities or mark them as complete
      if (!activity.participant) {
        // If no participant, user is bidding on the activity
        Logger.info(`User ${user.uuid} bidding on activity ${uuid}`);
        try {
          updatedActivity = await activityService.bidOnActivity(uuid, user);
          
          if (!updatedActivity) {
            Logger.error(`Failed to bid on activity ${uuid}`);
            throw new NotFoundError("Failed to bid on activity. The activity may already have a participant.");
          }
          
          Logger.info(`User ${user.uuid} successfully bid on activity ${uuid}`);
        } catch (error: any) {
          Logger.error(`Error bidding on activity ${uuid}: ${error?.message || 'Unknown error'}`, error);
          throw error;
        }
      } else if (
        activity.participant.uuid === user.uuid &&
        activity.status === "pending"
      ) {
        // User is marking their activity as complete
        Logger.info(`User ${user.uuid} marking activity ${uuid} as finished`);
        try {
          updatedActivity = await activityService.updateActivity({
            uuid,
            status: "finished",
          });
          
          if (!updatedActivity) {
            Logger.error(`Failed to mark activity ${uuid} as finished`);
            throw new NotFoundError("Failed to mark activity as finished.");
          }
          
          Logger.info(`Activity ${uuid} marked as finished by user ${user.uuid}`);
        } catch (error: any) {
          Logger.error(`Error marking activity ${uuid} as finished: ${error?.message || 'Unknown error'}`, error);
          throw error;
        }
      } else {
        // No valid action for the user
        Logger.error(`Invalid action for activity ${uuid} by user ${user.uuid}. Status: ${activity.status}`);
        throw new UnauthorizedError("Invalid action for this activity");
      }
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (error: any) {
    Logger.error(`Error in update activity handler: ${error?.message || 'Unknown error'}`, error);
    throw error; // Let the error middleware handle it
  }
};

export const updateActivityController = errorHandlerWrapper(
  updateActivityHandler
);