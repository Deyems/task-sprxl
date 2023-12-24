import {Router, Request, Response, NextFunction} from "express";
import { registerHandler, loginHandler, getUser, getUserAccountStatement, getUserBalance } from "../controllers/userController";
import { authenticateJWT } from "../common/utils/authenticate";
import { accountHandler } from "../controllers/AccountController";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/user/:id', authenticateJWT, getUser);
router.post('/user/:id', authenticateJWT, accountHandler);
router.get('/user/:id/account-statement', authenticateJWT, getUserAccountStatement);
router.get('/user/:id/balance', authenticateJWT, getUserBalance);

router.use('alive', (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).json({ status: 'success', message: 'Server is up and running' })
);

export default router;