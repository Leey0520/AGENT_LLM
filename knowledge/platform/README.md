---
id: platform.overview
title: 分析平台知识总览
scope: platform
status: approved
owner: data-analytics
reviewed_at: 2026-08-20
tags: [platform, governance, codex]
---

# 分析平台知识总览

本目录只描述跨游戏通用的系统操作方式、权限边界和工具职责，不保存任何游戏的 APPID、事件、属性、身份映射或指标口径。

## 平台分工

- GitLab `main`：正式知识的版本、评审和追溯。
- 本地 Git 工作区：Codex 实际读取 Markdown 的位置。
- Codex `AGENTS.md`：全仓规则和安全边界。
- 仓库 Skills：分析与知识维护的决策流程。
- Codex Hooks：安全同步和明确危险操作拦截。
- 数数 `ae-cli`：数据查询、分析资产和元数据等在线操作入口。
- 飞书 CLI：文档、表格和看板交付入口。

具体边界见 [tool-boundaries.md](tool-boundaries.md)。
