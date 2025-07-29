import { Request, Response } from "express";
import { connectDB } from "../db/mongo";
import { getInsights } from "../services/insightService";

export const insightHandler = async (req: Request, res: Response) => {
  const repo = String(req.query.repo || "");
  if (!repo) {
    return res.status(400).json({
      error: "Query param 'repo' é obrigatório"
    });
  }

  try {
    const db = await connectDB();
    const result = await getInsights(db, repo);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message.includes("Nenhum snapshot")) {
      return res.status(404).json(error.message)
    }
    console.error("Erro em GET /insights:", error);
    res.status(500).json({ error: error.message });
  }
}