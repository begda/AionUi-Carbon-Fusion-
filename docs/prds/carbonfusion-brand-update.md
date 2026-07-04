# CarbonFusion 品牌重塑开发进度

## 概述

本次更新将项目从 **AionUi** 品牌重塑为 **CarbonFusion**，包括应用名称、appId 和 Logo 的全面修改。

---

## 完成日期

2026-06-29

---

## 修改内容

### 1. appId 修改

| 文件 | 修改内容 |
|------|----------|
| `packages/desktop/electron-builder.yml` | `com.aionui.app` → `com.shanzhake.app` |

---

### 2. 软件名称修改（AionUi → CarbonFusion）

#### 核心配置文件

| 文件 | 修改项 |
|------|--------|
| `package.json` | name、productName、author.name、author.email |
| `packages/desktop/electron-builder.yml` | productName、executableName、copyright、协议名、Linux 桌面名、maintainer、vendor、publish.repo |

#### 前端显示配置

| 文件 | 修改项 |
|------|--------|
| `packages/desktop/src/renderer/index.html` | title、meta application-name、meta apple-mobile-web-app-title、localStorage key (`__aionui_theme` → `__carbonfusion_theme`) |
| `public/manifest.webmanifest` | name、short_name、description |

#### 开发模式配置

| 文件 | 修改项 |
|------|--------|
| `packages/desktop/src/common/platform/index.ts` | 开发模式名称 (`AionUi-Dev` → `CarbonFusion-Dev`)、环境变量 (`AIONUI_MULTI_INSTANCE` → `CARBONFUSION_MULTI_INSTANCE`) |
| `packages/desktop/src/common/config/constants.ts` | 常量名 (`AIONUI_TIMESTAMP_SEPARATOR` → `CARBONFUSION_TIMESTAMP_SEPARATOR` 等)、环境变量 |
| `packages/desktop/src/common/config/appEnv.ts` | 环境变量名、注释文档 |
| `packages/desktop/src/index.ts` | 环境变量名 |
| `packages/desktop/electron.vite.config.ts` | 环境变量注入 |

#### 脚本文件

| 文件 | 修改项 |
|------|--------|
| `scripts/resetpass.ts` | 环境变量名、数据目录名 (`aionui-web` → `carbonfusion-web`) |
| `scripts/webui.ts` | 环境变量名、数据目录名、注释文档 |
| `packages/desktop/src/process/utils/webuiConfig.ts` | 环境变量名 |

#### 渲染器文件

| 文件 | 修改项 |
|------|--------|
| `packages/desktop/src/renderer/hooks/system/useTheme.ts` | localStorage key |
| `packages/desktop/src/renderer/pages/conversation/Messages/components/MessageText.tsx` | 常量引用 |
| `packages/desktop/src/renderer/services/FileService.ts` | 常量引用、函数名 |
| `packages/desktop/src/renderer/utils/file/messageFiles.ts` | 常量引用 |

#### 安装脚本

| 文件 | 修改项 |
|------|--------|
| `homebrew/aionui.rb.example` | cask 名称、应用名、下载 URL、appId 路径、GitHub 仓库链接 |
| `resources/windows-installer-arm64.nsh` | 所有宏名、变量名、可执行文件名、日志文件名、错误消息 |
| `resources/windows-installer-x64.nsh` | 所有宏名、变量名、可执行文件名、日志文件名、错误消息 |

---

### 3. Logo 替换

#### 源文件

- 使用 `新 logo/资源 4@4x.png`（185x224，非正方形）
- 处理方式：居中放置在透明正方形背景上（224x224）

#### 生成的图标文件

| 目标文件 | 用途 | 尺寸 |
|----------|------|------|
| `resources/app.icns` | macOS 应用图标 | 多尺寸（16-1024） |
| `resources/app.ico` | Windows 应用图标 | 多尺寸（16-256） |
| `resources/app.png` | Linux 应用图标 | 512x512 |
| `resources/app_dev.png` | 开发模式图标 | 512x512 |
| `resources/icon.png` | 通用图标 | 512x512 |
| `public/pwa/icon-180.png` | PWA Apple touch icon | 180x180 |
| `public/pwa/icon-192.png` | PWA 图标 | 192x192 |
| `public/pwa/icon-512.png` | PWA 图标 | 512x512 |
| `mobile/assets/images/icon.png` | 移动端图标 | 512x512 |
| `packages/desktop/src/renderer/assets/logos/brand/app.png` | 侧边栏 Logo | 原比例（185x224） |

---

## 环境变量变更

| 旧名称 | 新名称 |
|--------|--------|
| `AIONUI_MULTI_INSTANCE` | `CARBONFUSION_MULTI_INSTANCE` |
| `AIONUI_PORT` | `CARBONFUSION_PORT` |
| `AIONUI_DATA_DIR` | `CARBONFUSION_DATA_DIR` |

---

## 数据目录变更

| 旧路径 | 新路径 |
|--------|--------|
| `~/.aionui` | `~/.carbonfusion` |
| `~/.aionui-dev` | `~/.carbonfusion-dev` |
| `~/.aionui-web` | `~/.carbonfusion-web` |
| `~/Library/Application Support/AionUi` | `~/Library/Application Support/CarbonFusion` |
| `~/Library/Preferences/com.aionui.app.plist` | `~/Library/Preferences/com.shanzhake.app.plist` |

---

## 待处理事项

### 必须处理

1. **GitHub 仓库重命名**
   - 当前：`iOfficeAI/AionUi`
   - 目标：`iOfficeAI/CarbonFusion`
   - 需同步更新 `electron-builder.yml` 中的 `publish.repo`（已修改）

2. **Homebrew 官方 cask 更新**
   - 需向 Homebrew 官方仓库提交 PR
   - 文件：`Casks/c/carbonfusion.rb`

### 可选处理

1. **子包名称修改**
   - `@aionui/desktop` → `@carbonfusion/desktop`
   - `@aionui/web-host` → `@carbonfusion/web-host`
   - `@aionui/web-cli` → `@carbonfusion/web-cli`
   - `aionui-mobile` → `carbonfusion-mobile`

2. **其他品牌资源**
   - `resources/aionui_logo_black_bg.svg`
   - `resources/aionui_logo_no_border.png`
   - `packages/desktop/src/renderer/assets/logo.svg`

---

## 验证状态

| 检查项 | 状态 | 备注 |
|--------|------|------|
| TypeScript 类型检查 | ✅ 通过 | 仅有一个预先存在的依赖类型错误 |
| lint/format | ⏳ 待验证 | 需项目环境支持 |
| 本地构建 | ⏳ 待验证 | 需运行 `bun run build` |
| 应用运行测试 | ⏳ 待验证 | 需启动应用验证名称和 Logo 显示 |

---

## 注意事项

1. **appId 修改影响用户数据**
   - 用户首次启动新版本时，数据路径会变更
   - 旧数据保留在 `com.aionui.app` 路径下
   - 如需数据迁移，需额外实现迁移逻辑

2. **协议 scheme 变更**
   - 旧：`aionui://`
   - 新：`carbonfusion://`
   - 深链接调用方需更新

3. **向后兼容性**
   - 旧版本用户升级后，appId 变化可能导致设置丢失
   - 建议在发布说明中提醒用户