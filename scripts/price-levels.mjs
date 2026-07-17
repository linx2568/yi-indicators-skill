#!/usr/bin/env node
import { parseArgs, apiPost, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/price-levels.mjs --symbol <symbol>

Get support/resistance levels with OB-enhanced levels.`);
  process.exit(0);
}

const { symbol } = parseArgs(args, ["symbol"]);

try {
  const result = await apiPost("/api/v1/price-levels", { symbol });
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
