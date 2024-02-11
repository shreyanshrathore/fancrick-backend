import { Request, Response, NextFunction, response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import teamModel, { ITeam } from "../models/team.model";
import ErrorHandler from "../utils/ErrorHandler";
import contestModel from "../models/contest.model";
import playerModel from "../models/player.model";
import userModel from "../models/user.model";
import fantasyModel from "../models/fantasy.team.model";

export const createcontest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, teamLeftName, teamRightName } = req.body;

      if (!name || !teamLeftName || !teamRightName) {
        return next(new ErrorHandler("Give all feild values", 400));
      }

      const teamLeft = await teamModel.findOne({ name: teamLeftName });

      if (!teamLeft) {
        return next(new ErrorHandler("Left Team not found", 400));
      }

      const teamRight = await teamModel.findOne({ name: teamRightName });

      if (!teamRight) {
        return next(new ErrorHandler("Right Team not found", 400));
      }

      const leftId = teamLeft._id;
      const rightId = teamRight._id;

      const contest = await contestModel.create({
        name,
        teamLeft: leftId,
        teamRight: rightId,
      });

      const Id = contest._id;

      const playersToUpdate = await playerModel.find({
        _id: { $in: teamLeft.players },
      });
      await Promise.all(
        playersToUpdate.map(async (player: any) => {
          player.contests.push({ contestId: Id, score: 0 });
          await player.save();
        })
      );

      const playersToUpdateRight = await playerModel.find({
        _id: { $in: teamRight.players },
      });
      await Promise.all(
        playersToUpdateRight.map(async (player: any) => {
          player.contests.push({ contestId: Id, score: 0 });
          await player.save();
        })
      );
      res.status(200).json(contest);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const fetchAllContests = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contests = await contestModel
        .find()
        .populate({
          path: "teamLeft",
          select: "logo name",
        })
        .populate({
          path: "teamRight",
          select: "logo name",
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
      const id = req.params.id;
      if (!id) {
        return next(new ErrorHandler("Id is no present", 400));
      }

      const contest = await contestModel
        .findById(id)
        .populate({
          path: "teamLeft",
          populate: {
            path: "players",
            select: "_id username role",
          },
        })
        .populate({
          path: "teamRight",
          populate: {
            path: "players",
            select: "_id username role",
          },
        });

      if (!contest) {
        return next(new ErrorHandler("Contest not found", 400));
      }

      res
        .status(201)
        .json({ message: "Contest fetched successfully", contest });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateStatusContest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, id } = req.body;
      const contest = await contestModel.findByIdAndUpdate(
        id,
        { status: status },
        {
          new: true,
        }
      );
      if (!contest) {
        return next(new ErrorHandler("Contest not found", 400));
      }

      // contest.status = status;
      // await contest.save();
      res.status(201).json({
        status: "success",
        contest,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const joinContest = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contestId, fantasyTeam } = req.body;

    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return next(new ErrorHandler("Contest not found", 400));
    }

    const user = req.user;

    const docUser = await userModel.findById(user._id);
    const docFantasyTeam = await fantasyModel.create({ team: fantasyTeam });

    if (!docFantasyTeam) {
      return next(new ErrorHandler("fantasy team cant be generated", 400));
    }

    const fantasyTeamId = docFantasyTeam._id;

    const participant = { userId: user._id, fantasyTeamId: fantasyTeamId };
    contest.participants.push(participant);

    await contest.save();
    const team = { contestId, fantasyTeamId };
    docUser.contests.push(team);
    const newUser = await docUser.save();
    res.status(200).json(newUser);
  }
);
