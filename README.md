# jiaqi-skill

A collection of Claude Code skills for daily work.

## Install

```bash
# In Claude Code
/plugin marketplace add Grakie93/jiaqi-skill
/plugin install jiaqi-skill
```

## Skills

### Utility

- **jiaqi-format-text** — Cleans up mixed Chinese-English text: adds spaces between CJK and Latin, normalizes punctuation, collapses extra whitespace.
- **jiaqi-url-to-markdown** — Fetches a URL and returns the main article as clean Markdown (strips nav/ads/sidebar via Readability).

### Writing

- **jiaqi-article** — Writes long-form analytical articles for tech blogs and WeChat public accounts. Macro industry analysis, policy/supply-chain framing, business logic, plain and precise Chinese. Targets investors, founders, and engineers.

### Xiaohongshu (小红书)

- **jiaqi-xhs-text** — Writes a complete Xiaohongshu post from a persona and topic: title with emoji, structured body, hashtags, and a visual brief per image.
- **jiaqi-xhs-image** — Generates vertical 3:4 images from a scene description using your choice of API (DashScope, OpenAI, or Replicate).

## First-time setup

```bash
bun install     # or: npm install
```

Required for skills with TypeScript scripts.

## Repository layout

```
jiaqi-skill/
├── .claude-plugin/
│   └── marketplace.json     # Plugin manifest
├── skills/                  # All jiaqi-* skills
├── docs/                    # Authoring docs (repo-internal)
├── CLAUDE.md                # Project guide for Claude Code
└── README.md
```

## License

MIT
