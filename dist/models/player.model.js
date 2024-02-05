"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerSchema = void 0;
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
exports.playerSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username"],
    },
    teamName: {
        type: String,
    },
    role: {
        type: String,
        required: [true, "Please enter your role"],
    },
    // profile: {
    //   public_id: String,
    //   url: String,
    // },
});
const playerModel = mongoose_1.default.model("Player", exports.playerSchema);
exports.default = playerModel;
//# sourceMappingURL=player.model.js.map