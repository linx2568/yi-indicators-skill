#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/market-state.mjs --symbol <symbol>

Get 7-interval market state panorama with confluence analysis.`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);

try {
  const result = await apiPost("/api/v1/market-state", { symbol });
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
