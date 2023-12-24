import { RowDataPacket } from "mysql2/promise";

import { logger } from "../common/utils/logger";
import { connectDatabase } from "../database";
import { IUser, LoggedInUser, User } from "../common/interfaces/user";
import { comparePassword, hashPassword, generateToken } from "../common/utils/authenticate";
import { ENVIRONMENT } from "../common/config/environment";
import AppError from "../common/utils/appError";
import { createUserRepository, fetchUserById } from "../repository/userRepository";
import { fetchTransactionUserAccountStatement } from "../repository/transactionRepository";
import { fetchAccountBalance } from "../repository/accountRepository";

const registerService = async (user: IUser) => {
    //Interact with database here. 
    logger.info('log from register Service Fxn' + JSON.stringify(user));

    user.password = await hashPassword(user.password);
    const modifiedUser = await createUserRepository(user);
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

const getAccountStatementService = async (userId: number) => {
    let connection = null;
    try {
        connection = await connectDatabase().getConnection();

        await connection.beginTransaction();

        const transactionHistory = await fetchTransactionUserAccountStatement(userId);

        // Commit the transaction
        await connection.commit();

        console.log(transactionHistory, 'history of transaction for this user');
        return transactionHistory;
    } catch (error) {

        console.error(error, 'error while withdrawing???');
        if (connection) {
            await connection.rollback();
        }
        throw new AppError("Error while getting Account Statement", 500, {});

    }finally{
        if (connection) {
            connection.release();
        }
    }
    
}

const getBalanceService = async (userId: number) => {
    let balanceResult = await fetchAccountBalance(userId);
    return balanceResult;
}

export {
    registerService, 
    loginService,
    fetchUserService,
    getAccountStatementService,
    getBalanceService,
}