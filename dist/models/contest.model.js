"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const playerSchema = new mongoose_1.default.Schema({
    playerName: {
        type: String,
    },
    score: {
        type: Number,
        default: 0,
    },
});
const teamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter teamName"],
    },
    logo: {
        public_id: String,
        url: String,
    },
    playerData: [playerSchema],
});
const contestSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter contest name"],
    },
    status: {
        type: String,
        default: "Upcoming",
    },
    teamLeftData: {
        type: teamSchema,
    },
    teamRightData: {
        type: teamSchema,
    },
});
const contestModel = mongoose_1.default.model("Contest", contestSchema);
exports.default = contestModel;
//# sourceMappingURL=contest.model.js.map