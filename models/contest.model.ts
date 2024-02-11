require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IPlayer } from "./player.model";

export interface IContest extends Document {
  name: string;
  status: STATUS;
  teamLeft: Schema.Types.ObjectId;
  teamRight: Schema.Types.ObjectId;
  participants: Array<{
    userId: Schema.Types.ObjectId;
    fantasyTeamId: Schema.Types.ObjectId;
  }>;
}

type STATUS = "Upcoming" | "Ongoing" | "Completed";

export interface ITeams {
  name: string;
  logo: {
    public_id: string;
    url: string;
  };
  playerData: Array<IContestPlayer>;
}

export interface IContestPlayer {
  playerName: string;
  score: number;
}
export interface IParticipants {
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
  name: {
    type: String,
    required: [true, "Please enter teamName"],
  },
  logo: {
    public_id: String,
    url: String,
  },
  playerData: [playerSchema],
});

const contestSchema: Schema<IContest> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter contest name"],
  },
  status: {
    type: String,
    default: "Upcoming",
  },
  teamLeft: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  teamRight: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  participants: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming "User" is the name of the model for users
        required: true,
      },
      fantasyTeamId: {
        type: Schema.Types.ObjectId,
        ref: "FantasyTeam", // Assuming "FantasyTeam" is the name of the model for fantasy teams
        required: true,
      },
    },
  ],
});

const contestModel: Model<IContest> = mongoose.model("Contest", contestSchema);

export default contestModel;
