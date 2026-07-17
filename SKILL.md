---
name: yi-indicators
description: "Yi Stickiness 指标解读技能。将 Yi 指标系统返回的原始数值（Liquidity、Pressure、Absorption、TrendEff 等 10 个指标 + 七态分类 + OB 验证）转化为交易者可直接使用的市场分析。当用户说'帮我看看BTC'、'分析ETH微观结构'、'扫描机会'、'解读Yi指标'时触发此技能。"
---

# Yi Stickiness 指标解读技能

## Overview

Yi 是一个**五层实时市场微观结构分析系统**，针对 Binance USDⓈ-M 永续合约。其核心输出是 **Stickiness 指标族**（10 个归一化指标 + 七态市场分类），基于逐笔成交的微观结构而非传统的 K 线 OHLCV 数据计算。

**关键理念**：与 RSI/MACD 等传统 TA 指标不同，Yi 指标衡量的是**市场效率**和**供需不平衡**，而非简单的价格动量或超买超卖。

## 前置要求

使用 Yi 指标系统需要有效的 API Key。

### 没有 Key？自助注册

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

应返回账户套餐和用量信息。配置完成后进入正常数据获取流程。

### 配置 API 服务器地址

Yi 服务部署在远程服务器上。使用前需确认连接目标：

**方式一：环境变量（优先）**

```bash
export YI_API_URL=http://你的服务器IP:8001
```

**方式二：服务器列表文件**

Skill 内置了一份可用服务器列表 `servers.json`。启动时自动选择第一个 `status=active` 的服务器。AI 可执行以下命令查看当前可用服务器：

```bash
node scripts/servers.mjs
```

**优先级**：环境变量 `YI_API_URL` > `servers.json` 活跃服务器 > `localhost:8001`

---

## 理论框架速览

```
Layer 0: 基础指标 (10 个归一化指标)
    ├── Liquidity           [0, 1]     市场厚度
    ├── Pressure            [-1, +1]   买卖压力方向
    ├── Absorption          [0, 1]     方向+流动性复合强度
    ├── TrendEff            [0, 1]     趋势效率 (Kaufman ER)
    ├── BuyRatioOscillation [0, 1]     买卖方向切换频率
    ├── Divergence          [-1, +1]   短/长周期流动性背离
    ├── TickBias            [-1, +1]   逐笔涨跌偏差
    ├── SizeAsymmetry       [-1, +1]   订单大小不对称
    ├── ClusterAnomaly      [0, 1]     聚类异常检测
    └── WhaleConcentration  [0, 1]     大户集中度

Layer 1: 七态市场分类
    利区 (Liq < 0.4):   劲买 / 缓买 / 劲卖 / 缓卖
    常区 (0.4 ≤ Liq ≤ 0.85): 常
    滞区 (Liq > 0.85):  滞买 / 滞卖

Layer 2: 价格位分析 (支撑/阻力，纯成交推导)

Layer 3: OB 增强价格位 (盘口加权验证)

Layer 4: OB 验证 (命中率 / 确认率 / 回测)
```

---

## 数据获取（脚本命令）

所有数据通过 `scripts/` 目录下的 Node.js 脚本获取，零外部依赖，AI 通过 `execute_command` 调用：

| 脚本 | 用途 |
|------|------|
| `node scripts/register.mjs` | 自助注册 Free 套餐 Key |
| `node scripts/stickiness.mjs --symbol <SYMBOL> --interval <INT>` | 单周期完整指标 |
| `node scripts/market-state.mjs --symbol <SYMBOL>` | 7 周期状态全景 + 共振分 |
| `node scripts/price-levels.mjs --symbol <SYMBOL>` | 支撑/阻力位 + OB 增强位 |
| `node scripts/historical.mjs --symbol <SYMBOL> --interval <INT> --limit 100` | 历史指标序列 |
| `node scripts/screen.mjs --state_filter <STATE> --zone_filter <ZONE>` | 全市场扫描 |
| `node scripts/ob-verify.mjs --symbol <SYMBOL>` | OB 盘口验证统计 |
| `node scripts/symbols.mjs` | 查询支持交易对 |
| `node scripts/account.mjs` | 查询套餐/用量 |
| `node scripts/servers.mjs` | 查看可用 API 服务器列表 |

