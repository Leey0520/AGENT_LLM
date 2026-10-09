---
id: project.zhansoul-mingren.known-data-issues
title: 战魂铭人数据历史问题与规避
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-10-09
tags: [zhansoul-mingren, data-quality, migration, known-issues]
---

# 战魂铭人数据历史问题与规避

| 问题 | 影响范围 | 查询规避 |
| --- | --- | --- |
| 迁移渠道设备主体变化 | 2024 年迁移包；迁移后数数生成新的用户主体 | 非付费按 `#device_id`；不要用账号 ID 代替；按渠道和迁移日期拆分。 |
| 服务端付费没有设备号 | 付费事件及订单链路 | 使用 `#user_id`；迁移渠道付费记录从 2024-07-19 起才有。 |
| 付费金额与活跃主体不一致 | 付费率、ARPU 等跨主体指标 | 付费侧按 `#user_id`，活跃侧按 `#device_id`；没有映射规则时不要直接联结计算。 |
| 付费虚拟事件不可直接过滤 | `ta@claim_order_finish` | 当前项目采用 `claim_order`、`order_finish`；先确认虚拟事件展开规则和订单生命周期。 |
| 两个付费事件的重复/缺口风险 | `claim_order`、`order_finish` | 确认订单关联键和去重规则；不要直接把两个事件的记录数或金额相加当唯一付费结果。 |
| 付费字段与旧交接口径不同 | 渠道、商品、金额 | 当前项目采用 `#vp@channel_fix`、`#vp@combine_sku_name_item_name`、`#vp@order_price_total`；上线前核验类型、枚举和空值。 |
| 金额语义未锁定 | 商品金额、ARPU、GMV | 确认币种、原价/实付、折扣、退款冲减和观察窗口。 |
| 难度字段与方案字段可能不一致 | 难度分层、通关分析 | 当前项目采用 `#vp@num_difficult_level`；核验与物理字段 `difficult_level` 的关系和类型。 |
| 回流分层存在包含关系 | 7 日、14 日、30 日回流 | 回流集合按 `30 日 ⊆ 14 日 ⊆ 7 日`；汇总求和时改用互斥分类，见 `metrics/player-segmentation.md`。 |
| 看板动态标签与 SQL 事件时间不一致 | 所有依赖 `$part_date` 的看板 SQL | 看板使用标签动态匹配筛选时，SQL 必须显式带入事件时间动态参数 `${PartDate:ds}`；否则会报 `$part_date属性获取失败`。 |
| 付费历史窗口早于完整记录起点 | 首次付费、历史付费、首次付费机会人群 | 迁移渠道付费记录自 2024-07-19 起才完整。即使查询分区从更早日期开始，也不能把当前表结果解释为全历史；早期版本判「此前是否消费」会偏松，抬高机会人群并压低付费率。 |
| `tap_start` 的 `#user_id` 可能缺失 | 用活跃人数做付费率、首次付费率或按人 ARPU 分母 | `#user_id` 由登录后 SDK 写入，登录前点击开始游戏可能为空。先验证覆盖率；不足时只能声明为「已登录活跃用户」口径。 |
| 纯新增与版本新增粒度不同 | 活跃构成、版本 cohort | 纯新增是日粒度 `#vp@lifetime_formal = 0`；版本新增是版本窗口内符合条件的设备并集，不能直接相加。 |
| 在线埋点表混有历史版本 | 客户端事件、旧属性和停用字段 | 先核对版本生效、数数方案状态和更新日志；不把表头或旧页签当现行口径。 |
| 首次入库类型错误 | 任何新属性 | 先修程序上报，再由数数管理员处理错误元数据；不要在 SQL 里强转掩盖。 |
| 对象/对象组父子结构不一致 | 战斗、道魂、技能和 Boss 快照 | 事件分析点开原始明细，父属性和每个子属性分别验收。 |
| 版本更新内容不一定有独立看板或事件 | 新英雄、皮肤、礼包和活动 | 先查版本看板和基础看板映射，再查现有事件；SQL 只作最后兜底。 |

## 当前已知的大事件

2024 年迁移、2024 年渠道分批上线、2026-05-05 国内集群登录事故等大事件会影响活跃、新增、登录和版本趋势。解释趋势拐点前先查项目大事件记录和更新日志。

## 关联口径

- 核心事件与属性见 `data-contract/analysis-fields.md`。
- 用户主体与付费选择见 `data-contract/identity-and-payment.md`。
- 玩家分层与回流互斥规则见 `metrics/player-segmentation.md`。

## 证据

- [战魂铭人交接文档](https://chillyroom.feishu.cn/wiki/QzInwjjLei28EEkaQvMcgxOPnyd)
- [战魂铭人大事件记录](https://chillyroom.feishu.cn/wiki/wikcnZJns9CpwbKO3XoRsgxSmUh)
- [战魂铭人更新日志与游戏内邮件](https://chillyroom.feishu.cn/wiki/wikcnAs9kBF3ZgbYzZ6T9xQCfpd)
- 2026-09-18 项目分析口径确认。
- 2026-10-09 项目分析人员确认：动态事件时间参数、付费历史覆盖和 `tap_start` 的 `#user_id` 覆盖率风险。
