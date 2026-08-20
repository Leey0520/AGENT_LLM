---
id: method.project-organization
title: 游戏项目知识组织规则
scope: method
status: approved
owner: data-analytics
reviewed_at: 2026-08-20
tags: [projects, taxonomy, governance]
---

# 游戏项目知识组织规则

每个游戏使用一个稳定目录：`knowledge/projects/<project>/`。目录名使用小写英文、数字和连字符，创建后不要随展示名变化。

## 固定结构

- `project.yaml`：APPID、时区、用户主体、数据范围和负责人。
- `business/`：玩法、系统、版本和业务语义。
- `data-contract/events/`：事件触发和版本范围。
- `data-contract/properties/`：事件、用户或对象属性定义。
- `metrics/`：该游戏最终指标口径。
- `decisions/`：口径决策、迁移和已知数据问题。
- `playbooks/`：重复分析或报告流程。

平台操作可以共享，项目口径不能共享。复制 `_template/` 创建项目后，必须先完成 `project.yaml`，再把任何页面标为 `approved`。
