import { logger } from "../common/utils/logger";
import { connectDatabase } from "../database";
import { LoggedInUser, User } from "../common/interfaces/user";
import { comparePassword, hashPassword } from "../common/utils/authenticate";
import { RowDataPacket } from "mysql2/promise";

const registerService = async (user: Omit<User, 'id'>) => {
    //Interact with database here. 
    logger.info('log from register Service Fxn' + JSON.stringify(user));
    user.password = await hashPassword(user.password);
    const [result] = await connectDatabase().query('INSERT INTO User (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.password]);
    const insertId = (result as any).insertId as number;
    return { id: insertId, ...user };
}

const loginService = async (user: LoggedInUser) => {
    console.log(user, 'used at login info');
    // data pulled should then be checked based on the password.
    const [ rows ] = await connectDatabase().query('SELECT * FROM Users WHERE email = ?', [user.email]);

    // return Array.isArray(rows) && rows.length > 0 ? rows[0] as User : null;
    if (!rows){
        //
        // no user found
    }

    let foundUser = (rows as RowDataPacket[])[0] as User;

    let verified = await comparePassword(user.password, foundUser.password);
    console.log(verified, 'is password same');

    //sign the payload to generate a token for the user.
}

export {
    registerService, 
    loginService
}