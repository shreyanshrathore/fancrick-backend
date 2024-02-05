"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cloudinary_1 = require("cloudinary");
const app_1 = require("./app");
const db_1 = __importDefault(require("./utils/db"));
// cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLUD_API,
    api_secret: process.env.CLOUD_SECRET_KEY
});
// Create server 
app_1.app.listen(process.env.PORT, () => {
    (0, db_1.default)();
});
//# sourceMappingURL=server.js.map