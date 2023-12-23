import {Router, Request, Response, NextFunction} from "express";
import { registerHandler, loginHandler, getUser } from "../controllers/userController";
// import { verifyUser } from "../middlewares/auth";
import { authenticateJWT } from "../common/utils/authenticate";
import { accountDepositHandler, accountWithdrawHandler } from "../controllers/AccountController";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/user/:id', authenticateJWT, getUser);
router.post('/deposit', authenticateJWT, accountDepositHandler);
router.post('/withdraw', authenticateJWT, accountWithdrawHandler);
router.post('/account-statement', registerHandler);

router.use('alive', (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).json({ status: 'success', message: 'Server is up and running' })
);



export default router;