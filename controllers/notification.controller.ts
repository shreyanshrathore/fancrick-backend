import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from 'node-cron'

// gett all notifications --- only admin
export const getNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// update notification status -- only for admins 
export const updateNotification = CatchAsyncError(async(req: Request, res:Response, next: NextFunction)=>{
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("no notification found", 500));
        }
        notification.status = 'read';

        await notification.save();

        const notifications = await NotificationModel.find().sort({created:-1}); // this is for frontend

        res.status(200).json({
            success : true,
            notifications
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})



// delete notification
cron.schedule("0 0 0 * * * ", async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
    await NotificationModel.deleteMany({status: "read", createdAt: {$lt: thirtyDaysAgo}});
    console.log('Delete read Notifications');
});
