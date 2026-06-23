import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { spawn } from "node:child_process";

const videos = [
  "shorts/rendered/shorts-01.mp4",
  "shorts/rendered/shorts-02.mp4",
  "shorts/rendered/shorts-03.mp4"
];

function ffprobe(file) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height,duration",
      "-of", "json",
      file
    ], { stdio: ["ignore", "pipe", "pipe"], shell: false });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", chunk => stdout += chunk);
    child.stderr.on("data", chunk => stderr += chunk);
    child.on("error", reject);
    child.on("close", code => {
      if (code !== 0) reject(new Error(stderr || `ffprobe exited with code ${code}`));
      else resolve(JSON.parse(stdout));
    });
  });
}

for (const file of videos) {
  const info = await ffprobe(file);
  const meta = info.streams?.[0];
  const fileStat = await stat(file);

  assert.ok(fileStat.size > 100_000, `${file} should be a real rendered MP4`);
  assert.equal(meta.width, 1080, `${file} width must be 1080`);
  assert.equal(meta.height, 1920, `${file} height must be 1920`);
  assert.ok(Number(meta.duration) >= 20, `${file} duration must be at least 20 seconds`);
}

console.log("Rendered shorts MP4 OK: 3 vertical videos at 1080x1920");
