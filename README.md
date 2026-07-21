# Yi Indicators Skill

A CodeBuddy / Claude Code / Cursor skill for Yi Stickiness indicator analysis — a five-layer real-time market microstructure system for Binance USDⓈ-M perpetual contracts.

## Install

```bash
npx skills add github.com/linx2568/yi-indicators-skill --skill yi-indicators
```

Or tell your AI agent:

> 安装 yi-indicators Skills：https://github.com/linx2568/yi-indicators-skill

## Quick Start

```bash
# 1. 注册免费 API Key
node scripts/register.mjs

# 2. 查看账户状态（验证配置）
node scripts/account.mjs

# 3. 分析第一个币种
node scripts/stickiness.mjs --symbol BTCUSDT --interval 15m
```

## What It Does

Transforms raw Yi indicator values (Liquidity, Pressure, Absorption, TrendEff, etc.) into actionable market analysis. When you ask things like "analyze BTC structure" or "scan for opportunities", this skill guides the AI to:

- Fetch stickiness indicators via `scripts/stickiness.mjs`
- Interpret 10 normalized metrics with 7-state market classification
- Perform multi-timeframe confluence analysis
- Read price levels and OB (order book) verification data

## Prerequisites

- Node.js (zero npm dependencies)
- Yi API key (free tier available)

## API Key Configuration

### 自助注册（推荐）

```bash
node scripts/register.mjs
```

这会自动申请一个 **Free 套餐** API Key 并保存到本地配置文件。可选参数：

```bash
node scripts/register.mjs --email your@email.com   # 可选，关联邮箱
```

### 已有 Key？手动配置

将已有的 API Key 保存到 `~/.config/yi-indicators/api-key`：

```bash
mkdir -p ~/.config/yi-indicators
echo "your-api-key" > ~/.config/yi-indicators/api-key
```

### 验证配置

```bash
node scripts/account.mjs
```

应返回账户套餐和用量信息。

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

## Script Usage

### Single Asset Analysis

```bash
# 单周期完整指标
node scripts/stickiness.mjs --symbol BTCUSDT --interval 15m

# 7 周期状态全景 + 共振分
node scripts/market-state.mjs --symbol ETHUSDT

# 支撑/阻力位 + OB 增强位
node scripts/price-levels.mjs --symbol SOLUSDT

# 历史指标序列
node scripts/historical.mjs --symbol BTCUSDT --interval 1h --limit 100
```

### Multi-Asset Screening

```bash
# 全市场扫描（按状态筛选）
node scripts/screen.mjs --state_filter StrongBuy --zone_filter Liquid

# 查看所有支持的交易对
node scripts/symbols.mjs
```

### Advanced Analysis

```bash
# OB 盘口验证统计
node scripts/ob-verify.mjs --symbol BTCUSDT

# 状态切换时间线
node scripts/state-timeline.mjs --symbol ETHUSDT
```

## Documentation

- **SKILL.md**: Skill definition for AI agents (trigger rules, workflow, key principles)
- **references/indicators_reference.md**: Detailed indicator interpretation guide with numeric ranges, seven-state classification rules, and multi-indicator signal combinations

## Key Features

1. **Spring Model Breakout Detection**: Identify energy release signals when market transitions from Stagnant to Liquid zone
2. **Whale Tracking**: Detect large order flow concentration and smart money behavior
3. **False Breakout Warning**: Identify algorithmic manipulation patterns
4. **Multi-Timeframe Confluence**: Combine signals across 7 intervals (1m to 1d)
5. **Order Book Verification**: Validate price levels against order book data

## Requirements

- Node.js 16+ (zero external npm dependencies)
- Yi API key (free tier available)
