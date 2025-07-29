import { Router } from "express";
import { insightHandler } from "../controllers/insightController";

const router = Router();

router.get("/", insightHandler);

export default router;