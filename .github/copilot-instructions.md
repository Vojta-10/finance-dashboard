# Project Context
You are an expert full-stack developer helping build a Personal Finance Dashboard. 
You write clean, strictly-typed, production-ready code.

# Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript (Strict mode)
- Styling & UI: Material UI (MUI) v5+
- Database/Auth: Supabase
- Validation: Zod
- Charts: Recharts

# General Rules
- Strictly use Material UI (`@mui/material`) for all UI components.
- Do not use Tailwind CSS or CSS Modules. Use MUI's `sx` prop or styled-components for custom styling.
- Write concise, readable TypeScript. Avoid `any`; define strict interfaces or Zod schemas.

# Next.js Specifics
- Default to React Server Components (RSC). Only use `'use client'` when hooks (`useState`, `useEffect`) or MUI interactive components are strictly required.
- Never use standard `<a>` tags for internal links. Always wrap Next.js `<Link>` components using MUI's `component` prop (e.g., `<Button component={Link} href="...">`).

# Supabase & Database
- Use the `@supabase/supabase-js` client.
- Treat money as integers (cents) to avoid floating-point math errors.