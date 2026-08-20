---
id: project.zhansoul-mingren.known-data-issues
title: 战魂铭人数据历史问题与规避
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [zhansoul-mingren, data-quality, migration, known-issues]
---

# 战魂铭人数据历史问题与规避

| 问题 | 影响范围 | 查询规避 |
| --- | --- | --- |
| 迁移渠道设备主体变化 | 2024 年迁移包；迁移后数数生成新的用户主体 | 非付费按 `#device_id`；不要用账号 ID 代替；按渠道和迁移日期拆分。 |
| 服务端付费没有设备号 | 付费事件及订单链路 | 使用服务端用户主体；迁移渠道付费记录从 2024-07-19 起才有。 |
| 在线埋点表混有历史版本 | 客户端事件、旧属性和停用字段 | 先核对版本生效、数数方案状态和更新日志；不把表头或旧页签当现行口径。 |
| 首次入库类型错误 | 任何新属性 | 先修程序上报，再由数数管理员处理错误元数据；不要在 SQL 里强转掩盖。 |
| 对象/对象组父子结构不一致 | 战斗、道魂、技能和 Boss 快照 | 事件分析点开原始明细，父属性和每个子属性分别验收。 |
| 版本更新内容不一定有独立看板或事件 | 新英雄、皮肤、礼包和活动 | 先查版本看板和基础看板映射，再查现有事件；SQL 只作最后兜底。 |

## 当前已知的大事件

2024 年迁移、2024 年渠道分批上线、2026-05-05 国内集群登录事故等大事件会影响活跃、新增、登录和版本趋势。解释趋势拐点前先查项目大事件记录和更新日志。

## 证据

- [战魂铭人交接文档](https://chillyroom.feishu.cn/wiki/QzInwjjLei28EEkaQvMcgxOPnyd)
- [战魂铭人大事件记录](https://chillyroom.feishu.cn/wiki/wikcnZJns9CpwbKO3XoRsgxSmUh)
- [战魂铭人更新日志与游戏内邮件](https://chillyroom.feishu.cn/wiki/wikcnAs9kBF3ZgbYzZ6T9xQCfpd)
