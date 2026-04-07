Deploy the current project to Vercel and give the user the live URL.

## Steps

1. Check if the Vercel CLI is installed globally (`vercel --version`). If not, install it with `npm install -g vercel`.
2. Run `npm run build` to verify the production build succeeds. If it fails, diagnose and fix before retrying.
3. Build the Vercel output locally: `vercel build --prod --yes`. This avoids Vercel's remote build environment issues (Tailwind CSS v4 compatibility).
4. Deploy the prebuilt output: `vercel deploy --prebuilt --prod --yes`.
5. Present the production URL to the user.

## Important Notes

- This project is a pure static SPA (localStorage for auth/scores, no backend).
- Build output goes to `build/` directory (not the Vite default `dist/`).
- **Do NOT use `vercel --prod --yes` directly** — Vercel's remote build fails due to Tailwind CSS v4 / Node version issues. Always use the local prebuilt approach (steps 3-4).
- If not logged in, prompt the user to run `vercel login` in their own terminal (interactive OAuth flow).
- `vercel.json` already exists with `rewrites` for SPA routing. Do NOT use `routes` (it intercepts static asset requests).
