#!/usr/bin/env node
import { apiGet, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("Usage: node scripts/symbols.mjs\n\nList all trading pairs with live data.");
  process.exit(0);
}

try {
  const result = await apiGet("/api/v1/symbols");
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
