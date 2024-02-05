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
exports.sendToken = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const accessToken = user.SignAccessToken();
    // const refreshToken = user.SignRefreshToken();
    const token = jsonwebtoken_1.default.sign({ user }, process.env.ACTIVATION_SECRET, {
        expiresIn: "6h",
    });
    redis_1.redis.set(user._id, JSON.stringify(user));
    res.cookie("jwt_token", token);
    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
});
exports.sendToken = sendToken;
//# sourceMappingURL=jwt.js.map