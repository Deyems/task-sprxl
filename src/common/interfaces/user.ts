import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoggedInUser {
    email: string;
    password: string;
}

export interface AuthUserRequest extends Request {
    user: string | JwtPayload; //
}