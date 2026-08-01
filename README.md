# SK JobPilot

SK JobPilot is an AI-powered job discovery, job matching, resume tailoring, application preparation, application tracking, and interview preparation platform.

---

## Workspace Architecture

This project is structured as an npm workspaces monorepo:

```
sk-job-pilot/
├── apps/
│   ├── web/           # React + Vite + Tailwind CSS Frontend (Port 5173)
│   └── api/           # Node.js + Express + Mongoose Backend API (Port 5000)
├── packages/
│   ├── shared/        # Shared TypeScript types, Zod schemas, constants & utils
│   ├── config/        # Shared ESLint & TypeScript configurations
│   └── ui/            # UI components and design token package
├── .env.example       # Template environment variables
├── package.json       # Root npm workspaces manifest
├── tsconfig.json      # Root TypeScript project references
├── README.md          # Project documentation & sitemap
└── AGENTS.md          # Architecture rules & agent instructions
```

---

## Prerequisites

- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher (use `npm` exclusively, do not use `pnpm` or `yarn`)
- **MongoDB**: Local running instance or MongoDB Atlas URI (e.g. `mongodb://127.0.0.1:27017/sk_job_pilot`)

---

## Quick Start & Local Setup

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd sk-job-pilot
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Ensure default environment parameters:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/sk_job_pilot
LOG_LEVEL=info
VITE_API_BASE_URL=http://localhost:5000/api/v1
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
```

> **Note**: `GEMINI_API_KEY` is kept exclusively on the server and is never exposed to the frontend browser bundle.

### 3. Run Development Servers

Run the entire application stack concurrently from the repository root:

```bash
npm run dev
```

This starts both:
- **React Frontend**: `http://localhost:5173`
- **Express Backend API**: `http://localhost:5000/api/v1`

---

## Root Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Concurrently launch React frontend (Vite) and Express API (tsx watch) |
| `npm run build` | Build all workspace packages and production bundles |
| `npm run typecheck` | Perform TypeScript type checks across all packages |
| `npm run lint` | Execute ESLint across all codebase files |
| `npm run lint:fix` | Automatically fix ESLint errors |
| `npm run format` | Prettier code formatting |
| `npm run test` | Run Vitest unit & integration test suites |
| `npm run clean` | Clean all `dist/`, `.vite/`, and build artifacts |

---

## Backend API Endpoints (Phase 1)

- `GET /api/v1/health` - API server status & uptime
- `GET /api/v1/health/database` - MongoDB connection health status

---

## Application Pages (Frontend Shell)

- `/` - **Dashboard**: KPI stat cards, top recommendations, pipeline activity & live agent log stream
- `/discover` - **Discover Jobs**: Job discovery search & filter interface
- `/saved-jobs` - **Saved Jobs**: Saved job cards
- `/applications` - **Applications**: Application tracking & status table
- `/resumes` - **Resumes**: Master & tailored resume management
- `/interviews` - **Interviews**: Scheduled rounds & mock AI simulator launcher
- `/agent-activity` - **Agent Activity**: Detailed background agent activity stream
- `/settings` - **Settings**: Local API, DB, and AI model configurations
