import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";

import { logger } from "./logger";
import bcrypt from "bcrypt";
import { ENVIRONMENT } from "../config/environment";
import AppError from "./appError";
import { IHashData } from "../interfaces/user";

// Middleware for JWT Authentication
const authenticateJWT = async (req: Request, res:Response, next:NextFunction) => {
    try {
        let token = pickAuthHeader(req);
        if (!token) {
            logger.error('token not passed ' + new Date(Date.now()) + ' ' + req.originalUrl);
            return res.sendStatus(401).json({ message: "Token Not set" });
        }
        if(token.startsWith("Bearer")){
            token = token.split(" ")[1];
        }
        const user: Record<string, string | number> | JwtPayload | string = jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY);
        if( ((user as Record<string, string | number>).id !== req.params.id) ){
            throw new AppError('No Permission to view another user information', 401, {});
        }
        if (!user) throw new AppError('not verified', 401, {});
        return next();
    } catch (error) {
        next(error);
    }
    
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