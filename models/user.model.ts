require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IContestPlayer } from "./contest.model";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  contests: Array<{
    contestId: Schema.Types.ObjectId;
    fantasyTeamId: Schema.Types.ObjectId;
  }>;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a valid message",
    },
    unique: true,
  },
  password: {
    type: String,
    // required: [true, "Please enter your password"],
    minlength: [6, "Password must be atleast 6 character"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  contests: [
    {
      contestId: { type: Schema.Types.ObjectId, ref: "Contest" }, // Assuming 'Contest' is the related model name
      fantasyTeamId: { type: Schema.Types.ObjectId, ref: "FantasyTeam" }, // Assuming 'ContestPlayer' is the related model name
    },
  ],
});

// Hash Password before checking it
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    // it will check that either password is updated or not, if yes then only.
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Compare Password
userSchema.methods.comparePassword = async function (
  eneterePassword: string
): Promise<boolean> {
  return await bcrypt.compare(eneterePassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
