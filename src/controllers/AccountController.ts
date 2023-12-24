import { Request, NextFunction, Response } from "express";
import { transactionService } from "../services/accountService";
import { AppResponse } from "../common/utils/appResponse";
import { isValidNumber } from "../common/utils/utilityFxns";
import AppError from "../common/utils/appError";

export const accountHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {action} = req.query;
        const userId = req.params.id;

        if (!isValidNumber(userId as string)) return AppResponse(res, 400, {}, "Invalid Param");
        
        let response = null;
        let parsedData = {
            userId: parseInt(userId), 
            amount: +req?.body?.amount,
        }
        switch (action) {
            case 'deposit':
                response = await transactionService(parsedData, action);
                break;
            case 'withdrawal':
                parsedData.amount = -req?.body?.amount;
                response = await transactionService(parsedData, action);
                break;
            default:
                throw new AppError(`Invalid Action`, 400, {});
        }

        return AppResponse(res, 200, response, `${action} successful`);
    } catch (error) {
        console.log(error, 'error at depositing');
        next(error);
    }
}