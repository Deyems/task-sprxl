import { Request, Response, NextFunction } from "express";
import { loginService, registerService, fetchUserService } from "../services/userService";
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

const getUserAccountStatement = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const accountStatement = {};
        return AppResponse(res, 200, accountStatement, "Successfully retrieved user"); 
    } catch (error) {
        next(error);
    }
}

// getUserBalance
const getUserBalance = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const accountBalance = {};
        return AppResponse(res, 200, accountBalance, "Successfully retrieved user");
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