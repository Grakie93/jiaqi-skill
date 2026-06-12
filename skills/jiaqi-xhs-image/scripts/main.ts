#!/usr/bin/env bun
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

interface Args {
  prompt: string;
  style: string;
  output: string;
  count: number;
  help: boolean;
}

const STYLES: Record<string, string> = {
  warm: "warm tones, soft lighting, cozy atmosphere, pastel colors, lifestyle photography style",
  minimal: "minimalist, clean white background, simple composition, muted palette, modern aesthetic",
  bold: "vivid colors, strong contrast, graphic design style, eye-catching composition",
};

function parseArgs(argv: string[]): Args {
  const a: Args = { prompt: "", style: "warm", output: "", count: 1, help: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "-h" || x === "--help") a.help = true;
    else if (x === "--prompt" || x === "-p") a.prompt = argv[++i] ?? "";
    else if (x === "--style" || x === "-s") a.style = argv[++i] ?? "warm";
    else if (x === "--output" || x === "-o") a.output = argv[++i] ?? "";
    else if (x === "--count" || x === "-n") a.count = Math.min(4, Math.max(1, Number(argv[++i] ?? 1)));
    else if (!a.prompt && !x.startsWith("-")) a.prompt = x;
  }
  return a;
}

function detectPlatform(): { platform: string; key: string } | null {
  if (process.env.DASHSCOPE_API_KEY) return { platform: "dashscope", key: process.env.DASHSCOPE_API_KEY };
  if (process.env.OPENAI_API_KEY) return { platform: "openai", key: process.env.OPENAI_API_KEY };
  if (process.env.REPLICATE_API_TOKEN) return { platform: "replicate", key: process.env.REPLICATE_API_TOKEN };
  return null;
}

function buildPrompt(userPrompt: string, style: string): string {
  const styleDesc = STYLES[style] ?? STYLES.warm;
  return `${userPrompt}, ${styleDesc}, xiaohongshu style, vertical format 3:4, high quality`;
}

async function generateDashScope(prompt: string, key: string, count: number): Promise<string[]> {
  const res = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-DashScope-Async": "enable" },
    body: JSON.stringify({
      model: "wanx-v1",
      input: { prompt },
      parameters: { n: count, size: "768*1024" },
    }),
  });
  if (!res.ok) throw new Error(`DashScope error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { output: { task_id: string } };
  const taskId = data.output.task_id;

  // poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const pollData = (await poll.json()) as { output: { task_status: string; results?: { url: string }[] } };
    if (pollData.output.task_status === "SUCCEEDED") {
      return (pollData.output.results ?? []).map((r) => r.url);
    }
    if (pollData.output.task_status === "FAILED") throw new Error("DashScope task failed");
  }
  throw new Error("DashScope timed out after 90s");
}

async function generateOpenAI(prompt: string, key: string, count: number): Promise<string[]> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "dall-e-3", prompt, n: Math.min(count, 1), size: "1024x1792", quality: "standard" }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data: { url: string }[] };
  return data.data.map((d) => d.url);
}

async function generateReplicate(prompt: string, key: string, count: number): Promise<string[]> {
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt, num_outputs: count, aspect_ratio: "3:4" } }),
  });
  if (!res.ok) throw new Error(`Replicate error ${res.status}: ${await res.text()}`);
  const pred = (await res.json()) as { id: string; urls: { get: string } };

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${key}` } });
    const data = (await poll.json()) as { status: string; output?: string[] };
    if (data.status === "succeeded") return data.output ?? [];
    if (data.status === "failed") throw new Error("Replicate prediction failed");
  }
  throw new Error("Replicate timed out after 60s");
}

async function downloadImage(url: string, path: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const buf = await res.arrayBuffer();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(buf));
}

function help() {
  process.stdout.write(
    [
      "Usage: bun main.ts --prompt <text> [options]",
      "",
      "Generates Xiaohongshu-style images using the first available API key.",
      "Set one of: DASHSCOPE_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN",
      "",
      "Options:",
      "  -p, --prompt <text>    Image description (required)",
      "  -s, --style <style>    warm | minimal | bold  (default: warm)",
      "  -n, --count <n>        Number of images, max 4  (default: 1)",
      "  -o, --output <path>    Save path (default: ./xhs-image-01.png)",
      "  -h, --help             Show this help",
      "",
    ].join("\n"),
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.prompt) { help(); if (!args.prompt) process.exit(2); return; }

  const platform = detectPlatform();
  if (!platform) {
    process.stderr.write(
      "error: no API key found.\nSet one of: DASHSCOPE_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN\n",
    );
    process.exit(1);
  }

  const fullPrompt = buildPrompt(args.prompt, args.style);
  process.stdout.write(`using ${platform.platform}, generating ${args.count} image(s)...\n`);

  let urls: string[];
  if (platform.platform === "dashscope") urls = await generateDashScope(fullPrompt, platform.key, args.count);
  else if (platform.platform === "openai") urls = await generateOpenAI(fullPrompt, platform.key, args.count);
  else urls = await generateReplicate(fullPrompt, platform.key, args.count);

  const results: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const outPath = args.output
      ? urls.length === 1 ? args.output : args.output.replace(/(\.\w+)$/, `-${String(i + 1).padStart(2, "0")}$1`)
      : `./xhs-image-${String(i + 1).padStart(2, "0")}.png`;
    await downloadImage(urls[i], outPath);
    results.push(outPath);
    process.stdout.write(`saved: ${outPath}\n`);
  }

  process.stdout.write(JSON.stringify({ status: "ok", files: results }) + "\n");
}

main().catch((e) => {
  process.stderr.write(`error: ${e?.message ?? e}\n`);
  process.exit(1);
});
