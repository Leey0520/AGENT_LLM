# 游戏数据分析知识库

这是 Codex、数数（ThinkingData/AE）和飞书分析工作流的唯一正式知识仓库和运行配置源。`main` 同时保存知识正文、Skills、Hooks 和 `AGENTS.md`；Codex 通过本地 Git 工作区直接读取 Markdown，不需要让 Skill 逐页调用 GitLab API。

仓库中的 `.agents/`、`.codex/` 和 `AGENTS.md` 是唯一受 Git 管理的源文件；用户级 `C:\Users\Administrator\.codex\` 是供 Codex 从任意项目目录运行的安装副本。执行 `node scripts/install-global-codex.mjs` 可将仓库源文件同步到用户级全局目录，不会覆盖模型、MCP 或授权配置。

## 工作链路

```text
GitLab main（知识 + Skill/Hook/AGENTS 源文件）
    ↓ git pull / 安全快进
本地 Git 工作区
    ↓ install-global-codex.mjs
Codex 用户级全局运行副本
    ↓ 全局 AGENTS.md + 全局 Skills/Hooks
Codex 分析流程
    ↓ ae-analysis Skill + 已授权 ae-cli
数数平台
    ↓ 分析结果
inbox/generated 候选知识
    ↓ 人工复核 + Merge Request
knowledge 正式知识 + index.md
```

各层职责：

- `knowledge/`：可被分析引用的知识正文。
- `knowledge/platform/`：数数、飞书、Git 等系统级操作边界。
- `knowledge/methods/`：跨项目通用的分析方法和检查清单，不保存某个游戏的最终口径。
- `knowledge/projects/<project>/`：该游戏独有的业务、埋点、属性、指标和已知问题。
- `AGENTS.md`：Git 管理的全局规则源文件；安装到 `C:\Users\Administrator\.codex\AGENTS.md` 后服务所有项目。
- `.agents/skills/`：Git 管理的全局 Skill 源文件；安装到 `C:\Users\Administrator\.codex\skills\` 后服务所有项目。
- `.codex/hooks.json` 和 `.codex/hooks/`：Git 管理的全局 Hook 源文件；安装到 `C:\Users\Administrator\.codex\` 后服务所有项目。
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
