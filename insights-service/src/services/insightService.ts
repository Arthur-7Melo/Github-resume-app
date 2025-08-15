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
    Você é um analista técnico especializado em qualidade de código. Para o repositório ${snapshot.repo}, analise estritamente os dados fornecidos:
    **Dados técnicos:**
    - Distribuição de linguagens: ${JSON.stringify(snapshot.top_languages)}
    - Atividade recente: ${snapshot.commits_last_week} commits nos últimos 7 dias
    - Popularidade: ${snapshot.stars} estrelas

    Gere um único parágrafo coeso (130-160 palavras) em português que:
      1. Descreva o padrão técnico mais significativo
      2. Destaque UM ponto forte técnico comprovado
      3. Aponte UMA oportunidade de melhoria prática
      4. Sugira UMA ação baseada na atividade de commits

      Regras absolutas:
      → Idioma: Português brasileiro
      → Use números exatos (ex: "TypeScript 42.7%")
      → Zero adjetivos subjetivos (bom/ruim/pouco/muito)
      → Foco em fatos mensuráveis sobre qualidade de código
  `;

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
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