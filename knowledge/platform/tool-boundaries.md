---
id: platform.tool-boundaries
title: GitHub Codex 数数与飞书工具边界
scope: platform
status: approved
owner: data-analytics
reviewed_at: 2026-10-30
tags: [github, codex, thinkingdata, feishu]
---

# GitHub Codex 数数与飞书工具边界

## GitHub

仓库地址用于首次克隆和后续 Git 同步：

```text
https://github.com/Leey0520/AGENT_LLM.git
```

Codex 通过本地工作区读取 Markdown。GitHub 网页或集成工具用于处理 Issue、Pull Request 和 Actions 等协作对象，不是读取本地知识正文的必要条件。

GitHub `main` 同时保存知识正文和 Codex 运行源文件：`AGENTS.md`、`.agents/skills/`、`.codex/hooks.json`、`.codex/hooks/` 和 `.codex/config.toml`。从仓库根目录执行 `node scripts/install-global-codex.mjs`：Skills 安装到用户级 `~/.agents/skills/`，规则和 Hooks 安装到 `$CODEX_HOME`（未设置时为 `~/.codex/`）。

## Codex

- Git 管理的 `AGENTS.md` 安装到用户级 `$CODEX_HOME/AGENTS.md` 后，约束所有项目的来源、审批和安全规则。
- Git 管理的 `.agents/skills/` 安装到用户级 `~/.agents/skills/` 后，成为所有项目共用的工作流 Skill；它们按任务路由到本地知识库的 `knowledge/projects/<project>/`，不把某个游戏的口径写进通用 Skill。
- Git 管理的 `.codex/hooks.json` 和 `.codex/hooks/` 安装到用户级 `$CODEX_HOME/` 后，成为所有项目共用的 Hook，只做确定性的同步和安全拦截，不替代业务判断。
- Hook 首次出现或内容变化后需要在 `/hooks` 中重新审查和信任。

## 数数

- 在线数据操作使用已经授权的 `ae-cli`。
- 按任务调用 `ae-analysis`、`ae-metadata`、`ae-dataops` 等对应 Skill，不在本仓库复制 CLI 参数手册。
- 查询前必须从游戏项目知识确认 APPID、时区、用户主体、事件、属性和指标口径。
- 执行查询前必须展示完整 SQL 和范围并等待用户明确批准。
- 禁止把令牌、授权缓存或个人明细写入仓库。

## 飞书

飞书用于发布报告、文档、表格和看板。若飞书内容与本仓库正式口径冲突，应先在仓库中完成复核和版本更新，不能静默以飞书覆盖 Git 知识。
