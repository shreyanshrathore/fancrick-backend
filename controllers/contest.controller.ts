import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import teamModel, { ITeam } from "../models/team.model";
import ErrorHandler from "../utils/ErrorHandler";
import playerModel, { IPlayer } from "../models/player.model";
import { IContest, IContestPlayer, ITeams } from "../models/contest.model";
const cloudinary = require("cloudinary");

export const createContest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, teamLeftName, teamRightName } = req.body as IContest;

      if (!name || !teamLeftName || !teamRightName) {
        return next(new ErrorHandler("Give all feild values", 400));
      }

      const teamLeft = await teamModel
        .findOne({ name: teamLeftName })
        .populate("players");

      const teamRight = await teamModel
        .findOne({ name: teamRightName })
        .populate("players");

      if (!teamLeft) {
        return next(new ErrorHandler(`${teamLeftName} does not exist`, 400));
      }
      if (!teamRight) {
        return next(new ErrorHandler(`${teamLeftName} does not exist`, 400));
      }
      console.log(teamRight);
      // return next(new ErrorHandler(teamLeft, 400));

      const teamLeftData: ITeams = { teamName: teamLeft.name, playerData: {} };
      const contest: IContest = {
        name,
        teamLeftName,
        teamRightName,
        teamLeftData: teamLeft,
        teamRightData: teamRight,
      };
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
