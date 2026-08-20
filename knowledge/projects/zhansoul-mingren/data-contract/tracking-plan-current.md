---
id: project.zhansoul-mingren.tracking-plan-current
title: 战魂铭人当前埋点方案索引（2026-08-20）
scope: project
project: zhansoul-mingren
status: draft
owner: unassigned
reviewed_at: 2026-08-20
tags: [zhansoul-mingren, tracking, thinkingdata, source-workbook]
---

# 战魂铭人当前埋点方案索引

## 来源与状态

- 来源文件：`战魂铭人_埋点方案_20260820.xlsx`。
- SHA-256：`F1C9FEA4BBD6E3166088931F95850CE3FB38356E2DC8CC9A72291E2CAE1B6DB3`。
- 读取范围：9 个工作表；`#事件数据` 194 个事件、3811 条事件属性行、487 个去重属性名；`#公共事件属性` 23 条；`#用户数据` 69 条。
- 当前只作为项目方案索引，APPID、数数项目 ID、时区、用户主体和线上生效范围均未从数数或飞书交接文档确认。

## 用户 ID 草案

工作簿列出 `#account_id` 与 `#distinct_id` 的通用设计说明，但没有替代项目交接文档。战魂铭人的账号、角色、设备、平台和访客 ID 关系必须以项目交接资料和线上配置为准。

## 事件目录（按属性行数降序）

| 事件名 | 属性行数 |
| --- | ---: |
| `game_over` | 122 |
| `enter_level` | 101 |
| `game_over_network` | 86 |
| `dailyActivity_progress` | 47 |
| `enter_level_network` | 41 |
| `shop_jew_buy` | 39 |
| `mel_trail_end` | 38 |
| `skill_buy` | 38 |
| `style_buy` | 38 |
| `hero_buy` | 38 |
| `tap_start` | 38 |
| `browse_hero` | 37 |
| `drinks_buy` | 37 |
| `UnityException` | 37 |
| `completeTravel` | 37 |
| `ta_app_start` | 37 |
| `unlock_hero_skin` | 36 |
| `fightClub_fightOver` | 36 |
| `purchases_fail` | 36 |
| `order_finish` | 36 |
| `browse_heroPortrait` | 36 |
| `enter_shop` | 35 |
| `decomposition_machine_use` | 35 |
| `heroPiece_heroMerge` | 35 |
| `purchases_success` | 35 |
| `purchases_trigger` | 35 |
| `ta_app_end` | 35 |
| `useSoulStone` | 34 |
| `useRedStone` | 34 |
| `dailyActivity_rewardCollect` | 34 |
| `app_on_active` | 34 |
| `browse_heroSkin` | 34 |
| `choose_character` | 34 |
| `completeStory` | 34 |
| `start_host` | 32 |
| `talk_asura` | 32 |
| `talk_builderCat` | 32 |
| `talk_crystallBall` | 32 |
| `talk_mailbox` | 32 |
| `talk_phonograph` | 32 |
| `talk_zhao` | 32 |
| `disconnect` | 32 |
| `refresh_host` | 32 |
| `join_network` | 34 |
| `exit_network` | 34 |
| `UnityException` | 37 |

完整 194 个事件名及逐行属性仍以工作簿和数数当前方案为准；此处只保留高频事件索引，避免把未经过项目历史核验的大表复制成“最终口径”。

## 公共事件属性

工作簿列出 23 条公共事件属性，主要是 AB 测试、货币/道具库存、当前角色和版本等状态字段。代表性字段包括：`ab_test_group`（对象组及其 `group`、`test_name` 子属性）、`current_hero_level`、`current_soul_stone`、`current_red_stone`、`current_battle_key`、`current_use_power_point`。

## 用户属性

工作簿列出 69 条用户属性，包含账号与设备、版本、累计行为、拥有内容、付费累计、角色等级和对象组状态等。代表性对象组包括：

- `asura_power_use`：修罗之力方案页及已用/未用数量。
- `equipped_esr_balls`：已装备道魂及词条、角色子属性。
- `total_role_level`：用户拥有角色及等级。

## 版本与历史注意点

- 事件名中同时存在通用事件、玩法事件、网络事件、系统错误事件、支付事件和带年份/月后缀的历史或活动事件（例如 `_202606`、`_2023`）。后缀不是可跨项目复用的命名规则，必须按项目历史判断是否仍在线。
- `enter_level`、`game_over` 及其网络版本包含大量对象/对象组快照；验收时父属性和每一个子属性都要独立核验。
- 同一业务域存在 `purchases_trigger`、`purchases_success`、`purchases_fail`、`order_finish`、`claim_order`、`refund_order` 等生命周期事件，不应只凭事件名推断“付费人数”或“订单成功”。
- 表格中大量单元格出现 `161` 等值，且部分显示名/说明为空；本页不对这些值进行语义猜测。
