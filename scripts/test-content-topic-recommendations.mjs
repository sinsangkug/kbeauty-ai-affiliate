import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");

assert.ok(html.includes('id="contentTopicSummary"'), "content topic summary is missing");
assert.ok(html.includes('id="contentTopicSuggestions"'), "content topic suggestion list is missing");
assert.ok(html.includes("아직 클릭·구매가 없을 때 올릴 주제 5개"), "no-signal topic card headline is missing");
assert.ok(html.includes("const noSignalContentTopics = ["), "no-signal topic source list is missing");
assert.ok(html.includes("function contentTopicAdvice()"), "content topic advice function is missing");
assert.ok(html.includes("function renderContentTopicSuggestions()"), "content topic renderer is missing");
assert.ok(html.includes("function copyContentTopicSuggestions()"), "content topic copy action is missing");
assert.ok(html.includes("renderContentTopicSuggestions();"), "content topic renderer must run with campaign rendering");
assert.ok(html.includes("아직 클릭·구매 신호가 없습니다."), "zero-click zero-purchase guidance is missing");
assert.ok(html.includes("COSRX 중심 콘텐츠 5개"), "beginner guidance must keep the first product focused");

console.log("Content topic recommendations OK: 5 no-signal topics");
