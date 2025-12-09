# AI Coding Agent Instructions for bus15

## Project Overview

Next.js 16 app using React 19, TypeScript 5, Tailwind CSS 4, and pnpm package management. This is an App Router project with minimal dependencies, optimized for modern React features.

## Package Management

- **Always use pnpm** for package operations (enforced in `package.json` via packageManager field)
- Commands: `pnpm install`, `pnpm add <package>`, `pnpm dev`, `pnpm build`
- Never use npm or yarn

## Development Workflow

- **Dev server**: `pnpm dev` (runs on http://localhost:3000)
- **Production build**: `pnpm build` → `pnpm start`
- **Linting**: `pnpm lint` (uses ESLint 9 with Next.js config)
- **Formatting**: `pnpm format` to format all files, `pnpm format:check` to check formatting
- Hot reload enabled - changes to `app/**/*.tsx` files auto-update

## Architecture & File Structure

- **App Router**: All routes in `app/` directory (Next.js 13+ pattern)
- **Root layout**: `app/layout.tsx` defines global HTML structure, fonts (Geist Sans/Mono), and metadata
- **Pages**: `app/page.tsx` for home route, nested folders for additional routes (e.g., `app/about/page.tsx`)
- **Path alias**: Use `@/*` to import from project root (configured in `tsconfig.json`)

## Styling Conventions

- **Tailwind CSS 4** with `@tailwindcss/postcss` plugin
- CSS variables defined in `app/globals.css` using `@theme inline` directive
- Dark mode via `prefers-color-scheme` media query (automatic)
- Color tokens: `--color-background`, `--color-foreground`, accessed via `bg-background`, `text-foreground`
- Font variables: `--font-geist-sans`, `--font-geist-mono` applied at root layout

## TypeScript Patterns

- **Strict mode enabled** in tsconfig.json
- Use `type` imports for types: `import type { Metadata } from "next"`
- React 19 uses `react-jsx` transform (no React import needed in components)
- Export metadata from page/layout files for SEO: `export const metadata: Metadata = {...}`

## Component Patterns

- Server Components by default (no 'use client' needed unless using hooks/interactivity)
- Use `next/image` for images (optimized loading): `<Image src="/next.svg" width={100} height={20} priority />`
- Font optimization with `next/font/google`: preload with `variable` prop, apply via className
- Props typing: Use `Readonly<{ prop: Type }>` for component props

## shadcn/ui Integration

- **Install components**: `pnpm dlx shadcn@latest add <component-name>`
- **Style**: "new-york" variant with CSS variables enabled
- **Utilities**: Use `cn()` helper from `@/lib/utils` for conditional classes (combines clsx + tailwind-merge)
- **Icons**: Uses lucide-react icon library
- **Path aliases**: Components at `@/components/ui`, utils at `@/lib/utils`
- **Variant management**: Uses class-variance-authority (cva) for component variants
- Components will be added to `components/ui/` directory as needed

## ESLint Configuration

- Uses `eslint/config` flat config format (ESLint 9)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Run lint before committing: `pnpm lint`

## File Naming

- Routes: `page.tsx` (required name for pages)
- Layouts: `layout.tsx` (required name for layouts)
- Static assets: Place in `public/` (reference with `/filename.svg`)
- Components: Use PascalCase for files (e.g., `ButtonGroup.tsx`)

## Key Dependencies

- Next.js 16.0.8 (latest App Router features)
- React 19.2.1 (latest with Actions, async components)
- Tailwind CSS 4 (new @theme directive, simplified config)
- TypeScript 5 with strict checking
