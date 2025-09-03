import express, { Express, Request, Response } from "express";
import cors from "cors";
import { json as bodyParser } from "body-parser";
import { Env } from "@/env";
import { Logger } from "@/utils";
import { MESSAGE } from "@/consts";
import appRouter from "@/routers";
import { errorHandlerMiddleware, routeMiddleware } from "@/middlewares";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "@/swaggerConfig";
import swaggerDocument from "../../swagger-output.json";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const backendSetup = () => {
  const app: Express = express();
  const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: MESSAGE.SERVER.TOO_MANY_REQUEST,
  });

  const { port, corsOrigin } = Env;

  app.set('trust proxy', 1)
  app.get('/ip', (request, response) => response.send(request.ip))

  app.use(limiter);

  app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(bodyParser());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(routeMiddleware);

  app.use("/health", (_req: Request, res: Response) =>
    res.send(MESSAGE.SERVER.HELLO_WORLD)
  );

  app.use("/api", appRouter);

  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    Logger.info(MESSAGE.SERVER.STARTING_SUCCESS);
  });
};
