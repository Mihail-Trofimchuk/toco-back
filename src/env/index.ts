import { EnvType } from "@/types";
import "dotenv/config";

export const Env: EnvType = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.PORT) || 8000,
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
  expiresIn: Number(process.env.EXPIRE_TIME) || 3600,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
