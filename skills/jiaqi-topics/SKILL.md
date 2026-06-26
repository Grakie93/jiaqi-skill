---
name: jiaqi-topics
description: Generates multiple content topic ideas with angles and reasoning from a single theme or event. Use it when the user says "给我出几个选题", "这个主题可以写什么", "帮我想选题", "XX活动能做哪些内容", or provides a theme and needs content direction before writing.
version: 0.1.0
---

# jiaqi-topics

Takes a theme, event, or keyword and returns a set of ready-to-use topic ideas. Each topic comes with a specific angle, the reason it would resonate, and a recommendation for which skill to use to write it.

Designed to be the first step before `jiaqi-article`, `jiaqi-xhs-text`, or `jiaqi-xhs-persona`.

## When to trigger

- User says "给我出几个选题"、"帮我想内容方向"、"XX可以写哪些"、"这个活动/主题能做什么内容"
- User has a theme but hasn't decided what angle to take
- User wants multiple options before committing to writing

Do not trigger when:

- The user already has a clear topic and wants to write it — go directly to the writing skill
- The user wants a content calendar (multiple weeks) — that's a different scope

## User Input Tools

Collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 主题 / 活动 | The theme, event, product, or keyword to brainstorm around | Required |
| 目标平台 | Where the content will be published | 不限 |
| 目标读者 | Who you're writing for | 通用 |
| 选题数量 | How many topics to generate | 6 |

## Topic generation rules

Every batch of topics must cover at least these five angles. Generate more by varying the sub-angle within each type:

| 角度类型 | 说明 | 示例切入 |
|---------|------|---------|
| 反直觉 | 挑战常见假设，给读者"没想到"感 | "大家都以为X，但数据说的是Y" |
| 实操干货 | 可以直接照着做的步骤或清单 | "5个方法 / 手把手教你 / 避坑指南" |
| 情绪共鸣 | 触发读者真实感受，引发分享欲 | "你有没有过这种感受…" |
| 宏观分析 | 放在产业/政策/市场背景下看 | "这件事背后的逻辑是…" |
| 人群视角 | 从特定人群出发看同一主题 | "对XX来说，这意味着什么" |

**多样性规则**：
- 同一批选题中，标题句式不能重复（不能都是疑问句）
- 受众视角要有变化（初学者 / 从业者 / 决策者 至少覆盖两种）
- 时间跨度要有变化（当下热点 / 中期趋势 / 长期逻辑 至少覆盖两种）

## Output format

```
## 选题 N：[直接可用的标题，带句式特色]

**角度**：[一句话说清楚切入点]

**为什么这个选题好**：[2-3句话，说明受众共鸣点、时效性、或差异化优势]

**适合形式**：深度文章 / 小红书种草 / 小红书干货 / 小红书人设

**推荐 skill**：`jiaqi-article` / `jiaqi-xhs-text` / `jiaqi-xhs-persona`（人设类型）
```

所有选题连续输出，中间用 `---` 分隔。最后加一行：

> 💡 选好选题后，直接告诉我"用选题N写"，我会调用对应 skill 开始写作。

## Process

1. **Collect inputs** — ask for theme, platform, audience, count in one prompt if anything is missing.
2. **Generate topic matrix** — internally map the theme across the five angle types and the three time horizons to find the strongest combinations.
3. **Select the best N** — keep diversity high; drop any topic that's too similar to another in the same batch.
4. **Output** — present all topics in the format above.
5. **Wait for selection** — when the user picks a topic, immediately invoke the recommended skill for that topic.
