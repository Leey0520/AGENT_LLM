# Knowledge Routing

## Source order

Use sources in this order:

1. Approved pages inside the selected `knowledge/projects/<project>/` directory.
2. Other non-retired pages in the same project, with their status disclosed.
3. `knowledge/platform/` for tool behavior and access boundaries.
4. `knowledge/methods/` for reusable analysis checks.
5. `inbox/` only when the user explicitly requests candidate review.

Never use another project's data contract or metric as fallback. General methods may suggest questions but cannot establish a project's final definition.

## Required project context

Read `project.yaml` first and confirm these values are populated:

- project identifier and display name
- ThinkingData project or APPID
- business timezone and natural-day boundary
- primary user subject and any ID merge rule
- authorized data scope or cluster where applicable
- knowledge owners

Null, placeholder, contradictory, or retired values are unresolved. Stop before online execution and ask for the missing decision.

## Route by question

| Question | Required project locations |
| --- | --- |
| Product or gameplay meaning | `business/` |
| Event availability or semantics | `data-contract/events/` |
| Property type or value meaning | `data-contract/properties/` |
| KPI, numerator, denominator, filters | `metrics/` |
| Known gaps, migrations, exceptions | `decisions/` |
| Repeated report or analysis procedure | `playbooks/` |

Read the smallest complete set. Follow links from those pages only when they affect the current question.

## Conflict handling

- Prefer the page with the exact project and metric/event identity.
- Do not silently prefer a newer review date if definitions disagree.
- Show both stable IDs, paths, review dates, and conflicting fields.
- Ask the user or documented owner to resolve the conflict before execution.

## Analysis evidence

For every final analysis, preserve:

- project and APPID
- timezone and date range
- stable knowledge IDs and repository paths
- metric/event/property status and review date
- executable SQL or exact asset/query reference
- result validation performed
- unresolved limitations
