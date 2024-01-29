require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import jwt, { Secret } from "jsonwebtoken";

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  // const accessToken = user.SignAccessToken();
  // const refreshToken = user.SignRefreshToken();

  const token = jwt.sign({ user }, process.env.ACTIVATION_SECRET as Secret, {
    expiresIn: "6h",
  });
  redis.set(user._id, JSON.stringify(user) as any);

  res.cookie("jwt_token", token);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};
