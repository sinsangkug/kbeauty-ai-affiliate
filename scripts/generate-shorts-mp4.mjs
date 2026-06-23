import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const shorts = [
  { id: "shorts-01", bg: "0xE9FFF4", accent: "0x156F54" },
  { id: "shorts-02", bg: "0xEDF6FF", accent: "0x2456A6" },
  { id: "shorts-03", bg: "0xFFF6D8", accent: "0x2A2418" }
];

const renderedDir = path.join("shorts", "rendered");
const tmpDir = path.join(renderedDir, ".tmp");
const fontFile = "C\\:/Windows/Fonts/malgun.ttf";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function srtTimeToSeconds(value) {
  const match = value.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) return 0;
  const [, hh, mm, ss, ms] = match.map(Number);
  return hh * 3600 + mm * 60 + ss + ms / 1000;
}

function parseSrt(value) {
  return value
    .trim()
    .split(/\r?\n\r?\n/)
    .map(block => {
      const lines = block.split(/\r?\n/);
      const timeLine = lines.find(line => line.includes("-->"));
      const match = timeLine?.match(
        /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
      );
      if (!match || !timeLine) return null;
      return {
        start: srtTimeToSeconds(match[1]),
        end: srtTimeToSeconds(match[2]),
        text: lines.slice(lines.indexOf(timeLine) + 1).join(" ").trim()
      };
    })
    .filter(Boolean);
}

function wrapLines(value, maxLength = 18) {
  const words = value.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + word).length <= maxLength) {
      current = current ? `${current} ${word}` : word;
      continue;
    }

    if (current) lines.push(current);

    if (word.length <= maxLength) {
      current = word;
      continue;
    }

    for (let index = 0; index < word.length; index += maxLength) {
      lines.push(word.slice(index, index + maxLength));
    }
    current = "";
  }

  if (current) lines.push(current);
  return lines;
}

async function getDuration(srtPath) {
  const srt = await readFile(srtPath, "utf8");
  const matches = [...srt.matchAll(/-->\s*(\d{2}:\d{2}:\d{2},\d{3})/g)];
  const last = matches.at(-1)?.[1];
  return Math.max(last ? srtTimeToSeconds(last) : 30, 20);
}

async function renderShort({ id, bg, accent }) {
  const folder = path.join("shorts", id);
  const outputPath = path.join(renderedDir, `${id}.mp4`);
  const srtPath = path.join(folder, "captions.srt");
  const srtRaw = await readFile(srtPath, "utf8");
  const cues = parseSrt(srtRaw);
  const duration = await getDuration(srtPath);
  const cueFilters = [];

  for (const [index, cue] of cues.entries()) {
    const lines = wrapLines(cue.text);
    const lineGap = 68;
    for (const [lineIndex, line] of lines.entries()) {
      const cuePath = path.join(
        tmpDir,
        `${id}-cue-${String(index + 1).padStart(2, "0")}-${String(lineIndex + 1).padStart(2, "0")}.txt`
      );
      await writeFile(cuePath, line, "utf8");
      const cueFilterPath = cuePath.replaceAll("\\", "/");
      const y = `(h/2)-${Math.round(((lines.length - 1) * lineGap) / 2)}+${lineIndex * lineGap}`;
      cueFilters.push(
        `drawtext=fontfile='${fontFile}':textfile='${cueFilterPath}':x=(w-text_w)/2:y=${y}:fontsize=46:fontcolor=0x222222:box=1:boxcolor=white@0.84:boxborderw=28:enable='between(t\\,${cue.start}\\,${cue.end})'`
      );
    }
  }

  const episodeNumber = id.split("-").at(-1);
  const titleFilter = `drawtext=fontfile='${fontFile}':text='K-BEAUTY TEST ${episodeNumber}':x=(w-text_w)/2:y=150:fontsize=44:fontcolor=${accent}:box=1:boxcolor=white@0.78:boxborderw=18`;
  const footerFilter = `drawtext=fontfile='${fontFile}':text='affiliate first · no inventory':x=(w-text_w)/2:y=h-150:fontsize=34:fontcolor=0x34443D:box=1:boxcolor=white@0.62:boxborderw=14`;
  const vf = `${titleFilter},${cueFilters.join(",")},${footerFilter},format=yuv420p`;

  await run("ffmpeg", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    `color=c=${bg}:s=1080x1920:d=${duration}`,
    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-vf",
    vf,
    "-shortest",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    outputPath
  ]);

  console.log(`Rendered ${outputPath}`);
}

await mkdir(renderedDir, { recursive: true });
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });

for (const item of shorts) {
  await renderShort(item);
}

console.log("Rendered 3 MP4 shorts into shorts/rendered");
