---
name: yi-indicators
description: "Yi Stickiness 指标解读技能。将 Yi 指标系统返回的原始数值（Liquidity、Pressure、Absorption、TrendEff 等 10 个指标 + 七态分类 + OB 验证）转化为交易者可直接使用的市场分析。支持 Spring Model 突破捕捉、鲸鱼资金追踪、假突破预警、全市场扫描选币。当用户说'帮我看看BTC'、'分析ETH微观结构'、'扫描机会'、'解读Yi指标'、'BTC spring signal'、'scan opportunities'时触发此技能。"
---

# Yi Stickiness 指标解读技能

## 示例输出

```
## BTCUSDT 微观结构分析报告（15m）

### 当前状态
- 主导周期: 15m, 状态: **劲买**, 区: 利区 (Liq=0.32)
- 当前价格: 67,523 USDT, VWAP: 67,489
- 买卖量比: 2.3:1

### 核心指标
| 指标 | 数值 | 解读 |
|------|------|------|
| Liquidity | 0.32 | 低流动性（利区），价格易被推动 |
| Pressure | +0.68 | 强买压，买方主导 |
| Absorption | 0.72 | 高吸收，方向确认且有流动性支撑 |
| TrendEff | 0.35 | 高效率，趋势性强 |
| WhaleConc | 0.71 | 大户集中度高，鲸鱼在主动买入 |

### 多周期共振
| 周期 | 状态 | 压力 |
|------|------|------|
| 1d | 劲买 | +0.52 |
| 4h | 劲买 | +0.61 |
| 1h | 劲买 | +0.58 |
| 15m | 劲买 | +0.68 |

- 共振分: **0.78**，5/7 周期一致 → 极强上涨确认

### 价格位
- 支撑: 67,200 (强度 0.85) | 阻力: 67,800 (强度 0.72)
- OB 增强确认: 支撑位盘口数据验证通过

### 综合判断
BTC 处于**利区劲买**状态，多周期高度共振，鲸鱼资金持续流入。
建议顺势做多，止损参考支撑位 67,200。
```

---

## Quick Start

```bash
# 1. 注册免费 API Key
node scripts/register.mjs

# 2. 查看账户状态（验证配置）
node scripts/account.mjs

# 3. 分析第一个币种
node scripts/stickiness.mjs --symbol BTCUSDT --interval 15m
```

详细配置说明见 [README.md](README.md)。

---

## 核心场景

### 1. Spring Model 突破捕捉

**场景**：滞区转利区，能量释放信号

```bash
# 查看状态切换时间线
node scripts/state-timeline.mjs --symbol BTCUSDT

# 当看到 Liquidity 从 >0.85 跌破 0.4 + Pressure 方向明确时入场
```

### 2. 鲸鱼资金流向追踪

**场景**：识别大户行为，跟庄操作

```bash
# 查看大户集中度 + 订单大小不对称
node scripts/stickiness.mjs --symbol ETHUSDT --interval 1h
# 关注 WhaleConcentration + SizeAsymmetry 组合
```

### 3. 假突破预警

**场景**：避免被算法假突破诱骗

```bash
# 高 Pressure + 低 TrendEff + 高 ClusterAnomaly = 假突破信号
node scripts/stickiness.mjs --symbol SOLUSDT --interval 5m
```

### 4. 全市场扫描选币

**场景**：批量筛选机会币种

```bash
# 扫描所有利区劲买状态的币种
node scripts/screen.mjs --state_filter StrongBuy --zone_filter Liquid

# 扫描所有滞区状态（潜在 Spring 机会）
node scripts/screen.mjs --state_filter StagnantBuy --zone_filter Stagnant
```

---

## 数据获取脚本

| 脚本 | 用途 |
|------|------|
| `register.mjs` | 自助注册 Free 套餐 Key |
| `stickiness.mjs --symbol <SYMBOL> --interval <INT>` | 单周期完整指标 |
| `market-state.mjs --symbol <SYMBOL>` | 7 周期状态全景 + 共振分 |
| `price-levels.mjs --symbol <SYMBOL>` | 支撑/阻力位 + OB 增强位 |
| `historical.mjs --symbol <SYMBOL> --interval <INT>` | 历史指标序列 |
| `screen.mjs --state_filter <STATE> --zone_filter <ZONE>` | 全市场扫描 |
| `ob-verify.mjs --symbol <SYMBOL>` | OB 盘口验证统计 |
| `state-timeline.mjs --symbol <SYMBOL>` | 状态切换时间线 |
| `symbols.mjs` | 查询支持交易对 |
| `account.mjs` | 查询套餐/用量 |

---

## 工作流程

1. **获取数据**：根据用户问题调用对应脚本（单周期/多周期/全市场扫描）
2. **指标解读**：严格基于数值区间（见 references/indicators_reference.md）
3. **七态判断**：利区=趋势、滞区=积累、常区=盘整
4. **多周期共振**：大周期定方向，小周期找入场
5. **OB 验证**：盘口确认率不对称提供独立信号
6. **生成报告**：按示例输出格式生成结构化解读

---

## 关键原则

1. **数值驱动**：所有解读必须基于指标具体数值区间
2. **多指标交叉验证**：单一指标不构成信号，至少需要 2-3 个指标印证
3. **区决定义可靠性**：利区信号更可靠，滞区需等待突破确认
4. **大周期优先**：1d/4h 方向 > 15m/5m 短期波动
5. **标注边界不确定性**：指标值接近阈值时明确说明

---

## Edge Cases

- **数据为空**：告知用户该交易对/周期暂无数据，建议尝试其他周期
- **指标全部中性**：市场无方向盘整，不强行解读信号
- **OB 数据不足**：仅基于纯成交指标分析，注明"OB 数据不足"
- **脚本失败**：检查 API Key 配置，运行 `account.mjs` 验证

---

## 参考资料

- [指标详解参考手册](references/indicators_reference.md)：逐指标数值区间解读、七态分类规则、多指标组合信号
