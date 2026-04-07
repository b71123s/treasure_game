# 開發紀錄 & 踩坑筆記

> 寶藏獵人遊戲 — React + TypeScript + Vite  
> 後端曾使用 Express + better-auth + SQLite，後轉為純靜態部署

---

## 1. Express 5 + better-auth 相容性

### toNodeHandler 回傳 500

better-auth 提供的 `toNodeHandler` 與 Express 5 不相容，所有請求都回傳 500。

**根因：** Express 5 的 `Request` 物件與 Node.js 原生 `IncomingMessage` 有差異，`toNodeHandler` 內部轉換失敗。

**解法：** 手動建立 request bridge — 從 Express req 讀取 raw body，用 `globalThis.Request` 建立 Fetch API 格式的 request，再呼叫 `auth.handler(fetchReq)`：

```typescript
// server/index.ts（已註解）
const chunks: Buffer[] = [];
await new Promise<void>((resolve) => {
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", resolve);
});
const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

const fetchReq = new globalThis.Request(url.toString(), {
  method: req.method,
  headers,
  body: body?.length ? body : undefined,
});
const response = await auth.handler(fetchReq);
```

**注意：** 必須用 `import type { Request, Response } from "express"` 避免 Express `Request` 與全域 `Request` 命名衝突。

### Express 5 wildcard 語法

Express 5 不再支援 `/*`，需改為 `/*splat`。否則會拋出 `PathError`。

---

## 2. better-auth 表結構

### 密碼存在 account 表

better-auth 的密碼 hash **不存在 `user` 表**，而是存在 `account` 表的 `password` 欄位。`account` 表用 `providerId: "credential"` 標記 email/password 登入方式。因此即使只用 email/password，`account` 表也不能移除。

### runMigrations 必須呼叫

better-auth 的 4 張表（user、session、account、verification）不會自動建立。必須在伺服器啟動時呼叫：

```typescript
const ctx = await auth.$context;
await ctx.runMigrations();
```

否則會報 `no such table: user`。

### Schema 定義位置

4 張表的 schema 定義在 better-auth 套件深處：
```
node_modules/better-auth/node_modules/@better-auth/core/dist/db/schema/
  ├── user.d.mts
  ├── session.d.mts
  ├── account.d.mts
  └── verification.d.mts
```

### verification 表

只有啟用 `emailVerification` 時才會使用。若未開啟（預設），此表永遠為空，可安全移除。

### 自訂欄位方式

- 新增 user 欄位：`betterAuth({ user: { additionalFields: { ... } } })`
- 改表名/欄位名：`betterAuth({ schema: { user: { tableName: "auth_users" } } })`
- 新增全新表：透過 plugin 的 `schema` 屬性

---

## 3. React 共享狀態問題

### 問題

最初 `useAuth` 是獨立的 custom hook，每個使用它的元件（AuthModal、UserMenu、App）各自維護獨立的 state。登入後 AuthModal 內的 state 更新了，但 App 和 UserMenu 的 state 仍是未登入。

### 解法

改用 React Context：
1. 建立 `AuthContext.tsx`，在 `AuthProvider` 中集中管理 user state
2. 在 `main.tsx` 用 `<AuthProvider>` 包裹 `<App />`
3. 所有元件透過 `useAuth()` 取得同一份 state

---

## 4. Radix UI DropdownMenu + Framer Motion 衝突

### 問題

點擊 UserMenu 的 `test ∨` 按鈕後，下拉選單不顯示。

### 根因（多層問題）

1. **Framer Motion `transform` 建立新 stacking context**  
   寶箱的 `rotateY`、`scale` 動畫建立了新的 stacking context，影響 z-index 層疊順序。  
   **解法：** Header 加 `z-50`。

2. **`DropdownMenuTrigger asChild` + Button 無 `forwardRef`**  
   `asChild` 會用 Radix 的 `Slot` 將 ref 傳給子元件。但 shadcn/ui 的 `Button` 是普通 function component，沒有 `React.forwardRef`，React 18 靜默丟棄 ref。Radix 拿不到 trigger 的 DOM 節點，無法計算下拉選單定位。  
   **解法：** 不用 `asChild`，直接在 `DropdownMenuTrigger` 上套 `buttonVariants` 樣式類別。

3. **`modal={false}` 無效**  
   `modal` 控制的是事件攔截（pointer capture），對定位問題無效。加了也沒差。

---

## 5. Windows 環境問題

### ENOBUFS 錯誤

開發時偶爾出現 `AggregateError [ENOBUFS]`，Vite proxy 無法連接後端。

**根因：** Windows TCP 連線耗盡。Vite dev server 在後端尚未完全啟動前就發出 `/api/auth/get-session` proxy 請求，觸發大量失敗連線佔用 socket。

**處理：** 等 30 秒左右自然恢復，或重啟 dev server（先 `npx kill-port 3000 3001`）。

---

## 6. 型別宣告

### react/jsx-runtime 找不到宣告檔

IDE 報錯：`Could not find a declaration file for module 'react/jsx-runtime'`

**根因：** 專案沒有安裝 `@types/react` 和 `@types/react-dom`，也沒有根目錄 `tsconfig.json`。

**影響：** 僅影響 IDE 型別提示（紅線），不影響 Vite 打包和執行（Vite 用 SWC 編譯，不做型別檢查）。

**修法：** `npm install -D @types/react @types/react-dom typescript` + 建立 `tsconfig.json`。

---

## 7. 靜態化部署

### 為何需要靜態化

Vercel serverless 環境不支援 SQLite（檔案系統是唯讀的、每次 cold start 會重建），Express 後端無法直接部署。

### 改動策略

- 後端檔案全部註解保留（方便比對差異）
- `AuthContext.tsx` 和 `api.ts` 改用 `localStorage` 替代後端 API
- 保持所有介面（`AuthContextValue`、`GameScore`、`saveScore`、`getScores`）不變，上層元件零改動
- `vite.config.ts` 移除 proxy，`package.json` 簡化 scripts