**注意**：如果 `scripts/` 目录不在当前工作目录，需使用完整路径或相对路径。优先尝试：
```bash
# 默认路径（Skill 目录下）
node ~/.codebuddy/skills/yi-indicators/scripts/stickiness.mjs --symbol BTCUSDT --interval 15m
# 或项目路径
node yi-mcp/skills/yi-indicators/scripts/stickiness.mjs --symbol BTCUSDT --interval 15m
```

---

## 工作流程

### 1. 获取基础数据

根据用户问题，并行执行脚本获取所需数据：

```bash
# 单币种单周期分析
node scripts/stickiness.mjs --symbol ETHUSDT --interval 15m

# 多周期全景
node scripts/market-state.mjs --symbol ETHUSDT

# 价格位
node scripts/price-levels.mjs --symbol ETHUSDT

# OB 验证
node scripts/ob-verify.mjs --symbol ETHUSDT

# 全市场扫描（机会发现）
node scripts/screen.mjs --state_filter StrongBuy --zone_filter Liquid
```

只需执行用户询问的对应脚本，不需要每次都全部获取。

### 2. 指标逐项解读

对每个指标，根据数值范围进行解读。详见 `references/indicators_reference.md`。

解读时遵循：
- **数值驱动**：严格基于数值落入的区间给出解读，不编造信号
- **多指标交叉**：单个指标不构成交易信号，至少需要 2-3 个指标相互印证
- **周期上下文**：同一数值在不同周期含义不同（如 1m 的强买 vs 1d 的强买权重完全不同）
- **区间背景**：利区/常区/滞区决定了相同压力方向的可靠性
- **不确定性表述**：对边缘数值（如 Liquidity=0.39 接近利区/常区边界）明确标注不确定性

### 3. 七态分类解读

根据 `state` 和 `zone` 组合判断当前市场阶段：

| Zone | State | 微结构含义 | 交易含义 |
|------|-------|-----------|---------|
| 利区 | 劲买 | 低流动性+高效买方推动 | 趋势性强，顺势做多 |
| 利区 | 缓买 | 低流动性+弱买方推动 | 方向不牢固，谨慎 |
| 利区 | 劲卖 | 低流动性+高效卖方推动 | 趋势性强，顺势做空 |
| 利区 | 缓卖 | 低流动性+弱卖方推动 | 方向不牢固，谨慎 |
| 常区 | 常 | 流动性正常，无方向 | 观望或区间交易 |
| 滞区 | 滞买 | 高流动性+买方试探 | 能量积累中，关注突破 |
| 滞区 | 滞卖 | 高流动性+卖方试探 | 能量积累中，关注突破 |

**注意**：滞区不是"不能交易"，而是"能量在积累"——滞区转利区时常常爆发方向性行情（Spring Model 信号）。

### 4. 多周期共振分析

从 `market-state` 脚本返回的 `confluence` 字段判断：

- **score ≥ 0.6**：多周期高度共振，方向可靠性高
- **0.3 ≤ score < 0.6**：部分周期一致，需确认
- **score < 0.3**：周期分歧大，市场方向不明

结合 `aligned_intervals` 看多少个周期对齐：
- 7/7 对齐 → 极强一致（罕见）
- 5-6/7 对齐 → 强一致
- 3-4/7 对齐 → 中等一致
- 1-2/7 对齐 → 弱一致/方向不明

**大周期定方向，小周期找入场**：
- 4h/1d 决定主趋势方向
- 1h/15m 判断当前处于趋势的哪个阶段
- 5m/1m 辅助精确入场

### 5. 价格位解读

`price-levels` 脚本返回两类价格位：
- **support_levels / resistance_levels**：纯成交推导的价格位
- **ob_enhanced_support / ob_enhanced_resistance**：经盘口加权增强的价格位

解读要点：
- 纯成交位 `strength` 越高 → 该价位被反复测试 → 越可靠
- `ob_weight` > 0 表示盘口数据支持该价格位
- `ob_weight` < 0 表示盘口数据与该价格位矛盾 → 谨慎对待
- `final_strength` = base_strength 经 ob_weight 调整后的最终强度
- 多个 source_intervals 共同确认的位 → 更可靠

### 6. OB 验证解读

`ob-verify` 脚本返回盘口验证数据：

- **hit_rate**：价格位被实际触及的比例
  - with_ob 的 hit_rate > without_ob → 盘口数据确实提升了预测能力
  - with_ob 的 hit_rate < without_ob → 盘口数据在当前标的上价值有限

