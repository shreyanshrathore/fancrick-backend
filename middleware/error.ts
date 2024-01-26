import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/ErrorHandler'

export const ErrorMiddleware = (err:any, req:Request, res:Response, next:NextFunction) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";

    // wrong mongo db error

    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate Key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error
    if(err.code === 'JsonWebToken'){
        const message = `Json Web Token is Invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Expire
    if(err.code === 'TokenExpiredError'){
        const message = `Json web token is expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
};