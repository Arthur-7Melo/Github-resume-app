import express from "express";
import { PORT } from "./config";
import router from "./routes/insightRouter";

const app = express();
app.use(express.json());
app.use("/insights", router);

app.listen(PORT, () => {
  console.log(`Insights Service rodando na porta: ${PORT}`)
})