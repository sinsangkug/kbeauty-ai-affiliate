import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");
const tasks = JSON.parse(await readFile("data/kbeauty-tasks.json", "utf8"));

const approvalTasks = tasks.filter(task => task.approvalRequired || task.status === "approval_required");

assert.ok(approvalTasks.length > 0, "source task queue must include approval-required tasks");
assert.ok(html.includes("onclick=\"showView('approvals', this)\""), "approval tab is missing");
assert.ok(html.includes('id="approvals"'), "approval section is missing");
assert.ok(html.includes('id="approvalSummary"'), "approval summary container is missing");
assert.ok(html.includes('id="approvalFocusAction"'), "approval focus action card is missing");
assert.ok(html.includes('id="approvalFocusTitle"'), "approval focus title is missing");
assert.ok(html.includes('id="approvalFocusOwnerAction"'), "approval focus owner action is missing");
assert.ok(html.includes('id="approvalTaskBoard"'), "approval task board container is missing");
assert.ok(html.includes("오늘 승인 3개만"), "approval tab must explain the simplified 3-item approval view");
assert.ok(html.includes("const APPROVAL_VISIBLE_LIMIT = 3"), "approval visible limit must stay at 3");
assert.ok(html.includes("visibleApprovalTasks = approvalTasks.slice(0, APPROVAL_VISIBLE_LIMIT)"), "approval board must render only the visible approval subset");
assert.ok(html.includes("전체 AI 업무판 보기"), "approval tab must link to the full AI worker board");
assert.ok(html.includes("function renderApprovalBoard()"), "renderApprovalBoard function is missing");
assert.ok(html.includes("function getApprovalTasks()"), "approval task sorter is missing");
assert.ok(html.includes("function getTopApprovalTask()"), "top approval task selector is missing");
assert.ok(html.includes("renderApprovalBoard();"), "renderApprovalBoard is not called during startup");

for (const task of approvalTasks) {
  assert.ok(html.includes(task.id), `${task.id} is not represented in embedded dashboard data`);
}

console.log(`Dashboard approval board OK: ${approvalTasks.length} approval tasks`);
