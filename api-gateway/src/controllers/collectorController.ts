import { Request, Response } from "express";
import { COLLECTOR_SERVICE_URL } from "../config";
import { httpClient } from "../utils/httpClient";

export async function runCollector(req: Request, res: Response) {
  const { repo } = req.query as { repo?: string };
  if (!repo) {
    return res.status(400).json({
      error: "Campo 'repo' é obrigatório"
    });
  }

  try {
    const collectorUrl = COLLECTOR_SERVICE_URL;
    const response = await httpClient.post(`${collectorUrl}/collector?repo=${encodeURIComponent(repo)}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Erro ao chamar Collector Service:", error.message);
    return res.status(500).json({ error: "Erro no Collector Service" });
  }
}