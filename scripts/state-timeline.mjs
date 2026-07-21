#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/state-timeline.mjs --symbol <symbol> [options]

Get STATE_WINDOW state transition timeline for a symbol.

Options:
  --symbol <symbol>       Trading pair (required)
  --interval <int>        Kline interval (default: 1m)
  --lookback_hours <n>    Lookback hours (default: 24, max: 168)`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);
const { interval, lookback_hours } = parseArgs(args, [], ["interval", "lookback_hours"]);

try {
  const body = { symbol };
  if (interval) body.interval = interval;
  if (lookback_hours) body.lookback_hours = parseInt(lookback_hours);
  const result = await apiPost("/api/v1/state-timeline", body);
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}