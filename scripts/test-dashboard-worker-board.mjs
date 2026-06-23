import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("처음_열기.html", "utf8");
const workers = JSON.parse(await readFile("config/kbeauty-workers.json", "utf8"));
const tasks = JSON.parse(await readFile("data/kbeauty-tasks.json", "utf8"));

function extractJsonScript(id) {
  const pattern = new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)<\\/script>`);
  const match = html.match(pattern);
  assert.ok(match, `${id} JSON script is missing from dashboard`);
  return JSON.parse(match[1]);
}

assert.ok(html.includes("goStaff('workers')"), "AI 업무판 must remain reachable from the dashboard");
assert.ok(html.includes('id="workers"'), "AI 업무판 section is missing");
assert.ok(html.includes('id="workerSummary"'), "worker summary container is missing");
assert.ok(html.includes('id="workerBoard"'), "worker board container is missing");
assert.ok(html.includes('id="taskQueueBoard"'), "task queue board container is missing");
assert.ok(html.includes('id="workerTaskFilter"'), "worker task filter controls are missing");
assert.ok(html.includes('id="workerOwnerFilter"'), "worker owner filter controls are missing");
assert.ok(html.includes("setWorkerTaskFilter('all'"), "all task filter button is missing");
assert.ok(html.includes("setWorkerTaskFilter('ready'"), "ready task filter button is missing");
assert.ok(html.includes("setWorkerTaskFilter('pending'"), "pending task filter button is missing");
assert.ok(html.includes("setWorkerTaskFilter('approval_required'"), "approval-required task filter button is missing");
assert.ok(html.includes("function renderWorkerBoard()"), "renderWorkerBoard function is missing");
assert.ok(html.includes("function setWorkerTaskFilter(status)"), "setWorkerTaskFilter function is missing");
assert.ok(html.includes("function setWorkerOwnerFilter(workerId)"), "setWorkerOwnerFilter function is missing");
assert.ok(html.includes('value="link-manager"'), "link-manager worker filter option is missing");
assert.ok(html.includes('value="content-writer"'), "content-writer worker filter option is missing");
assert.ok(html.includes('value="performance-analyst"'), "performance-analyst worker filter option is missing");
assert.ok(html.includes("renderWorkerBoard();"), "renderWorkerBoard is not called during startup");

const embeddedWorkers = extractJsonScript("kbeautyWorkersData");
const embeddedTasks = extractJsonScript("kbeautyTasksData");

assert.equal(embeddedWorkers.length, workers.length, "embedded worker count must match JSON source");
assert.equal(embeddedTasks.length, tasks.length, "embedded task count must match JSON source");
assert.deepEqual(
  embeddedWorkers.map(worker => worker.id).sort(),
  workers.map(worker => worker.id).sort(),
  "embedded worker ids must match JSON source"
);
assert.deepEqual(
  embeddedTasks.map(task => task.id).sort(),
  tasks.map(task => task.id).sort(),
  "embedded task ids must match JSON source"
);

console.log(`Dashboard worker board OK: ${embeddedWorkers.length} workers, ${embeddedTasks.length} tasks`);
