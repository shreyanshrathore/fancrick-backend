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
exports.fetchAllTeam = exports.createTeam = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const team_model_1 = __importDefault(require("../models/team.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary = require("cloudinary");
exports.createTeam = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data.name && !data.logo) {
            return next(new ErrorHandler_1.default("name or image is not available", 400));
        }
        const isNameExist = yield team_model_1.default.findOne({ name: data.name });
        if (isNameExist) {
            return next(new ErrorHandler_1.default("Team already exist", 400));
        }
        try {
            const myCloud = yield cloudinary.v2.uploader.upload(data.logo, {
                folder: "teams",
            });
            data.logo = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return next(new ErrorHandler_1.default(`Error while image uploading - ${error}`, 400));
        }
        const team = yield team_model_1.default.create(data);
        res.status(201).json({
            status: "success",
            team,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.fetchAllTeam = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield team_model_1.default.find();
        if (!teams) {
            return next(new ErrorHandler_1.default("No teams found", 400));
        }
        res.status(201).json({
            status: "success",
            teams,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//# sourceMappingURL=team.controller.js.map