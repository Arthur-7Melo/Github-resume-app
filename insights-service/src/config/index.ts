import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 4000;
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB = process.env.MONGO_DB || "github_insights";
export const MONGO_COLLECTION = process.env.MONGO_COLLECTION || "snapshots";
export const GROQ_API_KEY = process.env.GROQ_API_KEY!;

if (!MONGO_URI) {
  throw new Error("MONGO_URI não definida no .env");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY não definida no .env");
}