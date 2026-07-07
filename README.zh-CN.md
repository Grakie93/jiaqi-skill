# jiaqi-skill

适用于 Claude Code 的日常工作技能集合。

[English](./README.md) | 中文

## 安装

```bash
# 在 Claude Code 中执行
/plugin marketplace add Grakie93/jiaqi-skill
/plugin install jiaqi-skill
```

## 技能列表

### 实用工具

- **jiaqi-format-text** — 整理中英混排文本：在中文和英文之间加空格、规范标点、合并多余空白。
- **jiaqi-url-to-markdown** — 抓取网页并返回纯净的 Markdown 正文（通过 Readability 过滤导航/广告/侧边栏）。

### 写作

- **jiaqi-topics** — 从单个主题或事件生成多个不同角度的选题。每个选题包含可直接使用的标题、共鸣点分析、以及推荐的下游写作技能。
- **jiaqi-article** — 为科技博客和微信公众号撰写长文分析。宏观产业分析、政策/供应链视角、商业逻辑，精准的中文表达。面向投资人、创业者和工程师。
- **jiaqi-repurpose** — 将一篇完整文章改编为多平台版本：小红书笔记、朋友圈文案、微博、X/Twitter thread、LinkedIn 文章。小红书版本可直接对接 `jiaqi-xhs-image` 生成海报。

### 小红书

- **jiaqi-xhs-text** — 根据人设和主题生成完整的小红书帖子：带 emoji 的标题、分段正文、话题标签、以及每张图的视觉方向。
- **jiaqi-xhs-persona** — 用六种预设人设生成小红书帖子（专业靠谱型、温柔贴心型、爽快高效型、生活顾问型、理财达人型、热心资源型）。每种人设有独特的语言模式、emoji 用法和叙事框架。
- **jiaqi-comment** — 生成小红书或公众号评论区的回复。回复内容基于原帖，语气匹配六种人设之一，保持账号调性一致。
- **jiaqi-xhs-image** — 从场景描述生成竖版 3:4 图片，支持多平台 API（DashScope、OpenAI、Replicate）。

## 首次使用前

```bash
bun install     # 或: npm install
```

带有 TypeScript 脚本的技能需要此步骤。

## 仓库结构

```
jiaqi-skill/
├── .claude-plugin/
│   └── marketplace.json     # 插件清单
├── skills/                  # 所有 jiaqi-* 技能
├── docs/                    # 编写文档（仓库内部）
├── CLAUDE.md                # Claude Code 项目指南
└── README.md
```

## 完整工作流示例

```
jiaqi-topics（生成选题）
    ↓
jiaqi-article / jiaqi-xhs-persona（撰写内容）
    ↓
jiaqi-repurpose（分发到各平台）
    ↓
jiaqi-xhs-image（小红书海报图）
    ↓
jiaqi-comment（处理评论区）
```

## 许可证

MIT
