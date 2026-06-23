import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");
const tasks = JSON.parse(await readFile("data/kbeauty-tasks.json", "utf8"));

const approvalTasks = tasks.filter(task => task.approvalRequired || task.status === "approval_required");

assert.ok(approvalTasks.length > 0, "source task queue must include approval-required tasks");
assert.ok(html.includes("onclick=\"showView('approvals', this)\""), "approval tab is missing");
assert.ok(html.includes('id="approvals"'), "approval section is missing");
assert.ok(html.includes('id="approvalSummary"'), "approval summary container is missing");
assert.ok(html.includes('id="approvalTaskBoard"'), "approval task board container is missing");
assert.ok(html.includes("function renderApprovalBoard()"), "renderApprovalBoard function is missing");
assert.ok(html.includes("renderApprovalBoard();"), "renderApprovalBoard is not called during startup");

for (const task of approvalTasks) {
  assert.ok(html.includes(task.id), `${task.id} is not represented in embedded dashboard data`);
}

console.log(`Dashboard approval board OK: ${approvalTasks.length} approval tasks`);
