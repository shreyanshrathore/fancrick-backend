require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPlayer extends Document {
  username: string;
  teamName: string;
  role: string;
  contests: [{ contestId: Schema.Types.ObjectId; score: number }];
}

export const playerSchema: Schema<IPlayer> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
  },
  teamName: {
    type: String,
    required: [true, "Please enter your team name"],
  },
  role: {
    type: String,
    required: [true, "Please enter your role"],
  },
  contests: [
    {
      contestId: {
        type: Schema.Types.ObjectId,
        ref: "Contest",
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const playerModel: Model<IPlayer> = mongoose.model("Player", playerSchema);

export default playerModel;
