import { Request, Response } from "express";
import { httpClient } from "../utils/httpClient";
import { INSIGHTS_SERVICE_URL } from "../config";

export async function getInsights(req: Request, res: Response) {
  const repo = req.query.repo;
  if (!repo) {
    return res.status(400).json({
      erro: "Query repo obrigatória"
    });
  }

  try {
    const baseUrl = INSIGHTS_SERVICE_URL;
    const response = await httpClient.get(`${baseUrl}/insights?repo=${repo}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar insights", error.message);
    res.status(500).json({ error: "Erro ao buscar insights" });
  }
}