import { Router, type IRouter } from "express";
import healthRouter from "./health";
import housesRouter from "./houses";

const router: IRouter = Router();

router.use(healthRouter);
router.use(housesRouter);

export default router;
