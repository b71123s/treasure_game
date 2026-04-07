# Treasure Hunt Game

React + TypeScript 單頁遊戲，點擊 3 個寶箱找出寶藏。

- 寶藏：+$1000
- 骷髏：-$50

## 技術棧

- React 18 + TypeScript
- Vite（建置工具）
- Tailwind CSS v4
- Framer Motion（`motion/react`）
- shadcn/ui + Radix UI

## 開發

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 產出 build/
```

## 部署

兩個部署目標，使用 Claude Code custom command 快速部署：

| 平台 | 指令 | URL |
|------|------|-----|
| GitHub Pages | `/deploy_github_page` | https://b71123s.github.io/treasure_game/ |
| Vercel | `/deploy_vercel` | 部署後回傳 |

詳見 `.claude/commands/` 中的部署指令說明。
