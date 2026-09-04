# Track Studio 公开网站 AI 工作指南

这是“轮迹研习社 / Track Studio”的**公开展示仓库**。它只用于发布可公开访问的静态网页，不是完整开发档案。

## 项目身份

- 网站名称：轮迹研习社：车辆工程与自动驾驶研究 Skill 地图；
- 技术：原生 HTML、CSS、JavaScript；
- 在线网址：`https://moytkl1999-del.github.io/track-studio-site/`；
- 部署方式：GitHub Pages / GitHub Actions；
- 面向人群：车辆工程硕士、自动驾驶研究者和开源学习者。

## 可以修改的内容

- `index.html`：网页结构与中文文案；
- `styles.css`：视觉样式、响应式布局；
- `app.js`：研究项目数据、搜索、筛选、排序；
- `assets/`：确认可公开使用的网页图片；
- `README.md`：公开说明。顶部的在线网址必须保留；
- `.github/workflows/deploy-pages.yml`：公开站点部署配置。

## 发布边界

不要将私人源文件、开发备份、用户笔记、账号信息、Token、API Key、本地服务脚本、未公开数据或其他项目上传到本仓库。

如果页面改动来自私有开发版，只同步已经确认可公开的网页成品。完成修改后，检查 GitHub Pages 部署状态，并确认在线网址可打开。

## 文档规则

- `README.md` 使用中文说明网站用途和访问方法；
- 每次网站网址或发布方式改变，立刻更新 `README.md`；
- 研究推荐数据为快照时，要注明时间；
- 不要把本公开仓库当成所有项目的总目录。
