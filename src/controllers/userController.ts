import { Request, Response, NextFunction } from "express";
import { loginService, registerService } from "../services/userService";
import { AppResponse } from "../common/utils/appResponse";
import { ENVIRONMENT } from "../common/config/environment";


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

export {
    registerHandler,
    loginHandler,
}