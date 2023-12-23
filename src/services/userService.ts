import { RowDataPacket } from "mysql2/promise";

import { logger } from "../common/utils/logger";
import { connectDatabase } from "../database";
import { IUser, LoggedInUser, User } from "../common/interfaces/user";
import { comparePassword, hashPassword, generateToken } from "../common/utils/authenticate";
import { ENVIRONMENT } from "../common/config/environment";
import AppError from "../common/utils/appError";
import { createUser, fetchUserById } from "../repository/userRepository";

const registerService = async (user: IUser) => {
    //Interact with database here. 
    logger.info('log from register Service Fxn' + JSON.stringify(user));

    user.password = await hashPassword(user.password);
    const modifiedUser = await createUser(user);
    return { ...modifiedUser };
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

const fetchUserService = async (id: number) => {
    let userFetched = await fetchUserById(id);
    return userFetched;
}

export {
    registerService, 
    loginService,
    fetchUserService,
}