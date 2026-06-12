---
name: jiaqi-xhs-image
description: Generates Xiaohongshu-style vertical images (3:4) from a text prompt and style preset, using whichever image API key the user has configured (DashScope, OpenAI, or Replicate). Use it when the user asks to "生成内页图", "帮我出配图", "生成小红书图片", or after jiaqi-xhs-text produces a 【配图方向】section and the user wants to turn those briefs into actual images.
version: 0.1.0
---

# jiaqi-xhs-image

Generates vertical (3:4) images in a Xiaohongshu visual style. Works with whatever API key the user has set up — DashScope, OpenAI DALL-E 3, or Replicate. Automatically detects which key is available.

## When to trigger

- User says: "生成内页图"、"帮我出图"、"配图"、"生成小红书图片"、"把配图方向变成图"
- User just finished running `jiaqi-xhs-text` and the output includes a 【配图方向】section
- User provides a visual scene description and asks for an image

Do not trigger when:

- The user wants a cover image with text/title overlaid (that requires design tools, not just image generation)
- No API key is configured — tell the user which key to set first

## User Input Tools

Before calling the script, confirm these inputs. If the user already provided them, skip those questions. Combine into a single prompt if multiple inputs are needed.

| Input | Description | Default |
|-------|-------------|---------|
| 图片描述 | The scene description (use 【配图方向】from jiaqi-xhs-text if available) | Required |
| 风格 | warm / minimal / bold | warm |
| 张数 | How many images (1–4) | matches image count from jiaqi-xhs-text, else 1 |
| 保存路径 | Where to save the file(s) | `./xhs-image-01.png` in current dir |

Style guide:

- **warm** — soft lighting, pastel tones, cozy lifestyle feel (best for beauty, food, daily life)
- **minimal** — clean backgrounds, simple composition, muted palette (best for productivity, fashion)
- **bold** — vivid colors, strong contrast, graphic pop (best for travel, events, promotions)

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

## Process

1. **Check EXTEND.md** — apply any platform or style overrides.
2. **Collect inputs** — confirm prompt, style, count, output path in a single question if anything is missing.
3. **Build one prompt per image** — take the scene description from user or from 【配图方向】, append the style descriptor. For multi-image runs, keep prompts thematically consistent but vary the composition (close-up / mid-shot / wide).
4. **Run the script** — call once per image (or use `--count` for batch). Wait for each to complete.
5. **Report results** — list saved file paths. Offer to regenerate any image the user isn't happy with.

## Prompt writing tips

For best results with Chinese lifestyle content, describe:

- **Subject** — what the main object/person is doing
- **Setting** — indoor/outdoor, specific location
- **Lighting** — natural light, golden hour, soft studio
- **Color mood** — match the tone of the post (warm oranges for autumn, cool greens for lifestyle)

Example prompt feeding from jiaqi-xhs-text 【配图方向】:

> 暖光咖啡桌，马克杯旁摆着一本翻开的书，秋叶散落，莫兰迪棕色调

→ Pass this directly as `--prompt`.
