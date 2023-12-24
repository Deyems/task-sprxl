import { updateAccount } from "../repository/accountRepository";
import { fetchUserById } from "../repository/userRepository";
import { saveTransaction } from "../repository/transactionRepository";
import { connectDatabase } from "../database";
import AppError from "../common/utils/appError";

const transactionService = async (data: Record<string, number>, action:string) => {
    let connection = null;
    try {
        connection = await connectDatabase().getConnection();
        
        await connection.beginTransaction();

        await updateAccount(data);
        
        const fetchedUserProfile = await fetchUserById(data.userId);
        
        //save this transaction by this user.
        let transactionData = {
            userId: fetchedUserProfile?.userId as number,
            accountId: fetchedUserProfile?.accountId as number,
            amount: data?.amount as number,
            transactionType: action as string,
        }
        
        await saveTransaction(transactionData);

        await connection.commit();

        return fetchedUserProfile;

    } catch (error) {
        console.error(error, 'error while withdrawing???');
        if(connection){
            await connection.rollback();
        }
        throw new AppError("Error while depositing", 500, {});
    }finally{
        if(connection){
            connection.release();
        }
    }

}

const accountBalanceService = (data: any) => {
    console.log(data, 'balance service');
}

export {
    transactionService,
    accountBalanceService,
}