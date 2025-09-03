import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { ActivityEntity, UserEntity } from "@/entities";
import { AppDataSource } from "@/setup";
import { Repository } from "typeorm";
import { Logger } from "@/utils/logger";
import { tokenContract } from "@/config/blockchain";
import { ethers } from "ethers";

type CreateActivityData = {
  title: string;
  description: string;
  reward: number;
  client: UserEntity;
  status: "pending" | "finished" | "closed";
};

type UpdateActivityData = {
  uuid: string;
  title?: string;
  description?: string;
  reward?: number;
  participant?: UserEntity | null;
  status?: null | "pending" | "finished" | "closed";
};

export const createActivity = async (
  data: CreateActivityData
): Promise<ActivityEntity> => {
  const { title, description, reward, status, client } = data;
  const activityRepository: Repository<ActivityEntity> =
    AppDataSource.getRepository(ActivityEntity);

  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  
  const sanitizedData = {
    title: purify.sanitize(title),
    description: purify.sanitize(description),
    reward,
    client,
    status: null
  };

  const activity = activityRepository.create(sanitizedData);
  await activityRepository.save(activity);

  return activity;
};

export const getActivities = async (
  user: UserEntity
): Promise<ActivityEntity[]> => {
  const activityRepository: Repository<ActivityEntity> =
    AppDataSource.getRepository(ActivityEntity);
  
  // If user is company (tocos), fetch activities where they are the client
  // If user is regular user, fetch activities where they are the participant
  if (user.role === "tocos") {
    return activityRepository.find({
      where: { client: { uuid: user.uuid } },
      relations: ["client", "participant"],
    });
  } else {
    return activityRepository.find({
      where: { participant: { uuid: user.uuid } },
      relations: ["client", "participant"],
    });
  }
};

export const getAvailableActivities = async (): Promise<ActivityEntity[]> => {
  const activityRepository: Repository<ActivityEntity> =
    AppDataSource.getRepository(ActivityEntity);
  
  // Get activities with no participant (available for bidding)
  return activityRepository.find({
    where: { participant: null },
    relations: ["client", "participant"],
  });
};

export const getActivityById = async (
  uuid: string
): Promise<ActivityEntity | null> => {
  const activityRepository: Repository<ActivityEntity> =
    AppDataSource.getRepository(ActivityEntity);
  
  return activityRepository.findOne({
    where: { uuid },
    relations: ["client", "participant"],
  });
};

export const updateActivity = async (
  data: UpdateActivityData
): Promise<ActivityEntity | null> => {
  const { uuid, ...updateData } = data;
  const activityRepository: Repository<ActivityEntity> =
    AppDataSource.getRepository(ActivityEntity);
  
  const activity = await activityRepository.findOne({
    where: { uuid },
    relations: ["client", "participant"],
  });

  if (!activity) {
    return null;
  }

  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

  // Sanitize string inputs if they exist
  if (updateData.title) {
    updateData.title = purify.sanitize(updateData.title);
  }
  
  if (updateData.description) {
    updateData.description = purify.sanitize(updateData.description);
  }

  // Update the activity with the new data
  Object.assign(activity, updateData);
  await activityRepository.save(activity);

  return activity;
};

export const bidOnActivity = async (
  activityUuid: string,
  user: UserEntity
): Promise<ActivityEntity | null> => {
  try {
    const activityRepository: Repository<ActivityEntity> =
      AppDataSource.getRepository(ActivityEntity);
    
    const activity = await activityRepository.findOne({
      where: { uuid: activityUuid },
      relations: ["client", "participant"],
    });

    if (!activity) {
      Logger.error(`Activity not found with UUID: ${activityUuid}`);
      return null;
    }

    // Check if activity already has a participant
    if (activity.participant) {
      return null; // Cannot bid on activity that already has a participant
    }

    // Update activity with the user as participant and status as pending
    activity.participant = user;
    activity.status = "pending";
    
    await activityRepository.save(activity);
    return activity;
  } catch (error: any) {
    Logger.error(`Error bidding on activity: ${error?.message || 'Unknown error'}`, error);
    throw error; // Re-throw to be caught by error middleware
  }
};

export const completeActivity = async (
  activityUuid: string
): Promise<ActivityEntity | null> => {
  try {
    const activityRepository: Repository<ActivityEntity> =
      AppDataSource.getRepository(ActivityEntity);
    
    const activity = await activityRepository.findOne({
      where: { uuid: activityUuid },
      relations: ["client", "participant"],
    });

    if (!activity) {
      Logger.error(`Activity not found with UUID: ${activityUuid}`);
      return null;
    }
    
    if (!activity.participant) {
      Logger.error(`Activity ${activityUuid} has no participant`);
      return null;
    }
    
    // Allow completing activities that are either pending or finished
    if (activity.status !== "pending" && activity.status !== "finished") {
      Logger.error(`Activity ${activityUuid} cannot be completed, current status: ${activity.status}`);
      return null;
    }

    // Update status to closed
    activity.status = "closed";
    
    // Here would be the blockchain integration for token sending
    // This is left as a comment as requested
    /*
    if (activity.client.role === "tocos") {
      // Send token to the participant
      // blockchain.sendToken(activity.client.address, activity.participant.address, activity.reward);
      Logger.info(`Token sent to participant ${activity.participant.uuid} for activity ${activityUuid}`);
    }
    */

    try {

      const walletAddress = activity?.participant?.walletAddress;

      if (!walletAddress) {
        Logger.error(`No address: ${walletAddress}`);
        return;
      }

      const tx = await tokenContract.mint(walletAddress, ethers.parseUnits(activity.reward.toString(), 18));
      await tx.wait();
  
      Logger.info(`Prize ${activity.reward} TOCO sent to ${walletAddress}`);
      console.log('tx.hash', tx.hash);

      await activityRepository.save(activity);
    } catch (err) {
      Logger.error(`Failed to send prize: ${err}`);
      throw err;
    }
    
    const updatedActivity = await activityRepository.save(activity);
    return updatedActivity;
  } catch (error: any) {
    Logger.error(`Error completing activity ${activityUuid}: ${error?.message || 'Unknown error'}`, error);
    // Instead of just returning null, we'll throw the error so it can be caught by the error middleware
    throw error;
  }
};

export const deleteActivity = async (
  uuid: string
): Promise<boolean> => {
  try {
    const activityRepository: Repository<ActivityEntity> =
      AppDataSource.getRepository(ActivityEntity);
    
    const activity = await activityRepository.findOne({
      where: { uuid }
    });

    if (!activity) {
      return false;
    }

    await activityRepository.remove(activity);
    return true;
  } catch (error: any) {
    Logger.error(`Error deleting activity ${uuid}: ${error?.message || 'Unknown error'}`, error);
    throw error;
  }
};