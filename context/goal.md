# Auth-Login Project — Agent Goal Document

> **Generated:** 2026-08-31 | **Stack:** Node.js · Express 5 · Supabase Auth · Swagger UI · ESM modules · pnpm · No frontend

---

## 0. What This Project Is

A **backend-only** secure REST API built as a FlyRank internship assignment (Week 2 / A4).
It implements a complete auth flow — sign-up, log in, log out, JWT verification, protected and public routes — documented with Swagger UI and published to GitHub.

**Language lane chosen:** JavaScript (Node.js + Express 5)
**Identity Provider:** Supabase Auth (anon key, not service_role)
**Database:** Supabase Auth handles user storage internally. No custom database (Docker/Postgres) is required for this assignment.
**Monorepo layout:** Turborepo with turbo mode on — no frontend package, backend only
**Module system:** ESM ("type": "module" already set)
**Package manager:** pnpm 11

---

## 1. Current State (What Is Already Done)

| Item | Status |
|---|---|
| Root repo initialized (git) | done |
| backend/ package initialized | done |
| backend/src/server.js — basic Express server with morgan + dotenv | done |
| backend/package.json — express 5, dotenv, morgan, pnpm, ESM | done |
| backend/.env (local only, git-ignored) | done |
| backend/.env.example | done |
| backend/.gitignore | done |
| Folder structure inside src/ | NOT CREATED |
| Supabase client | NOT INSTALLED |
| Swagger | NOT SET UP |
| Auth routes | NOT CREATED |
| Middleware | NOT CREATED |
| Turborepo config at root | NOT CONFIRMED — agent must check |

---

## 2. Target Folder Structure

The agent must create this exact structure (no frontend, no extra noise):

```
Auth-Login/
├── turbo.json                        <- root turbo config
├── package.json                      <- root workspace package.json (pnpm workspaces)
├── pnpm-workspace.yaml               <- declares backend as workspace
├── .gitignore                        <- root-level gitignore
├── context/
│   ├── main.md
│   └── goal.md                       <- this file
└── backend/
    ├── .env                          <- git-ignored, real secrets
    ├── .env.example                  <- committed, placeholder values
    ├── .gitignore
    ├── package.json
    ├── pnpm-lock.yaml
    └── src/
        ├── server.js                 <- entry point (already exists, needs updates)
        ├── config/
        │   ├── supabase.js           <- Supabase client singleton
        │   └── swagger.js            <- Swagger/OpenAPI config
        ├── routes/
        │   ├── auth.routes.js        <- POST /auth/signup, /auth/login, /auth/logout
        │   ├── protected.routes.js   <- GET /protected/profile, /protected/dashboard
        │   └── public.routes.js      <- GET /public/info
        ├── middleware/
        │   └── auth.middleware.js    <- reusable JWT guard (verifyToken)
        └── controllers/
            ├── auth.controller.js
            ├── protected.controller.js
            └── public.controller.js
```

Rule: no ai-version/ folder until Stage 7. No frontend/ folder at all.

---

## 3. Required Endpoints

| Method | Route | Auth Required | Expected Status Codes |
|---|---|---|---|
| POST | /auth/signup | No | 201, 400 |
| POST | /auth/login | No | 200, 400, 401 |
| POST | /auth/logout | Yes Bearer | 204, 401 |
| GET | /protected/profile | Yes Bearer | 200, 401 |
| GET | /protected/dashboard | Yes Bearer | 200, 401 |
| GET | /public/info | No | 200 |
| GET | /docs | No | Swagger UI |
| GET | / | No | 200 health check |

---

## 4. Dependencies to Install

Run inside backend/:

```
pnpm add @supabase/supabase-js swagger-ui-express
```

