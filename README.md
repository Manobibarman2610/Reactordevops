<div align="center">

# ⚛️ REACTOR

**The AI DevOps Engineer That Remembers Every Deployment**

Turning every deployment — and every failure — into organizational memory
that helps your team prevent the next outage.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🤔 The Problem: Stateless CI/CD Is Amnesiac

Modern pipelines run thousands of automated checks, but they have **zero memory**.
They can verify that TypeScript compiles and unit tests pass — yet they cannot answer
the question that actually matters:

> *"Have we shipped a change like this before? What failed last time? What must we verify before shipping?"*

**REACTOR** closes that gap. It ingests deployment diffs (dependency bumps, DB
migrations, env var changes, Kubernetes/Helm edits), recalls matching incidents from
long-term organizational memory, and produces a risk assessment with a blast radius,
a verification checklist, and a recommended rollout strategy — *before* the deploy
goes out.

### A real failure pattern it is built to catch

1. **Deployment #1** — a routine minor `pg` driver upgrade (`8.7.3 → 8.11.1`) in
   `checkout-api` passed CI. In production, `pg 8.8+` enforced strict TLS validation and
   drained the RDS connection pool in 4 minutes → checkout outage.
2. **Six weeks later** — another engineer repeats the exact same change.
3. With REACTOR, the pipeline flags it: **CRITICAL — resembles Deployment #1**, with the
   root cause, the verified fix, affected services, and a 5% canary strategy.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Hindsight Memory Engine** | Embedded agent-memory system with `retain` / `recall` primitives, TF-IDF + tag-boosted semantic scoring, memory banks, and an association graph. Optional sync to Hindsight Cloud (Vectorize). |
| 🔍 **Pre-Deployment Risk Analysis** | Normalizes a deployment event, recalls relevant historical incidents, and produces risk level, confidence, blast radius, and prevention advice. |
| ✅ **Verification Checklists** | Actionable, copy-pasteable commands per risk (`openssl s_client`, `pgbench`, lock-timeout guards, pool-size greps). |
| 📐 **Friendly ↔ Technical View** | Every assessment can be read as plain-English customer-impact copy or as a deep-dive for engineers. |
| 🔁 **Continuous Learning Loop** | Record the real outcome + engineer feedback → the lesson is retained in Hindsight → the next matching deployment recalls it. |
| 🎬 **One-Click Scenarios** | Demo triggers: the core story (Deployment #27 ≈ #1), Prisma migration drift, Kubernetes memory reduction, and a nominal feature deploy. |
| 💬 **DevOps Agent Chat** | Ask anything; answers are grounded in recalled incident memories, in both plain-English and technical form. |

---

## 🏗️ Architecture

```
                DEPLOYMENT EVENT
                       ↓
              CI/CD EVENT INGESTION
                       ↓
                 EVENT NORMALIZER
                       ↓
                 REACTOR AI AGENT
                   ↙        ↘
      HINDSIGHT RECALL     DETERMINISTIC RISK ENGINE
       (Agent Memory)       (Expert fallback rules)
              ↓                      ↓
      HISTORICAL CONTEXT  ──→  RISK & PATTERN ANALYSIS
                                      ↓
                              PRE-FLIGHT RECOMMENDATION
                                      ↓
                              DEPLOYMENT OUTCOME
                                      ↓
                              ENGINEER FEEDBACK
                                      ↓
                               HINDSIGHT RETAIN   ──→  permanent organizational memory
```

Gemini (`gemini-3.8-flash`) powers the reasoning when `GEMINI_API_KEY` is set; when it
is not, a deterministic DevOps rules engine takes over so the app remains fully
functional offline.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, `motion`, `lucide-react`
- **Backend:** Node.js, Express 4, `tsx` (TypeScript-first dev server)
- **AI:** Google Gemini via `@google/genai`
- **Memory:** Hindsight embedded engine (local JSON stores) with optional Hindsight Cloud
- **Storage:** JSON file stores in [`data/`](data/) (`deployments_store.json`, `hindsight_store.json`)

---

## 🚀 Run Locally

**Prerequisites:** Node.js 20+

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional — app runs without it using the rules engine)
cp .env.example .env
#    then set GEMINI_API_KEY in .env

# 3. Start the dev server (Express + Vite middleware)
npm run dev
```

Open **http://localhost:3000**

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Express + Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm start` | Start the server (serves `dist/` when `NODE_ENV=production`) |
| `npm run lint` | Type-check with `tsc --noEmit` |

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

### Deployments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health + Gemini configuration status |
| `GET` | `/api/deployments` | List all deployments (newest first) |
| `GET` | `/api/deployments/:id` | Fetch a single deployment |
| `POST` | `/api/deployments/analyze` | Analyze a deployment and return a risk assessment |
| `POST` | `/api/deployments/:id/outcome` | Record the real outcome + feedback → retained in Hindsight |
| `POST` | `/api/deployments/trigger-scenario` | Run a preset demo scenario |
| `POST` | `/api/deployments/reset` | Reset storage back to the seed state |

**`trigger-scenario` payloads:** `deployment_27_core_story` · `prisma_drift` ·
`k8s_memory_reduction` · _(anything else → nominal feature deploy)_

### Hindsight Memory

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hindsight/memories` | All retained memories |
| `GET` | `/api/hindsight/banks` | List memory banks |
| `GET` | `/api/hindsight/graph` | Memory association graph (nodes + edges) |
| `POST` | `/api/hindsight/recall` | Semantic recall — `{ query, threshold?, topK?, bankId?, tags? }` |
| `POST` | `/api/hindsight/retain` | Retain a new memory — `{ title, content, summary?, tags?, metadata?, bankId? }` |

### Agent

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/agent/chat` | Ask the DevOps agent — `{ message }` |

---

## 📁 Project Structure

```
reactor/
├── api/                    # Vercel serverless entry (Express app)
├── data/                   # JSON memory + deployment stores
├── docs/                   # Article, LinkedIn post, video script
├── public/                 # Static assets
├── src/
│   ├── components/         # UI (table, inspector, memory explorer, agent chat, …)
│   ├── server/
│   │   ├── agent.ts        # Gemini reasoning + deterministic risk fallback
│   │   ├── hindsight.ts    # Hindsight memory engine (retain / recall / graph)
│   │   └── storage.ts      # Deployment store + seed history
│   └── types/reactor.ts    # Shared domain types
├── server.ts               # Express app + API routes
└── vite.config.ts          # Vite + Tailwind + React config
```

---

## ☁️ Deploy on Vercel

The repo is deployment-ready for Vercel:

1. Import the GitHub repository into Vercel (framework preset: **Vite**).
2. Set environment variables under **Project → Settings → Environment Variables**:
   - `GEMINI_API_KEY` — enables Gemini-powered analysis and chat
   - *(optional)* `HINDSIGHT_API_URL` / `HINDSIGHT_API_KEY` — sync memories to Hindsight Cloud
3. Deploy. The frontend builds with Vite; `/api/*` routes run through the Express app
   in [`api/[...slug].ts`](api/%5B...slug%5D.ts).

> **Note:** on serverless runtimes the JSON stores persist per function instance under
> `/tmp` — seeding always comes from the code, so every cold start starts with the full
> demo dataset.

---

## 📚 Further Reading

- **Technical article:** [`docs/article.md`](docs/article.md) — memory architecture, integration details, and lessons learned
- **Video script:** [`docs/video_script.md`](docs/video_script.md)
- **Launch post:** [`docs/linkedin_post.md`](docs/linkedin_post.md)

---

<div align="center">
<sub>REACTOR — every deployment makes the system smarter. 🔄</sub>
</div>
