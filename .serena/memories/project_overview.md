# Project Overview

NövényNapló frontend project for a home houseplant care log. The app should manage rooms, plants, plant care requirements, monthly status reports, plant event history, photo upload, AI image analysis, dashboard summaries, and later PWA/export features.

Current repository initially contains only specifications and backend interface contracts:
- `novenynaplo_specifikacio.md`: product/MVP steps.
- `frontend-development-guidelines.md`: frontend architecture and UI rules.
- `external/openapi.yaml`: REST API contract.
- `external/schema.graphql`: minimal GraphQL schema currently exposing only `apiStatus`.

Frontend stack requested by guidelines: React, TypeScript, Vite, Tailwind CSS, shadcn/ui-like component organization, Apollo Client, GraphQL Codegen, React Hook Form, Zod, Zustand, Vitest, Testing Library, Playwright, Docker/nginx production serving.

Backend domain operations are currently REST-based. GraphQL is present but not useful for domain data yet.