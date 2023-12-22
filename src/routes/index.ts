import {Router, Request, Response, NextFunction} from "express";
import { registerHandler } from "../controllers/userController";
const router = Router();

router.post('/register', registerHandler)

router.use('alive', (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).json({ status: 'success', message: 'Server is up and running' })
);



export default router;