import { Router } from "express";
import { runCollector } from "../controllers/collectorController";

const router = Router();

router.post("/", runCollector);

export default router;