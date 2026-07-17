#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/ob-verify.mjs --symbol <symbol> [--interval <int>]

Get Order Book verification statistics.`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);
const { interval } = parseArgs(args, [], ["interval"]);

try {
  const body = { symbol };
  if (interval) body.interval = interval;
  const result = await apiPost("/api/v1/ob-verify", body);
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
