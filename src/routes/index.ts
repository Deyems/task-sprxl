import {Router, Request, Response, NextFunction} from "express";

const router = Router();

router.use('alive', (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).json({ status: 'success', message: 'Server is up and running' })
);



export default router;