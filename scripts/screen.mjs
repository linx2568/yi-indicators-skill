#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/screen.mjs [options]

Screen all symbols for specific conditions.

Options:
  --symbols <list>         Comma-separated symbols (default: all configured)
  --state_filter <state>   Filter: StrongBuy, WeakBuy, StrongSell, etc.
  --zone_filter <zone>     Filter: Liquid, Neutral, Stagnant
  --interval <int>         Kline interval (default: 15m)
  --min_liquidity <n>      Min liquidity [0, 1]
  --max_liquidity <n>      Max liquidity [0, 1]
  --min_pressure_abs <n>   Min absolute pressure [0, 1]`);
  process.exit(0);
}

const opts = ["symbols", "state_filter", "zone_filter", "interval", "min_liquidity", "max_liquidity", "min_pressure_abs"];
const parsed = parseArgs(args, [], opts);

try {
  const body = {};
  if (parsed.symbols) body.symbols = parsed.symbols;
  if (parsed.state_filter) body.state_filter = parsed.state_filter;
  if (parsed.zone_filter) body.zone_filter = parsed.zone_filter;
  if (parsed.interval) body.interval = parsed.interval;
  if (parsed.min_liquidity) body.min_liquidity = parseFloat(parsed.min_liquidity);
  if (parsed.max_liquidity) body.max_liquidity = parseFloat(parsed.max_liquidity);
  if (parsed.min_pressure_abs) body.min_pressure_abs = parseFloat(parsed.min_pressure_abs);
  const result = await apiPost("/api/v1/screen", body);
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
