#!/usr/bin/env node
import { apiGet, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/account.mjs [--usage]

Get account info (tier, quota, expiry) or usage history with --usage.`);
  process.exit(0);
}

try {
  const endpoint = args.includes("--usage") ? "/api/v1/usage" : "/api/v1/account";
  const result = await apiGet(endpoint, args.includes("--usage") ? { limit: "20" } : {});
  printJson(result);
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
}
