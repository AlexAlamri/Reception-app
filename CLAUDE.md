# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

Reception Triage Guide — a clinical care navigation tool for GP reception staff at Churchill Medical Centre & The Orchard Practice (Kingston, South West London). It uses a three-tier model:

- **Tier 1 (Reception)**: 5-step decision flow (per SOP v3.5 / Tier 1 Flowchart v4.0) — emergency red flags, signpost external services, check EMIS for planned items, Pharmacy First / self-care, forward to Tier 2 with handover accumulator.
- **Tier 2 (Patient Services Team)**: 6-step workflow (per SOP v3.5 / Tier 2 Flowchart v4.0) — receive & review, purple gate, amber/yellow/green matching, decision point with 60-second rule, eConsult distribution, structured Tier 2→3 handover.
- **Tier 3 (GP Triager)**: All clinical decisions, mandatory purple flag escalations.

SOP version: v3.5 (Feb 2026) | GP Urgency Table v2.0 | Tier 1 Flowchart v4.0 | Tier 2 Flowchart v4.0

This is a **healthcare safety tool**. The clinical data (STOP patterns, red/amber/purple/yellow/green flags, high-risk groups, pharmacy conditions, quick-match pathways, training scenarios) is cross-referenced against NICE guidelines and NHS sources. Changes to clinical content must be reviewed for patient safety.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js linter
```

No test framework is configured. No lock file exists — run `npm install` first.

## Architecture

**Next.js 14 App Router, but entirely client-side.** Everything uses `'use client'`. There are no API routes, no server components, and no database. All persistence is localStorage/sessionStorage.

### Key files

- **`app/page.js`** — The entire application UI as a monolithic component. Contains: `LoginScreen`, `DecisionFlow` (5-step Tier 1 flow with scanner-first red flags, signposting grid, EMIS checklist, Pharmacy First / self-care, handover accumulator), `Tier2Workflow` (6-step Tier 2 with purple gate, amber/yellow/green matching, 60-second rule, eConsult distribution, Tier 2→3 handover form), `StopAlertOverlay` (full-screen 999 alert), `SearchScreen`, `ContactsScreen`, `SOPScreen`, `FlowchartScreen`, `TrainingScreen` (topic navigation, 27 multi-step scenarios, localStorage progress tracking), `AdminConsole`, `NavBar` (with Tier 1/Tier 2 toggle based on role), plus helper components. Persistent quick action bar (999, Crisis, Tier 2, Copy) fixed at the bottom.
- **`lib/auth.js`** — Client-side authentication system with roles (`reception`, `tier2`, `tier3`, `partner`, `admin`) and groups (`churchill`, `orchard`, `partner`). Session management, user CRUD, `canAccessTier()` for role-based tier access, `getGroupLabel()` for practice name display, audit logging, data export/import. Partner shared group login. Uses SHA-256 hashing with a hardcoded salt. Sessions in sessionStorage (tab-scoped for multi-user isolation), accounts in localStorage.
- **`lib/data.js`** — All clinical triage data:
  - `stopPatterns` (17 patterns — full-screen 999 alerts)
  - `redFlags` (22 entries by body system — 999/A&E)
  - `amberFlags` (16 categories — same-day duty GP)
  - `purpleFlags` (7 categories — MUST Tier 3 GP Triager)
  - `yellowFlags` (9 categories — 1-3 days with eConsult suitability)
  - `greenFlags` (12 categories — 1 week with "tried and failed" rule)
  - `highRiskGroups` (13 groups with keywords)
  - `pharmacyFirstConditions` (7 CPCS conditions with strict age/gender criteria)
  - `quickMatchPathways` (13 entries with keywords for scanner matching)
  - `tier2Actions` (canDo/mustEscalate/timeLimits per v3.5)
  - `trainingScenarios` (27 scenarios including purple/eConsult/health visiting)
  - `trainingTopics` (10 topic groups)
  - `contacts` (including Health Visiting, Abortion services, Talking Therapies, NHS 111 Emergency Prescriptions)
  - `selfCareChecklist`, `scripts`, `directBooking`
- **`lib/sop-content.js`** — Full Standard Operating Procedure document content (28 sections across Parts A–E, SOP v3.5). Includes version control history (v1.0–v3.5), governance, golden rules, 5-step Tier 1 flow, EMIS checking, pathway grid, direct booking, red/amber/purple/yellow/green flags, eConsult suitability + tried & failed rule, high-risk groups, Pharmacy First, self-care, UTC, eye, women's health, health visiting, fit notes, eConsult guidance, 6-step Tier 2 workflow, Tier 3, service directory, contacts, documentation, training requirements.
- **`app/layout.js`** — Root layout. Server component that sets metadata, viewport, and PWA config. Loads Plus Jakarta Sans font.
- **`app/globals.css`** — Tailwind base + custom dark-theme styles (glassmorphism, glow effects, noise overlay, ambient background).

### Data flow

1. `lib/data.js` exports default clinical datasets (including all flag types, `quickMatchPathways`, `tier2Actions`, `trainingTopics`)
2. `useTriageData()` hook in `page.js` merges defaults with any admin customizations from localStorage (key: `triage_custom_data`)
3. `useKeywordScanner()` hook scans pasted patient text against all flag datasets in real-time — detects STOP patterns, red flags, amber flags, purple flags, yellow flags, green flags, high-risk groups, pathway keywords, cancer-related terms, and change/worsening words
4. STOP alert overlay (full-screen red, triggered by stopPatterns) — blocks all interaction until acknowledged
5. Mandatory step gating (Steps 1-3 must be confirmed sequentially in Tier 1)
6. Sticky patient words banner with colour-coded scan badges (STOP, RED, AMBER, PURPLE, YELLOW, GREEN, HIGH RISK, CANCER, WORSENING)
7. Tier 1→2 handover accumulator (auto-populated copy-paste form in Step 5)
8. Tier 2→3 handover form (auto-populated copy-paste form in Tier 2 Step 6)
9. Keyword highlighting per step (matched rows get coloured border + tint)
10. Scanner-first red flags with collapsed accordion by body system
11. Admin edits go to localStorage via `lib/auth.js` functions (`saveCustomData`, `saveSettings`, etc.)
12. Auth sessions stored in sessionStorage (key: `triage_session`) — tab-scoped for simultaneous multi-user sessions
13. User accounts in localStorage (key: `triage_users`)
14. Training progress stored in localStorage (key: `triage_training_progress`)

### Auth system

- Individual logins for `reception`, `tier2`, `tier3`, `admin` roles
- Partner shared group login (one username/password for all partner practices)
- Role-based tier access via `canAccessTier()` function
- Tier toggle in navigation only visible to users with Tier 2+ access
- Session isolation via sessionStorage (tab-scoped, supports multiple simultaneous users)
- Groups: `churchill`, `orchard`, `partner` — displayed in UserBadge

### Design system

Dark luxury theme. Custom Tailwind colors defined in `tailwind.config.js`: `triage-red`, `triage-amber`, `triage-green`, `triage-blue`, `triage-teal`, `triage-violet`. Design tokens object `C` in `page.js` maps these to consistent `text`/`bg`/`border`/`glow` class sets.

## Deployment
- Hosted on Vercel, deployed via GitHub push
- Any push to main triggers a production deployment
- ALWAYS test with `npm run build` before committing

## Workflow Rules
- ALWAYS create a feature branch — never commit directly to main
- Run `npm run build` before every commit to catch errors
- Use conventional commits (feat:, fix:, refactor:)

## Boundaries
- NEVER modify clinical data in lib/data.js without explicit approval
- NEVER modify red flags, amber flags, or escalation pathways without asking first
- NEVER change the 5-step Tier 1 or 6-step Tier 2 flow without approval
- NEVER modify stopPatterns without explicit clinical review
- NEVER remove mandatory step gating on Steps 1-3
- NEVER modify purpleFlags (these are mandatory Tier 3 escalations)
- NEVER change the "tried and failed" eConsult rule
- NEVER allow Tier 2 to process purple flag presentations
- NEVER delete or overwrite localStorage keys used for auth or session data
- ASK before refactoring page.js into separate components (it works as-is)
- ASK before adding any server-side features or API routes

## Known Issues

- **Monolithic `page.js`**: All UI, state, and logic in one large file. No `components/` directory exists despite Tailwind config referencing one.
- **No backend**: Despite Next.js, there's no server-side logic. Auth is client-side only (bypassable via DevTools). `bcryptjs` and `jose` are in package.json but never imported.
- **Hardcoded credentials**: Default users with plaintext passwords in `lib/auth.js` and `README.md`.
- **Missing PWA icons**: `manifest.json` references `icon-192.png` and `icon-512.png` that don't exist in `public/`.
- **Theme color mismatch**: manifest.json theme is blue `#1976D2`, layout.js viewport theme is dark `#0A0A0F`.
- **No tests, no CI/CD.**
