---
id: project.dajianghu.tracking-plan-current
title: 大江湖埋点方案使用基线
scope: project
project: dajianghu
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [dajianghu, tracking, baseline, thinkingdata]
---

# 大江湖埋点方案使用基线

本页把本地方案表里已经能确认的业务结构提炼成查询入口，不把模板假设升级成正式口径。APPID、数数项目 ID、时区、主体和线上生效版本仍需从项目交接和数数后台确认后才能执行查询。

## 事件族

- 基础与生命周期：`app_on_active`、`ta_app_start`、`ta_app_end`、`create_role`、`player_account_login`、`next_day_login`。
- 教程与养成：`guide`、`tutorial_select_class`、`attribute_upgrade`、`class_change`、`skill_slot_upgrade`、`create_star_vein`。
- 战斗：`battle_enter`、`battle_end`。战斗对象组使用角色/装备/掉落等明细时，按 `character_id` 等稳定实体关联，不把对象组拍平成一个字符串。
- 商业化：`create_order`、`claim_order`、`refund_order`、`buy_fullgame_call`、`buy_fullgame_success`。订单 ID、商品、金额和支付状态必须按实际服务端链路确认。

## 公共与用户字段

方案中可见的公共上下文包括渠道、版本、存档、UTC 事件时间以及资源库存；用户表包括存档、唯一 ID、最高剧情进度和活跃集合等长期状态。字段能否用于去重、连接或指标计算，必须等项目确认主体和字段类型后再决定。

## 对象组验收

`battle_enter`/`battle_end` 的战斗角色信息、掉落物等对象组需要验收父属性、子属性、行粒度和空列表/空对象组约定；不能只看事件有无触发。

## 使用限制

- 本地文件 `C:\Users\Administrator\Downloads\大江湖_埋点方案_20260820.xlsx` 是设计输入，不代表已上线数据。
- 方案中的空说明、历史标记和未确认值不做语义猜测；发现冲突时保留“待确认”，不复制战魂铭人的字段或主体规则。
- 设计或验收前仍需补充大江湖版本需求文档、数数线上方案和已有看板。
