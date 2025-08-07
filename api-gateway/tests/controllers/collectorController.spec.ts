import request from 'supertest';
import app from '../../src/app';
import { httpClient } from '../../src/utils/httpClient';
import { COLLECTOR_SERVICE_URL } from '../../src/config';

jest.mock("../../src/utils/httpClient");

const mockedHttp = httpClient as jest.Mocked<typeof httpClient>;

describe("POST /collect", () => {
  const collectorUrl = COLLECTOR_SERVICE_URL;

  beforeEach(() => {
    jest.clearAllMocks()
  });

  it("Deve retornar status 400 se query 'repo' não fornecida", async () => {
    const res = await request(app).post("/collect");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Campo 'repo' é obrigatório" });
    expect(mockedHttp.post).not.toHaveBeenCalled();
  });

  it("Deve fazer proxy corretamente e retornar body do collector-service", async () => {
    const fakedData = {
      status: 'ok',
      repo: 'abc/def',
      insertedAt: '2025-07-01T00:00:00Z'
    };
    mockedHttp.post.mockResolvedValue({ data: fakedData });

    const res = await request(app)
      .post("/collect")
      .query({ repo: 'abc/def' });

    expect(mockedHttp.post).toHaveBeenCalledWith(
      `${collectorUrl}/collector?repo=abc%2Fdef`
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakedData);
  });

  it("Deve retornar status 500 se Collector-service falhar", async () => {
    mockedHttp.post.mockRejectedValue(new Error("Error"));

    const res = await request(app)
      .post("/collect")
      .query({ repo: "any" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro no Collector Service" });
  });
})