require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPlayer extends Document {
  username: string;
  teamName: string;
  role: string;
  // profile: {
  //   public_id: string;
  //   url: string;
  // };
}

export const playerSchema: Schema<IPlayer> = new mongoose.Schema({
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

const playerModel: Model<IPlayer> = mongoose.model("Player", playerSchema);

export default playerModel;
