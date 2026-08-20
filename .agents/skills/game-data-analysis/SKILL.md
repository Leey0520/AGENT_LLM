---
name: game-data-analysis
description: Use the local GitLab Markdown knowledge base to plan and perform game data analysis with ThinkingData/AE. Applies to metric, event, SQL, report, dashboard, retention, monetization, progression, and player-behavior questions that require project-specific definitions; do not use it for knowledge-repository maintenance alone.
---

# Game Data Analysis

Read [references/knowledge-routing.md](references/knowledge-routing.md) before using project knowledge.

## Workflow

1. Identify the game project, analysis question, date range, timezone, and intended output. Resolve the project from `knowledge/projects/`; never infer it from a similar game.
2. Read `index.md`, the selected project's `project.yaml`, and only the business, data-contract, metric, decision, and playbook pages required by the question.
3. Confirm APPID, user subject, timezone, event and property definitions, metric numerator and denominator, filters, grain, observation cutoff, and known data issues. Stop and list missing or conflicting items instead of borrowing another project's definition.
4. Draft complete runnable SQL. Before any AE/ThinkingData execution, show the full SQL together with project, APPID, timezone, and date range, then wait for explicit user approval.
5. After approval, use the installed `ae-analysis` Skill and authorized `ae-cli` for discovery, query, export, or analysis-asset work. Do not guess physical tables, capability IDs, command parameters, or permissions.
6. Validate totals, denominator coverage, zero-event users, time maturity, duplicated identities, and obvious anomalies before interpreting the result.
7. Report the definition used, knowledge IDs and paths, query scope, SQL, result, conclusion, limitations, and recommended next action.

Use Feishu CLI only for the requested delivery artifact. Do not treat a Feishu document or dashboard as the sole source of metric or tracking truth.

Do not write analysis conclusions into formal knowledge automatically. If the user asks to preserve a conclusion that has not been reviewed, create a draft under `inbox/generated/` with its evidence and source paths.
