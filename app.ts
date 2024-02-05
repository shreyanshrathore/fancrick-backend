require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import teamRouter from "./routes/team.route";
import contestRouter from "./routes/contest.route";
import playerRouter from "./routes/player.route";
import bodyParser from "body-parser";

// Body Parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes

app.use("/api/v1", userRouter, teamRouter, playerRouter, contestRouter);
app.get("/", (req, res) => {
  res.json({ message: "hello lwde!!!...." });
});
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Unknown Route

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
