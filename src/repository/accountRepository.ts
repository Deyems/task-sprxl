
import { connectDatabase } from "../database";
import { RowDataPacket } from "mysql2";

const topUpAccount = async() => {
    const dbResult = await connectDatabase().query('');
    console.log(dbResult, 'check....')
}


const withdrawFromAccount = async () => {
    const dbResult = await connectDatabase().query('');
    console.log(dbResult, 'check....withdraw');
}

const createAccount = async (id: number): Promise<string | null> => {
    const [result] = await connectDatabase().query('INSERT INTO Account (userId, accountNumber) VALUES (?, LPAD(?, 10, 0) )', [id, id]);
    const insertedID = (result as RowDataPacket).insertId;
    const [insertedRow] = await connectDatabase().query('SELECT * FROM Account WHERE accountId = ?', [insertedID]);
    const accountNumber = (insertedRow as RowDataPacket)[0].accountNumber as string;
    return accountNumber;
}


export {
    topUpAccount,
    withdrawFromAccount,
    createAccount,
}