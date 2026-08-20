---
id: project.zhansoul-mingren.identity-and-payment
title: 战魂铭人用户主体与付费口径
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
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

当前交接口径：

- 付费虚拟事件：`ta@claim_order_finish`。
- 渠道推荐属性：`#vp@distro_id`。
- 商品名推荐属性：`#vp@total_item_name`。
- `purchases_trigger`、`purchases_success`、`purchases_fail`、`order_finish`、`claim_order`、`refund_order` 是不同生命周期，不能仅按事件名推导付费人数或收入。

## 查询前检查

先写明项目、渠道、日期、主体、付费/非付费范围和版本，再检查看板是否已经处理迁移。若结果同时混用客户端与服务端事件，必须在结果中说明主体差异。

## 证据

- [战魂铭人交接文档](https://chillyroom.feishu.cn/wiki/QzInwjjLei28EEkaQvMcgxOPnyd)
- [战魂铭人大事件记录](https://chillyroom.feishu.cn/wiki/wikcnZJns9CpwbKO3XoRsgxSmUh)
