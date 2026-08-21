---
name: game-data-analysis
description: Use the local GitLab Markdown knowledge base to plan and perform game data analysis with ThinkingData/AE. Applies to metric, event, SQL, report, dashboard, retention, monetization, progression, and player-behavior questions that require project-specific definitions; do not use it for knowledge-repository maintenance alone.
---

# Game Data Analysis

## Shared knowledge-base location

Use `LLM_WIKI_ROOT` when it is set; otherwise use `C:\Users\Administrator\Documents\通用项目` as the knowledge-base root. Resolve `index.md`, `knowledge/platform/`, and `knowledge/projects/` from that root, not from the current game project's working directory. The current working directory may be a different game repository.

## Mandatory routing

Before doing any game-data task, read the smallest complete set in this order from the knowledge-base root:

1. `index.md`.
2. `knowledge/platform/thinkingdata/README.md` and the relevant ThinkingData page(s).
3. The selected project's `project.yaml`.
4. The project's business, data-contract, decisions, metrics, and playbook pages required by the question.

For tracking design, always read the company tracking standard, the project tracking baseline, the project's known issues, and the user-provided version/PRD document before drafting events. For tracking acceptance, always read the project acceptance playbook and check the version dashboard before using event analysis or SQL. The order is: version dashboard → existing project dashboards → ThinkingData data acceptance/event analysis/realtime data → SQL fallback.

Do not treat screenshots, rendered tables, row counts, or the attached generic tracking Skills as business knowledge. Do not use another game's events, properties, identity rules, APPID, or metric definitions as fallback.

## Project readiness

Resolve the game project, analysis question, date range, timezone, and intended output. Confirm APPID/project ID, query cluster, primary user subject, identity merge rule, event/property definitions, metric numerator and denominator, filters, grain, version range, maturity, and zero-event handling. A null or contradictory value in `project.yaml` is unresolved; stop before online execution and list the missing decision.

For `zhansoul-mingren`, non-payment analysis defaults to `#device_id` on migrated packages; payment uses the service-side user subject. The current payment virtual event is `ta@claim_order_finish`, with `#vp@distro_id` and `#vp@total_item_name` as recommended attributes. Verify the project page before using these rules outside this project.

## SQL and AE execution

Draft complete runnable SQL only after the project and platform pages are read. Before any AE/ThinkingData execution, show the full SQL together with project, APPID, timezone, date range, identity subject, and query scope, then wait for explicit user approval.

After approval, use the installed `ae-analysis` Skill and authorized `ae-cli` for discovery, query, export, or analysis-asset work. Do not guess physical tables, capability IDs, command parameters, virtual-event expansion, or permissions. Discover the real project, event, property, dashboard, and table first.

Validate totals, denominator coverage, zero-event users, time maturity, duplicated identities, version/channel coverage, and obvious anomalies before interpreting results. Keep numeric ratios numeric; add percent text only when the requested output is display text.

## Output and knowledge updates

Report the definition used, project and query scope, knowledge paths, SQL or exact asset reference, validation actions, result, limitations, and next action. Distinguish confirmed facts, assumptions, and unresolved items.

Do not write analysis conclusions into formal knowledge automatically. If the user explicitly asks to preserve an unreviewed conclusion, create a candidate under `inbox/generated/` with evidence and a named reviewer; formal promotion is handled by `knowledge-maintenance`.
