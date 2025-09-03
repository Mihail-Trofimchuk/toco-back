import { Env } from "@/env";
import jwt from "jsonwebtoken";

export const generateToken = (uuid: string, role: string): string => {
  const { secretKey, expiresIn } = Env;
  return `Bearer ${jwt.sign({ uuid, role }, secretKey || "express", { expiresIn })}`;
};

export const generateResetToken = (email: string): string => {
  const { secretKey, expiresIn } = Env;
  return jwt.sign({ email }, secretKey || "express", { expiresIn });
};
