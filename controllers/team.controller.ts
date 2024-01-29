import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import teamModel, { ITeam } from "../models/team.model";
import ErrorHandler from "../utils/ErrorHandler";
const cloudinary = require("cloudinary");

export const createTeam = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (!data.name && !data.logo) {
        return next(new ErrorHandler("name or image is not available", 400));
      }

      const isNameExist = await teamModel.findOne({ name: data.name });

      if (isNameExist) {
        return next(new ErrorHandler("Team already exist", 400));
      }

      try {
        const myCloud = await cloudinary.v2.uploader.upload(data.logo, {
          folder: "teams",
        });

        data.logo = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return next(
          new ErrorHandler(`Error while image uploading - ${error}`, 400)
        );
      }

      const team = await teamModel.create(data);
      res.status(201).json({
        status: "success",
        team,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const fetchAllTeam = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teams = await teamModel.find();
      if (!teams) {
        return next(new ErrorHandler("No teams found", 400));
      }
      res.status(201).json({
        status: "success",
        teams,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
