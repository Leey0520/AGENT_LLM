---
name: knowledge-maintenance
description: Create, restructure, review, validate, index, and safely synchronize the game analytics Markdown knowledge base. Use for project onboarding, metric or tracking documentation, candidate promotion, repository hygiene, and knowledge updates; do not use for ordinary data analysis unless knowledge itself must change.
---

# Knowledge Maintenance

Read [references/document-contract.md](references/document-contract.md) before creating or promoting knowledge pages.

## Workflow

1. Fetch remote state with `node scripts/sync-knowledge.mjs`. Do not overwrite local changes, resolve a divergence automatically, or force push.
2. Classify the content as platform, method, project-specific, or unreviewed candidate. Game events, properties, identities, APPIDs, timezones, and final metric definitions always belong to one project.
3. Put AI-derived or unreviewed content under `inbox/generated/`. Move it into `knowledge/` only after explicit review; new formal content begins as `draft` unless the owner explicitly approves it.
4. Preserve stable `id` values when editing. Update `reviewed_at`, owner, status, evidence, and cross-links when their meaning changes.
5. Run `node scripts/knowledge-tool.mjs build-index` and `node scripts/knowledge-tool.mjs validate --check-index`.
6. Inspect `git diff --check`, `git status --short`, and the complete diff. Never stage `.ae-cli/`, credentials, personal data, or generated exports.
7. Use a branch and Merge Request for formal changes unless the user explicitly authorizes another Git workflow. Never push, merge, or alter remote state without task-specific authorization.

When onboarding a game, copy `knowledge/projects/_template/` to a stable lowercase project slug and complete `project.yaml` before adding metrics or running analysis.
