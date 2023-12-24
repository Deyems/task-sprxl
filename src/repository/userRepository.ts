import { connectDatabase } from "../database";
import { RowDataPacket } from "mysql2";
import { IUser, User, UserAccount, UserWithAccountNo } from "../common/interfaces/user";
import { createAccount } from "./accountRepository";

const fetchUserByEmail = async (email:string): Promise<IUser | null> => {
    const [rows] = await connectDatabase().query('SELECT * FROM User WHERE email = ?', [email]);

    if (!rows || (rows as RowDataPacket[]).length == 0) {
        return null;
    }

    let foundUser = (rows as RowDataPacket[])[0] as User;

    if (!foundUser) {
        return null;
    }
    return foundUser;
}


const fetchUserById = async (userId: number): Promise<UserAccount | null> => {
    
    const [rows] = await connectDatabase().query('SELECT User.userId, User.firstName, User.lastName, User.email, Account.accountNumber, Account.accountId, Account.balance FROM User JOIN Account ON User.userId = Account.userId WHERE User.userId = ?', [userId]);

    if (!rows || (rows as RowDataPacket[]).length == 0) {
        return null;
    }

    let foundUser = (rows as RowDataPacket[])[0] as UserAccount;

    if (!foundUser) {
        return null;
    }
    return foundUser;
}

const createUser = async (user: IUser): Promise<UserWithAccountNo | null> => {

    const [result] = await connectDatabase().query('INSERT INTO User (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.password]);

    const insertId = (result as any).insertId as number;

    //create an account for each user registered.
    const accountNumber = await createAccount(insertId) as string;

    const modifiedUser: UserWithAccountNo = {
        accountNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }
    return modifiedUser;
}

const updateUser = async (user:IUser) => {
    const [result] = await connectDatabase().query('UPDATE User SET () VALUES (?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.password]);
    return result;
}


export {
    fetchUserByEmail,
    fetchUserById,
    createUser,
    updateUser,
}