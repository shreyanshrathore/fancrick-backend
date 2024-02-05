"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const player_controller_1 = require("../controllers/player.controller");
// import { activateUser } from "../controllers/user.controller";
const playerRouter = express_1.default.Router();
playerRouter.post("/create-player", player_controller_1.createPlayer);
playerRouter.get("/get-players/:team", player_controller_1.fetchPlayerByTeam);
exports.default = playerRouter;
//# sourceMappingURL=player.route.js.map