import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");
const navMatch = html.match(/<nav class="tabs">([\s\S]*?)<\/nav>/);

assert.ok(navMatch, "main tabs nav is missing");

const navHtml = navMatch[1];
const tabTargets = [...navHtml.matchAll(/showView\('([^']+)'/g)].map(match => match[1]);

assert.deepEqual(tabTargets, ["today", "approvals", "link", "tracker"], "main tabs must stay simple: today, approvals, link, tracker");
assert.ok(navHtml.includes("🔥 오늘"), "today tab label is missing");
assert.ok(navHtml.includes("🔐 승인"), "approval tab label is missing");
assert.ok(navHtml.includes("🔗 가입"), "signup tab label is missing");
assert.ok(navHtml.includes("📊 결과"), "result tab label is missing");
assert.ok(!navHtml.includes("workers"), "AI 업무판 should not be a top-level tab");
assert.ok(!navHtml.includes("content"), "content draft should not be a top-level tab");

console.log("Simple main tabs OK: today, approvals, link, tracker");
