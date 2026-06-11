#!/usr/bin/env bun
import { writeFileSync } from "node:fs";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

interface Args {
  url: string;
  output: string;
  raw: boolean;
  withFrontmatter: boolean;
  timeoutMs: number;
  help: boolean;
}

function parseArgs(argv: string[]): Args {
  const a: Args = {
    url: "",
    output: "",
    raw: false,
    withFrontmatter: false,
    timeoutMs: 30000,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "-h" || x === "--help") a.help = true;
    else if (x === "-o" || x === "--output") a.output = argv[++i] ?? "";
    else if (x === "--raw") a.raw = true;
    else if (x === "--frontmatter") a.withFrontmatter = true;
    else if (x === "--timeout") a.timeoutMs = Number(argv[++i] ?? 30000);
    else if (!a.url && !x.startsWith("-")) a.url = x;
  }
  return a;
}

function help() {
  process.stdout.write(
    [
      "Usage: bun main.ts <url> [options]",
      "",
      "Fetches a URL, extracts the main content, returns Markdown.",
      "",
      "Options:",
      "  -o, --output <file>   Write Markdown to file (default: stdout)",
      "      --raw             Skip readability, convert full <body>",
      "      --frontmatter     Prepend YAML frontmatter (title, url, fetched_at)",
      "      --timeout <ms>    Network timeout (default 30000)",
      "  -h, --help            Show this help",
      "",
    ].join("\n"),
  );
}

async function fetchHtml(url: string, timeoutMs: number): Promise<string> {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("only http(s) URLs are supported");
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 jiaqi-skill/0.1",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function extractContent(html: string, url: string, raw: boolean) {
  const dom = new JSDOM(html, { url });
  if (raw) {
    return {
      title: dom.window.document.title || "",
      contentHtml: dom.window.document.body?.innerHTML ?? "",
      excerpt: "",
      byline: "",
    };
  }
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.content) {
    return {
      title: dom.window.document.title || "",
      contentHtml: dom.window.document.body?.innerHTML ?? "",
      excerpt: "",
      byline: "",
    };
  }
  return {
    title: article.title ?? dom.window.document.title ?? "",
    contentHtml: article.content,
    excerpt: article.excerpt ?? "",
    byline: article.byline ?? "",
  };
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
  });
  td.addRule("strikethrough", {
    filter: ["del", "s"],
    replacement: (c) => `~~${c}~~`,
  });
  return td.turndown(html);
}

function buildFrontmatter(opts: { title: string; url: string; byline: string }) {
  const lines = [
    "---",
    `title: ${JSON.stringify(opts.title)}`,
    `url: ${opts.url}`,
  ];
  if (opts.byline) lines.push(`byline: ${JSON.stringify(opts.byline)}`);
  lines.push(`fetched_at: ${new Date().toISOString()}`);
  lines.push("---", "");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.url) {
    help();
    if (!args.url && !args.help) process.exit(2);
    return;
  }
  const html = await fetchHtml(args.url, args.timeoutMs);
  const ext = extractContent(html, args.url, args.raw);
  const md = htmlToMarkdown(ext.contentHtml).trim();
  const head = args.withFrontmatter
    ? buildFrontmatter({ title: ext.title, url: args.url, byline: ext.byline })
    : ext.title
      ? `# ${ext.title}\n\n`
      : "";
  const out = head + md + "\n";
  if (args.output) {
    writeFileSync(args.output, out, "utf8");
    process.stdout.write(`wrote ${args.output} (${out.length} chars)\n`);
  } else {
    process.stdout.write(out);
  }
}

main().catch((e) => {
  process.stderr.write(`error: ${e?.message ?? e}\n`);
  process.exit(1);
});
