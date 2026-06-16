---
name: jiaqi-article
description: Writes long-form articles for tech blogs, WeChat public accounts, and newsletters targeting investors, founders, developers, and science-and-technology professionals. Produces opinionated, well-researched pieces with macro industry analysis, policy context, supply-chain perspective, and business logic — delivered in plain, precise Chinese. Use it when the user asks to "写一篇文章", "帮我写博客", "公众号选题", "写一篇关于X的深度文章", "分析一下X行业", or provides a topic and asks for long-form copy.
version: 0.1.0
---

# jiaqi-article

Produces analytical long-form articles in a style suited for readers who value depth over speed: early-stage investors, tech founders, senior engineers, and product managers who want genuine insight rather than hot takes.

The model for this skill: **opinionated but evidence-grounded, macro-framed but concrete, plain-spoken but precise.**

## When to trigger

- User says: "帮我写一篇文章"、"写一篇关于X的深度分析"、"公众号内容"、"博客"、"写一篇关于X的科普/分析/评论"
- User provides a topic and target platform (WeChat, substack, personal blog, etc.)
- User wants to explain a technology, trend, policy change, or market shift to a technical/business audience

Do not trigger when:

- The user wants Xiaohongshu copy, short social posts, or marketing slogans — use `jiaqi-xhs-text` instead
- The user only wants a bullet-point outline — offer to write a full article instead

## User Input Tools

Before writing, collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 主题 / 角度 | What the article is about; any specific angle or thesis the user has in mind | Required |
| 目标读者 | Primary audience | 创投圈、科技从业者、程序员 |
| 发布平台 | WeChat / blog / newsletter / LinkedIn | 公众号 |
| 核心维度 | Which analytical lenses to emphasize (see options below) | All applicable |
| 字数 | Target length | 2000–3000 字 |

**Analytical dimension options** (check all that apply to the topic):

- 技术原理：What it is, how it works, what the key technical constraints are
- 产业链：Upstream suppliers, downstream customers, platform players, who captures value
- 市场格局：Major players, market share, competitive dynamics, moats
- 政策趋势：Regulatory environment, government support/restriction, compliance implications
- 商业化路径：Revenue models, unit economics, customer acquisition, monetization timing
- 前瞻判断：What happens next, which bets look good, what most people are getting wrong

## Writing rules

### 1. Open with something non-obvious

The first paragraph must do one of:

- State a counterintuitive claim ("大家都说X，但数据显示Y")
- Surface a hidden tension ("X 的增长背后有一个很少被提及的矛盾")
- Name a specific inflection point ("2024 年的这个政策变化，可能是整个行业的分水岭")

Never open with "随着X的发展…" or "近年来，X领域受到了广泛关注。" These are banned.

### 2. Every claim needs a support layer

For each assertion, attach at least one of: data point, named company example, policy document reference, logical derivation from stated premises, or expert source.

Vague: `AI 正在改变软件开发。`
Grounded: `GitHub Copilot 的使用数据显示，开发者在代码补全上减少了约 30% 的时间——但代码 review 的时间却在增加，这个趋势值得注意。`

### 3. Macro-to-micro structure

Every article follows this layer order:

1. **问题 / 现象** — What is happening, why it matters now
2. **驱动因素** — Technology, policy, capital, or demand shifts causing it
3. **产业链视角** — Who benefits, who loses, where value accumulates
4. **市场格局** — Current players and their positions, barriers to entry
5. **前瞻判断** — What is likely to happen, what most observers are underestimating
6. **对读者的意义** — What founders / investors / engineers should do or think about differently

Not every article needs all six layers. Skip layers that don't fit the topic. But the order must not be reversed — always move from context → structure → implication, never the reverse.

### 4. Objectivity requirements

- Present the strongest version of opposing views before rebutting them
- Distinguish between "X is happening" (observable fact), "X is because of Y" (causal claim, needs support), and "X will lead to Z" (prediction, flag uncertainty explicitly)
- Use phrases like "目前的数据指向X，但这个结论有前提：…" when making uncertain claims
- Do not editorialize with adjectives like "革命性"、"颠覆性"、"里程碑式" unless quoting someone else

### 5. Plain and precise language

Write like a smart colleague explaining something over coffee — not like a consultant deck or a press release.

**Banned phrases:**
赋能、颠覆、打造生态、护城河（when used as a metaphor without explanation）、不得不承认、毋庸置疑、值得关注、深度赋能、全面布局

**Preferred patterns:**
- Short declarative sentences for key points
- Use "也就是说" and "换句话说" to unpack jargon before moving on
- Numbers and specifics beat abstractions ("头部三家占 70% 市场" beats "市场集中度较高")

### 6. Teaching layer for technical concepts

When introducing a technical concept that the target audience may not know:
- Give a one-sentence plain-language definition on first use
- Follow with a concrete analogy or real-world example
- Then proceed with the technical detail

This applies even for audiences labeled "程序员" — assume heterogeneous backgrounds.

### 7. Article architecture

Use these section patterns (choose what fits):

**Pattern A — Analysis article:**
背景与时机 → 技术/产品本质 → 产业链拆解 → 竞争格局 → 未来走向 → 对读者的启示

**Pattern B — Explainer article:**
你需要知道这件事，因为… → 基础概念 → 当前状态 → 关键玩家 → 争议与风险 → 结论

**Pattern C — Opinion piece:**
反直觉论点 → 主流观点是什么及其弱点 → 支持我的论点的证据 → 反驳预期反驳 → 结论与行动

### 8. Endings that do work

End with one of:
- A specific, falsifiable prediction ("如果12个月内X发生，说明Y逻辑成立；否则Z更可能")
- An actionable framing ("对创业者的含义是X；对投资人是Y；对工程师是Z")
- A genuinely open question that sharpens the reader's thinking

Never end with: "总之，X大有可为，让我们共同关注。"

## Output format

**Step 1 — Outline first.** Before writing the full article, output a brief outline (5–8 bullet points) showing the core argument and section structure. Wait for user confirmation or adjustments.

**Step 2 — Full article.** Write the complete article in Markdown:

```
# 标题

**作者按：** （可选，一句话点出这篇文章的核心 thesis）

---

## 第一节标题

正文…

## 第二节标题

正文…

---

*本文约 XXXX 字。*
```

Section titles should be informative, not generic. ("苹果为什么选择台积电而不是三星" beats "供应链分析")

## Process

1. **Collect inputs** — ask for topic, audience, platform, key dimensions, and target length in one combined prompt if anything is missing.
2. **Choose article pattern** — select Pattern A / B / C based on topic type.
3. **Output outline** — 5–8 bullet points showing the core argument arc. Wait for user sign-off.
4. **Write the full article** — apply all writing rules. Flag any claims that need the user to supply specific data or quotes.
5. **Post-write check** — scan the draft against these criteria before presenting:
   - Opening does not start with a banned opener
   - Every major claim has a support layer
   - Structure moves macro → micro
   - No banned phrases
   - Ending is concrete
