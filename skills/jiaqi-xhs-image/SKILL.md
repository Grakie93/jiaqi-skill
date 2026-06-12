---
name: jiaqi-xhs-image
description: Turns each section of a Xiaohongshu post into a poster-style note image with the text rendered directly inside, in a 3:4 vertical format ready to publish. Use it when the user asks to "帮我出笔记图", "把这段文案做成海报", "生成小红书内页图", "出图", or after jiaqi-xhs-text produces body sections and the user wants each section turned into a poster image.
version: 0.1.1
---

# jiaqi-xhs-image

Generates vertical (3:4) poster-note images where **the post copy is rendered as part of the image itself** — styled like a Xiaohongshu note card. Takes the body sections from `jiaqi-xhs-text` (or any text the user provides) and produces one poster image per section, ready to upload.

> **Note on Chinese text rendering**: Image AI models can occasionally misrender Chinese characters. If any text looks garbled, regenerate that image once or twice — it usually corrects itself.

## When to trigger

- User says: "帮我出笔记图"、"把这段文案做成海报"、"生成内页图"、"出图"、"配图"
- User just ran `jiaqi-xhs-text` and wants the body sections turned into images
- User provides a block of text and asks to make it into a note-style image

Do not trigger when:

- The user only wants a plain background illustration with no text in it
- No API key is configured — tell the user which key to set first

## User Input Tools

Before calling the script, confirm these inputs. If they were already provided, skip. Combine into a single prompt if multiple inputs are missing.

| Input | Description | Default |
|-------|-------------|---------|
| 内容文字 | The text to render — one section from 【正文】per image | Required |
| 风格 | warm / minimal / bold | warm |
| 保存路径 | Where to save the file(s) | `./xhs-poster-01.png` in current dir |

Style guide:

- **warm** — creamy/off-white background, hand-drawn decorative elements, warm serif or rounded font feel; best for beauty, food, daily life
- **minimal** — pure white or light grey background, thin line accents, clean sans-serif layout; best for productivity, fashion, lifestyle tips
- **bold** — vibrant gradient or color-block background, geometric accents, high contrast; best for travel, promotions, punchy statements

## EXTEND.md support

Check for EXTEND.md in this order (first found wins):

1. `.jiaqi-skills/jiaqi-xhs-image/EXTEND.md` (project-level)
2. `$XDG_CONFIG_HOME/jiaqi-skills/jiaqi-xhs-image/EXTEND.md`
3. `~/.jiaqi-skills/jiaqi-xhs-image/EXTEND.md`

EXTEND.md may override: `preferred_platform` (dashscope / openai / replicate), default style, custom prompt suffix.

## Script Directory

The script lives at `{baseDir}/scripts/main.ts`.

**API key setup** (set one in your shell environment or `.env`):

| Platform | Environment variable | Sign up |
|----------|---------------------|---------|
| DashScope (阿里云) | `DASHSCOPE_API_KEY` | dashscope.aliyun.com |
| OpenAI | `OPENAI_API_KEY` | platform.openai.com |
| Replicate | `REPLICATE_API_TOKEN` | replicate.com |

Priority: DashScope → OpenAI → Replicate. The script uses the first key it finds.

Resolve the runtime once per session:

1. If `bun` is on PATH, set `BUN_X=bun`.
2. Otherwise set `BUN_X="npx -y bun"`.

Invoke:

```bash
${BUN_X} {baseDir}/scripts/main.ts \
  --prompt "<scene description>" \
  --style warm \
  --count 3 \
  --output ./images/xhs-image.png
```

Options:

- `-p, --prompt <text>` — image description (required)
- `-s, --style <style>` — warm / minimal / bold (default: warm)
- `-n, --count <n>` — number of images, max 4 (default: 1)
- `-o, --output <path>` — save path; multi-image appends `-01`, `-02`…

## Poster prompt template

For each section, build the prompt using this template:

```
小红书风格笔记海报，竖版3:4比例，图片中央清晰排版以下文字：
"{段落文字}"
背景风格：{style_description}
文字清晰可读，字体与背景协调，精致排版，高质量
```

Style descriptions to substitute:

- **warm**: 奶油色暖调背景，手绘风格装饰小元素，温馨氛围
- **minimal**: 纯白或浅灰背景，细线条装饰，简洁现代排版
- **bold**: 鲜明渐变色块背景，几何装饰元素，视觉冲击力强

## Process

1. **Check EXTEND.md** — apply any platform, style, or prompt-suffix overrides.
2. **Extract text sections** — if coming from `jiaqi-xhs-text`, take each paragraph from 【正文】as one image's content. If the user provides text directly, split by the natural paragraph breaks.
3. **Collect remaining inputs** — style and save path in a single question if missing.
4. **Build one prompt per section** — fill the template above with the section text and style description.
5. **Run the script** — call once per section, passing `--prompt` and `--output` with an incremented filename (`xhs-poster-01.png`, `xhs-poster-02.png`…).
6. **Report results** — list saved paths. If any image has garbled text, offer to regenerate just that one.
