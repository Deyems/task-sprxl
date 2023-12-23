import { Request, Response, NextFunction } from "express";
import jwt, {SignOptions} from "jsonwebtoken";

import { logger } from "./logger";
import bcrypt from "bcrypt";
import { ENVIRONMENT } from "../config/environment";
import AppError from "./appError";
import { AuthUserRequest, IHashData } from "../interfaces/user";

// Middleware for JWT Authentication
const authenticateJWT = async (req: AuthUserRequest, res:Response, next:NextFunction) => {
    const token = pickAuthHeader(req);
    
    if (!token) {
        logger.error('token not passed ' + new Date(Date.now()) + ' ' + req.originalUrl);
        return res.sendStatus(401);
    }

    const user = await jwt.verify(token, 'your_secret_key');

    if(!user) throw new AppError('not verified', 401, {});
    req.user = user;
    return next();
    // , (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     req.user = user;
    //     next();
    // });
};

const pickAuthHeader = (req: Request): string => {
    let auth = req.headers["authorization"] || req.headers["Authorization"] || req.headers["x-access-token"];
    return auth as string;
}

const hashPassword = async (plainPassword: string) => {
    const salt = await bcrypt.genSalt(ENVIRONMENT.APP.PASSWORD_SALT);
    return await bcrypt.hash(plainPassword, salt);
}

const comparePassword = async (plainPass: string, hashedPass: string) => {
    return await bcrypt.compare(plainPass, hashedPass);
}

const generateToken = (userPayload: IHashData, options?: SignOptions, secret?: string) => {
    return jwt.sign(
        { ...userPayload },
        secret ? secret : ENVIRONMENT.JWT.ACCESS_KEY,
        ...[options?.expiresIn ? { expiresIn: options?.expiresIn } : {}]
    );
}


export {
    hashPassword, 
    comparePassword,
    authenticateJWT,
    generateToken,
}