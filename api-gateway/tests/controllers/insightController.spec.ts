import request from 'supertest';
import app from '../../src/app';
import { httpClient } from '../../src/utils/httpClient';
import { INSIGHTS_SERVICE_URL } from '../../src/config';

jest.mock("../../src/utils/httpClient");

const mockedHttp = httpClient as jest.Mocked<typeof httpClient>;

describe("GET /insights", () => {
  const INSIGHTS_URL = INSIGHTS_SERVICE_URL;

  beforeEach(() => {
    jest.clearAllMocks()
  });

  it("Deve retornar status 400 se query 'repo' não fornecida", async () => {
    const res = await request(app).get("/insights");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Campo 'repo' é obrigatório" });
    expect(mockedHttp.get).not.toHaveBeenCalled();
  });

  it("Deve fazer proxy corretamente e retornar body do insights-service", async () => {
    const fakeInsights = {
      repo: 'x/y',
      fetchedAt: '2025-07-01T00:00:00Z',
      top_languages: [],
      commits_last_week: 1,
      stars: 2,
      insights: 'ok'
    };
    mockedHttp.get.mockResolvedValue({ data: fakeInsights });

    const res = await request(app)
      .get("/insights")
      .query({ repo: 'x/y' });

    expect(mockedHttp.get).toHaveBeenCalledWith(
      `${INSIGHTS_URL}/insights?repo=x/y`
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeInsights);
  });

  it("Deve retornar status 500 se insights-service falhar", async () => {
    mockedHttp.get.mockRejectedValue(new Error("Error"));

    const res = await request(app)
      .get("/insights")
      .query({ repo: 'any' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro ao buscar insights" });
  });
})
