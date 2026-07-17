#!/usr/bin/env node
import { getApiUrl, saveApiKey, printJson } from "./lib.mjs";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log(`Usage: node scripts/register.mjs [--email <email>]

Register a free Yi API key (no existing key required).
Saves the key to ~/.config/yi-indicators/api-key automatically.

Options:
  --email <email>   Optional contact email for your key`);
  process.exit(0);
}

// parse --email
const emailIdx = args.indexOf("--email");
const email = emailIdx !== -1 && emailIdx + 1 < args.length ? args[emailIdx + 1] : "";

try {
  const url = `${getApiUrl()}/api/v1/register`;
  const body = email ? { email } : {};

  process.stderr.write("正在注册免费 Yi API Key...\n");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    process.stderr.write(`注册失败: ${data.error || res.statusText}\n`);
    process.exitCode = 1;
  } else {
    // 自动保存到配置文件
    if (data.api_key) {
      saveApiKey(data.api_key);
      process.stderr.write("已保存到 ~/.config/yi-indicators/api-key\n");
    }

    // 打印 Key 信息（不含明文 Key 的摘要）
    printJson({
      key_id: data.key_id,
      tier: data.tier,
      daily_limit: data.daily_limit,
      rate_per_minute: data.rate_per_minute,
      allowed_tools: data.allowed_tools,
      allowed_intervals: data.allowed_intervals,
      expires_at: data.expires_at,
      message: data.message,
    });

    process.stderr.write("\n注册成功！你现在可以使用 Yi 指标系统了。\n");
    process.stderr.write(`免费套餐: 每日 ${data.daily_limit} 次调用, ${data.allowed_tools.length} 个工具, ${data.allowed_intervals.length} 个周期\n`);
  }
} catch (err) {
  process.stderr.write(`注册失败: ${err.message}\n`);
  process.exitCode = 1;
}
