import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import teamModel, { ITeam } from "../models/team.model";
import ErrorHandler from "../utils/ErrorHandler";
import playerModel, { IPlayer } from "../models/player.model";
const cloudinary = require("cloudinary");

export const createPlayer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as IPlayer;
      if (!data.username || !data.role || !data.teamName) {
        return next(new ErrorHandler("please input all fields", 400));
      }
      const isNameExist = await playerModel.findOne({ name: data.username });

      if (isNameExist) {
        return next(new ErrorHandler("username already exist", 400));
      }

      const team = await teamModel.findOne({ name: data.teamName });
      if (!team) {
        return next(new ErrorHandler("Team is not registered", 400));
      }
      // const myCloud = await cloudinary.v2.uploader.upload(data.profile, {
      //   folder: "player-profile",
      // });

      // data.profile = {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // };
      const player = await playerModel.create(data);
      if (!player) {
        return next(new ErrorHandler("player is not saved", 400));
      }
      team.players.push(player._id);
      await team.save();

      res.status(201).json({
        status: "success",
        player,
        team,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const fetchPlayerByTeam = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { team } = req.params;

      if (!team) {
        return next(new ErrorHandler("Team not provided", 400));
      }

      const teamData = await teamModel
        .findOne({ name: team })
        .populate("players");

      if (!teamData) {
        return next(new ErrorHandler("Team not found", 404));
      }

      const players = teamData.players;
      res.status(201).json({
        status: "success",
        players,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
