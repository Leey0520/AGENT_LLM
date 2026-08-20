---
id: project.zhansoul-mingren.tracking-plan-current
title: 战魂铭人埋点方案使用基线
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [zhansoul-mingren, tracking, baseline, thinkingdata]
---

# 战魂铭人埋点方案使用基线

## 这张表能做什么

在线文档 [战魂铭人埋点数据设计方案](https://chillyroom.feishu.cn/wiki/VQPKwciGWiuK2EkFPsAcYjqJnTd) 是查历史事件、属性、显示名、类型、对象结构和变更记录的入口。它同时保留历史版本内容，表头存在旧版本标注，不能直接当作“当前线上全量方案”。做版本验收前，必须再用数数后台的方案状态、版本范围和线上事件确认。

## 读取顺序

1. 看当前可见的客户端事件表、用户表、服务端埋点和玩法实验室页签。
2. 用 `TA埋点ID名词映射表` 核对事件/属性英文名与中文显示名。
3. 用更新日志和埋点表更新日志确认哪个版本新增、修改、停用或只在某渠道生效。
4. 对对象和对象组打开子属性结构，不只看父属性行。
5. 发现方案与代码不一致时，先记录“方案状态”和“实际是否上报”，不要在知识库里静默改写方案。

## 已确认的设计基线

### 基础与引导

- `app_on_active`：启动游戏；`first_active` 是首次启动布尔值。
- `tap_start`：点击开始游戏；历史表中还有 `time_stamp` 和 `game_length`，是否继续使用要按当前版本确认。
- `tutorial_progress`：新手引导进度，使用 `step_name` 和 `section_name` 区分步骤与阶段。

### 关卡与战斗

- `enter_level` 与 `game_over` 分开，分别表达进入关卡和结算；二者属性粒度不同，不能合并成一个“战斗事件”。
- 单人、局域网、远程联机有不同事件族，例如 `enter_level_network`、`game_over_network`、`remote_enter_level` 和远联结算事件；不能跨模式混算。
- `skill_msg`、`boss_battle`、`boss_msg`、`equip_skills_oa` 等对象组要按子属性逐项验收；对象组不可嵌套。

### 经济、商业化和广告

- 资源产出/消耗事件使用数量、来源、变化后余额等字段；要检查负数、小数和空值是否符合该事件的说明。
- `purchases_trigger`、`purchases_success`、`purchases_fail` 与服务端订单事件分开；金额、商品 ID、支付结果按订单链路确认。
- 广告点击、播放成功、播放失败、下载点击和关闭分别建事件，不能把“有广告事件”当成“广告成功”。

### 方案中的历史遗留

- `enter_level`/`game_over` 仍可看到早期字符串字段、重复列表字段和后续停止上报字段；查询前必须按版本确认，不要把历史字段当作现行字段。
- 方案更新记录中明确停止过 `weapon_ce`、`weapon_quality`、`weapon_ce_list`、`equip_mainSkill`、`equip_style`、`equip_secondSkill`、`runningDataSkills` 等字段；当前使用应以数数线上方案和生效版本为准。
- 方案中出现 `weapon_upgrade` 的“武器铭刻没上报”待确认记录，不能直接用它判断武器升级数据完整。

## 版本联动

2026 年版本日志显示 v3.4.0 引入神话阵营、彼岸试炼、塔拉卡试炼和灯神活动，v3.5.0 引入六周年活动和存档覆盖保护。这些内容是否有对应埋点，要先在方案表查事件和版本记录，再到版本看板验收；不能因为更新日志出现功能名就推断存在同名事件。

## 证据

- [战魂铭人埋点数据设计方案](https://chillyroom.feishu.cn/wiki/VQPKwciGWiuK2EkFPsAcYjqJnTd)
- [战魂铭人更新日志与游戏内邮件](https://chillyroom.feishu.cn/wiki/wikcnAs9kBF3ZgbYzZ6T9xQCfpd)
- 本地参考表：`C:\Users\Administrator\Downloads\战魂铭人_埋点方案_20260820.xlsx`。本地表只作为离线比对，不替代线上方案。
