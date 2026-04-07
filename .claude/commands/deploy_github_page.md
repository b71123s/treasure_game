Deploy the current project to GitHub Pages and return the live URL.

## Steps

1. Ensure git is initialized with remote `https://github.com/b71123s/treasure_game.git`.
2. Build with GitHub Pages base path: `MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/treasure_game/ npm run build`
3. Deploy: `npm run deploy:gh` (pushes `build/` to `gh-pages` branch).
4. Return the live URL: **https://b71123s.github.io/treasure_game/**

## Important Notes

- **CRITICAL (Windows):** Must prefix build command with `MSYS_NO_PATHCONV=1` — Git Bash auto-converts `/treasure_game/` to `C:/Program Files/Git/treasure_game/`, breaking all asset paths.
- `vite.config.ts` reads `VITE_BASE_PATH` env var (defaults to `/`). GitHub Pages requires `/treasure_game/` to match the repo name.
- Must set `VITE_BASE_PATH` at build time, NOT in `npm run build` (which defaults to `/` for Vercel).
- If GitHub Pages is not enabled: repo Settings → Pages → Source: `gh-pages` branch / `/ (root)`.
- Deploy may take 1-2 minutes to reflect on GitHub Pages.
