# Creating a new skill

> Required reading: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## Hard requirements

- **Prefix**: every skill name starts with `jiaqi-`.
- **`name` field**: lowercase letters, digits, hyphens only. Max 64 chars. Never include `anthropic` or `claude`.
- **`description` field**: third person, ≤1024 chars, must answer _what it does_ + _when to use it_.
- **SKILL.md body**: keep under 500 lines. Move long content into `references/`.
- **References**: only one level deep, no nesting.

## Steps

1. Create `skills/jiaqi-<name>/SKILL.md` with YAML frontmatter.
2. If the skill needs scripts, add TypeScript under `skills/jiaqi-<name>/scripts/`.
3. If the skill renders templates, add `skills/jiaqi-<name>/prompts/`.
4. Register the skill path in `.claude-plugin/marketplace.json` under `plugins[0].skills`.
5. If there are scripts, include a **Script Directory** section in `SKILL.md`.

## Frontmatter template

```yaml
---
name: jiaqi-<name>
description: <Third-person description. What it does + when to use it.>
version: 0.1.0
---
```

## Directory layout

```
skills/jiaqi-example/
├── SKILL.md          # main instructions (<500 lines)
├── references/       # optional, loaded on demand
│   ├── styles.md
│   └── examples.md
└── scripts/          # optional
    └── main.ts
```

## Description writing rules

Third person, present tense, action-first.

- Good: `Generates a Markdown table of contents from headings in the input file.`
- Bad: `I can help you generate a TOC.`

## Self-containment

A skill must be runnable on its own. SKILL.md cannot link to files outside its own directory. If two skills need the same convention, inline it into both.
