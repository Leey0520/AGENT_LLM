---
name: knowledge-maintenance
description: Create, restructure, review, validate, index, and safely synchronize the game analytics Markdown knowledge base. Use for project onboarding, metric or tracking documentation, candidate promotion, repository hygiene, and knowledge updates; do not use for ordinary data analysis unless knowledge itself must change.
---

# Knowledge Maintenance

## Shared knowledge-base location

Use `$knowledgeRoot = $env:LLM_WIKI_ROOT` as the knowledge-base root. All paths and commands below are relative to that root, even when Codex is working in another project directory; if it is unset, stop and ask for the knowledge-base root instead of guessing.

Read the skill-local `references/document-contract.md` before creating or promoting knowledge pages.

## Workflow

1. Fetch remote state with `node "$knowledgeRoot\scripts\sync-knowledge.mjs"` after resolving the knowledge-base root. Do not overwrite local changes, resolve a divergence automatically, or force push.
2. Classify the content as platform, method, project-specific, or unreviewed candidate. Game events, properties, identities, APPIDs, timezones, and final metric definitions always belong to one project.
3. Put AI-derived or unreviewed content under `inbox/generated/`. Move it into `knowledge/` only after explicit review; new formal content begins as `draft` unless the owner explicitly approves it.
4. Preserve stable `id` values when editing. Update `reviewed_at`, owner, status, evidence, and cross-links when their meaning changes.
5. Run `node "$knowledgeRoot\scripts\knowledge-tool.mjs" build-index` and `node "$knowledgeRoot\scripts\knowledge-tool.mjs" validate --check-index` from the knowledge-base root.
6. Inspect `git diff --check`, `git status --short`, and the complete diff. Never stage `.ae-cli/`, credentials, personal data, or generated exports.
7. Use a branch and Merge Request for formal changes unless the user explicitly authorizes another Git workflow. Never push, merge, or alter remote state without task-specific authorization.

## Source extraction rules

- For Feishu sources, read the document body, embedded Sheets/Base fields and records that affect the requested workflow. Screenshots, rendered tables and image alt text are UI evidence only; never copy them into formal knowledge.
- Extract decisions as “when to do what”, field semantics, exceptions, owners and verification steps. Do not create pages whose main content is a source filename, row count, attribute count or ingestion log.
- When a source table contains historical versions, preserve the version boundary and label the table as a baseline or index unless the online platform confirms it is current.
- For a project-specific page, link the source and record unresolved fields instead of guessing. Do not promote generic Skills or industry conventions over company documents.

When onboarding a game, copy `knowledge/projects/_template/` to a stable lowercase project slug and complete `project.yaml` before adding metrics or running analysis.
