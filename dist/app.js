"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const team_route_1 = __importDefault(require("./routes/team.route"));
const contest_route_1 = __importDefault(require("./routes/contest.route"));
const player_route_1 = __importDefault(require("./routes/player.route"));
const body_parser_1 = __importDefault(require("body-parser"));
// Body Parser
exports.app.use(body_parser_1.default.json({ limit: "50mb" }));
exports.app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors
exports.app.use((0, cors_1.default)()
// {
// origin: process.env.ORIGIN,
// }
);
// routes
exports.app.use("/api/v1", user_route_1.default, team_route_1.default, player_route_1.default, contest_route_1.default);
exports.app.get("/", (req, res) => {
    res.json({ message: "hello lwde!!!...." });
});
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
// Unknown Route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
//# sourceMappingURL=app.js.map