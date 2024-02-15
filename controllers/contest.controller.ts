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
      res.status(201).json(contest);
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
    // const isUserExist = contest.participants.map(
    //   (parti) => parti.userId == req.user._id
    // );

    // if (isUserExist) {
    //   return next(
    //     new ErrorHandler("user already registered to this contest", 400)
    //   );
    // }
    contest.participants.push(participant);

    await contest.save();
    const team = { contestId, fantasyTeamId };
    docUser.contests.push(team);
    const newUser = await docUser.save();
    res.status(201).json(newUser);
  }
);

export const getLeaderBoard = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const contest = await contestModel.findById(id);

      // console.log(contest);
      if (!contest) {
        return next(new ErrorHandler("Contest not found", 400));
      }

      const leaderboard = [];
      for (let i = 0; i < contest.participants.length; i++) {
        const participant = contest.participants[i];

        if (!participant) {
          return next(new ErrorHandler("Participant does not exist", 400));
        }
        // console.log(participant)

        const user = await userModel.findById(participant.userId);

        if (!user) {
          return next(new ErrorHandler("User not found", 400));
        }

        const fantasyTeam = await fantasyModel
          .findById(participant.fantasyTeamId)
          .populate({
            path: "team",
            // populate: {
            //   path: "contests.contestId",
            //   match: { _id: contest._id },
            // },
          });
        if (!fantasyTeam) {
          return next(new ErrorHandler("Fantasy team not found", 400));
        }

        let totalScore = 0;
        console.log(fantasyTeam.team.length);
        // console.log(fantasyTeam.team[2]);
        for (let j = 0; j < fantasyTeam.team.length; j++) {
          var player = fantasyTeam.team[j];

          const index = player.contests.findIndex(
            (contest: any) => contest.contestId === id
          );

          console.log(index);
          // console.log(player);

          totalScore += player.contests[0].score;
        }

        // for (let j = 0; j < fantasyTeam.team.length; j++) {
        //   var player = fantasyTeam.team[j];

        //   if (!player.contests[j]) {
        //     return next(
        //       new ErrorHandler("Player's contest score not found", 400)
        //     );
        //   }

        //   // totalScore += player.contests[0].score;
        // }

        leaderboard.push({ user: user.name, totalScore });
      }

      leaderboard.sort((a, b) => b.totalScore - a.totalScore);

      res
        .status(200)
        .json({ message: "Leaderboard fetched successfully", leaderboard });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
