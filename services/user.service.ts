import { Response } from "express";

// get user by id
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get all users

export const getAllUsersService = async(res:Response)=>{
  const user = await userModel.find().sort({createdAt:-1});

  res.status(201).json({
    success: true,
    user
  });
}



// update user Role

export const updateUserRoleService = async(res:Response, id:string, role:string)=>{
  const user = await userModel.findByIdAndUpdate(id, {role}, {new: true});
  
  res.status(201).json({
    success: true,
    user
  });
}