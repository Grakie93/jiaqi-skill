---
name: jiaqi-format-text
description: Cleans up mixed Chinese-English text by inserting half-width spaces between CJK and Latin characters, normalizing punctuation, and collapsing redundant whitespace. Use it when the user pastes raw text and asks to "排版", "格式化", "format this", or similar requests about prose readability.
version: 0.1.0
---

# jiaqi-format-text

Reformats mixed Chinese-English prose so it follows the conventions used in well-typeset Chinese tech writing.

## When to trigger

Activate this skill when the user request matches any of:

- Pastes a block of mixed Chinese and English text and asks to "排版", "整理一下", "格式化", "format", "clean up".
- Mentions issues like "中英文之间没有空格", "标点全是半角的".
- Asks to "统一标点" or "fix punctuation" on Chinese text.

Do not activate when:

- The text is code. Use a code formatter instead.
- The user only wants translation, not formatting.

## Formatting rules

Apply the rules in this order. Do not add or remove meaning, only reformat.

### 1. Spacing between CJK and Latin

Insert a single half-width space between any adjacent CJK character and any Latin letter, digit, or `%`.

| Before | After |
|--------|-------|
| `今天用Python写了个脚本` | `今天用 Python 写了个脚本` |
| `准确率92%` | `准确率 92%` |
| `iPhone15发布了` | `iPhone 15 发布了` |

Exception: do not add a space between a CJK character and a punctuation mark.

### 2. Punctuation normalization

Inside a Chinese sentence, use full-width punctuation. Inside English-only sentences, use half-width punctuation.

| Context | Use |
|---------|-----|
| Chinese sentence | `，。！？：；""''（）` |
| English sentence | `, . ! ? : ; " ' ( )` |

A sentence is "Chinese" if it contains any CJK character, except when the punctuation appears inside an English clause that is fully wrapped in `""` or parentheses.

### 3. Whitespace collapsing

- Replace any run of 2+ spaces with a single space (except inside code fences).
- Trim trailing spaces on every line.
- Collapse 3+ consecutive blank lines into 2.

### 4. List markers

- Bullet lists use `- ` (hyphen + space).
- Ordered lists use `1.` `2.` `3.` (digit + period + space), not `1、` `2、`.
- One blank line before and after a list block.

### 5. Code spans and code blocks

- Inline code stays untouched. Do not touch content inside backticks.
- Code blocks (triple backtick) stay untouched.
- Outside code, surround inline code with half-width spaces from CJK on both sides: `用 \`grep\` 找一下`.

## Output format

Return the reformatted text as a fenced markdown block. Do not add commentary above or below unless the user explicitly asks why a change was made.

If the user pasted Markdown, preserve all Markdown syntax (headings, links, emphasis, tables) — only adjust spacing and punctuation inside text content.

## Examples

### Input

```text
今天用Python写了一个爬虫,效率提升了200%！代码里用了 requests   库, 然后用 BeautifulSoup 解析HTML.
```

### Output

```text
今天用 Python 写了一个爬虫，效率提升了 200%！代码里用了 requests 库，然后用 BeautifulSoup 解析 HTML。
```

## Process

1. Read the input text.
2. Apply rules 1 through 5 in order.
3. Return the reformatted result in a fenced block.
4. If anything was ambiguous (e.g. a sentence that's half English half Chinese with no clear primary language), flag the choice in one short line after the block.
