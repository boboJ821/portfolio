# 项目分析：mysite-main（BBX821 个人作品集）

> 分析日期：2026-08-17
> 站点：BBX821 / bbx821.top（作者 Huangxi · 黄曦）
> 类型：个人作品集单页应用 + 访问统计后台

---

## 一、项目概况

| 项 | 内容 |
|---|---|
| 类型 | 个人作品集 / 单页应用 + 后台访问统计 |
| 构建 | Vite 5 + React 18，部署到 Vercel |
| 标题/品牌 | BBX821（黄曦）|
| 主题 | 深紫霓虹、3D 沙丘地形、滚动叙事 |

---

## 二、技术栈

- **前端**：React 18、react-router-dom v7、Tailwind CSS 3、framer-motion（动画）、GSAP（相机滚动）
- **3D**：three / @react-three/fiber / @react-three/drei、自定义 GLSL 着色器
- **图表**：chart.js + react-chartjs-2（后台访问趋势）
- **后端（双份）**：Supabase（生产数据层）、Express + MongoDB（本地遗留后端）
- **部署**：Vercel（`api/*.js` 作为 Serverless Function）

---

## 三、目录结构

```
src/
  Background/   Scene.jsx(全屏3D沙丘+滚动相机) Terrain.jsx(未使用)
  Sections/     Hero About Experience Works Skills Contact
  Works/        ProjectDetail / ProjectNav（项目详情页）
  Admin/        Login + Dashboard（访问统计后台）
  gallery/      3D 作品画廊（TS + 虚拟滚动 + 着色器弯曲）
  data/         projects.js / galleryProjects.ts
  hooks/        useVisitTracker / useSmoothScroll
  utils/        auth.js / formatters.js
api/visits.js   生产用 Serverless API（Supabase 读写访问记录）
server/index.js 本地 Express 后端（已失效）
```

---

## 四、核心功能

1. **3D 动态背景**：`Scene.jsx` 用 Simplex 噪声顶点着色器生成流动紫色沙丘，相机随滚动沿弧线移动（`CameraController` + GSAP）。
2. **作品画廊**：`gallery/` 是一套独立的 3D 虚拟滚动画廊，卡片贴图带速度感应弯曲着色器，且做了渐进增强（移动端/降低动效时降级为静态 `<img>`）。
3. **项目管理**：`/works/:id` 详情页，自适应图片网格 + 灯箱预览。
4. **访问统计**：`useVisitTracker` 记录 IP/UA/路径/停留时长 → Supabase；`/admin` 后台用 Chart.js 展示趋势、可搜索/按时间筛选。
5. **后台鉴权**：`Login` + `Dashboard`，前端校验密码。

---

## 五、发现的问题与风险

### 🔴 1. 本地后端 `server/index.js` 无法运行（依赖缺失）
文件顶部 `require('mongoose')`、`require('mysql2/promise')`、`require('pg')`，但三者**均不在 package.json 依赖中**，且 `node_modules` 中也没有。直接 `node server/index.js` 会立刻报 `Cannot find module`。这是一段**失效/被遗弃的代码**。

### 🔴 2. 后端架构混乱、双份重复实现
- 生产走 `api/visits.js`（Supabase）；本地走 `server/index.js`（Mongo + Supabase + 未使用的 pg/mysql2）。两者功能重叠，且 `server/` 永远不会在 Vercel 生效。
- `server/index.js` 里 MongoDB 连接了却**从不写入**（最终写的是 Supabase），`pg`/`mysql2` 引入后完全没用 —— 大量死代码。

### 🔴 3. 管理员密码是客户端变量，等于公开
`VITE_ADMIN_PASSWORD=bbx821722` 以 `VITE_` 前缀注入，**会打包进公开 JS**，任何人打开网页源码即可拿到后台密码，直接进入 `/admin` 访问统计后台。应改为服务端校验。

### 🟡 4. 开发环境配置错配
- `useVisitTracker` 中开发 API 硬编码为 `http://localhost:3000/api`，但 Express 监听 `5000`，且 `.env.development` 的 `VITE_API_URL=http://localhost:5000` **代码并未使用**。
- `Dashboard` 用相对路径 `/api/visits`，而 `vite.config.js` 没有配 `/api` 代理 → 本地 `npm run dev` 时后台和访问追踪都会 404。

### 🟡 5. `.env` 含密钥且存在于磁盘
`.gitignore` 虽忽略 `.env*`，但该文件实际存在于工作区，内含 Supabase anon key、MongoDB 连接串（含账号密码）、管理员密码。anon key 设计上可公开但需 RLS 保护；Mongo 连接串含凭据，建议用 Vercel 环境变量托管，勿落盘。

