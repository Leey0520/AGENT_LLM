---
id: project.zhansoul-mingren.identity-and-payment
title: 战魂铭人用户主体与付费口径
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-10-09
tags: [zhansoul-mingren, identity, payment, migration]
---

# 战魂铭人用户主体与付费口径

## 非付费数据

2024 年服务器迁移和迁移渠道换包改变了 `#distinct_id` 与设备号关系，数数后台为同一玩家生成了新的用户主体。现有看板已统一使用“设备号主体（迁移包）”，按 `#device_id` 去重。

因此，新分析默认：

- 非付费事件按 `#device_id` 去重。
- 不用 `account_id` 或 `user_id` 代替设备主体。
- 用户、设备、访客三套历史 ID 不可直接合并；先按看板口径和渠道范围确认。
- TapTap 渠道的 `#distinct_id` 与 `device_id` 未改变，不要把迁移包规则泛化到 TapTap。

## 付费数据

付费是服务端上报，通常没有 `#device_id`，所以付费分析使用默认用户主体 `#user_id` 或服务端访客主体。迁移渠道的付费记录从 2024-07-19 以后才有记录，日期之前不能用迁移后的付费口径解释。

## 当前项目采用口径

2026-09-18 项目分析口径确认结果：

- 付费事件：`claim_order`、`order_finish`。
- 渠道字段：`#vp@channel_fix`。
- 商品字段：`#vp@combine_sku_name_item_name`。
- 金额字段：`#vp@order_price_total`。
- 付费主体：`#user_id`。
- 活跃主体：`#device_id`。

这些字段是当前项目选择，不代表已经完成线上元数据核验。执行前仍须确认字段类型、枚举、版本覆盖和空值。

`claim_order` 与 `order_finish` 属于订单链路中的不同节点。除非业务已明确两者的去重和关联规则，否则不能把两个事件的记录数或金额直接相加，也不能默认一个事件天然代表完整付费成功。

2026-10-09 项目分析人员补充：一笔订单只会出现在 `claim_order` 或 `order_finish` 其中一个事件，按订单去重时不需要做「`order_finish` 优先」的二次去重。该结论仍待订单号级线上核验。

## 历史交接口径

- `ta@claim_order_finish` 是此前交接文档中的付费虚拟事件，不能直接作为底层 `$part_event` 过滤；当前项目分析采用 `claim_order`、`order_finish`。
- `#vp@distro_id` 是此前推荐的渠道属性，当前项目分析采用 `#vp@channel_fix`。
- `#vp@total_item_name` 是此前推荐的商品属性，当前项目分析采用 `#vp@combine_sku_name_item_name`。
- `purchases_trigger`、`purchases_success`、`purchases_fail`、`order_finish`、`claim_order`、`refund_order` 是不同生命周期，不能仅按事件名推导付费人数或收入。

## 主体混用限制

- 付费人数、ARPPU 等付费侧指标以 `#user_id` 去重。
- 活跃、留存、回流、关卡和难度分层以 `#device_id` 去重。
- 付费率、ARPU 同时涉及付费与活跃时，必须分别写清分子和分母主体。
- 当前知识没有定义 `#user_id` 与 `#device_id` 的通用映射规则。不能对两套主体直接联结后无说明地计算比率。
- 若某个指标使用付费 numerator、设备 denominator，应将其标记为跨主体指标，并说明适用范围和限制。

## 首次付费口径

- 首次付费指该 `#user_id` 全历史的第一笔有效付费，不是版本内第一笔；按 `#event_time` 取最早一笔。
- 首次付费机会人群指版本期间活跃、且在该版本开始日之前没有任何付费记录的用户；活跃侧使用 `tap_start` 上携带的 `#user_id`，因为服务端付费事件没有 `#device_id`。
- 版本首次付费率、商品首次付费率和商品构成的计算见 `metrics/payment-metrics.md`。
- 按人统计活跃前必须先验证 `tap_start` 的 `#user_id` 覆盖率；覆盖率不足时，分母只能声明为「已登录活跃用户」。

## 查询前检查

先写明项目、渠道、日期、主体、付费/非付费范围和版本，再检查看板是否已经处理迁移。若结果同时混用客户端与服务端事件，必须在结果中说明主体差异。

- 确认 `#vp@channel_fix`、`#vp@combine_sku_name_item_name`、`#vp@order_price_total` 的线上字段存在且枚举/类型正确。
- 确认 `#vp@order_price_total` 的币种、实付/原价、折扣和退款处理。
- 确认 `claim_order`、`order_finish` 的订单关系、去重键和统计窗口。
- 检查付费记录分区，避免把缺失日期解释为零付费。

## 关联口径

- 核心字段定义见 `data-contract/analysis-fields.md`。
- 玩家分层和回流包含关系见 `metrics/player-segmentation.md`。
- 已知数据问题见 `decisions/known-data-issues.md`。

## 证据

- [战魂铭人交接文档](https://chillyroom.feishu.cn/wiki/QzInwjjLei28EEkaQvMcgxOPnyd)
- [战魂铭人大事件记录](https://chillyroom.feishu.cn/wiki/wikcnZJns9CpwbKO3XoRsgxSmUh)
- 2026-09-18 项目分析口径确认。
- 2026-10-09 项目分析人员确认：订单事件不共存的处理边界、首次付费口径和 `tap_start` 的 `#user_id` 覆盖率风险。
