require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

import cors from "cors"
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import bodyParser from "body-parser";

// Body Parser 
app.use(bodyParser.json({limit: "50mb"}));
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

// cookie parser
app.use(cookieParser());

// cors 
app.use(cors({
    origin: process.env.ORIGIN
}));

// routes

app.use('/api/v1', courseRouter, userRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter) 


app.get("/test", (req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});

// Unknown Route

app.all("*", (req:Request, res:Response, next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);