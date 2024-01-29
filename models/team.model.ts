require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IPlayer, playerSchema } from "./player.model";

export interface ITeam extends Document {
  name: string;
  logo: {
    public_id: string;
    url: string;
  };
  players: Array<IPlayer>;
}

const teamSchema: Schema<ITeam> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    logo: {
      public_id: String,
      url: String,
    },
    players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  },
  { timestamps: true }
);

const teamModel: Model<ITeam> = mongoose.model("Team", teamSchema);

export default teamModel;
