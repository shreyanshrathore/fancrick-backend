import express from "express";
import {
  createPlayer,
  fetchPlayerByTeam,
} from "../controllers/player.controller";
import { isAuthenticated } from "../middleware/auth";
// import { activateUser } from "../controllers/user.controller";
const playerRouter = express.Router();

playerRouter.post("/create-player", isAuthenticated, createPlayer);

playerRouter.get("/get-players/:team", isAuthenticated, fetchPlayerByTeam);

export default playerRouter;
