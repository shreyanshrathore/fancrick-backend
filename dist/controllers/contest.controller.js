"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusContest = exports.fetchContestById = exports.fetchAllContests = exports.createContest = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const team_model_1 = __importDefault(require("../models/team.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const contest_model_1 = __importDefault(require("../models/contest.model"));
const cloudinary = require("cloudinary");
exports.createContest = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, teamLeftName, teamRightName } = req.body;
        if (!name || !teamLeftName || !teamRightName) {
            return next(new ErrorHandler_1.default("Give all feild values", 400));
        }
        let teamLeft = yield team_model_1.default
            .findOne({ name: teamLeftName })
            .populate("players");
        let teamRight = yield team_model_1.default
            .findOne({ name: teamRightName })
            .populate("players");
        if (!teamLeft) {
            return next(new ErrorHandler_1.default(`${teamLeftName} does not exist`, 400));
        }
        if (!teamRight) {
            return next(new ErrorHandler_1.default(`${teamLeftName} does not exist`, 400));
        }
        let teamPlayersLeft = [];
        for (let i = 0; i < teamLeft.players.length; i++) {
            teamPlayersLeft.push({
                playerName: teamLeft.players[i].username,
                score: 0,
            });
        }
        let teamPlayersRight = [];
        for (let i = 0; i < teamRight.players.length; i++) {
            teamPlayersRight.push({
                playerName: teamRight.players[i].username,
                score: 0,
            });
        }
        const teamLeftData = {
            name: teamLeft.name,
            logo: teamLeft.logo,
            playerData: teamPlayersLeft,
        };
        const teamRightData = {
            name: teamRight.name,
            logo: teamRight.logo,
            playerData: teamPlayersRight,
        };
        const newContest = yield contest_model_1.default.create({
            name,
            teamLeft,
            teamRight,
            teamLeftData: teamLeftData,
            teamRightData: teamRightData,
        });
        res.status(201).json({
            status: "success",
            newContest,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.fetchAllContests = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contests = yield contest_model_1.default.find().select({
            name: 1,
            "teamLeftData.name": 1,
            "teamLeftData.logo": 1,
            "teamLeftData._id": 1,
            "teamRightData.name": 1,
            "teamRightData.logo": 1,
            "teamRightData._id": 1,
        });
        if (!contests) {
            return next(new ErrorHandler_1.default("Contests not found", 400));
        }
        res.status(201).json({
            status: "success",
            contests,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.fetchContestById = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.updateStatusContest = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, id } = req.body;
        const contest = yield contest_model_1.default.findByIdAndUpdate(id, status);
        if (!contest) {
            return next(new ErrorHandler_1.default("Contest not found", 400));
        }
        // contest.status = status;
        // await contest.save();
        res.status(201).json({
            status: "success",
            contest,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//# sourceMappingURL=contest.controller.js.map