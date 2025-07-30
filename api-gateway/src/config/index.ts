import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5000;
export const INSIGHTS_SERVICE_URL = process.env.INSIGHTS_SERVICE_URL;
export const COLLECTOR_SERVICE_URL = process.env.COLLECTOR_SERVICE_URL;

if (!INSIGHTS_SERVICE_URL) {
  throw new Error("INSIGHTS_SERVICE_URL não definida no .env");
}

if (!COLLECTOR_SERVICE_URL) {
  throw new Error("COLLECTOR_SERVICE_URL não definida no .env");
}