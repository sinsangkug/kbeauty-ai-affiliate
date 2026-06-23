import { readFile, writeFile } from "node:fs/promises";

const htmlPath = "처음_열기.html";

async function readJsonText(path) {
  const raw = await readFile(path, "utf8");
  return JSON.stringify(JSON.parse(raw), null, 2);
}

function replaceJsonScript(html, id, jsonText) {
  const pattern = new RegExp(`<script type="application/json" id="${id}">[\\s\\S]*?<\\/script>`);
  const replacement = `<script type="application/json" id="${id}">\n${jsonText}\n  </script>`;
  if (!pattern.test(html)) {
    throw new Error(`${id} script tag is missing`);
  }
  return html.replace(pattern, replacement);
}

let html = await readFile(htmlPath, "utf8");
html = replaceJsonScript(html, "kbeautyWorkersData", await readJsonText("config/kbeauty-workers.json"));
html = replaceJsonScript(html, "kbeautyTasksData", await readJsonText("data/kbeauty-tasks.json"));
await writeFile(htmlPath, html, "utf8");

console.log("Dashboard embedded worker/task data synced");