### 🟡 6. 死代码 / 冗余依赖
- `Terrain.jsx`（未在任何地方引用）、`selectedWorks`（projects.js 中定义但作品区改用 `galleryProjects`）、`@splinetool/*`（依赖列表里有，但组件未使用）。
- 画廊是 TS（`gallery/*.ts(x)`）有独立 `tsconfig.gallery.json`，但 `build` 脚本只跑 `vite build`（esbuild 不做类型检查），`typecheck:gallery` 游离在构建流程外——类型错误不会阻断发布。

### 🟢 7. 优点（值得肯定）
- 3D 画廊的渐进增强（降级、IntersectionObserver 预加载、`prefers-reduced-motion` 适配）做得规范。
- `GalleryBoundary` 错误边界 + 静态兜底，健壮性较好。
- 着色器代码完整、相机运动平滑，视觉完成度高。

---

## 六、修复建议（按优先级）

1. **删除或修复 `server/index.js`**：若不用本地后端，直接删掉，避免误导与依赖缺失问题。
2. **后台密码改服务端校验**：在 Vercel Function 中对比服务端密钥，前端只存 session token；避免 `VITE_ADMIN_PASSWORD` 暴露。
3. **统一 dev/prod API 地址**：在 `vite.config.js` 增加 `/api` 代理到本地后端，并让 `useVisitTracker` / `Dashboard` 统一使用 `import.meta.env.VITE_API_URL`。
4. **清理死代码与未使用依赖**：移除 `Terrain.jsx`、`selectedWorks`、`@splinetool/*`，把 `typecheck` 接入 `build` 前步骤。
5. **密钥迁移**：`.env` 密钥迁移到 Vercel 环境变量，并确认 Supabase `visits` 表已开启 RLS（行级安全）。

---

## 七、修复进度（2026-08-17）

| # | 问题 | 状态 | 处理 |
|---|---|---|---|
| 1 | 失效后端 server/index.js | ✅ 已修复 | 已删除 `server/` 目录（依赖 mongoose/mysql2/pg 缺失，且 Vercel 从不使用） |
| 2 | 管理员密码打包进前端 | ✅ 已修复 | 新增 `api/login.js`（服务端校验 ADMIN_PASSWORD，签发 HMAC 签名 token）；`api/visits.js` 的 GET 需携带 token；客户端 `auth.js`/`Login.jsx`/`Dashboard.jsx` 改为调用服务端；`.env` 移除 `VITE_ADMIN_PASSWORD`，新增 `ADMIN_PASSWORD`/`ADMIN_SECRET`；新建 `.env.example` |
| 3 | dev/prod API 地址错配 | ✅ 已修复 | 统一为 `VITE_API_URL || '/api'`；`useVisitTracker` 修正为 `/visits`（原路径 `/api/api/visit` 双重前缀且单数，本就 404）；`vite.config.js` 增加 `/api` 代理（默认 → localhost:3000，可用 `VITE_API_PROXY_TARGET` 覆盖）；`.env.development` 改为相对路径 |
| 4 | 死代码/冗余依赖 | ✅ 已修复 | 删除未引用的 `Terrain.jsx` 与 `projects.js` 中 `selectedWorks`；移除未使用的 `@splinetool/*` 及失效后端专属的 `express`/`cors`/`dotenv`/`geoip-lite`；将 `typecheck:gallery` 接入 `build` 与 `vercel-build`（`tsc` 已验证通过） |
| 5 | 密钥/RLS 加固 | 🟡 部分 | `.env*` 已被 gitignore；已建 `.env.example` 与 `supabase/visits_rls.sql`（RLS 策略需手动在 Supabase SQL Editor 执行）；部署时请在 Vercel 配置 `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`ADMIN_PASSWORD`/`ADMIN_SECRET` 环境变量 |

### 仍需你手动处理
- **Vercel 环境变量**：部署前在 Vercel 项目设置里添加 `ADMIN_PASSWORD`、`ADMIN_SECRET`（值同 `.env`），以及已有的 Supabase 变量。
- **本地 API 联调**：Vercel Serverless 函数不在 `vite dev` 中运行。本地测试后台/埋点请用 `vercel dev`（默认 :3000），或设 `VITE_API_PROXY_TARGET` 指向你的本地 API。
- **Supabase RLS**：在 Supabase SQL Editor 执行 `supabase/visits_rls.sql`；建议 `api/visits.js` 改用 `service_role` key 连接，使数据库层可拒绝 anon 直接 SELECT。

