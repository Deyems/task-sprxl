
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
    const accountNumber = fetchAccountById(insertedID);
    return accountNumber;
}

const fetchAccountById = async (id: number) => {
    const [insertedRow] = await connectDatabase().query('SELECT * FROM Account WHERE accountId = ?', [id]);
    const accountNumber = (insertedRow as RowDataPacket)[0].accountNumber as string;
    return accountNumber;
}

export {
    updateAccount,
    createAccount,
    fetchAccountById,
}