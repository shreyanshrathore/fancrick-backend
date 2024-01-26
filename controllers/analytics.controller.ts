import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CoursModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get user analytics  --- only for admin
export const getUserAnalytics = CatchAsyncError(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        const user = await generateLast12MonthsData(userModel);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
    
})



// get course analytics  --- only for admin
export const getCourseAnalytics = CatchAsyncError(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        const course = await generateLast12MonthsData(CoursModel);
        res.status(200).json({
            success: true,
            course
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
    
})



// get course analytics  --- only for admin
export const getOrderAnalytics = CatchAsyncError(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        const order = await generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            order
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
    
})