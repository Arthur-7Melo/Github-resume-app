# Gerador de Insights Github

## 🔍 Sumário

- [Sobre](#-Sobre)  
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Pré‑requisitos](#-pré‑requisitos)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Usando Docker](#-usando-docker)
- [Testes](#-testes)   
- [Documentação Swagger](#-documentação-swagger)     
- [Licença](#-licença)

---

## 📗 Sobre
Github Insights é um pequeno sistema composto por microsserviços que coleta métricas de repositórios GitHub, armazena snapshots no MongoDB e gera um parágrafo de insights usando um LLM (atualmente usando GROQ LLaMA3).

---

## 🚀 Funcionalidades

- Coleta de linguagens (bytes), commits da última semana e estrelas do GitHub.
- Geração automática de texto com LLM (insights, recomendações).
- Armazenamento de snapshots no MongoDB.
- Gateway para orquestração (proxy / roteamento).
- Frontend (React + Vite + Tailwind) para UX.
- Testes (pytest, Jest, Supertest).
- Containerização (Docker + docker-compose).
- Documentação OpenAPI / Swagger.
- CI (Github Actions).

---

## ⚙️ Arquitetura

- **Client (React + Vite + Tailwind):** 
SPA que permite ao usuário colar uma URL de GitHub, disparar coleta e visualizar métricas + texto de insights.
- **API Gateway (Node + Express + TS):**
Entrada principal do sistema. Roteia e orquestra chamadas para:
  - `/collector` — proxy para o Collector (dispara coleta e salva snapshot)
  - `/insights` - proxy para o Insights Service (recupera snapshot e pede ao LLM um parágrafo).
- **Collector (Python + FastAPI):**
Serviço Python ETL (Extract, Transform, Load) que:
  - `Extract`: Coleta dados brutos do Github API
  - `Transform`: Transforma dados brutos em estrutura analítica (Snapshot)
  - `Load`: Salva o snapshot no MongoDB
- **Insights Service (Node + TS):**
Lê o último snapshot do MongoDB e chama o LLM (Groq SDK) para gerar um texto conciso com tendências, pontos fortes e recomendações.
- **MongoDB:**
Armazena snapshots (coleção snapshots por padrão).
- **OpenAPI/Swagger:**
O Gateway expõe a documentação em /docs (Swagger UI) e o YAML raw em /openapi.yaml.

---

## 🛠️ Variáveis de Ambiente
Coloque em `.env` (cada serviço tem seu próprio .env para desenvolvimento). Exemplo mínimo por serviço:
- ### Collector/.env:
```dotenv
GITHUB_TOKEN=ghp_fakekey
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/github_insights
MONGO_DB=github_insights
MONGO_COLLECTION=snapshots
```


- ### Insights-service/.env:
```dotenv
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/github_insights
MONGO_DB=github_insights
MONGO_COLLECTION=snapshots
GROQ_API_KEY=your_groq_key
PORT=4000
```

- ### api-gateway/.env
```dotenv
PORT=5000
COLLECTOR_SERVICE_URL=http://collector:8000
INSIGHTS_SERVICE_URL=http://insights:4000
FRONTEND_URL=http://localhost:5173
```

- ### client/.env (Vite)
```dotenv
VITE_API_URL=http://localhost:5000
```

---

## 💻 Pré‑requisitos
- Node 18+
- Python 3.10+ (para collector)
- Docker & docker-compose (opcional, mas facilita replicação de ambiente)

---

## ▶️ Rodando o Projeto
### Collector (Python):
```bash
cd collector
python -m venv .venv
. .venv/bin/activate      # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Insights Service (Node)
```bash
cd insights-service
npm install
npm run dev
```

### API Gateway (Node)
```bash
cd api-gateway
npm install
npm run dev
```

### Client (React)
```bash
cd client
npm install
npm run dev
```

---

## 🐳 Usando Docker
No root do projeto:
```bash
docker-compose up --build
```

Isso vai criar/rodar: Mongo, collector (8000), insights (4000), gateway (5000) e client (5173).
 Acesse:
- Frontend: `http://localhost:5173`
- Gateway API: `http://localhost:5000`
- OpenAPI (UI): `http://localhost:5000/docs`
- Collector API: `http://localhost:8000`
- Insights API: `http://localhost:4000`

---

## ✅ Testes
### Collector (Python):
```bash
cd collector
. .venv/bin/activate      # ou .venv\Scripts\activate no Windows
pytest -q
```

### Insights Service (Node)
```bash
cd insights-service
npm test
```

### API Gateway (Node)
```bash
cd api-gateway
npm test
```

---

## 📄 Documentação Swagger
Depois de iniciar a API, abra:

```bash
http://localhost:5000/docs
```
(As rotas do gateway fazem proxy para collector/insights — a documentação descreve endpoints públicos do gateway.)

---

## 📜 Licença
Este projeto está licenciado sob a [MIT License](https://opensource.org/license/mit)
