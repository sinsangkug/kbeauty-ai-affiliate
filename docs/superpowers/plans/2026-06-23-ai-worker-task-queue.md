# AI Worker Task Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first real JSON backbone for the K-beauty affiliate CEO dashboard so AI employees have clear roles, task queues, approval gates, and validation rules.

**Architecture:** Keep the current single HTML app intact, then add data files designed for a local automation server. A plain Node validation script checks the JSON data without requiring external packages.

**Tech Stack:** Static HTML, JSON, Node.js built-in `fs`, `path`, and `assert`.

---

### Task 1: Add JSON Validation Script

**Files:**
- Create: `scripts/validate-kbeauty-data.mjs`

- [ ] **Step 1: Write the failing validation script**

```js
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
  assert.ok(Array.isArray(worker.guardrails), `${worker.id} guardrails must be an array`);
}

for (const task of tasks) {
  assert.match(task.id, /^task-[0-9]{3}$/, `invalid task id: ${task.id}`);
  assert.ok(workerIds.has(task.workerId), `${task.id} has unknown workerId ${task.workerId}`);
  assert.ok(["P0", "P1", "P2"].includes(task.priority), `${task.id} priority must be P0/P1/P2`);
  assert.ok(["pending", "ready", "approval_required", "done"].includes(task.status), `${task.id} has invalid status`);
  assert.ok(typeof task.approvalRequired === "boolean", `${task.id} approvalRequired must be boolean`);
  assert.ok(task.ownerAction, `${task.id} needs ownerAction`);
  assert.ok(task.aiAction, `${task.id} needs aiAction`);
  assert.ok(Array.isArray(task.doneCriteria) && task.doneCriteria.length, `${task.id} needs doneCriteria`);
}

console.log(`K-beauty AI worker data OK: ${workers.length} workers, ${tasks.length} tasks`);
```

- [ ] **Step 2: Run script to verify it fails before data exists**

Run: `node scripts/validate-kbeauty-data.mjs`

Expected: FAIL because `config/kbeauty-workers.json` is missing.

### Task 2: Add AI Worker Roster

**Files:**
- Create: `config/kbeauty-workers.json`

- [ ] **Step 1: Create 10 worker definitions**

Create an array with exactly 10 worker objects:

```json
[
  {
    "id": "chief-manager",
    "emoji": "👑",
    "nameKo": "AI 팀장",
    "mission": "상국님 명령을 업무로 쪼개고 오늘 1순위를 정한다.",
    "automationLevel": "high",
    "approvalPolicy": "승인·로그인·결제·외부 발행은 자동 실행하지 않는다.",
    "inputs": ["상국님 명령", "성과 지표", "승인 대기 작업"],
    "outputs": ["오늘 1순위", "작업 배정", "다음 우선순위 1~3순위"],
    "guardrails": ["돈 쓰는 작업 금지", "상품 구매 추천 금지", "불확실하면 확인 필요 표시"]
  }
]
```

Create exactly these 10 worker IDs with the same required fields: `chief-manager`, `product-researcher`, `experiment-designer`, `content-writer`, `link-manager`, `risk-checker`, `performance-analyst`, `report-writer`, `expansion-strategist`, `ops-manager`.

- [ ] **Step 2: Run validation**

Run: `node scripts/validate-kbeauty-data.mjs`

Expected: FAIL because `data/kbeauty-tasks.json` is missing.

### Task 3: Add Initial Task Queue

**Files:**
- Create: `data/kbeauty-tasks.json`

- [ ] **Step 1: Create first operating queue**

Create an array of task objects covering signup, link, content, risk, metrics, reporting, and expansion gates. Every task must include:

```json
{
  "id": "task-001",
  "stage": "가입 전",
  "priority": "P0",
  "status": "ready",
  "workerId": "chief-manager",
  "title": "오늘 1순위 정리",
  "ownerAction": "첫 화면에서 오늘 딱 하나 버튼을 누른다.",
  "aiAction": "가입 조건 확인을 오늘 1순위로 추천한다.",
  "approvalRequired": false,
  "doneCriteria": ["상국님이 오늘 할 일 1개를 확인했다."]
}
```

- [ ] **Step 2: Run validation**

Run: `node scripts/validate-kbeauty-data.mjs`

Expected: PASS with `K-beauty AI worker data OK`.

### Task 4: Link Data Files From README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add data file section**

Add a short table that explains:

| File | Purpose |
|---|---|
| `config/kbeauty-workers.json` | AI 직원 10명 직무·입력·출력·금지 규칙 |
| `data/kbeauty-tasks.json` | 현재 사업 단계별 작업 큐 |
| `scripts/validate-kbeauty-data.mjs` | JSON 구조 검증 스크립트 |

- [ ] **Step 2: Run validation and git checks**

Run:

```bash
node scripts/validate-kbeauty-data.mjs
git diff --check
git status --short
```

Expected: validation passes, no whitespace errors, only intended files changed.
