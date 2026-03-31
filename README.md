# HAGoTVClient

现代化 TV 直播与社区管理系统

## 功能特性

- **用户系统**：注册、登录、找回密码、多用户组权限
- **TV 直播**：M3U8 格式支持、云端频道同步
- **管理后台**：用户管理、频道管理、用户组管理、系统配置
- **现代化 UI**：毛玻璃效果、圆角设计、流畅动画

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Electron + Tauri |
| 前端 | React 18 + TypeScript + TailwindCSS + Framer Motion |
| 后端 | Node.js + Express + SQLite |
| 视频播放 | hls.js |

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动后端 API 服务（另一个终端）
cd server && npm run dev
```

访问 http://localhost:5173

### 构建

```bash
# 构建前端
npm run build:vite

# 构建桌面应用
npm run electron:build

# 构建 Tauri 应用（需要 Rust 环境）
npm run tauri:build
```

## 默认账号

- 用户名: admin
- 密码: admin123

## 项目结构

```
HAGoTVClient/
├── src/                 # React 前端源码
│   ├── components/      # 组件库
│   ├── pages/           # 页面组件
│   ├── stores/          # 状态管理
│   ├── services/        # API 服务
│   ├── hooks/           # React Hooks
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   └── styles/          # 全局样式
├── electron/            # Electron 主进程
├── server/              # 后端 API 服务
│   ├── src/             # 源码
│   │   ├── db/          # 数据库模块
│   │   ├── routes/      # API 路由
│   │   └── index.ts     # 入口文件
│   └── dist/            # 编译后代码
├── src-tauri/           # Tauri 后端 (Rust)
├── release/             # 构建输出
├── SPEC.md              # 技术规范文档
└── README.md            # 项目文档
```

## 部署后端（Linux 服务器）

### 1. 上传代码

将 `server/` 目录上传到服务器 `/www/wwwroot/` 目录

### 2. 安装依赖

```bash
cd /www/wwwroot/hagotv-server
npm install
```

### 3. 启动服务

```bash
# 使用 PM2 守护进程
pm2 start dist/index.js --name HAGoTV-Server
pm2 save

# 开机自启
pm2 startup
```

### 4. 配置 Nginx 反向代理

在宝塔面板中配置反向代理指向 `http://127.0.0.1:3001`

## UI 预览

- 毛玻璃效果卡片
- 深色主题设计
- 流畅的动画过渡
- 响应式布局

## 许可证

MIT
