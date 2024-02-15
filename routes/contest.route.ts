import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createcontest,
  fetchAllContests,
  fetchContestById,
  getLeaderBoard,
  joinContest,
  updateStatusContest,
} from "../controllers/contest.controller";
const contestRouter = express.Router();

contestRouter.post("/create-contest", createcontest);

contestRouter.get("/get-all-contests", fetchAllContests);

contestRouter.get("/get-contest/:id", fetchContestById);

contestRouter.post("/join-contest", isAuthenticated, joinContest);

contestRouter.get("/leaderboard/:id", isAuthenticated, getLeaderBoard);

contestRouter.put(
  "/update-contest-state",
  isAuthenticated,
  updateStatusContest
);

export default contestRouter;
