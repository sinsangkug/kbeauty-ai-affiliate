import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");

assert.ok(html.includes('class="first-screen-details" id="firstScreenRevenueDetails"'), "revenue detail section must be collapsed on first screen");
assert.ok(html.includes('class="first-screen-details beginner-extra" id="firstScreenRuleDetails"'), "rule detail section must be collapsed on first screen");
assert.ok(html.includes("💡 돈 버는 구조 자세히 보기"), "revenue detail summary is missing");
assert.ok(html.includes("🚦 해도 되는 일 / 멈출 일 자세히 보기"), "rule detail summary is missing");
assert.ok(html.includes(".first-screen-details summary"), "collapsed first-screen detail styling is missing");
assert.ok(!html.includes('<div class="traffic-board beginner-extra">'), "traffic board should not be fully expanded on the first screen");
assert.ok(html.includes("고객이 제휴 링크로 직접 구매하면 상국님에게 커미션이 생깁니다."), "core affiliate model statement must remain visible");

console.log("First-screen details OK: long explanations are collapsed");
