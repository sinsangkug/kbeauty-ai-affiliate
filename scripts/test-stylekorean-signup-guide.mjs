import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");
const growthTitleMatch = html.match(/const growthPostTitles = \[([\s\S]*?)\];/);
const growthTitleCount = growthTitleMatch
  ? [...growthTitleMatch[1].matchAll(/"[^"]+"/g)].length
  : 0;

assert.ok(html.includes('id="signupSimpleGuide"'), "beginner signup guide is missing");
assert.ok(html.includes('id="signupNowBox"'), "signup now action box is missing");
assert.ok(html.includes("초보자는 이 4개만 확인"), "beginner-focused signup headline is missing");
assert.ok(html.includes("SNS 채널 1개"), "SNS channel step is missing");
assert.ok(html.includes("팔로워 1,000명"), "follower requirement is missing");
assert.ok(html.includes("게시물 10개"), "post requirement is missing");
assert.ok(html.includes("PayPal 이메일"), "PayPal requirement is missing");
assert.ok(html.includes('id="affiliateRouteTable"'), "affiliate route table is missing");
assert.ok(html.includes("1순위</td><td>StyleKorean"), "StyleKorean must be the first affiliate route");
assert.ok(html.includes("2순위</td><td>YesStyle"), "YesStyle must be the backup affiliate route");
assert.ok(html.includes("1순위 StyleKorean 신청 가능권"), "eligibility result must clearly recommend StyleKorean first");
assert.ok(html.includes("바로 신청은 보류"), "missing requirements result must tell beginners to pause application");
assert.ok(html.includes('id="channelGrowthIdeas"'), "channel growth idea panel is missing");
assert.ok(html.includes('id="growthPostTitles"'), "growth post title list is missing");
assert.ok(html.includes("가입 조건 부족할 때 올릴 게시물 제목 10개"), "growth post title headline is missing");
assert.ok(html.includes("const growthPostTitles = ["), "growth post title source list is missing");
assert.ok(html.includes("function renderGrowthPostTitles()"), "growth post title renderer is missing");
assert.ok(html.includes("function copyGrowthPostTitles()"), "growth post title copy action is missing");
assert.ok(html.includes("renderGrowthPostTitles();"), "growth post titles must render on startup");
assert.equal(growthTitleCount, 10, "growth post title list must contain exactly 10 titles");
assert.ok(html.includes("신청 버튼은 상국님이 직접"), "manual application approval warning is missing");
assert.ok(html.includes("확인 기준: 2026-06-23 KST"), "official verification date is missing");
assert.ok(!html.includes("SNS 채널 준비"), "duplicate old SNS preparation card should be removed");
assert.ok(!html.includes("<strong>PayPal 준비</strong>"), "duplicate old PayPal preparation card should be removed");
assert.ok(!html.includes("실제로 운영할 채널 URL 준비"), "duplicate old signup todo list should be removed");

console.log("StyleKorean beginner signup guide OK");
