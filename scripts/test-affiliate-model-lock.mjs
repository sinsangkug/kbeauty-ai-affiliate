import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");

assert.ok(html.includes('id="affiliateModelStatement"'), "affiliate model statement must be fixed on the first screen");
assert.ok(html.includes("✅ 물건 안 삼"), "no-inventory message is missing");
assert.ok(html.includes("고객이 제휴 링크로 직접 구매하면 상국님에게 커미션이 생깁니다."), "affiliate commission message is missing");
assert.ok(html.includes("재고·포장·배송 없음"), "no stock/packing/shipping message is missing");
assert.ok(html.includes(".model-lock-statement"), "affiliate model statement styling is missing");

console.log("Affiliate model lock OK: no inventory, affiliate-link commission");
