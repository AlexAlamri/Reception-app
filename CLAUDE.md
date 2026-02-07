# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

Reception Triage Guide — a clinical care navigation tool for GP reception staff at Churchill Medical Centre & The Orchard Practice (Kingston, South West London). It walks non-clinical staff through an 8-step decision flow when processing patient requests from "ANIMA" (their clinical request system), helping route patients safely without making clinical diagnoses.

This is a **healthcare safety tool**. The clinical data (red flags, amber flags, high-risk groups, pharmacy conditions) is cross-referenced against NICE guidelines and NHS sources. Changes to clinical content must be reviewed for patient safety.

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

- **`app/page.js`** (1,215 lines) — The entire application UI lives here as a single monolithic component. Contains ~15 inline component functions: `LoginScreen`, `DecisionFlow` (the 8-step triage), `QuickLookup`, `KeyContacts`, `SOPScreen`, `TrainingScreen`, `AdminConsole`, plus helper components. All state management is here too.
- **`lib/auth.js`** — Client-side authentication system. Session management, user CRUD, audit logging, data export/import. Uses SHA-256 hashing with a hardcoded salt. All stored in localStorage.
- **`lib/data.js`** — All clinical triage data: red flags, amber flags, high-risk groups, pharmacy-first conditions, direct booking items, contacts, scripts, pathways, and training scenarios. This is the clinical safety content.
- **`lib/sop-content.js`** — Full Standard Operating Procedure document content (16 sections), rendered in the SOP viewer screen.
- **`app/layout.js`** — Root layout. Server component that sets metadata, viewport, and PWA config. Loads Plus Jakarta Sans font.
- **`app/globals.css`** — Tailwind base + custom dark-theme styles (glassmorphism, glow effects, noise overlay, ambient background).

### Data flow

1. `lib/data.js` exports default clinical datasets
2. `useTriageData()` hook in `page.js` merges defaults with any admin customizations from localStorage (key: `triage_custom_data`)
3. `useKeywordScanner()` hook scans pasted patient text against all flag datasets in real-time
4. Admin edits go to localStorage via `lib/auth.js` functions (`saveCustomData`, `saveSettings`, etc.)
5. Auth sessions stored in sessionStorage (key: `triage_session`), user accounts in localStorage (key: `triage_users`)

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
- NEVER change the 8-step decision flow logic without approval
- NEVER delete or overwrite localStorage keys used for auth or session data
- ASK before refactoring page.js into separate components (it works as-is)
- ASK before adding any server-side features or API routes

## Known Issues

- **Monolithic `page.js`**: All UI, state, and logic in one 1,215-line file. No `components/` directory exists despite Tailwind config referencing one.
- **No backend**: Despite Next.js, there's no server-side logic. Auth is client-side only (bypassable via DevTools). `bcryptjs` and `jose` are in package.json but never imported.
- **Hardcoded credentials**: Default users with plaintext passwords in `lib/auth.js` and `README.md`.
- **Missing PWA icons**: `manifest.json` references `icon-192.png` and `icon-512.png` that don't exist in `public/`.
- **Theme color mismatch**: manifest.json theme is blue `#1976D2`, layout.js viewport theme is dark `#0A0A0F`.
- **No tests, no CI/CD.**
