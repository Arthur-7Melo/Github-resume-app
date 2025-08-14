import express from 'express';
import insightRouter from './routes/insightRouter';
import collecorRouter from './routes/collectorRouter';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use("/insights", insightRouter);
app.use("/collect", collecorRouter);

const swaggerDocument = YAML.load('./openapi.yaml');
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default app;