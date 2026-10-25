#!/usr/bin/env node
/**
 * Regenerates brand-overlay.png: the accent rule plus the FactSpark logo badge.
 * The badge (brand-badge.png) is the FS logo cut to a circle with a soft ring.
 * Edit the constants, re-run, and every future video picks up the change.
 *   node make-overlay.js
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "brand-overlay.png");
const BADGE = path.join(HERE, "brand-badge.png");

const W = 1080, H = 1920, M = 110;
const SPARK = "0xE0552B";
// Facebook's Reel UI covers roughly the bottom 250px; stay above it.
const BADGE_Y = H - 358;

const filters =
  `color=c=0x00000000:s=${W}x${H}:d=1,format=rgba,` +
  `drawbox=x=${M}:y=96:w=150:h=8:color=${SPARK}@1:t=fill[bg];` +
  `[bg][0:v]overlay=${M}:${BADGE_Y}:format=auto,format=rgba`;

const r = spawnSync("ffmpeg", ["-y","-i",BADGE,
  "-filter_complex",filters,"-frames:v","1",OUT], { encoding: "utf8" });

if (r.status !== 0) {
  console.error("Failed to build the overlay.");
  console.error(r.stderr.split("\n").slice(-8).join("\n"));
  process.exit(1);
}
console.log("✓ brand-overlay.png written —", W + "×" + H);
