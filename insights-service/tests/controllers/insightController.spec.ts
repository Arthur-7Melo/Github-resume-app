import request from 'supertest';
import app from '../../src/app';

jest.mock("../../src/db/mongo", () => ({
  connectDB: jest.fn()
}));
jest.mock("../../src/services/insightService", () => ({
  getInsights: jest.fn()
}));

import { connectDB } from '../../src/db/mongo';
import { getInsights } from '../../src/services/insightService';

describe("GET /insights", () => {
  const fakeDb = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (connectDB as jest.Mock).mockResolvedValue(fakeDb)
  });

  it("Deve retornar status 400 se repo não passado", async () => {
    const res = await request(app).get("/insights");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Query param 'repo' é obrigatório"
    });
    expect(connectDB).not.toHaveBeenCalled();
    expect(getInsights).not.toHaveBeenCalled();
  });

  it("Deve retornar status 200 e resultado", async () => {
    const fakeResult = {
      repo: "owner/repo",
      fetchedAt: "2025-07-01T00:00:00Z",
      top_languages: [],
      commits_last_week: 1,
      stars: 2,
      insights: "insights"
    };
    (getInsights as jest.Mock).mockResolvedValue(fakeResult);

    const res = await request(app).get("/insights").
      query({ repo: fakeResult.repo });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeResult);
    expect(connectDB).toHaveBeenCalled();
    expect(getInsights).toHaveBeenCalledWith(fakeDb, fakeResult.repo);
  });

  it("Deve retornar status 404 se snapshot não encontrado", async () => {
    (getInsights as jest.Mock).mockRejectedValue(new Error("Nenhum snapshot encontrado para esse repo"));

    const res = await request(app).get("/insights").
      query({ repo: "owner/unknown" });

    expect(res.status).toBe(404);
    expect(res.text).toContain("Nenhum snapshot encontrado para esse repo")
  });

  it("Deve retornar status 500 se Error", async () => {
    (getInsights as jest.Mock).mockRejectedValue(new Error("Erro inesperado"));

    const res = await request(app).get("/insights").
      query({ repo: "owner/error" })

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Erro inesperado"
    });
  });
});