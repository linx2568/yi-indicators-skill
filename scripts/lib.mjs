#!/usr/bin/env node
import fs from "fs";
import os from "os";
import path from "path";

const DEFAULT_API_URL = process.env.YI_API_URL || "http://localhost:8001";
const CONFIG_DIR = path.join(os.homedir(), ".config", "yi-indicators");
const CONFIG_FILE = path.join(CONFIG_DIR, "api-key");

export function getConfigFilePath() {
  return CONFIG_FILE;
}

export function maskApiKey(apiKey) {
  if (!apiKey) return "";
  if (apiKey.length <= 9) return `${apiKey.slice(0, 2)}...`;
  return `${apiKey.slice(0, 5)}...${apiKey.slice(-4)}`;
}

export function readSavedApiKey() {
  const keyFile = getConfigFilePath();
  if (!fs.existsSync(keyFile)) return "";
  return fs.readFileSync(keyFile, "utf8").trim();
}

export function saveApiKey(apiKey) {
  const key = apiKey.trim();
  if (!key) throw new Error("Missing Yi API key");
  const keyFile = getConfigFilePath();
  fs.mkdirSync(path.dirname(keyFile), { recursive: true, mode: 0o700 });
  fs.writeFileSync(keyFile, `${key}\n`, { mode: 0o600 });
  fs.chmodSync(keyFile, 0o600);
  return keyFile;
}

export function resolveApiKey() {
  const envKey = process.env.YI_API_KEY;
  if (envKey?.trim()) return envKey.trim();
  const savedKey = readSavedApiKey();
  if (savedKey) return savedKey;
  throw new Error("Missing Yi API key. Set YI_API_KEY env var or save key to ~/.config/yi-indicators/api-key");
}

export function getApiUrl() {
  return process.env.YI_API_URL || DEFAULT_API_URL;
}

export async function apiPost(endpoint, body) {
  const apiKey = resolveApiKey();
  const url = `${getApiUrl()}${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || `HTTP ${res.status}`);
  return json;
}

export async function apiGet(endpoint, params = {}) {
  const apiKey = resolveApiKey();
  const baseUrl = getApiUrl();
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${baseUrl}${endpoint}?${qs}` : `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || `HTTP ${res.status}`);
  return json;
}

export function parseArgs(args, required, optional = []) {
  const result = {};
  for (const flag of [...required, ...optional]) {
    const idx = args.indexOf(`--${flag}`);
    if (idx !== -1 && idx + 1 < args.length) result[flag] = args[idx + 1];
  }
  for (const flag of required) {
    if (!result[flag]) {
      console.error(`Error: --${flag} is required`);
      process.exit(1);
    }
  }
  return result;
}

export function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}
