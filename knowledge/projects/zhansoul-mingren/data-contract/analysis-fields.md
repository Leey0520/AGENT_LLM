---
id: project.zhansoul-mingren.analysis-fields
title: 战魂铭人核心分析事件与属性口径
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-09-18
tags: [zhansoul-mingren, events, properties, identity, payment]
---

# 战魂铭人核心分析事件与属性口径

## 适用范围

本页记录版本活跃、留存、付费、渠道、商品、难度分层和彼岸试炼渗透率分析采用的核心事件与属性。字段选择已于 2026-09-18 由项目分析人员确认，但线上字段类型、枚举、版本范围和分区覆盖仍需在数数后台核验后才能执行。

## 事件口径

| 事件 | 业务含义 | 主体 | 使用范围与边界 |
| --- | --- | --- | --- |
| `tap_start` | 点击开始游戏，作为活跃事件 | `#device_id` | DAU、版本日均 DAU、渠道 DAU、分层活跃分母 |
| `enter_level` | 进入关卡 | `#device_id` | 彼岸试炼渗透率分子；当前只使用单人事件族 |
| `game_over` | 关卡结束与结算 | `#device_id` | 通关、难度分层和关卡结果分析；不与 `enter_level` 合并为一个事件 |
| `claim_order` | 服务端订单事件 | `#user_id` | 当前项目采用的付费事件之一；须确认订单生命周期和去重规则 |
| `order_finish` | 服务端订单完成事件 | `#user_id` | 当前项目采用的付费事件之一；不能默认与 `claim_order` 相加后等于唯一付费订单数 |
| `purchases_trigger`、`purchases_success`、`purchases_fail` | 客户端购买链路 | 客户端主体 | 与服务端订单事件分开，不用于替代服务端收入 |
| `refund_order` | 退款链路 | 服务端主体 | 与付费成功和商品收入分开处理 |

`ta@claim_order_finish` 是此前的虚拟事件交接口径，不是可直接过滤的底层 `$part_event` 值。当前项目分析采用 `claim_order`、`order_finish`；执行前应确认虚拟事件展开规则、两个底层事件的关系和同一订单去重方式。

单人 `enter_level`、`game_over` 与局域网、远联事件族不能混算。当前彼岸试炼分层只使用客户端单人 `enter_level` 和 `game_over`，不使用 `remote_enter_level`。

## 属性口径

| 属性 | 业务含义 | 本项目采用值/规则 | 待核验项 |
| --- | --- | --- | --- |
| `#device_id` | 客户端设备主体 | 非付费分析按此去重 | 空值覆盖和迁移渠道差异 |
| `#user_id` | 服务端用户主体 | 付费分析按此去重 | 与服务端访客主体的关系 |
| `#vp@channel_fix` | 渠道字段 | 目标渠道精确值：`TapTap`、`IOS`、`GP` | 与旧推荐字段 `#vp@distro_id` 的覆盖差异 |
| `#vp@combine_sku_name_item_name` | 商品/SKU 名称 | 分商品付费人数和金额 | 与旧推荐字段 `#vp@total_item_name` 的粒度差异 |
| `#vp@order_price_total` | 订单金额合计 | 分商品金额、ARPU 分子 | 币种、原价/实付、折扣、退款冲减和跨订单汇总 |
| `#vp@num_difficult_level` | 主线难度 | 按设备历史最高通关难度分层 | 线上字段类型、空值、值域及与物理字段 `difficult_level` 的关系 |
| `mode_name` | 模式名称 | `彼岸试炼`；分层模式为 7 个空间碎片模式 | 精确枚举值和版本生效范围 |
| `reward_calculate` | 结算方式 | `success`、`success_special` 视为胜利 | 大小写、空值和历史版本差异 |
| `#vp@lifetime_formal` | 客户端生命周期/正式玩家标记 | `= 0` 表示纯新增；非 0 用于活跃留存判断 | 类型、空值和用户属性快照时点 |
| `#vp@is_d7_return2` | 7 日回流标记 | 布尔值；最近 7 日未 `tap_start` | 类型、空值和包含关系 |
| `#vp@is_d14_return2` | 14 日回流标记 | 布尔值；最近 14 日未 `tap_start` | 类型、空值和包含关系 |
| `#vp@is_d30_return` | 30 日回流标记 | 布尔值；最近 30 日未 `tap_start` | 类型、空值和包含关系 |
| `#event_time` | 事件时间 | 日粒度统计；服务端事件从 0 时区转北京时间时增加 8 小时 | 客户端事件不要重复加 8 小时 |
| `$part_date` | 事件分区日期 | 查询分区过滤 | 动态标签匹配时需确认报表使用事件时间动态参数 |
| `$part_event` | 事件名 | 纵向筛选事件 | 虚拟事件不能直接作为底层事件值 |

## 主体规则

- 活跃、新增、回流、关卡和难度分层使用 `#device_id`。
- 付费人数、ARPPU 和付费主体使用 `#user_id`。
- 付费率、ARPU 等同时需要付费和活跃口径的指标，必须明确分子、分母主体；`#user_id` 与 `#device_id` 不能无说明直接联结。
- 迁移渠道付费记录从 2024-07-19 起才完整。早于该日期的付费结果不能直接按现行口径解释。

## 时间规则

- 项目时区为 `Asia/Shanghai`。
- 服务端事件按 0 时区上报时，使用 `DATE_ADD('hour', 8, "#event_time")` 转为北京时间。
- 客户端事件按北京时间自然日统计，不对已经处于北京时间的 `#event_time` 重复加 8 小时。
- 分区过滤使用字符串条件，例如 `"$part_date" BETWEEN '2026-07-27' AND '2026-08-28'`。

## 关联口径

- 玩家分层、纯新增、版本新增和回流包含关系见 `metrics/player-segmentation.md`。
- 用户主体与迁移限制见 `data-contract/identity-and-payment.md`。
- 线上字段未确认时的执行风险见 `decisions/known-data-issues.md`。

## 证据

- 2026-09-18 项目分析口径确认：字段冲突由项目分析人员选择。
- `data-contract/identity-and-payment.md`
- `data-contract/tracking-plan-current.md`
- `decisions/known-data-issues.md`
