---
name: jiaqi-xhs-text
description: Writes a complete Xiaohongshu (Little Red Book) post from a persona and topic. Outputs a title with emoji, structured body copy split into sections matching the planned image count, hashtags, and a visual brief for each image. Use it when the user says "写小红书", "帮我写笔记", "小红书文案", "写一篇关于X的小红书", or provides a persona and topic and asks for social copy.
version: 0.1.0
---

# jiaqi-xhs-text

Generates a full Xiaohongshu post: title, body (one section per image), hashtags, and a visual brief that `jiaqi-xhs-image` can use directly to produce matching graphics.

## When to trigger

- User says "写小红书"、"帮我写一篇笔记"、"小红书文案"、"给我出个小红书"
- User provides a persona (e.g. "我是美妆博主") and a topic or keyword
- User asks to "write social copy" or "create a post" for a Chinese platform

Do not trigger when:

- The user wants WeChat articles, Twitter/X threads, or other platform formats
- The user only wants hashtags or a title — offer to write the full post instead

## User Input Tools

Before writing, collect these inputs. If the user already provided some in their message, skip those questions. Combine remaining questions into a single prompt rather than asking one by one.

Inputs to collect:

| Input | Description | Default |
|-------|-------------|---------|
| 人设 | Account persona/niche, e.g. "旅行博主", "极简生活" | Required |
| 主题/关键词 | Topic, product, or event to write about | Required |
| 语气 | Tone: 轻松 / 干货 / 种草 / 治愈 | 轻松 |
| 图片张数 | How many images (determines section count) | 3 |

Use the runtime's built-in user-input tool (e.g. `AskUserQuestion`, `request_user_input`). If unavailable, send a numbered list and ask the user to reply with their choices.

## EXTEND.md support

Check for an EXTEND.md file in the following order (first found wins):

1. `.jiaqi-skills/jiaqi-xhs-text/EXTEND.md` (project-level)
2. `$XDG_CONFIG_HOME/jiaqi-skills/jiaqi-xhs-text/EXTEND.md`
3. `~/.jiaqi-skills/jiaqi-xhs-text/EXTEND.md`

If found, read it and surface a one-line summary. EXTEND.md may override: default persona voice, banned words, default tone, preferred hashtag categories.

## Writing rules

### Title

- Length: ≤ 20 Chinese characters (not counting emojis)
- Start with 1-2 emojis that match the mood
- Use one of these hooks: question / contrast / number / curiosity gap
- Examples:
  - `✨ 素颜也能出门！我的5步早安护肤法`
  - `🌿 30天极简挑战，我扔掉了这些东西`

### Body

- Split into exactly N sections (N = image count)
- Each section: 80–150 Chinese characters
- First section = hook (draw them in, hint at the value)
- Middle sections = substance (tips, steps, story beats)
- Last section = call to action (save / try / share)
- Line breaks every 2–3 sentences for skimmability
- Use 1–2 emojis per section as visual punctuation, not decoration
- Tone guide:
  - 轻松：conversational, first-person "我", light humor
  - 干货：numbered steps, concrete data, no fluff
  - 种草：sensory details, "你一定要试试", emotional payoff
  - 治愈：slow pace, soft imagery, comforting affirmations

### Hashtags

- 5–8 tags total
- Mix: 2–3 broad traffic tags (e.g. `#生活方式`) + 2–3 niche tags + 1 branded/personal tag
- No spaces inside a tag
- Format: `#tag` separated by spaces

### Visual brief

One line per image, written as a concise scene description for the image generator. Keep it visual, not conceptual.

- Good: `暖光咖啡桌，马克杯旁摆着一本翻开的书，莫兰迪色调`
- Bad: `代表放松和自我提升的概念图`

## Output format

Return the post in this exact structure (use these exact headers):

```
【标题】
<title with emojis>

【正文】
<section 1>

<section 2>

<section 3>
...

【话题标签】
#tag1 #tag2 #tag3 ...

【配图方向】
图1：<visual brief>
图2：<visual brief>
图3：<visual brief>
...
```

Do not add any commentary before or after this block.

## Process

1. **Collect inputs** — ask for any missing required fields using a single combined prompt.
2. **Check EXTEND.md** — apply any persona overrides or banned words.
3. **Plan structure** — decide the narrative arc for N sections before writing.
4. **Write and output** — produce the full post in the format above. The 【配图方向】section feeds directly into `jiaqi-xhs-image`.
