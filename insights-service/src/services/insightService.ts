import { Db, WithId, Document } from "mongodb";
import Groq from "groq-sdk";
import { Snapshot } from "../types";
import { MONGO_COLLECTION, GROQ_API_KEY } from "../config";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function getInsights(db: Db, repo: string): Promise<Snapshot & { insights: string }> {
  const coll = db.collection(MONGO_COLLECTION);
  const doc = await coll
    .find({ repo })
    .sort({ fetchedAt: - 1 })
    .limit(1)
    .next() as WithId<Document> | null;

  if (!doc) {
    throw new Error("Nenhum Snapshot encontrado para esse repo");
  }

  const snapshot: Snapshot = {
    repo: doc.repo,
    fetchedAt: doc.fetchedAt.toISOString(),
    top_languages: doc.top_languages,
    commits_last_week: doc.commits_last_week,
    stars: doc.stars
  };

  const prompt = `
    Você é um analista de código. Para o repositório ${snapshot.repo}, considere:
    - Top linguagens e suas porcentagens: ${JSON.stringify(snapshot.top_languages)}
    - Commits nos últimos 7 dias: ${snapshot.commits_last_week}
    - Número de estrelas: ${snapshot.stars}

    Escreva um único parágrafo conciso destacando tendências, pontos fortes e sugestões de melhoria.
  `;

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("Falha ao gerar insights: resposta inválida do modelo");
  }

  return {
    ...snapshot,
    insights: message.trim()
  };
}