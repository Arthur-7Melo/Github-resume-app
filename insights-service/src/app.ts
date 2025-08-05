import express from "express";
import router from "./routes/insightRouter";

const app = express();
app.use(express.json());
app.use("/insights", router);

export default app;