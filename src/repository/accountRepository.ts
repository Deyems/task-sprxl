
import { connectDatabase } from "../database";
import { RowDataPacket } from "mysql2";

const updateAccount = async(data: Record<string, number>) => {
    const dbResult = await connectDatabase().query('UPDATE Account SET balance = balance + ? WHERE userId = ?', [data.amount, data.userId]);
    if(!(dbResult as RowDataPacket)[0].changedRows){
        return null;
    }
    return (dbResult as RowDataPacket)[0].changedRows
}

const createAccount = async (id: number): Promise<string | null> => {
    const [result] = await connectDatabase().query('INSERT INTO Account (userId, accountNumber) VALUES (?, LPAD(?, 10, 0) )', [id, id]);
    const insertedID = (result as RowDataPacket).insertId;
    const accountNumber = fetchAccountNumberById(insertedID);
    return accountNumber;
}

//Internal
const fetchAccountNumberById = async (id: number) => {
    const [insertedRow] = await connectDatabase().query('SELECT * FROM Account WHERE accountId = ?', [id]);
    const accountNumber = (insertedRow as RowDataPacket)[0].accountNumber as string;
    return accountNumber;
}

const fetchAccountBalance = async (userId: number) => {
    const [balanceResult] = await connectDatabase().query(`
            SELECT
                Account.accountId,
                Account.accountNumber,
                Account.balance
            FROM
                Account
            WHERE
                Account.userId = ?;
        `, [userId]);

    const balanceData = (balanceResult as RowDataPacket)[0];
    return balanceData;
}

export {
    updateAccount,
    createAccount,
    fetchAccountBalance,
}