# Yi Indicators Skill

A CodeBuddy / Claude Code / Cursor skill for Yi Stickiness indicator analysis — a five-layer real-time market microstructure system for Binance USDⓈ-M perpetual contracts.

## Install

```bash
npx skills add github.com/YOUR_USER/yi-indicators-skill --skill yi-indicators
```

Or tell your AI agent:

> 安装 yi-indicators Skills：https://github.com/YOUR_USER/yi-indicators-skill

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

## Requirements

- Node.js (zero npm dependencies)
- Yi API key (free tier available)
