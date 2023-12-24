import { Request, Response, NextFunction } from "express";
import { loginService, registerService, fetchUserService, getAccountStatementService, getBalanceService } from "../services/userService";
import { AppResponse } from "../common/utils/appResponse";
import { ENVIRONMENT } from "../common/config/environment";
import { isValidNumber } from "../common/utils/utilityFxns";


const registerHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        let response = await registerService(req.body);
        return AppResponse(res, 200, response, "registration successful");
    } catch (error) {
        console.error(error, 'error at Register Handler');
        next(error);
    }

}

const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = await loginService(req.body);
        return AppResponse(res, 200, { token, expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS }, "login successful");
    } catch (error) {
        console.error(error, 'error at loginHandler');
        next(error);
        // throw new AppError('error occured', 400, null);
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        if (!isValidNumber(id as string)) return AppResponse(res, 400, {}, "Invalid Param");
        let foundUser = await fetchUserService(Number(id));
        return AppResponse(res, 200, foundUser, "Successfully retrieved user");
    } catch (error) {
        console.error(error, 'error at getting User');
        next(error);
    }
}

const getUserAccountStatement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id: userId} = req.params;
        const accountStatement = await getAccountStatementService(parseInt(userId));
        return AppResponse(res, 200, accountStatement, "Account Statement retrieved successfully");
    } catch (error) {
        console.error(error, 'error fetching account Statement!');
        next(error);
    }
}

// getUserBalance
const getUserBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = req.params;
        const accountBalance = await getBalanceService(parseInt(userId));
        return AppResponse(res, 200, accountBalance, "Account Balance Successfully retrieved");
    } catch (error) {
        next(error);
    }
}


export {
    registerHandler,
    loginHandler,
    getUser,
    getUserAccountStatement,
    getUserBalance,
}