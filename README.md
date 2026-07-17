# Yi Indicators Skill

A CodeBuddy / Claude Code / Cursor skill for Yi Stickiness indicator analysis — a five-layer real-time market microstructure system for Binance USDⓈ-M perpetual contracts.

## Install

```bash
npx skills add github.com/linx2568/yi-indicators-skill --skill yi-indicators
```

Or tell your AI agent:

> 安装 yi-indicators Skills：https://github.com/linx2568/yi-indicators-skill

## What It Does

Transforms raw Yi indicator values (Liquidity, Pressure, Absorption, TrendEff, etc.) into actionable market analysis. When you ask things like "analyze BTC structure" or "scan for opportunities", this skill guides the AI to:

- Fetch stickiness indicators via `scripts/stickiness.mjs`
- Interpret 10 normalized metrics with 7-state market classification
- Perform multi-timeframe confluence analysis
- Read price levels and OB (order book) verification data

## Prerequisites

A Yi API key. Register for free:

```bash
node scripts/register.mjs
```

## Server Configuration

Yi services run on remote servers. Configure the API endpoint before use:

**Option 1: Environment variable (takes priority)**

```bash
export YI_API_URL=http://<your-server>:8001
```

**Option 2: Server list file**

The skill includes `servers.json` with available servers. The first active server is auto-selected. View available servers:

```bash
node scripts/servers.mjs
```

**Priority**: `YI_API_URL` env var > `servers.json` active entry > `localhost:8001`

## Requirements

- Node.js (zero npm dependencies)
- Yi API key (free tier available)