- **wall_confirm_rate**：盘口挂墙确认比例
  - 高确认率 + 方向偏差一致 → 盘口揭示的供需得到验证
  - 低确认率 → 盘口可能是虚假挂单

- **by_level_type** 中的不对称：
  - 支撑确认率 > 阻力确认率 → 买方结构更真实，偏多
  - 阻力确认率 > 支撑确认率 → 卖方结构更真实，偏空

- **avg_ttl_sec**：价格位从发布到被击中的平均时间
  - 短于预期 → 市场积极寻找价格位
  - 长于预期 → 市场在回避该价位

### 7. 生成结构化解读报告

```
## {SYMBOL} 微观结构分析报告

### 当前市场状态
- 主导周期: {interval}, 状态: {state}, 区: {zone}
- 当前价格: {last_price}, VWAP: {vwap}
- 买卖量比: {buy_vol}/{sell_vol}

### 核心指标面板
| 指标 | 数值 | 范围 | 解读 |
|------|------|------|------|
| Liquidity | {v} | [0,1] | {低/正常/高}流动性 — {含义} |
| Pressure | {v} | [-1,1] | {买/卖}方主导 — {强度} |
| Absorption | {v} | [0,1] | {高/中/低}吸收 — {含义} |
| TrendEff | {v} | [0,1] | 趋势效率{高/中/低} — {含义} |
| Divergence | {v} | [-1,1] | ... |
| TickBias | {v} | [-1,1] | ... |
| SizeAsymmetry | {v} | [-1,1] | ... |
| ClusterAnomaly | {v} | [0,1] | ... |
| WhaleConcentration | {v} | [0,1] | ... |

### 多周期共振
| 周期 | 状态 | 流动性 | 压力 | 趋势效率 |
|------|------|--------|------|----------|
| 1d | ... | ... | ... | ... |
| 4h | ... | ... | ... | ... |
| 1h | ... | ... | ... | ... |
| 15m | ... | ... | ... | ... |
| 5m | ... | ... | ... | ... |

- 共振分: {score}, 主导方向: {dominant}
- 周期一致性: {强/中/弱} — {含义}

### 价格位结构
- 最近支撑: {price} (强度 {s})
- 最近阻力: {price} (强度 {s})
- OB 增强确认: {有/无矛盾}

### OB 验证
- 总体命中率: with_ob={X%} vs without_ob={Y%} (差值 {delta})
- OB 挂单确认率: {X%}
- 方向偏差: {偏多/偏空/中性}

### 综合判断
[2-3 句综合判断，基于多指标交叉+多周期共振+OB验证]

### 风险提示
- 边缘指标: {list}
- 矛盾信号: {list}
- 缺失数据: {list}
```

---

## 关键原则

1. **数值驱动，不编造**：所有解读必须基于指标的具体数值区间
2. **多指标交叉验证**：单一指标不构成信号，至少需要 Liquidity + Pressure + TrendEff 三者一致
3. **区决定义可靠性**：利区信号更可靠（高效市场），滞区信号需要等待突破确认
4. **大周期定方向**：1d/4h 的 Pressure 方向 > 15m/5m 的短期波动
5. **OB 验证是独立维度**：盘口确认率的不对称性提供了不同于价格维度的独立信号
6. **标注边界不确定性**：指标值接近阈值边界时（如 Liq=0.38~0.42），明确说明
7. **买量/卖量比辅助验证**：高 Pressure + 买量显著大于卖量 → 买方真实推动

## Edge Cases

- **数据为空**：告知用户该交易对/周期暂无数据，建议尝试其他周期或等待数据积累
- **指标全部接近中性**（Liq~0.5, Pres~0, TE~0.1）：市场处于无方向盘整，不建议强行解读出信号
- **利区 + 常 = 不同周期矛盾**：优先信任更长周期（4h/1d）的判断
- **滞区连续出现**：关注 Divergence 指标——如果短周期 Liq 开始下降而长周期 Liq 仍高 → 可能是 Spring 释放前兆
- **OB 数据为空**：OB 数据需要足够时间积累，如果为空则仅基于纯成交指标分析，注明"OB 数据不足"
- **单周期分析**：如果用户只要求单周期，仍需提醒多周期交叉验证的重要性
- **脚本执行失败**：检查 API Key 是否已配置（`node scripts/account.mjs`）。如果没有 Key，运行 `node scripts/register.mjs` 自助注册一个 Free 套餐 Key
