# Auth-Login API

A secure backend API built with Node.js, Express, and Supabase Auth.

## Setup

1. Copy `.env.example` to `.env` in the `backend/` directory and add your Supabase keys.
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Run

```bash
pnpm dev
```
Starts the server on `http://localhost:3000`.

## Endpoints

| Method | Route | Auth |
|---|---|---|
| POST | `/auth/signup` | No |
| POST | `/auth/login` | No |
| POST | `/auth/logout` | Yes (Bearer) |
| GET | `/protected/profile` | Yes (Bearer) |
| GET | `/protected/dashboard` | Yes (Bearer) |
| GET | `/public/info` | No |

## Docs
Go to `http://localhost:3000/docs` for Swagger UI.
