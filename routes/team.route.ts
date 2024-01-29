import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createTeam, fetchAllTeam } from "../controllers/team.controller";
const teamRouter = express.Router();

teamRouter.post("/create-team", createTeam);

teamRouter.get("/get-team", fetchAllTeam);

export default teamRouter;
