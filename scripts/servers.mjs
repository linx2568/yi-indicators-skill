#!/usr/bin/env node
import { getServerList, resolveApiUrl } from "./lib.mjs";

const { servers } = getServerList();

if (servers.length === 0) {
  console.log("⚠️  未找到服务器配置文件 (servers.json)，使用 localhost:8001");
  process.exit(0);
}

console.log("当前可用服务器列表：\n");
for (const s of servers) {
  const active = s.status === "active" ? "● ACTIVE" : "○ INACTIVE";
  console.log(`  [${active}] ${s.id}`);
  console.log(`    名称: ${s.name}`);
  console.log(`    地址: ${s.url}`);
  console.log(`    区域: ${s.region}`);
  if (s.description) console.log(`    说明: ${s.description}`);
  console.log();
}

console.log(`当前连接目标: ${resolveApiUrl()}`);
console.log("\n切换服务器: export YI_API_URL=http://<server>:8001");
