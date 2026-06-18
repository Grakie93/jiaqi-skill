---
name: jiaqi-repurpose
description: Repurposes a long-form article or piece of writing into platform-specific formats: Xiaohongshu note, WeChat Moments post, Weibo, X/Twitter thread, or LinkedIn article. Preserves the original argument and tone while adapting length, structure, and style to each platform's norms. Use it when the user says "帮我分发", "改成小红书", "发朋友圈版本", "出推特帖子", "改成微博", or pastes an article and asks to adapt it for another platform.
version: 0.1.0
---

# jiaqi-repurpose

Takes a completed article (e.g. from `jiaqi-article`) and produces ready-to-post versions for one or more platforms. Output formats are designed to chain directly into other skills: the Xiaohongshu output matches `jiaqi-xhs-text`'s structure so `jiaqi-xhs-image` can pick it up immediately.

## When to trigger

- User pastes an article and says "帮我改成X平台的版本"
- User says "帮我分发"、"出朋友圈文案"、"改成小红书"、"发微博"、"出推特thread"
- User just ran `jiaqi-article` and wants to distribute across platforms

Do not trigger when:

- The user only wants a summary without platform-specific formatting — just summarize directly
- The source content is shorter than 300 characters — offer to adapt it but note it may be thin

## User Input Tools

Collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 原文 | The article or content to repurpose | Required |
| 目标平台 | One or more: 小红书 / 朋友圈 / 微博 / X(Twitter) / LinkedIn | 全部 |
| 语气调整 | Any tone shift from the original (e.g. "更轻松一点") | 继承原文 |

## Platform specs

### 小红书

Follow all rules from `jiaqi-xhs-text`. Output format must match exactly so `jiaqi-xhs-image` can use it directly:

- Title: ≤ 20 Chinese characters, 1–2 leading emojis, hook-style opener
- Body: 3 sections, each 80–150 characters, first = hook, last = CTA
- Hashtags: 5–8 tags, mix broad + niche
- 海报风格建议: one line per section (style note, not scene description)

```
【标题】
【正文】
【话题标签】
【海报风格建议】
```

### 朋友圈

- Length: 100–180 Chinese characters
- No hashtags (WeChat Moments doesn't use them)
- 1–2 emojis, placed naturally — not stacked at the end
- End with a question or observation that invites comments
- Tone: personal and reflective, as if sharing a thought with friends
- Do not restate the entire article — pick one insight and make it resonate

### 微博

Two modes depending on depth:
- **短微博**: ≤ 140 characters + 1–2 hashtags in `#话题#` format. Punchy, shareable.
- **长微博**: 500–1500 characters. Mini article format. Use when source content is dense analysis.

Default to 短微博 unless user specifies otherwise or the source has 5+ key points worth preserving.

### X / Twitter thread

- 5–8 tweets, numbered `1/N` through `N/N`
- Each tweet: ≤ 280 characters (English) or ≤ 120 characters (Chinese)
- Tweet 1: counterintuitive hook or key finding — must stand alone as the reason to read on
- Tweets 2–(N-1): one point per tweet, concrete and specific
- Tweet N: conclusion + one actionable takeaway or question
- No filler transitions ("So...", "In conclusion...")
- Write in the same language as the source unless user requests translation

### LinkedIn

- Language: English (translate from Chinese source)
- Length: 400–700 words
- Structure: opening hook → context → 3–4 key insights → conclusion with professional relevance
- Tone: thoughtful and professional, not formal or stiff
- 3–5 English hashtags at the end
- First line must work as a standalone hook (LinkedIn shows only the first line before "see more")

## Output format

Separate each platform's output with a clear header:

```
---
## 小红书版本

【标题】
...

【正文】
...

【话题标签】
...

【海报风格建议】
...

---
## 朋友圈版本

...

---
## 微博版本

...
```

If only one platform was requested, skip the headers and output the content directly.

Do not add commentary between sections. Do not summarize what you did.

## Process

1. **Collect inputs** — ask for the article and which platforms in one combined prompt if anything is missing.
2. **Read the source** — identify the core argument, 3–5 key supporting points, and the original tone.
3. **Generate in platform order**: 小红书 → 朋友圈 → 微博 → X thread → LinkedIn
4. **Output all requested platforms** in the format above.
5. **Offer next step**: if 小红书 was included, remind the user they can say "帮我把小红书版本出成海报图" to feed it into `jiaqi-xhs-image`.
