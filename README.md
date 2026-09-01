# Student Analytics Dashboard

A frontend-only React + TypeScript dashboard that fetches live student data from
a Google Apps Script JSON API and renders attendance, assignment, and
assessment performance.

No backend, no database, no Supabase — this project only talks to the Apps
Script Web App you already have running.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (charts)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL, enter a Student ID (e.g. `2335615`), and click
**View Dashboard**.

To build for production:

```bash
npm run build
npm run preview
```

## Configuring the API URL

The Apps Script Web App URL lives in exactly one place:
`src/lib/studentApi.ts` (`APPS_SCRIPT_WEB_APP_URL`).

To override it without editing code, copy `.env.example` to `.env` and set:

```
VITE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/.../exec
```

## Architecture

```
Google Sheet
    ↓
Apps Script (unchanged)
    ↓  JSON response
src/lib/studentApi.ts        — fetch, error classification, one URL constant
    ↓
src/lib/studentAdapter.ts    — maps API shape → internal Student model
    ↓
src/lib/studentTypes.ts      — Student / Subject / Performance types
    ↓
src/pages/Dashboard.tsx      — view-state machine (empty / loading / error / ready)
    ↓
src/components/*             — presentational components, no API knowledge
```

Components never see the raw API field names — they consume `Student`,
`Subject`, and `Performance` from `studentTypes.ts`. All null values run
through `formatPercent()` in `src/lib/formatters.ts`, which renders `"—"`
instead of `NaN%` / `undefined%` / `null%`.

The three averaged KPI cards (assessment performance, assignment completion,
assessment attempt) are calculated transparently as an average across the
returned subjects (see `studentAdapter.ts`) — the API does not currently
expose true "overall" figures for those, so nothing is fabricated. Overall
attendance uses `performance.overallAttendance` from the API directly,
unmodified.

The Assessment History section renders real data from `response.assessments`.
Attempt status is derived purely from `attemptCount > 0` (never inferred any
other way), dates come from `releaseDate` formatted client-side, and the
percentage shown is always the API's own `percentage` field — it is never
recalculated. Assessments are sorted newest-first by `releaseDate`. If the
API returns no assessments (or an older response without the field at all),
the section shows "No assessment history available." — no fake assessments
are ever shown. Filters (All / In-Class / Post-Class) and the name search box
are local, client-side only. `courseId` is not mapped to a subject name since
no verified courseId → subject mapping exists yet.

## View states

- **Empty** — landing page with the search box and a "Search for a student" prompt, before any request has been made.
- **Loading** — search button shows a spinner and is disabled; the content area shows skeleton placeholders instead of the previous dashboard or blank space.
- **Error** — `"Student not found"` with a suggestion to check the ID, or `"Unable to load student data. Please try again."` for network failures. No raw errors are ever shown to the user.
- **Ready** — full dashboard: profile card, KPI cards, subject cards with progress bars, three comparison charts, an overview table, and the assessment-history placeholder.

## Manual test checklist

- [ ] Valid ID `2335615` → AKSHAY KUMAR MODI, enrollment `2501010047`, batch `A`, overall attendance `85.71%`, three subjects with correct values, Mathematics-I assessment fields show `—`.
- [ ] Assessment History lists real assessments (e.g. "Classroom Quiz - Computer Hardware, Computer Software, Operating System") newest-first, with correct marks/maxMarks, percentage, date, and Attempted/Not Attempted badge.
- [ ] All / In-Class / Post-Class filters narrow the list correctly; search box filters by name.
- [ ] A student with an empty `assessments` array shows "No assessment history available."
- [ ] A second valid student ID.
- [ ] Empty input → inline validation message, no request sent.
- [ ] Invalid/unknown student ID → "Student not found" error state.
- [ ] Network/API failure (e.g. offline) → "Unable to load student data. Please try again."
- [ ] Mobile viewport (375px) → no horizontal overflow, cards stack, charts remain responsive, assessment rows stack cleanly.

## Project structure

```
src/
  components/
    Header.tsx
    StudentSearch.tsx
    StudentProfile.tsx
    KpiCard.tsx
    SubjectCard.tsx
    SubjectPerformanceCharts.tsx
    PerformanceOverviewTable.tsx
    AssessmentHistory.tsx
    LoadingState.tsx
    ErrorState.tsx
    EmptyState.tsx
  lib/
    studentApi.ts
    studentAdapter.ts
    studentTypes.ts
    formatters.ts
  pages/
    Dashboard.tsx
  App.tsx
  main.tsx
  index.css
```

## A note on CORS

Google Apps Script Web Apps sometimes need to be deployed with
**"Who has access: Anyone"** for browser `fetch()` calls to succeed without
CORS errors. If you see `"Unable to load student data. Please try again."`
in the browser but the URL works when pasted directly into a new tab, check
the Web App's deployment access setting — this project cannot change that
for you since it does not touch the Apps Script.
