# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Treasure Box Game — a React + TypeScript single-page app where players click on 3 treasure chests to find the one containing treasure (+$100) while avoiding skeletons (-$50). Built with Vite, Tailwind CSS v4, and Framer Motion (via `motion/react`).

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on http://localhost:3000 (auto-opens browser)
npm run build      # Production build → build/ directory
```

No test runner or linter is configured.

## Architecture

- **Single-component app**: All game logic lives in `src/App.tsx` — state management (boxes, score, game-over), box click handling, and rendering.
- **UI library**: shadcn/ui components in `src/components/ui/` with Radix UI primitives. The `Button` component is used; many others are pre-installed but unused.
- **Styling**: Tailwind CSS v4 with CSS custom properties defined in `src/styles/globals.css`. Design tokens (colors, radius, typography) use CSS variables, not tailwind.config.
- **Animations**: `motion/react` (Framer Motion) for chest flip, bounce, and fade-in effects.
- **Assets**: Static images in `src/assets/` (closed/opened/skeleton chests, key icon). Audio files in `src/audios/` (chest open sound, evil laugh).
- **Path alias**: `@` maps to `src/` (configured in `vite.config.ts`).
- **Build output**: `build/` directory (not the Vite default `dist/`).
