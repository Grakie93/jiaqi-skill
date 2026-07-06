---
name: jiaqi-comment
description: Generates replies to comments on Xiaohongshu posts or WeChat public account articles. Replies are grounded in the user's original post/article content and adapt to one of six persona voices if specified. Use it when the user says "帮我回复这条评论", "怎么回这个", pastes a comment and asks for a response, or provides comment text + original post context.
version: 0.1.0
---

# jiaqi-comment

Produces comment replies that feel human, stay on-brand, and are grounded in what you actually said in the original post. Each reply references specific content from your post so your judgment on risks/opportunities/nuances is credible, not generic.

Supports the same six persona voices from `jiaqi-xhs-persona` for consistent account tone.

## When to trigger

- User says "帮我回复"、"怎么回这条评论"、"回复一下"
- User pastes a comment (with or without the original post context) and asks what to say
- User mentions "评论区" and wants response suggestions

Do not trigger when:

- The user only wants to read comments or analyze sentiment — just summarize directly
- The comment is spam or clearly malicious — offer to ignore/report instead of engaging

## User Input Tools

Collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 评论内容 | The comment text to reply to | Required |
| 原文/原帖 | The original post or article the comment is on — critical for grounding the reply | Ask if not provided |
| 人设类型 | One of six personas, or "通用友好型" | 通用友好型 |
| 回复长度 | short (≤30 字) / medium (30-80 字) / long (80-150 字) | medium |

**Why "原文" is required**: A reply without the original post context will be vague and generic ("感谢支持!"）. The best replies quote or paraphrase something from your original post to show you're actually engaging with what the commenter said.

If the user only provides the comment and not the original post, **ask for it before replying**. Say: "能把原帖内容也给我吗？这样回复会更有针对性。"

## Reply quality rules

### 1. Ground every reply in the original post

Reference specific points from the original post when replying. This makes your stance credible.

Bad (generic):
> 评论："降息对房价有影响吗？"
> 回复："会有一定影响的，可以关注一下。"

Good (grounded):
> 评论："降息对房价有影响吗？"
> 回复："会的，我文里提到的'资金成本下降会传导到按揭利率'就是这个逻辑，短期刺激需求，但要看供给端政策配不配合。"

The second reply shows you're answering from what you actually wrote, not guessing.

### 2. Match the comment's engagement level

If the comment is:
- **A question** → Answer directly, cite your post if relevant
- **A disagreement** → Acknowledge their point, then clarify your reasoning with evidence from your post
- **Sharing personal experience** → Respond to their story specifically, connect it back to your post's theme
- **Simple praise ("写得好!")** → Thank them briefly, optionally highlight one point from your post they might have missed

### 3. Persona voice applies to replies too

If a persona is specified, the reply must follow that persona's language rules from `jiaqi-xhs-persona`:

- **专业靠谱型**: cite data or steps from your post, stay precise
- **温柔贴心型**: empathize first, then gently guide to your post's point
- **爽快高效型**: one-sentence direct answer, no filler
- **生活顾问型**: relate their comment to a real-world scenario from your post
- **理财达人型**: frame your reply in market logic terms
- **热心资源型**: offer to follow up or connect them to something

If no persona specified, use **通用友好型**: warm but not overly familiar, clear but not blunt, helpful without over-explaining.

### 4. Length discipline

- **short (≤30 字)**: For praise, simple agreement, or when the comment doesn't need elaboration
- **medium (30-80 字)**: Most replies — answer the question, reference your post, stay concise
- **long (80-150 字)**: For complex questions, disagreements that need careful clarification, or when the commenter shared a detailed story

Default to medium. Go short when the comment is light. Go long only when the situation truly requires it.

### 5. What NOT to do

- ❌ "感谢支持！"（empty gratitude with no substance）
- ❌ Restating the entire original post in reply form — the commenter already read it
- ❌ Defensive or dismissive tone when facing disagreement
- ❌ Over-selling or pushing the commenter to take an action unless they asked for next steps
- ❌ Generic advice that could apply to any post ("多关注就好了"）

## EXTEND.md support

Check for EXTEND.md in this order (first found wins):

1. `.jiaqi-skills/jiaqi-comment/EXTEND.md` (project-level)
2. `~/.jiaqi-skills/jiaqi-comment/EXTEND.md`

EXTEND.md may override: default persona, banned phrases (e.g. compliance-sensitive industries), signature closing line, auto-append disclaimer for specific topics.

## Output format

Output the reply text directly, ready to paste. No extra commentary, no "这样回复：" prefix.

If the comment requires clarification before you can reply well (ambiguous, or missing original post), say so and ask.

## Process

1. **Collect inputs** — comment text, original post, persona, length. If original post is missing, stop and ask for it.
2. **Read the comment type** — question / disagreement / personal story / praise?
3. **Find the anchor point** — which part of the original post is most relevant to this comment?
4. **Apply persona rules** if specified, otherwise use 通用友好型.
5. **Write the reply** — grounded, concise, matching engagement level and length constraint.
6. **Check** — does this reply reference something specific from the original post? If not, revise.
