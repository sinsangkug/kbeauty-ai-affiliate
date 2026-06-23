import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const requiredFiles = [
  "script.txt",
  "captions.srt",
  "scene-plan.txt",
  "upload-title.txt",
  "description.txt",
  "hashtags.txt",
  "thumbnail-text.txt"
];

const shorts = ["shorts-01", "shorts-02", "shorts-03"];

for (const folder of shorts) {
  const files = await readdir(`shorts/${folder}`);
  for (const file of requiredFiles) {
    assert.ok(files.includes(file), `${folder}/${file} is missing`);
    const content = await readFile(`shorts/${folder}/${file}`, "utf8");
    assert.ok(content.trim().length > 0, `${folder}/${file} must not be empty`);
  }

  const captions = await readFile(`shorts/${folder}/captions.srt`, "utf8");
  assert.ok(captions.includes("00:00:"), `${folder}/captions.srt must include timecodes`);

  const description = await readFile(`shorts/${folder}/description.txt`, "utf8");
  assert.ok(description.includes("테스트"), `${folder}/description.txt must explain this is a test`);

  const thumbnail = await readFile(`shorts/${folder}/thumbnail-text.txt`, "utf8");
  assert.ok(thumbnail.includes("큰 문구:"), `${folder}/thumbnail-text.txt must include main thumbnail copy`);
}

console.log("Shorts package OK: 3 shorts with scripts, captions, scenes, upload copy");
