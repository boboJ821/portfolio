# 黄曦 Portfolio

基于 React、Vite 和 React Three Fiber 的个人简历与项目作品集。首页包含简历内容、
项目轮播和动态背景，`/admin` 提供本地访问记录查看入口。

## 本地运行

环境要求：Node.js 22、npm 10 或更高版本。

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

默认访问地址为 `http://127.0.0.1:5173/`。开发环境下，Vite 会直接挂载本地内存版
访问统计 API；数据会在开发服务重启后清空。

## 常用命令

```powershell
npm run dev          # 启动开发服务
npm run check        # 类型、代码规范和格式检查
npm run build        # 完整检查并生成生产构建
npm run preview      # 预览生产构建
npm run lint:fix     # 自动修复可修复的 ESLint 问题
npm run format       # 使用 Prettier 统一格式
```

## 目录结构

```text
api/                         Vercel Serverless API
  _lib/                      API 共用逻辑
dev/                         本地开发 API
public/
  media/projects/            项目封面和演示视频
src/
  components/
    Admin/                   访问统计后台
    Background/              WebGL 动态背景与着色器
    Experience/              工作经历时间线
    Projects/                项目卡片轮播与项目详情页
    Sections/                首页内容区块
    UI/                      全局界面组件
  config/                    前端运行配置
  data/resume.js             简历和项目内容的唯一数据源
  hooks/                     React Hooks
  utils/                     通用工具
supabase/                    数据库策略
```

## 更新简历与项目

个人资料、经历、技能和项目都在 `src/data/resume.js` 中维护。每个项目的 `details`
字段用于详情页的背景、方法和价值说明。项目媒体的放置位置、格式和路径示例见
`public/media/projects/README.md`。

## 环境变量

从 `.env.example` 创建本地 `.env`。环境文件不会提交到 Git：

- `ADMIN_PASSWORD`：本地后台登录密码。
- `ADMIN_SECRET`：后台令牌签名密钥。
- `SUPABASE_URL`、`SUPABASE_ANON_KEY`：生产访问统计使用。
- `VITE_API_URL`：可选；为空时使用同源 `/api`。

项目当前以本地运行为优先。正式部署前，还需要单独复核 Supabase RLS、生产密钥、
CORS 域名和隐私告知。

## 分支约定

- `main` 始终保持可运行。
- 每项功能使用独立英文分支，例如 `feature/project-experience`。
- 提交前执行 `npm run check` 和 `npm run build`。
- 通过 Pull Request 合并功能分支，合并后删除已完成的分支。
