import { connectDatabase } from "../database";
import { ITransaction } from "../common/interfaces/transaction";
import { RowDataPacket } from "mysql2";

const saveTransaction = async (transaction: ITransaction): Promise<number | null> => {

    const [result] = await connectDatabase().query('INSERT INTO Transaction (userId, accountId, amount, transactionType) VALUES (?, ?, ?, ?)', [transaction.userId, transaction.accountId, transaction.amount, transaction.transactionType]);

    const insertId = (result as any).insertId as number;

    if(!insertId) return null;

    return insertId;
}

const fetchTransactionById = async (id: number) => {
    const [result] = await connectDatabase().query('SELECT * FROM Transaction WHERE transactionId = ?', [id]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}

const fetchTransactionByUserId = async (id: number) => {
    const [result] = await connectDatabase().query('SELECT * FROM Transaction WHERE userId = ?', [id]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}

const fetchTransactionByAccountId = async (id: number) => {
    const [result] = await connectDatabase().query('SELECT * FROM Transaction WHERE AccountId = ?', [id]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}


const fetchTransactionByTransactionType = async (txnType: string) => {
    const [result] = await connectDatabase().query('SELECT * FROM Transaction WHERE transactionType = ?', [txnType]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}

export {
    saveTransaction,
    fetchTransactionById,
    fetchTransactionByUserId,
    fetchTransactionByAccountId,
    fetchTransactionByTransactionType,
}