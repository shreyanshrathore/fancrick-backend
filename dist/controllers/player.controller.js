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
exports.fetchPlayerByTeam = exports.createPlayer = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const team_model_1 = __importDefault(require("../models/team.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const player_model_1 = __importDefault(require("../models/player.model"));
const cloudinary = require("cloudinary");
exports.createPlayer = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data.username || !data.role || !data.teamName) {
            return next(new ErrorHandler_1.default("please input all fields", 400));
        }
        const isNameExist = yield player_model_1.default.findOne({ name: data.username });
        if (isNameExist) {
            return next(new ErrorHandler_1.default("username already exist", 400));
        }
        const team = yield team_model_1.default.findOne({ name: data.teamName });
        if (!team) {
            return next(new ErrorHandler_1.default("Team is not registered", 400));
        }
        // const myCloud = await cloudinary.v2.uploader.upload(data.profile, {
        //   folder: "player-profile",
        // });
        // data.profile = {
        //   public_id: myCloud.public_id,
        //   url: myCloud.secure_url,
        // };
        const player = yield player_model_1.default.create(data);
        if (!player) {
            return next(new ErrorHandler_1.default("player is not saved", 400));
        }
        team.players.push(player._id);
        yield team.save();
        res.status(201).json({
            status: "success",
            player,
            team,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.fetchPlayerByTeam = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team } = req.params;
        if (!team) {
            return next(new ErrorHandler_1.default("Team not provided", 400));
        }
        const teamData = yield team_model_1.default
            .findOne({ name: team })
            .populate("players");
        if (!teamData) {
            return next(new ErrorHandler_1.default("Team not found", 404));
        }
        const players = teamData.players;
        res.status(201).json({
            status: "success",
            players,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
//# sourceMappingURL=player.controller.js.map