"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("../controllers/team.controller");
const teamRouter = express_1.default.Router();
teamRouter.post("/create-team", team_controller_1.createTeam);
teamRouter.get("/get-team", team_controller_1.fetchAllTeam);
exports.default = teamRouter;
//# sourceMappingURL=team.route.js.map