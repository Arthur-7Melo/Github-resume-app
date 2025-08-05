const createMock = jest.fn();

jest.mock("groq-sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createMock
      }
    }
  }))
}));

import { getInsights } from "../../src/services/insightService";
import type { Db, Document, WithId } from "mongodb";

describe("getInsights", () => {
  let fakeDb: Db;
  let fakeCursor: any;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeCursor = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      next: jest.fn()
    };
    fakeDb = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue(fakeCursor)
      })
    } as unknown as Db;
  });

  it("deve retornar snapshot + insights", async () => {
    const repo = "owner/repo";
    const now = new Date("2025-07-01T12:00:00Z");
    const doc: WithId<Document> = {
      _id: "fakeid" as any,
      repo,
      fetchedAt: now,
      top_languages: [{ name: "JS", bytes: 10, pct: 66.7 }],
      commits_last_week: 5,
      stars: 42
    };

    fakeCursor.next.mockResolvedValue(doc);

    createMock.mockResolvedValue({
      choices: [{ message: { content: "Insight gerado com sucesso" } }]
    });

    const result = await getInsights(fakeDb, repo);

    expect(result).toEqual({
      repo,
      fetchedAt: now.toISOString(),
      top_languages: doc.top_languages,
      commits_last_week: doc.commits_last_week,
      stars: doc.stars,
      insights: "Insight gerado com sucesso"
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining(`repositório ${repo}`)
          })
        ])
      })
    );
  });

  it("deve lançar erro quando não encontrar snapshot", async () => {
    fakeCursor.next.mockResolvedValue(null);
    await expect(getInsights(fakeDb, "owner/empty"))
      .rejects.toThrow("Nenhum Snapshot encontrado para esse repo");
  });

  it("deve lançar erro quando o modelo não retornar mensagem", async () => {
    const repo = "owner/noinsight";
    fakeCursor.next.mockResolvedValue({
      _id: "fakeid" as any,
      repo,
      fetchedAt: new Date(),
      top_languages: [],
      commits_last_week: 0,
      stars: 0
    });

    createMock.mockResolvedValue({ choices: [{}] });

    await expect(getInsights(fakeDb, repo))
      .rejects.toThrow("Falha ao gerar insights: resposta inválida do modelo");
  });
});
