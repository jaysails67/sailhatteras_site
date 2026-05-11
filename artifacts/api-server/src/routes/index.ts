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
import telegramRouter from "./telegram";
import storageRouter from "./storage";
import shRouter from "./sh";
import shChatRouter from "./sh-chat";
import shAgentMailRouter from "./sh-agentmail";
import shSitemapRouter from "./sh-sitemap";

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
router.use(telegramRouter);
router.use(storageRouter);
router.use(shRouter);
router.use(shChatRouter);
router.use(shAgentMailRouter);
router.use(shSitemapRouter);

export default router;
