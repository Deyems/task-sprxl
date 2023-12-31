import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Account{
    accountId: number;
    accountNumber: string;
    balance: number;
    userId: number;
}

export interface UserAccount extends User, Account{}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type RegisteredUser = Omit<IUser, 'password'>;

export interface UserWithAccountNo extends RegisteredUser {
    accountNumber: string;
}

export type LoggedInUser = Omit<IUser, 'firstName' | 'lastName'>;

export interface AuthUserRequest extends Request {
    user: string | JwtPayload; //
}

export interface IHashData {
    id: string,
    email: string,
}