swagger-ui-express is CommonJS — requires ESM workaround (see Flaw #6 below).

---

## 5. Environment Variables

.env.example must contain ALL of these:

```
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

NEVER use service_role key. Only anon key. Agent must add comment warning in config/supabase.js.

---

## 6. Swagger Configuration

- Use swagger-ui-express + inline OpenAPI spec object in src/config/swagger.js
- Define securitySchemes: type http, scheme bearer, bearerFormat JWT
- Apply security: [{ bearerAuth: [] }] to all /protected/* and /auth/logout paths in spec
- Serve at GET /docs
- Lock icon must appear on protected routes in browser at http://localhost:3000/docs

---

## 7. Known Flaws and Bug Prevention (14 items — read ALL before writing code)

### CRITICAL — Security

#### Flaw 1 — service_role key instead of anon key
What breaks: service_role bypasses all Supabase Row Level Security. Attacker with it owns the database.
Prevention: SUPABASE_KEY in .env must be the anon key. service_role must never appear in code or .env.
Agent must: add a comment in config/supabase.js warning against this explicitly.

#### Flaw 2 — .env committed to git
What breaks: Supabase bots scan GitHub for leaked keys within 60 seconds of a push.
Prevention: Verify backend/.gitignore contains .env on line by itself. Check git status before commit. .env.example is committed; .env never is.
Agent must: confirm .gitignore is correct before creating any files.

#### Flaw 3 — Not checking getUser error before trusting response
What breaks: supabase.auth.getUser(token) returns { data, error }. If token is invalid, data.user is null but code may proceed if only data is checked.
Prevention:
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired token' });
Agent must: always destructure and check BOTH data and error.

#### Flaw 4 — Bearer prefix not stripped from token
What breaks: Passing "Bearer eyJ..." to getUser() always fails — Supabase expects only the raw JWT.
Prevention:
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
Agent must: always use split(' ')[1], never pass raw header value.

#### Flaw 5 — Logging tokens to console
What breaks: console.log(req.headers) dumps bearer token to stdout — a leak.
Prevention: Never log req.headers or the token. Log user ID only: data.user.id.

### STRUCTURAL

#### Flaw 6 — swagger-ui-express ESM import issue
What breaks: swagger-ui-express is CommonJS. With "type": "module", bare import may fail.
Prevention — use createRequire:
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const swaggerUi = require('swagger-ui-express');
Test this import before building any routes.

#### Flaw 7 — Express 5 async error handling
What breaks: Express 5 auto-catches async errors. Code assumes Express 4 manual behavior.
Prevention: Always use async/await. Use try/catch in controllers for explicit control. Works fine in Express 5 too.

#### Flaw 8 — dotenv.config() called after imports that need env vars
What breaks: In ESM, import statements execute before any code. If config/supabase.js is imported before dotenv loads, SUPABASE_URL is undefined when client is created.
Prevention — correct order in server.js:
  import 'dotenv/config';              // side-effect import, loads .env FIRST
  import express from 'express';
  import { supabase } from './config/supabase.js';
Use "import 'dotenv/config'" not "import dotenv from 'dotenv'; dotenv.config()".

#### Flaw 9 — PORT not defined fallback missing
What breaks: app.listen(process.env.PORT) with undefined PORT causes Node to listen on random OS port silently.
Prevention:
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

#### Flaw 10 — No input validation on POST routes
What breaks: Missing email/password passes undefined to Supabase SDK, producing confusing error messages.
Prevention:
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

#### Flaw 11 — Middleware applied at wrong scope
What breaks: Applying verifyToken at app level makes ALL routes including public ones require auth.
Prevention:
  // protected.routes.js — apply to entire router
  router.use(verifyToken);
  // auth.routes.js — apply only to logout, not signup/login
  router.post('/logout', verifyToken, logoutController);

#### Flaw 12 — Turbo not configured at root
What breaks: turbo dev errors or falls through silently if turbo.json or root package.json workspaces are missing.
Prevention: Agent must check if root package.json and turbo.json exist. If not, create minimal versions for backend only (no frontend workspace).

### OPERATIONAL

#### Flaw 13 — Supabase email confirmation blocking login in dev
What breaks: Fresh signup cannot log in — Supabase returns confusing 400/401 until email confirmed.
Prevention (Human task): Supabase Dashboard → Authentication → Sign In / Providers → Email → Confirm email → OFF. Must be done before testing Stage 1.

#### Flaw 14 — Swagger UI breaking due to global Content-Type middleware
What breaks: If any global middleware forces Content-Type: application/json on all responses, Swagger UI (which serves HTML) breaks silently.
Prevention: Never set a global Content-Type header middleware. Only use res.json() per-route.

---

## 8. Implementation Stages (Agent Execution Order)

Execute in this exact order to avoid dependency issues:

  Stage 0  — Check and fix root turbo/workspace config (turbo.json, package.json, pnpm-workspace.yaml)
  Stage 1  — Install packages: pnpm add @supabase/supabase-js swagger-ui-express
  Stage 2  — Create full folder structure inside backend/src/ (config, routes, middleware, controllers)
  Stage 3  — Write src/config/supabase.js (Supabase client singleton with anon key warning)
  Stage 4  — Fix src/server.js (dotenv/config import first, PORT fallback, mount all routers, serve /docs)
  Stage 5  — Write src/routes/public.routes.js + src/controllers/public.controller.js
  Stage 6  — Write src/routes/auth.routes.js + src/controllers/auth.controller.js (signup, login, logout)
  Stage 7  — Write src/middleware/auth.middleware.js (verifyToken — checks Bearer, calls getUser, checks error+user)
  Stage 8  — Wire logout in auth.routes.js to use verifyToken middleware
  Stage 9  — Write src/routes/protected.routes.js + src/controllers/protected.controller.js (profile, dashboard)
  Stage 10 — Write src/config/swagger.js with full OpenAPI spec, mount at /docs in server.js
  Stage 11 — Final smoke test: confirm server starts, hit each route, check status codes
  Stage 12 — Update or create README with setup instructions, endpoint table, and Swagger screenshot note

---

## 9. Division of Responsibilities

### Agent Does

- Creates all folders and files
- Installs missing packages via pnpm add inside backend/
- Writes all route, controller, middleware, and config code
- Fixes server.js entry point (import order, PORT fallback, router mounts)
- Writes Swagger OpenAPI spec with correct security schemes
- Updates .env.example with required keys and placeholder values
- Checks and creates root turbo/workspace config if missing (backend only, no frontend)
- Adds JSDoc comments on middleware and controllers
- Never modifies the actual .env file (real secrets — human-managed)

### Human Does (You)

1. Supabase project setup:
   - Go to supabase.com, open or create project Auth-Practice
   - Copy Project URL and anon key from Settings → API
   - Paste into backend/.env:
       PORT=3000
       SUPABASE_URL=https://xxxx.supabase.co
       SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - Turn off email confirmation: Dashboard → Authentication → Sign In / Providers → Email → Confirm email → OFF

2. Run server after agent completes:
     cd backend
     pnpm dev

3. Test via curl or Swagger UI at http://localhost:3000/docs

4. GitHub: Create public repo, push, confirm .env is not in git history

---

## 10. Acceptance Criteria (Done = ALL pass)

- [ ] pnpm dev starts without errors, prints "Server running on port 3000"
- [ ] GET / returns { "message": "Hello World!" } with status 200
- [ ] GET /public/info returns 200 with public message, no auth needed
- [ ] POST /auth/signup with valid email+password returns 201 with user object
- [ ] POST /auth/signup with missing fields returns 400 with JSON error
- [ ] POST /auth/login with valid credentials returns 200 with access_token in response
- [ ] POST /auth/login with wrong password returns 401 with JSON error
- [ ] GET /protected/profile without token returns 401
- [ ] GET /protected/profile with valid Bearer token returns 200 with user metadata (id, email, created_at)
- [ ] GET /protected/profile with tampered/expired token returns 401
- [ ] GET /protected/dashboard works with same middleware — zero new auth code written
- [ ] POST /auth/logout with valid Bearer token returns 204 (no body)
- [ ] GET /docs loads Swagger UI in browser with lock icons on protected routes
- [ ] Swagger Authorize → paste access_token → Try it out on /protected/profile → 200
- [ ] git status shows .env as untracked (not staged, not committed)
- [ ] .env.example has PORT, SUPABASE_URL, SUPABASE_KEY with placeholder values

---

*End of goal.md*
