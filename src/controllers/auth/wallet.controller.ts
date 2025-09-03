import { MESSAGE } from "@/consts";
import { UnauthorizedError } from "@/errors";
import { userService } from "@/services";

import { CommonRequest } from "@/types/authReq.type";
import { errorHandlerWrapper } from "@/utils";
import { Logger } from "@/utils/logger";
import { Response } from "express";
import httpStatus from "http-status";

const updateWalletAddressHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  const user = req.user;
  const { walletAddress } = req.body;

  if (!walletAddress) {
    throw new UnauthorizedError("Wallet address is required");
  }

  Logger.info(`User ${user.uuid} updating wallet address: ${walletAddress}`);

  const updatedUser = await userService.updateUser(user.uuid, { walletAddress });

  res.status(httpStatus.OK).json({
    success: true,
    message: MESSAGE.RESPONSE.WALLET_ADDRESS_SET,
    data: {
      uuid: updatedUser.uuid,
      walletAddress: updatedUser.walletAddress,
    },
  });
};

export const walletController = {
  updateWalletAddress: errorHandlerWrapper(updateWalletAddressHandler),
};
