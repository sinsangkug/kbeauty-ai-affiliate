import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function readJson(relativePath) {
  const raw = await readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(raw);
}

function assertArray(value, name) {
  assert.ok(Array.isArray(value), `${name} must be an array`);
  assert.ok(value.length > 0, `${name} must not be empty`);
}

const workers = await readJson("config/kbeauty-workers.json");
const tasks = await readJson("data/kbeauty-tasks.json");

assertArray(workers, "workers");
assertArray(tasks, "tasks");
assert.equal(workers.length, 10, "there must be exactly 10 AI workers");

const workerIds = new Set(workers.map(worker => worker.id));
assert.equal(workerIds.size, workers.length, "worker ids must be unique");

for (const worker of workers) {
  assert.match(worker.id, /^[a-z0-9-]+$/, `invalid worker id: ${worker.id}`);
  assert.ok(worker.emoji, `${worker.id} needs an emoji`);
  assert.ok(worker.nameKo, `${worker.id} needs Korean name`);
  assert.ok(worker.mission, `${worker.id} needs mission`);
  assert.ok(Array.isArray(worker.inputs), `${worker.id} inputs must be an array`);
  assert.ok(Array.isArray(worker.outputs), `${worker.id} outputs must be an array`);
  assert.ok(Array.isArray(worker.guardrails), `${worker.id} guardrails must be an array`);
}

for (const task of tasks) {
  assert.match(task.id, /^task-[0-9]{3}$/, `invalid task id: ${task.id}`);
  assert.ok(workerIds.has(task.workerId), `${task.id} has unknown workerId ${task.workerId}`);
  assert.ok(["P0", "P1", "P2"].includes(task.priority), `${task.id} priority must be P0/P1/P2`);
  assert.ok(["pending", "ready", "approval_required", "done"].includes(task.status), `${task.id} has invalid status`);
  assert.ok(typeof task.approvalRequired === "boolean", `${task.id} approvalRequired must be boolean`);
  assert.ok(task.title, `${task.id} needs title`);
  assert.ok(task.ownerAction, `${task.id} needs ownerAction`);
  assert.ok(task.aiAction, `${task.id} needs aiAction`);
  assert.ok(Array.isArray(task.doneCriteria) && task.doneCriteria.length, `${task.id} needs doneCriteria`);
}

console.log(`K-beauty AI worker data OK: ${workers.length} workers, ${tasks.length} tasks`);
