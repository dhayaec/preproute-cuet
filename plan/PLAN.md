# Architecture Plan / PLAN.md

## Project: vite-react

Type: React 19 + TypeScript + Vite + React Router v7 + TanStack Query + Tailwind v4

## Folder Structure (feature-based)

- src/app/providers/QueryProvider.tsx
- src/features/users/ (api/hooks/components)
- src/features/posts/ (api/hooks/components)
- src/shared/lib/http.ts (typed fetch client)
- src/shared/hooks/useQueryKeys.ts (centralized query key factory)
- src/pages/ (thin wrappers using feature hooks)
- src/components/RootLayout.tsx
- src/routes/index.tsx

## Dependencies

- react, react-dom
- react-router-dom
- @tanstack/react-query
- tailwindcss, @tailwindcss/postcss, autoprefixer, postcss
- husky, lint-staged, prettier, @commitlint/cli/config-conventional

## Config Files

- vite.config.ts (aliases: @/, postcss)
- postcss.config.js (tailwindcss + autoprefixer)
- tsconfig.app.json (paths: {"@/_": ["./src/_"]})
- tailwind: @import in src/index.css

## Scripts

- dev / build / lint / preview
- css:build (tailwind cli minify)
- commitlint via .husky/commit-msg
- lint-staged via .husky/pre-commit
