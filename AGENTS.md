# SK JobPilot - AI Agent Architecture & Contributor Guidelines

This document provides mandatory architectural rules, conventions, and operational procedures for human developers and autonomous AI agents contributing to **SK JobPilot**.

---

## 1. Single-User & No-Auth System Rule

- **No Authentication**: SK JobPilot is designed as a single-user local application. Do **NOT** add user login, JWT tokens, OAuth, session middleware, or multi-tenant database partitioning.
- All endpoints and routes must remain directly accessible without auth guards.

---

## 2. Monorepo & Dependency Rules

- Use **`npm` only** (do not use `pnpm`, `yarn`, or `bun`).
- **Workspace Architecture**:
  - `apps/web`: React + Vite + Tailwind CSS frontend application.
  - `apps/api`: Express + Node.js + Mongoose backend application.
  - `packages/shared`: Shared types, Zod schemas, constants, and utils.
  - `packages/config`: Shared ESLint & TypeScript configs.
  - `packages/ui`: Shared design tokens and exported component primitives.
- **Dependency Control**: Do not add npm packages unnecessarily. Use existing utility libraries (`clsx`, `tailwind-merge`, `date-fns`, `zod`) before introducing third-party packages.

---

## 3. Naming Conventions & Code Style

- **Files & Directories**: Use `kebab-case` for file and folder names (e.g., `health.controller.ts`, `app-layout.tsx`).
- **Components**: Use `PascalCase` for React components (e.g., `StatCard`, `EmptyState`).
- **Variables & Functions**: Use `camelCase` (e.g., `getHealthStatus`, `isSidebarCollapsed`).
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `API_ROUTES`, `DEFAULT_PAGINATION`).
- **Types & Interfaces**: Use `PascalCase` without `I` prefixes (e.g., `JobItem`, `ApiResponse`).

---

## 4. API & Standard Response Rules

All API responses must strictly follow the standard JSON envelope structure defined in `@sk-job-pilot/shared`:

### Success Format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-01T20:00:00.000Z",
    "requestId": "uuid-v4"
  }
}
```

### Error Format:
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": null
  },
  "meta": {
    "timestamp": "2026-08-01T20:00:00.000Z",
    "requestId": "uuid-v4"
  }
}
```

---

## 5. Input & Environment Validation Rules

- All incoming request bodies, query parameters, and route parameters must be validated using **Zod** schemas.
- All environment variables must be parsed via `envSchema` at process startup.
- **API Key Confidentiality**: `GEMINI_API_KEY` must never be passed to or exposed in `apps/web`.

---

## 6. Development & Validation Requirement

After implementing any feature or completing any phase, you **MUST** run all verification commands and fix any errors before concluding:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Do not leave unresolved type errors, failing unit tests, or broken build outputs.
