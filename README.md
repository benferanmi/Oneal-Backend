# O'Neal's Auto Detailing — Backend

Lean Node.js / Express / MongoDB backend for a mobile auto-detailing lead-gen site.

## Setup

```bash
cd backend
cp .env.example .env
# edit .env
npm install
npm run seed     # seeds admin + initial services
npm run dev
```

Server runs on `http://localhost:4000`. All routes are namespaced under `/api/v1`.

See the prompt in the project root for the full API contract. All data shapes
are defined in `src/types/models.ts` — do not redefine them anywhere else.
