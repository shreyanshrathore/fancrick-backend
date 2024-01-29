import express from "express";
// import { activateUser } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  registerUser,
  activateUser,
  loginUser,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/activate", activateUser);

userRouter.post("/login", loginUser);

export default userRouter;
