# Validity Patterns

A React + TypeScript demo that compares three state management approaches for handling validity state (valid/invalid) across many sections. The app renders three columns side by side — **Context + useState**, **Context + Reducer**, **useSyncExternalStore**, and **Zustand** — and logs re-renders so you can observe the performance differences between each pattern.

## What it shows

- **Context + Reducer** re-renders _all_ cells on any state change.
- **useSyncExternalStore** and **Zustand** only re-render the affected cell.

A shared control panel toggles validity for individual sections or sets all at once, and a re-render log at the bottom tracks how many components re-rendered per action in each pattern.

## Prerequisites

- Node.js (v18+)
- npm

## Getting started

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the Vite dev server           |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Tech stack

- React 19
- TypeScript
- Vite
- Zustand
