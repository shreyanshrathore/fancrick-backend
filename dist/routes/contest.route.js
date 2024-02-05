"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contest_controller_1 = require("../controllers/contest.controller");
const contestRouter = express_1.default.Router();
contestRouter.post("/create-contest", contest_controller_1.createContest);
contestRouter.get("/get-all-contests", contest_controller_1.fetchAllContests);
contestRouter.get("/get-contest/:id", contest_controller_1.fetchContestById);
contestRouter.put("/update-contest-state", contest_controller_1.updateStatusContest);
exports.default = contestRouter;
//# sourceMappingURL=contest.route.js.map