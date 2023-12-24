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
    const transaction = (result as RowDataPacket);
    return transaction;
}

const fetchTransactionUserAccountStatement = async (userId: number) => {
    
    const [transactionResult, balanceResult] = await Promise.all([
        connectDatabase().query(`
            SELECT
                Transaction.transactionId,
                Transaction.amount,
                Transaction.transactionType,
                Transaction.created_at,
                Transaction.updated_at,
                User.firstName,
                User.lastName,
                User.email,
                Account.accountNumber
            FROM
                Transaction
            JOIN
                User ON Transaction.userId = User.userId
            JOIN
                Account ON Transaction.accountId = Account.accountId
            WHERE
                User.userId = ?;
        `, [userId]),
        connectDatabase().query(`
            SELECT
                Account.accountId,
                Account.accountNumber,
                Account.balance
            FROM
                Account
            WHERE
                Account.userId = ?;
        `, [userId]),
    ]);

    const transactionData = (transactionResult as RowDataPacket)[0];
    const balanceData = (balanceResult as RowDataPacket)[0];

    return {
        transactionData,
        balanceData,
    }
}

const fetchTransactionByAccountId = async (id: number) => {
    const [result] = await connectDatabase().query('SELECT * FROM Transaction WHERE AccountId = ?', [id]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}

const fetchTransactionByTransactionType = async (userId:number, txnType: string) => {
    const [result] = await connectDatabase().query(`
    SELECT 
        Transaction.transactionId,
        Transaction.amount,
        Transaction.transactionType,
        Transaction.created_at,
        Transaction.updated_at,
        User.firstName,
        User.lastName,
        User.email,
        Account.accountNumber
    FROM 
        Transaction 
    JOIN 
        User ON Transaction.userId = User.userId 
    JOIN 
        Account ON Transaction.accountId = Account.accountId 
    WHERE 
        User.userId = ? 
    AND 
        Transaction.transactionType = ?
    `, [userId, txnType]);
    const transaction = (result as RowDataPacket)[0];
    return transaction;
}

export {
    saveTransaction,
    fetchTransactionById,
    fetchTransactionByUserId,
    fetchTransactionByAccountId,
    fetchTransactionByTransactionType,
    fetchTransactionUserAccountStatement,
}