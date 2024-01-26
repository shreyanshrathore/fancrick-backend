import { Response } from "express";
import CoursModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// create Course 
export const createCourse = CatchAsyncError(async(data:any, res:Response)=>{
    const course = await CoursModel.create(data);
    res.status(201).json({
        success: true,
        course
    })
})

// Get all courses  -- only for admin

export const getAllCoursesService = async(res:Response)=>{
    const courses = await CoursModel.find().sort({createdAt:-1});
  
    res.status(201).json({
      success: true,
      courses
    });
  
  }
  