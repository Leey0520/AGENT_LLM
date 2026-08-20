---
id: project.dajianghu.tracking-plan-current
title: 大江湖当前埋点方案索引（2026-08-20）
scope: project
project: dajianghu
status: draft
owner: unassigned
reviewed_at: 2026-08-20
tags: [dajianghu, tracking, thinkingdata, source-workbook]
---

# 大江湖当前埋点方案索引

## 来源与状态

- 来源文件：`大江湖_埋点方案_20260820.xlsx`。
- SHA-256：`DC973A3838C279D085AE6D3B4D7615237866113B79CDBCE4EA1941451299B17B`。
- 读取范围：9 个工作表；`#事件数据` 19 个事件、94 条事件属性行、56 个去重属性名；`#公共事件属性` 7 条；`#用户数据` 7 条。
- 当前只作为项目方案索引，APPID、数数项目 ID、时区、用户主体和线上生效范围均未从数数或飞书交接文档确认。

## 用户 ID 草案

工作簿同时列出单账号单角色和单账号多角色两种场景：`#account_id` 是账户或角色业务 ID，`#distinct_id` 是设备相关或访客 ID。实际项目采用哪一种必须以项目交接文档和线上数数配置为准，不能从模板直接推断。

## 事件目录

| 事件名 | 属性行数 |
| --- | ---: |
| `app_on_active` | 1 |
| `attribute_upgrade` | 2 |
| `battle_end` | 18 |
| `battle_enter` | 10 |
| `buy_fullgame_call` | 1 |
| `buy_fullgame_success` | 1 |
| `claim_order` | 15 |
| `class_change` | 5 |
| `create_order` | 15 |
| `create_role` | 5 |
| `create_star_vein` | 2 |
| `guide` | 1 |
| `next_day_login` | 2 |
| `player_account_login` | 1 |
| `refund_order` | 11 |
| `skill_slot_upgrade` | 1 |
| `ta_app_end` | 1 |
| `ta_app_start` | 1 |
| `tutorial_select_class` | 1 |

## 公共事件属性

| 属性名 | 类型 | 显示名 |
| --- | --- | --- |
| `channel_name` | 文本 | 渠道名 |
| `hero_token_count` | 数值 | 当前拥有的江湖英雄贴 |
| `martial_fragment_count` | 数值 | 当前拥有的江湖武学残章 |
| `meat_bun_count` | 数值 | 当前拥有的大肉包 |
| `save_id` | 文本 | 存档 ID |
| `utc_time` | 时间 | 事件触发时 UTC 时间戳 |
| `version_name` | 文本 | 客户端版本号 |

## 用户属性

| 属性名 | 类型 | 更新方式 |
| --- | --- | --- |
| `active_set_info` | 列表 | 待确认 |
| `channel_name` | 文本 | `user_set` |
| `max_level_id` | 文本 | 待确认 |
| `save_id_list` | 列表 | 待确认 |
| `unique_id` | 文本 | `user_set` |
| `user_max_story_mode_level` | 数值 | `user_set` |
| `version_name` | 文本 | `user_set` |

## 结构性注意点

- `battle_end`、`battle_enter` 使用 `battle_character_info` 对象组；`battle_end` 还使用 `drop_item_info` 对象组。子属性必须按对象组的实际结构验收。
- 订单链路同时存在 `create_order`、`claim_order`、`refund_order` 和买断相关事件；订单 ID、商品字段、金额和支付状态的最终含义需要结合项目业务和线上字段绑定确认。
- 表格中的事件说明、属性说明存在空值或 `161`/`163` 等值；本页没有把这些值解释为业务语义。
- 这份索引不是完整方案替代品；需要逐行方案时以用户提供的工作簿和数数当前方案导出为准。
