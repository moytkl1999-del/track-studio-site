# JYN 健康习惯网页端：AI 协作指南

## 项目定位

这是 “JYN 健康习惯计划” 的纯前端网页端。它不依赖后端、数据库、账号或 API；用户数据使用浏览器 `localStorage` 保存。

## 代码结构

| 文件 | 职责 |
| --- | --- |
| `index.html` | 页面语义结构和表单控件。 |
| `styles.css` | 响应式布局、颜色、卡片和移动端视觉样式。 |
| `app.js` | 输入校验、BMI/计划计算、食谱和训练建议、`localStorage` 读写、按钮交互。 |
| `README.md` | 面向普通使用者的说明。 |

## 修改规则

- 保持原生 HTML/CSS/JavaScript；除非用户明确要求，不引入框架、打包器或云服务。
- 新增控件时，必须同步完成 HTML ID、JavaScript 事件绑定、可访问标签和移动端样式。
- 保持离线可用；不要将用户的体重、睡眠等记录上传到第三方服务。
- 训练和饮食建议必须以一般健康习惯为定位，保留“不替代医生或营养师”的提示。
- 修改后至少检查：页面可打开、无控制台 JavaScript 错误、保存后刷新页面数据仍在、窄屏下没有横向溢出。

## 发布

- 私有源码镜像：`moytkl1999-del/TEST` 的 `health-habits-web/` 目录。
- 公开网页镜像：`moytkl1999-del/track-studio-site` 的 `health-habits-web/` 目录。
- 公开网址：`https://moytkl1999-del.github.io/track-studio-site/health-habits-web/`。
- 公开站点由 `track-studio-site/.github/workflows/deploy-pages.yml` 在 `main` 分支更新后自动发布。
