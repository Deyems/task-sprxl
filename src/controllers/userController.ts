import { Request, Response, NextFunction } from "express";
import { loginService, registerService } from "../services/userService";
import { AppResponse } from "../common/utils/appResponse";


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
        let response = await loginService(req.body);
        return AppResponse(res, 200, response, "login successful");
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