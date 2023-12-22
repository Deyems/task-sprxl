import { NextFunction, Request, Response } from "express";
import AppError from "../common/utils/appError";
import { ENVIRONMENT } from "../common/config/environment";
import {logger} from "../common/utils/logger";

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired!', 401);
};

const handleTimeoutError = () => {
    return new AppError('Request timeout', 408);
};

const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err.data,
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    if (err?.isOperational) {
        console.log('Error: ', err);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err.data,
        });
    } else {
        console.log('Error: ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

const errorHandler = (err: any, req:Request, res:Response, _next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if (ENVIRONMENT.APP.ENV === 'development') {
        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        sendErrorDev(err, res);
    } else {
        let error = err;
        if ('timeout' in err && err.timeout) error = handleTimeoutError();
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};

export default errorHandler;