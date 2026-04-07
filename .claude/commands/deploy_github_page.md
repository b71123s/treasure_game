Deploy the current project to GitHub Pages and return the live URL.

## Steps

1. **Check `gh` CLI**: Run `gh auth status`. If not logged in, prompt user to run `gh auth login` in their own terminal (interactive OAuth), then retry.
2. **Ensure repo exists**:
   - Run `git remote get-url origin` to check if remote is set.
   - If no remote: create repo with `gh repo create <repo-name> --public --source=. --remote=origin` (repo name defaults to current directory name).
   - If remote exists but repo doesn't exist on GitHub: create with `gh repo create <owner>/<repo> --public --source=. --remote=origin`.
3. **Push source code**: Ensure `main` branch is pushed to remote: `git push -u origin main`.
4. **Build**: `MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/<repo-name>/ npm run build`
5. **Deploy**: `npm run deploy:gh` (pushes `build/` to `gh-pages` branch).
6. **Enable GitHub Pages**: Run `gh api repos/<owner>/<repo>/pages -X POST -f source[branch]=gh-pages -f source[path]=/ 2>/dev/null || true` (no-op if already enabled).
7. **Return the live URL**: `https://<owner>.github.io/<repo-name>/`

## Important Notes

- **CRITICAL (Windows):** Must prefix build command with `MSYS_NO_PATHCONV=1` — Git Bash auto-converts `/<repo-name>/` to `C:/Program Files/Git/<repo-name>/`, breaking all asset paths.
- `vite.config.ts` reads `VITE_BASE_PATH` env var (defaults to `/`). GitHub Pages requires `/<repo-name>/` to match the repo name.
- Must set `VITE_BASE_PATH` at build time, NOT in `npm run build` (which defaults to `/` for Vercel).
- `gh auth login` requires interactive terminal — cannot run inside Claude Code. User must do it manually.
- The `gh api ...pages` call auto-enables Pages with `gh-pages` branch as source. Without this step, first deploy will 404.
- Deploy may take 1-2 minutes to reflect on GitHub Pages after first enable.
- Repo name is extracted from remote URL or directory name. Base path **must match** repo name.
