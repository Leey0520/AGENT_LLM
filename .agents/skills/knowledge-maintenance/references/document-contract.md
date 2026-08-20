# Document Contract

## Formal page front matter

Every Markdown file under `knowledge/` must start with YAML Front Matter containing:

```yaml
---
id: stable-lowercase-id
title: Human-readable title
scope: platform
status: draft
owner: owner-or-team
reviewed_at: 2026-08-20
tags: [tag-one, tag-two]
---
```

Allowed `scope` values are `platform`, `method`, and `project`. Allowed `status` values are `draft`, `approved`, and `retired`.

Project pages also require:

```yaml
project: project-directory-name
```

Use stable lowercase IDs with letters, digits, dots, underscores, or hyphens. Do not encode a mutable title or review date into the ID.

## Status meaning

| Status | Meaning | Analysis use |
| --- | --- | --- |
| `draft` | Structured but not finally approved | Use only with status disclosed and no conflicting approved page |
| `approved` | Reviewed by the stated owner | Preferred source for execution |
| `retired` | Historical and no longer valid | Do not use for new execution |

`reviewed_at` is the most recent semantic review date, not an automatic edit timestamp. Cosmetic edits do not falsely refresh it.

## Page body

Each formal page should state:

- what the knowledge defines and what it excludes
- the exact business or data meaning
- calculation or field logic where applicable
- applicable time range and known exceptions
- evidence or source references
- links to related stable IDs or repository paths

Metric pages must make numerator, denominator, filters, grain, timezone, maturity, and zero-event handling explicit. Event and property pages must make physical name, trigger timing, type, nullability, value semantics, and version scope explicit.

## Candidate knowledge

Files in `inbox/generated/` are not formal pages. Include source conversation or analysis, evidence, proposed destination, unresolved questions, and a named reviewer. Never label a generated candidate `approved`.

## Promotion checklist

Before moving a candidate into `knowledge/`:

- confirm the correct game project
- verify APPID, timezone, user subject, event/property names, and date scope
- resolve conflicts with existing stable IDs
- remove personal data and secrets
- assign owner and review date
- rebuild and validate `index.md`
- review the complete Git diff
