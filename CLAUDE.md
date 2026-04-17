# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**NEVER read `.env*` files.** They contain secrets. Reference config keys by name only — never inspect their values.

## Commands

```bash
# Development
npm run dev       # Start Next.js dev server at http://localhost:3000

# Build & Production
npm run build     # Build for production
npm start         # Run production build

# Linting
npm run lint      # Run ESLint (Next.js eslint config)
```

There are no tests configured in this project.

## Environment

The app requires a `.env` file with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

The backend defaults to `http://localhost:8000` if the env var is not set.

## Architecture

This is an **EmoDia (Emotion Diary)** Next.js 16 app using the App Router with React 19 and TypeScript.

### Provider Stack (Root Layout)

The root layout wraps all pages in three nested providers in this order:

```
LanguageProvider → AuthProvider → QueryProvider → children
```

- **LanguageProvider** (`src/components/providers/language-provider.tsx`): Manages `'vi'` / `'en'` language toggle, persisted to `localStorage` under `emodia-language`. Exposes `useLanguage()` and `useTranslations()` hooks. Default language is Vietnamese (`'vi'`).
- **AuthProvider** (`src/components/providers/auth-provider.tsx`): Stores the authenticated `User` in state and `localStorage` under `emodia-user`. Does **not** auto-fetch on mount — it reads from storage. Listens for a custom `auth:unauthorized` DOM event (dispatched by the HTTP layer on 401) to force logout and redirect to `/sign-in`.
- **QueryProvider**: Wraps TanStack React Query's `QueryClientProvider`.

### HTTP Layer

All API calls go through `src/components/http_request/index.ts`, which exports a `request` object with typed `get`, `post`, `put`, `patch`, `delete` methods. All requests include `credentials: 'include'` (cookie-based auth). On a `"Not authenticated"` 401 detail, it dispatches `window.dispatchEvent(new Event('auth:unauthorized'))` to trigger the AuthProvider logout.

API endpoints are centralized in `src/components/endpoint_config/endpoint_config.ts`.

### Page / Component Pattern

Each page in `src/app/` is a thin shell that imports a feature component from `src/components/pages/<feature>/`. Each feature folder follows this convention:

| File | Role |
|------|------|
| `<Feature>Form.tsx` / `<Feature>Canvas.tsx` | UI component (client) |
| `use<Feature>.ts` | Custom hook — all state and logic |
| `<feature>Service.ts` | API call functions using `request` |
| `index.ts` | Barrel export |

### Routing

- `(auth)` route group: `/sign-in`, `/sign-up`, `/verify-otp`
- `(homepage)` route group: `/` (home page)
- `/diem-danh`: Attendance/drawing canvas page
- `/thu-vien`: Drawing library — 3x3 image grid with pagination

### Internationalization

All UI strings live in `src/lib/translations.ts` as a `Record<Language, Translations>` object. Components access translations via `useLanguage()` or `useTranslations()`. The `Translations` interface serves as the source of truth for all available string keys.

### Attendance (Drawing) Feature

The `/diem-danh` page is a multi-layer canvas drawing app built with **react-konva** / **Konva.js**. Key architecture:

- `useAttendanceCanvas.ts`: Central hook managing layers (`LayerData[]`), undo/redo history (50-snapshot ring), tools (`brush`, `eraser`, `fill`, `picker`), and save state.
- `KonvaCanvas.tsx`: Renders the Konva `Stage` using `stageRef` from the hook.
- `AttendanceCanvas.tsx`: Full page component combining toolbar + canvas.
- `floodFill.ts`: Canvas flood-fill algorithm used by the fill tool.
- The fill tool renders fills as base64 `dataURL` images stored in the layer's `items` array alongside line data.
- `attendanceService.ts`: Sends the canvas image as multipart `FormData` to `POST /drawings/`. Uses `fetch` directly (not the shared `request` helper) because multipart uploads need the browser to set `Content-Type` with the boundary automatically.

### Library Feature

The `/thu-vien` page displays the user's saved drawings in a paginated 3x3 grid, ordered newest first.

- `useLibrary.ts`: Hook managing page state, fetching via `fetchDrawingsApi(page, size)`.
- `LibraryPage.tsx`: Grid UI with pagination controls (Previous/Next).
- `libraryService.ts`: Calls `GET /api/v1/drawings/?page=N&size=9`. Uses the shared `request` helper.
- Images load via presigned S3 URLs returned by the backend (1 hour expiry).

### UI Components

Shadcn/ui components (New York style, zinc base color) live in `src/components/ui/`. Uses `lucide-react` for icons, `sonner` for toasts, and `tailwindcss` v4.

### Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`).
