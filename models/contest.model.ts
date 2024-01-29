require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IPlayer } from "./player.model";
import { ITeam } from "./team.model";

export interface IContest extends Document {
  name: string;
  teamLeftName: string;
  teamRightName: string;
  teamLeftData: ITeam;

  teamRightData: ITeams;
}

export interface ITeams extends Document {
  teamName: string;
  playerData: Array<IContestPlayer>;
}

export interface IContestPlayer extends Document {
  playerName: string;
  score: number;
}
export interface IParticipants extends Document {
  user: IUser;
  fantasy_team: Array<Schema.Types.ObjectId | IPlayer>;
  total_point: number;
}

const playerSchema: Schema<IContestPlayer> = new mongoose.Schema({
  playerName: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const teamSchema: Schema<ITeams> = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, "Please enter teamName"],
  },
  playerData: [playerSchema],
});

const contestSchema: Schema<IContest> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter contest name"],
  },
  teamLeftName: {
    type: String,
    required: [true, "Please enter left team name"],
  },
  teamRightName: {
    type: String,
    required: [true, "Please enter right team name"],
  },
  teamLeftData: {
    type: teamSchema,
  },
  teamRightData: {
    type: teamSchema,
  },
});

const contestModel: Model<IContest> = mongoose.model("Contest", contestSchema);

export default contestModel;
