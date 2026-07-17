#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/historical.mjs --symbol <symbol> [options]

Get historical stickiness indicator time series.

Options:
  --symbol <symbol>    Trading pair (required)
  --interval <int>     Kline interval (default: 15m)
  --limit <n>          Max records (default: 100, max: 500)
  --from <ISO time>    Start time, e.g. "2026-07-01T00:00:00"
  --to <ISO time>      End time`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);
const { interval, limit, from, to } = parseArgs(args, [], ["interval", "limit", "from", "to"]);

try {
  const body = { symbol, interval: interval || "15m" };
  if (limit) body.limit = parseInt(limit);
  if (from) body.from_time = from;
  if (to) body.to_time = to;
  const result = await apiPost("/api/v1/historical", body);
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
