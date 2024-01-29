import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import teamModel, { ITeam } from "../models/team.model";
import ErrorHandler from "../utils/ErrorHandler";
import playerModel, { IPlayer } from "../models/player.model";
import contestModel, {
  IContest,
  IContestPlayer,
  ITeams,
} from "../models/contest.model";
const cloudinary = require("cloudinary");

export const createContest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, teamLeftName, teamRightName } = req.body;

      if (!name || !teamLeftName || !teamRightName) {
        return next(new ErrorHandler("Give all feild values", 400));
      }

      let teamLeft = await teamModel
        .findOne({ name: teamLeftName })
        .populate("players");

      let teamRight = await teamModel
        .findOne({ name: teamRightName })
        .populate("players");

      if (!teamLeft) {
        return next(new ErrorHandler(`${teamLeftName} does not exist`, 400));
      }
      if (!teamRight) {
        return next(new ErrorHandler(`${teamLeftName} does not exist`, 400));
      }
      let teamPlayersLeft: Array<IContestPlayer> = [];
      for (let i = 0; i < teamLeft.players.length; i++) {
        teamPlayersLeft.push({
          playerName: teamLeft.players[i].username,
          score: 0,
        });
      }
      let teamPlayersRight: Array<IContestPlayer> = [];

      for (let i = 0; i < teamRight.players.length; i++) {
        teamPlayersRight.push({
          playerName: teamRight.players[i].username,
          score: 0,
        });
      }
      const teamLeftData: ITeams = {
        name: teamLeft.name,
        logo: teamLeft.logo,
        playerData: teamPlayersLeft,
      };
      const teamRightData: ITeams = {
        name: teamRight.name,
        logo: teamRight.logo,
        playerData: teamPlayersRight,
      };
      const newContest: IContest = await contestModel.create({
        name,
        teamLeft,
        teamRight,
        teamLeftData: teamLeftData,
        teamRightData: teamRightData,
      });

      res.status(200).json({
        status: "success",
        newContest,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const fetchAllContests = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contests = await contestModel.find().select({
        name: 1,
        "teamLeftData.name": 1,
        "teamLeftData.logo": 1,
        "teamLeftData._id": 1,
        "teamRightData.name": 1,
        "teamRightData.logo": 1,
        "teamRightData._id": 1,
      });
      if (!contests) {
        return next(new ErrorHandler("Contests not found", 400));
      }

      res.status(201).json({
        status: "success",
        contests,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const fetchContestById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
