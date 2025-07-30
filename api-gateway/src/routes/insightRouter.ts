import { Router } from "express";
import { getInsights } from "../controllers/insightController";

const router = Router();

router.get("/", getInsights);

export default router;