#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/stickiness.mjs --symbol <symbol> [--interval <interval>]

Get full stickiness indicators for a single interval.

Options:
  --symbol <symbol>    Trading pair (required, e.g. BTCUSDT)
  --interval <int>     Kline interval (default: 15m): 1m, 3m, 5m, 15m, 1h, 4h, 1d`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);
const { interval } = parseArgs(args, [], ["interval"]);

try {
  const result = await apiPost("/api/v1/stickiness", { symbol, interval: interval || "15m" });
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
