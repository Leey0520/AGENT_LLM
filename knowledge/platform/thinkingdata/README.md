---
id: platform.thinkingdata.overview
title: ThinkingData 数数平台知识总览
scope: platform
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [thinkingdata, ta, tracking, draft]
---

# ThinkingData 数数平台知识总览

本页是数数平台知识的入口。当前版本只吸收了用户提供的埋点方案工作簿、随附 Skill 参考包和仓库已有的 AE CLI 路由说明；公司飞书培训、埋点规范、验收流程和项目交接文档仍待用户身份授权后逐一抓取，因此本页不能作为最终执行口径。

## 已确认的资料边界

- 两份 `20260820` 埋点方案工作簿已按原表结构读取，项目数据分别存放在项目目录，不合并事件、属性或用户身份。
- 工作簿中的通用页（接入工具、数据类型、跨端接入、用户 ID、多端公共属性）内容高度重复；正式沉淀时只在平台层保留一份，项目层只保留项目差异和例外。
- 随附的 tracking-design 与 online-tracking-acceptance Skill 仅是参考材料，不能覆盖公司自己的工作流。
- 表格中出现大量 `161`、`163` 等值。当前只按原值保留，不把它们解释成标签、状态或字段含义，待原始文档确认。

## 当前工作流约束

1. 埋点设计前先读取公司规范、项目历史、当前数数方案和实际游戏更新文档。
2. 埋点验收遵循用户确认的顺序：先找版本更新看板；有合适看板就用看板；没有再看其他已有看板；最后才写 SQL。
3. 设计和验收都不得套用其他游戏的事件、属性、身份或指标口径。
4. 需要查询数数时先发现真实项目、事件、属性、看板和数据表；不得猜 `project_id`、表名或虚拟事件的物理实现。
5. 任何将要执行的 SQL 先完整展示，得到用户明确批准后才调用 `ae-cli`。

## AE CLI 路由索引

| 任务 | 首选 Skill/命令 | 边界 |
| --- | --- | --- |
| 查询当前埋点方案 | `ae-analysis` → `ae-cli tracking plan get/export` | 先确认真实 `project_id`；导出用于留档，不直接覆盖仓库草稿 |
| 查事件元数据 | `ae-analysis` → `ae-cli analysis-meta event list` | 这是元数据目录，不是事件计数或原始数据查询 |
| 版本验收看板 | `ae-analysis` → `analysis dashboard list`，再 `dashboard-report-data run/export` | 先看现有看板，SQL 是后备路径 |
| 埋点检查任务 | `ae-analysis` → `tracking check list/run/get/export` | 必须先读命令参考并使用已确认的检查范围 |
| 实时数据/错误 | `ae-analysis` → `tracking live-data`、`tracking ingest` | 用于在线样本和接入错误，不替代项目验收结论 |
| 数据表、维表和绑定 | `ae-metadata` | 先发现真实 ID；不猜物理表 |
| IDE、数仓、数据流 | `ae-dataops` | 只有任务确实涉及数仓开发或调度时使用 |
| SDK、LogBus、接入报错 | `ae-data-integration-helper` | 负责接入知识，不替代项目埋点口径 |
| 新建/导入埋点方案 | `ae-generate-tracking-plan` 或 `ae-cli tracking plan import-excel` | 仅在用户明确要求写入数数时使用；先完成草稿和冲突检查 |
| 生成埋点代码 | `ae-generate-tracking-code` | 仅在用户要求落地代码时使用 |
| AE 知识库 | `ae-kb` | 这是数数侧知识库，不是本 GitLab Markdown 知识库 |

## 待补齐资料

- 飞书埋点培训文档、埋点规范、验收工作流程、各类工作执行标准。
- 战魂铭人交接文档、设计拆解、总项目知识库。
- 两个项目的数数 `project_id`、APPID、时区、主用户主体和可用观察范围。
- 当前线上看板目录、版本看板命名规则、看板中使用的报告和验收阈值。

## 相关页面

- [来源与审阅记录](../../../inbox/generated/2026-08-20-tracking-knowledge-onboarding.md)
- [大江湖当前埋点方案](../../projects/dajianghu/data-contract/tracking-plan-current.md)
- [战魂铭人当前埋点方案](../../projects/zhansoul-mingren/data-contract/tracking-plan-current.md)
