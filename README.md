# 游戏数据分析知识库

这是 Codex、数数（ThinkingData/AE）和飞书分析工作流的正式知识仓库与运行配置源。`main` 同时保存知识正文、Skills、Hooks 和 `AGENTS.md`；Codex 通过本地 Git 工作区直接读取 Markdown，不需要让 Skill 逐页调用 GitLab API。

仓库中的 `.agents/`、`.codex/` 和 `AGENTS.md` 是受 Git 管理的源文件；用户级 `$CODEX_HOME` 是供 Codex 从任意项目目录运行的安装副本。执行 `node scripts/install-global-codex.mjs` 可将仓库源文件同步到用户级全局目录，不会覆盖模型、MCP 或授权配置。

## 工作流总览

```text
GitLab main（知识、Skill、Hook、AGENTS 源文件）
    ↓ 同步源文件并按需安装全局运行副本
本地知识库 + Codex 全局运行环境
```

不同任务使用不同工作流，不是所有任务都经过数数查询：

| 工作流 | 触发场景 | 主要读取内容 | 主要结果 |
| --- | --- | --- | --- |
| 知识维护 | 新增、修订、审核、整理知识 | `index.md`、Front Matter 契约、目标页面 | 正式知识或 `inbox/generated/` 候选、索引和校验结果 |
| 游戏数据分析 | 指标、留存、付费、行为、进度、SQL | ThinkingData 平台知识、目标项目知识、现有看板 | 分析方案、看板结果或经批准后执行的 SQL |
| 埋点方案设计 | 新版本、新功能、需求或 PRD | 公司埋点规范、项目埋点基线、项目历史问题、需求文档 | 可评审的项目埋点方案 |
| 埋点验收 | 上线版本或线上埋点检查 | 验收流程、版本看板、项目看板、数数验收能力 | 验收结论、异常清单和必要的 SQL 证据 |
| 报告与看板交付 | 将已确认结果交付团队 | 已验证的分析结果、飞书交付规范 | 飞书文档、表格、看板或分析资产 |
| 平台与工具操作 | 数数、飞书、GitLab、CLI、权限问题 | `knowledge/platform/` 与对应工具 Skill | 可验证的操作结果，不改变业务口径 |

所有工作流共享“先定位知识、再确认项目口径”的原则，但具体步骤由对应 Skill 和项目知识决定。

各层职责：

- `knowledge/`：可被分析引用的知识正文。
- `knowledge/platform/`：数数、飞书、Git 等系统级操作边界。
- `knowledge/methods/`：跨项目通用的分析方法和检查清单，不保存某个游戏的最终口径。
- `knowledge/projects/<project>/`：该游戏独有的业务、埋点、属性、指标和已知问题。
- `AGENTS.md`：Git 管理的全局规则源文件；安装到 `$CODEX_HOME/AGENTS.md` 后服务所有项目。
- `.agents/skills/`：Git 管理的全局 Skill 源文件；安装到 `$CODEX_HOME/skills/` 后服务所有项目。
- `.codex/hooks.json` 和 `.codex/hooks/`：Git 管理的全局 Hook 源文件；安装到 `$CODEX_HOME/` 后服务所有项目。
- `scripts/`：知识库同步、索引、校验和全局运行副本安装脚本。
- `inbox/`：AI 或人工尚未复核的候选知识。

## 首次使用

只需克隆一次：

```powershell
git clone https://gitlab.chilly.room/liyanzhun/llm_wiki.git
Set-Location .\llm_wiki
node scripts/install-global-codex.mjs
```

首次安装或 Hook 修改后，在 Codex 中执行 `/hooks`，审查并信任用户级全局 Hook。全局 Hook 未被信任时，Codex 会跳过它们，但仍可读取知识库普通文件。

## 日常同步

不需要反复 `clone`。Codex 会在会话启动时执行安全同步：先 `fetch`，仅当处于 `main`、工作区干净、本地没有领先或分叉时才 `merge --ff-only`。

也可手工执行：

```powershell
node scripts/sync-knowledge.mjs
node scripts/install-global-codex.mjs
```

如果存在本地修改、领先提交或分叉，知识库同步脚本只提示并停止，不覆盖文件。完成知识库同步后再运行安装脚本，更新 Codex 全局运行副本。正式知识和运行源文件建议通过分支和 Merge Request 进入 `main`。

## 新建游戏项目

1. 复制 `knowledge/projects/_template/` 为稳定英文或拼音项目标识，例如 `soul-knight/`。
2. 完成 `project.yaml` 中的 APPID、时区、用户主体和数据范围。
3. 分别补充 `business/`、`data-contract/`、`metrics/`、`decisions/` 和 `playbooks/`。
4. 运行索引和校验，再提交 Merge Request。

```powershell
node scripts/knowledge-tool.mjs build-index
node scripts/knowledge-tool.mjs validate --check-index
```

不同游戏的事件名、属性、用户识别和指标口径不得共享。`knowledge/methods/` 只提供方法；当项目最终口径缺失时，Codex 必须停止并向用户确认。

## 数数与飞书

- 数数数据操作使用已经安装并授权的 `ae-cli`，由 `ae-analysis` 等对应 Skill 约束发现、查询和资产操作。
- 仓库 Skill 负责先读取项目知识、形成 SQL、展示完整 SQL并等待批准，再调用数数能力。
- 飞书 CLI 用于交付报告和看板，不作为埋点或指标口径的唯一事实源。
- GitLab MCP 可用于 Issue、Merge Request、Pipeline 等协作，但本仓库 Markdown 的主读取方式始终是本地 Git 工作区。

## 安全边界

- 禁止提交 `.ae-cli/`、访问令牌、Cookie、私钥、`.env` 或任何授权缓存。
- 项目知识不得包含个人明细数据，只记录表、字段、口径、约束和经过脱敏的示例。
- AI 自动提炼的知识只能先写入 `inbox/generated/`，不能直接标为正式批准知识。
- 禁止 `git reset --hard` 和强制推送。

Codex 约定参考：[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Skills](https://learn.chatgpt.com/docs/build-skills)、[Hooks](https://learn.chatgpt.com/docs/hooks)。
