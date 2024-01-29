import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createContest } from "../controllers/contest.controller";
const contestRouter = express.Router();

contestRouter.post("/create-contest", createContest);

export default contestRouter;
