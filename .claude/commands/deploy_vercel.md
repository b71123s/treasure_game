Deploy the current project to Vercel and return the live URL.

## Steps

1. Check if Vercel CLI is installed (`vercel --version`). If not: `npm install -g vercel`.
2. Build with default base path: `npm run build` (VITE_BASE_PATH defaults to `/`).
3. Build Vercel output locally: `vercel build --prod --yes`
4. Deploy prebuilt: `vercel deploy --prebuilt --prod --yes`
5. Return the production URL (aliased URL from output).

## Important Notes

- `vite.config.ts` reads `VITE_BASE_PATH` env var (defaults to `/`). Vercel uses the default `/` — do NOT set VITE_BASE_PATH.
- **Do NOT use `vercel --prod --yes` directly** — remote build fails due to Tailwind CSS v4 / Node version issues. Always use the local prebuilt approach (steps 3-4).
- If not logged in, prompt the user to run `vercel login` in their own terminal (interactive OAuth flow).
- `vercel.json` has `rewrites` for SPA routing. Do NOT use `routes` (it intercepts static asset requests).
