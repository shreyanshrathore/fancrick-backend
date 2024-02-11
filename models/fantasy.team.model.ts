require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IPlayer, playerSchema } from "./player.model";

export interface IFantasy extends Document {
  team: Array<Schema.Types.ObjectId>;
}

const fantasySchema: Schema<IFantasy> = new mongoose.Schema({
  team: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    validate: {
      validator: function (players: any[]) {
        return players.length <= 11;
      },
      message: "Fantasy team cannot have more than 11 players",
    },
  },
});

const fantasyModel: Model<IFantasy> = mongoose.model(
  "FantasyTeam",
  fantasySchema
);

export default fantasyModel;
