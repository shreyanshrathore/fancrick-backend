require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  contests: Array<{ contestId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
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
        contestId: String,
      },
    ],
  },
  { timestamps: true }
);

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
