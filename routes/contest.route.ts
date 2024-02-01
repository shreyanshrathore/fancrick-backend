import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createContest,
  fetchAllContests,
  fetchContestById,
  updateStatusContest,
} from "../controllers/contest.controller";
const contestRouter = express.Router();

contestRouter.post("/create-contest", createContest);

contestRouter.get("/get-all-contests", fetchAllContests);

contestRouter.get("/get-contest/:id", fetchContestById);

contestRouter.put("/update-contest-state", updateStatusContest);

export default contestRouter;
