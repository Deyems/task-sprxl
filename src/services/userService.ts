import { RowDataPacket } from "mysql2/promise";

import { logger } from "../common/utils/logger";
import { connectDatabase } from "../database";
import { IUser, LoggedInUser, RegisteredUser, User } from "../common/interfaces/user";
import { comparePassword, hashPassword, generateToken } from "../common/utils/authenticate";
import { ENVIRONMENT } from "../common/config/environment";
import AppError from "../common/utils/appError";
// import AppError from "../common/utils/appError";

const registerService = async (user: IUser) => {
    //Interact with database here. 
    logger.info('log from register Service Fxn' + JSON.stringify(user));

    user.password = await hashPassword(user.password);
    const [result] = await connectDatabase().query('INSERT INTO User (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.password]);
    const insertId = (result as any).insertId as number;
    
    //create an account for each user registered.
    const accountNumber = await createAccount(insertId);
    
    const modifiedUser:RegisteredUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }
    return { accountNumber, ...modifiedUser };
}

const createAccount = async (id: number ): Promise<string | null> => {
    const [result] = await connectDatabase().query('INSERT INTO Account (userId, accountNumber) VALUES (?, LPAD(?, 10, 0) )', [id, id]);
    const insertedID = (result as RowDataPacket).insertId;
    const [insertedRow] = await connectDatabase().query('SELECT * FROM Account WHERE accountId = ?', [insertedID]);
    const accountNumber = (insertedRow as RowDataPacket)[0].accountNumber as string;
    return accountNumber;
}

const loginService = async (user: LoggedInUser): Promise<string> => {
    const [ rows ] = await connectDatabase().query('SELECT * FROM User WHERE email = ?', [user.email]);
    if (!rows || (rows as RowDataPacket).length == 0){
        throw new AppError("Invalid Email/Password", 400, {});
    }

    let foundUser = (rows as RowDataPacket[])[0] as User;
    if(!foundUser){
        throw new AppError("Invalid Email/Password", 400, {});
    }

    let verified = await comparePassword(user.password, foundUser.password);
    if(!verified){
        throw new AppError("Invalid Email/Password", 400, {});
    }

    const token = generateToken(
        { id: foundUser.userId.toString(), email: foundUser.email },
        { expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS }
    );
    return token;
}

export {
    registerService, 
    loginService,
    createAccount,
}