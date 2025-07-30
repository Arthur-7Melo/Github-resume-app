import express from 'express';
import insightRouter from './routes/insightRouter';

const app = express();

app.use(express.json());
app.use("/insights", insightRouter)

export default app;