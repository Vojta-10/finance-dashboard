<!-- BEGIN:nextjs-agent-rules -->

# Finance Dashboard Agent Notes

## Core Stack

- Next.js App Router with TypeScript strict mode.
- Material UI is the only UI library for components and layout.
- Supabase handles auth/data; Zod validates form input and shared schemas.
- Charts use `@mui/x-charts`; treat money as integers in cents.

## Working Rules

- Default to React Server Components. Add `'use client'` only when state, effects, or interactive MUI controls require it.
- Keep internal navigation on Next.js `Link` wrapped by MUI components; do not add raw `<a>` tags for app routes.
- Prefer strict types and small reusable components. Avoid `any` and avoid loosening types to satisfy the compiler.
- Use MUI `sx` or styled APIs for styling; do not introduce Tailwind or CSS Modules.
- Prefer `slotProps` over deprecated `inputProps`/legacy prop bags when adding accessibility attributes to MUI inputs and controls.
- For Next.js behavior changes, check `node_modules/next/dist/docs/` before assuming App Router or middleware APIs.

## Repo Conventions

- Place shared UI in `src/components`, route-level UI in `src/app`, hooks in `src/hooks`, and Supabase helpers in `src/lib/supabase`.
- Reuse existing theme tokens and the shared MUI theme in `src/theme.ts`.
- Keep auth forms wired through the existing hook + schema pattern in `src/hooks` and `src/lib/schemas`.
- Match the current dashboard style: compact cards, MUI tables, and client-side state only where interaction requires it.

## Commands

- `npm run dev` for local development.
- `npm run lint` for linting.
- `npm run build` for production verification.

## Environment Notes

- Supabase client code expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- If auth/session behavior changes, inspect both `src/lib/supabase/*` and `src/proxy.ts`.

## Reference Files

- `README.md` for general project setup.
- `.github/copilot-instructions.md` for the higher-level project summary.
<!-- END:nextjs-agent-rules -->
