import { Request, NextFunction, Response } from "express";
import { accountDepositService, accountWithdrawService } from "../services/accountService";
import { AppResponse } from "../common/utils/appResponse";

export const accountDepositHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = accountDepositService(req.body);
        AppResponse(res, 200, response, "deposit successful");
    } catch (error) {
        console.log(error, 'error at depositing');
        next(error);
    }
}

export const accountWithdrawHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = accountWithdrawService(req.body);
        AppResponse(res, 200, response, "withdrawal successful");
    } catch (error) {
        console.error(error, 'error at withdrawing');
        next(error);
    }
}