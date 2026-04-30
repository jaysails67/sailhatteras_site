import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import investorsRouter from "./investors";
import contentRouter from "./content";
import postsRouter from "./posts";
import teamRouter from "./team";
import contactRouter from "./contact";
import waitlistRouter from "./waitlist";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(investorsRouter);
router.use(contentRouter);
router.use(postsRouter);
router.use(teamRouter);
router.use(contactRouter);
router.use(waitlistRouter);
router.use(adminRouter);

export default router;
