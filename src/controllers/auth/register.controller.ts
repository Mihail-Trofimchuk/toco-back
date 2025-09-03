import { MESSAGE } from "@/consts";
import { DuplicateError } from "@/errors";
import { userService } from "@/services";
import { CommonRequest } from "@/types/authReq.type";
import { encryptPassword, errorHandlerWrapper, generateToken } from "@/utils";
import { Response } from "express";
import httpStatus from "http-status";

const registerHandler = async (
  req: CommonRequest,
  res: Response
): Promise<void> => {
  const { username, email, role, password } = req.body;

  const hashPassword = await encryptPassword(password);
  const user = await userService.createUser({
    username,
    email,
    password: hashPassword,
    role
  });


  if (!user) throw new DuplicateError(MESSAGE.ERROR.EMAIL_ALREADY_EXISTS);

  const token = generateToken(user.uuid, user.role);

  res.status(httpStatus.CREATED).json({
    user: {
      id: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const registerController = errorHandlerWrapper(registerHandler);
