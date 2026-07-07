---
name: jiaqi-research
description: Synthesizes multiple articles (from jiaqi-url-to-markdown or user-provided text) into a structured research report. Covers competitive analysis, policy landscape, supply chain breakdown, or market overview. Use it when the user says "帮我整理这几篇文章", "做个调研报告", "综合分析一下", or provides 2+ articles and asks for synthesis.
version: 0.1.0
---

# jiaqi-research

Takes multiple source articles and produces a unified research report with structure, synthesis, and citations. Designed to be the **pre-writing research step** before `jiaqi-article` or `jiaqi-xhs-text`.

## When to trigger

- User provides 2+ articles (pasted text or from `jiaqi-url-to-markdown`) and says "帮我整理成报告"、"综合分析"
- User says "做个X行业的调研"、"竞品分析"、"政策梳理"、"产业链拆解"
- User explicitly asks to "combine these sources into a report"

Do not trigger when:

- The user only has one article — just summarize it directly
- The user wants a full article, not a research report — use `jiaqi-article` instead
- The sources are unrelated — ask the user what angle connects them

## User Input Tools

Collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 来源文章 | 2+ articles (pasted or from url-to-markdown) | Required |
| 研究主题 | What question or angle to synthesize around | Inferred from sources |
| 报告类型 | One of: 竞品分析 / 政策梳理 / 产业链拆解 / 市场概览 | 市场概览 |
| 目标读者 | Who will read this report | 通用专业读者 |

If the user provides articles without stating a research question, **infer the angle from the content and confirm** before proceeding. Don't guess — ask: "看起来这几篇都在讲X，你想从哪个角度整理？竞品/政策/产业链/市场概览？"

## Report types and structures

### 竞品分析 (Competitive Analysis)

**Use when**: Multiple sources cover different players in the same space.

**Structure**:
1. **市场格局** — Who are the main players? What's the overall landscape?
2. **核心差异** — How do they differ in product/strategy/positioning?
3. **数据对比** — Revenue, user base, funding, market share (if available in sources)
4. **优劣势分析** — What does each player do well / poorly?
5. **趋势判断** — Where is the competitive dynamic heading?

### 政策梳理 (Policy Landscape)

**Use when**: Multiple sources discuss regulations, government actions, or policy shifts.

**Structure**:
1. **政策背景** — Why did these policies emerge? What problem are they solving?
2. **核心条款** — What do the policies actually say? (cite sources)
3. **影响范围** — Which industries/companies/regions are affected?
4. **执行现状** — How is enforcement playing out? Any early signals?
5. **未来预期** — What's likely to happen next?

### 产业链拆解 (Supply Chain Breakdown)

**Use when**: Sources cover different parts of a value chain (upstream/midstream/downstream).

**Structure**:
1. **链条全景** — Map the full chain from raw materials to end users
2. **各环节拆解** — Who controls each part? What's their role and margin?
3. **关键卡点** — Where are the bottlenecks or concentration risks?
4. **成本结构** — Where does the money flow? (if data available)
5. **变化趋势** — Is the chain shifting? (e.g., vertical integration, new entrants)

### 市场概览 (Market Overview)

**Use when**: Sources provide a broad view of a sector or trend, not drilling into one specific angle.

**Structure**:
1. **市场规模与增长** — How big? How fast is it growing? (cite sources)
2. **驱动因素** — What's pushing this market forward?
3. **主要玩家与格局** — Who's in the game?
4. **挑战与风险** — What could slow it down or derail it?
5. **未来方向** — Where is this heading in 1-3 years?

## Synthesis rules

### 1. Cite sources inline

Every claim that comes from a source must reference it inline. Use `[来源N]` notation:

> 根据来源1，某公司Q1营收同比增长35%，而来源2提到其竞争对手仅增长12%。

Do not write "据报道" or "有数据显示" — always name which source.

### 2. Reconcile conflicts

If sources contradict each other (different numbers, opposing claims), **surface the conflict explicitly**:

> 来源1称该政策将于6月生效，但来源3显示实际执行时间推迟至9月。目前尚无官方明确说法。

Do not pick one and ignore the other. Show the user what's uncertain.

### 3. Fill gaps transparently

If a key question (e.g., "成本结构") isn't covered by any source, say so:

> 各来源均未提及具体成本拆解，无法判断利润主要来自哪个环节。

Do not invent data. Transparency > completeness.

### 4. Distinguish fact from interpretation

Mark which parts are directly from sources vs. your synthesis:

- **来自来源的事实**: "来源2数据显示…"
- **综合判断**: "综合来看，这可能意味着…"（基于多个来源推导）
- **未确认的推测**: "如果这一趋势持续，可能会…"（明确标注为推测）

### 5. Keep structure tight

Each section should be 150-300 characters. If a section balloons beyond that, it's a sign you're restating sources instead of synthesizing. Summarize the pattern, cite the sources, move on.

## Output format

```
# [研究主题] 调研报告

**来源清单**:
1. [来源1标题或URL]
2. [来源2标题或URL]
...

---

## [第一部分标题]

[内容，150-300字，inline引用]

## [第二部分标题]

[内容，150-300字，inline引用]

...

---

**关键发现**:
- [3-5条核心takeaway，每条一句话]

**建议下一步**:
- 如需深度文章，可用 `jiaqi-article` 展开其中一个角度
- 如需快速分发，可用 `jiaqi-repurpose` 改编为小红书/朋友圈版本
```

Do not add commentary before or after this block.

## Process

1. **Collect inputs** — sources, research angle, report type, audience.
2. **Read all sources** — identify: key facts, conflicts, gaps, patterns across sources.
3. **Select structure** — based on report type (竞品/政策/产业链/市场).
4. **Write each section** — synthesize, cite inline, flag conflicts/gaps.
5. **Extract key findings** — 3-5 one-sentence takeaways that a busy reader can scan.
6. **Suggest next steps** — which skill to use next (jiaqi-article for deep dive, jiaqi-repurpose for distribution).
