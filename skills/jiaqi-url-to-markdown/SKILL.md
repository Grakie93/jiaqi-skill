---
name: jiaqi-url-to-markdown
description: Fetches a web page and converts the main article content to clean Markdown, stripping nav, ads, and sidebars via Mozilla Readability. Use it when the user shares a URL and asks to "save as markdown", "convert this article", "抓一下这个网页", "把这个链接转成 markdown", or wants the article body fed back to the model for summarization.
version: 0.1.0
---

# jiaqi-url-to-markdown

Downloads a web page and returns its main content as Markdown. Cleans away navigation, ads, related-article modules, and footers. Useful for note-taking, article archiving, or piping clean text into another model step.

## When to trigger

- The user provides a URL and says: "save as markdown", "转成 markdown", "存档这篇文章", "抓取这个链接", "convert this article".
- The user wants to summarize a long article and asks the model to "read" it.
- The user is building a knowledge base and pastes a list of URLs to ingest.

Do not trigger when:

- The URL is a video / image / binary file.
- The user only wants the title or a short snippet (use a simpler fetch instead).
- The page is behind authentication; the script does not handle login.

## Script Directory

The script for this skill lives at `{baseDir}/scripts/main.ts`, where `{baseDir}` is the absolute path of this skill's directory.

First-time setup (once per machine):

```bash
cd <repo-root>
bun install     # or: npm install
```

Resolve the runtime once per session:

1. If `bun` is on `PATH`, set `BUN_X=bun`.
2. Otherwise set `BUN_X="npx -y bun"`.

Invoke:

```bash
${BUN_X} {baseDir}/scripts/main.ts <url> [options]
```

Options:

- `-o, --output <file>` — write Markdown to a file instead of stdout.
- `--raw` — skip Readability extraction, convert the full `<body>`.
- `--frontmatter` — prepend YAML frontmatter (`title`, `url`, `fetched_at`).
- `--timeout <ms>` — network timeout (default 30000).

## Process

1. Confirm the URL starts with `http://` or `https://`. Reject other schemes.
2. Choose mode:
   - Default: Readability extraction (best for articles).
   - `--raw`: keep full body (best for docs pages, simple homepages).
3. Choose output target:
   - Inline / next step → stdout.
   - Save to disk → `--output <path>`. Default save location is `{cwd}/<slugified-title>.md` if the user didn't specify.
4. Add `--frontmatter` when the user is building an archive or wants metadata; omit for one-shot conversions.
5. Pass the resulting Markdown back; if the user asked for a summary, call the next step on the captured Markdown rather than re-fetching.

## Examples

### Quickest one-liner

```bash
${BUN_X} {baseDir}/scripts/main.ts https://example.com/article
```

### Save with metadata

```bash
${BUN_X} {baseDir}/scripts/main.ts \
  https://example.com/article \
  --frontmatter \
  --output ~/notes/article.md
```

### Pipe into a summarizer

```bash
${BUN_X} {baseDir}/scripts/main.ts https://example.com/article | \
  pbcopy
```

## Output rules

- Default: print Markdown to stdout, with the article title as a top-level `#` heading on the first line.
- If the page has no extractable article content, the script falls back to converting the full `<body>` and emits a warning to stderr.
- Image and link URLs are left absolute (resolved against the source page).
- Code blocks and tables are preserved.

## Failure handling

- 4xx / 5xx → exits with code 1, error printed to stderr.
- Timeout → exits with code 1, error message contains the timeout value.
- Non-HTML content type → script will still try to convert, but result is unreliable; warn the user.
