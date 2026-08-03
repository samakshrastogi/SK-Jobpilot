# SK JobPilot

SK JobPilot is a private, single-user, local-first AI job discovery, job matching, resume tailoring, application preparation, application tracking, and interview preparation platform.

> **Single-User Architecture**: SK JobPilot runs locally as a private single-user application. It contains no authentication, login flows, or multi-tenant database partitioning.

---

## Workspace Architecture

This project is structured as an npm workspaces monorepo:

```
sk-job-pilot/
├── apps/
│   ├── web/           # React + Vite + Tailwind CSS Frontend (Port 5173)
│   └── api/           # Node.js + Express + Mongoose Backend API (Port 5000)
├── packages/
│   ├── shared/        # Shared TypeScript DTOs, Zod schemas, constants & normalization utils
│   ├── config/        # Shared ESLint & TypeScript configurations
│   └── ui/            # UI components and design token package
├── uploads/
│   └── resumes/       # Configurable storage directory for uploaded PDF & DOCX resumes
├── .env.example       # Template environment variables
├── package.json       # Root npm manifest
├── tsconfig.json      # Root TypeScript project references
├── README.md          # Project documentation & sitemap
└── AGENTS.md          # Architecture rules & contributor guidelines
```

---

## Prerequisites

- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher (use `npm` exclusively)
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

Default configuration variables:

```env
NODE_ENV=development
PORT=5000
API_PORT=5000
CLIENT_URL=http://localhost:5173
APP_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/sk_job_pilot
LOG_LEVEL=info
VITE_API_BASE_URL=http://localhost:5000/api/v1
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
RESUME_STORAGE_DIR=./uploads/resumes
MAX_RESUME_FILE_SIZE_MB=10
```

> **Note**: `GEMINI_API_KEY` is kept exclusively on the server and is never exposed to the frontend browser bundle.

### 3. Run Development Stack

Run the entire application stack concurrently from the repository root:

```bash
npm run dev
```

- **React Frontend**: `http://localhost:5173`
- **Express Backend API**: `http://localhost:5000/api/v1`

---

## Available Root Scripts

| Command             | Description                                                           |
| :------------------ | :-------------------------------------------------------------------- |
| `npm run dev`       | Concurrently launch React frontend (Vite) and Express API (tsx watch) |
| `npm run build`     | Build all workspace packages and production bundles                   |
| `npm run typecheck` | Perform TypeScript type checks across all packages                    |
| `npm run lint`      | Execute ESLint across all codebase files                              |
| `npm run lint:fix`  | Automatically fix ESLint errors                                       |
| `npm run format`    | Prettier code formatting                                              |
| `npm run test`      | Run Vitest unit & integration test suites                             |
| `npm run clean`     | Clean all `dist/`, `.vite/`, and build artifacts                      |

---

## Backend REST Endpoints

### Health Check APIs

- `GET /api/v1/health` - Server status & uptime
- `GET /api/v1/health/database` - MongoDB connection health status

### Candidate Profile APIs

- `GET /api/v1/profile` - Fetch master candidate profile (or structured default empty profile)
- `PUT /api/v1/profile` - Create / replace master profile
- `PATCH /api/v1/profile` - Update selected profile sections

### Resume Management APIs

- `POST /api/v1/resumes/upload` - Upload PDF/DOCX resume file (SHA-256 duplicate check, text extraction, parser)
- `GET /api/v1/resumes` - List resumes with pagination
- `GET /api/v1/resumes/:id` - Single resume details & parsed text
- `DELETE /api/v1/resumes/:id` - Delete resume database record AND physical storage file
- `PATCH /api/v1/resumes/:id/master` - Set target resume as active master resume

### Job Management APIs

- `POST /api/v1/jobs` - Add manual/scraped job listing (with duplicate fingerprint detection)
- `GET /api/v1/jobs` - List jobs with search, pagination, work mode, employment type, min match score, saved/archived filters
- `GET /api/v1/jobs/:id` - Fetch single job listing
- `PATCH /api/v1/jobs/:id` - Update job parameters
- `DELETE /api/v1/jobs/:id` - Remove job listing
- `PATCH /api/v1/jobs/:id/save` - Toggle saved/bookmark status
- `PATCH /api/v1/jobs/:id/archive` - Toggle archived status

### Application Tracking APIs

- `POST /api/v1/applications` - Start tracking job application (prevents duplicate active app for same job)
- `GET /api/v1/applications` - List tracked applications with status filters & pagination
- `GET /api/v1/applications/:id` - Fetch single application record with populated job & resume DTOs
- `PATCH /api/v1/applications/:id` - Update application status (automatically logs timeline event)
- `DELETE /api/v1/applications/:id` - Remove application track
- `POST /api/v1/applications/:id/events` - Append custom timeline log event
