import express from 'express';
import insightRouter from './routes/insightRouter';
import collecorRouter from './routes/collectorRouter';

const app = express();

app.use(express.json());
app.use("/insights", insightRouter);
app.use("/collect", collecorRouter);

export default app;