# 游戏数据分析知识库

本仓库是公司游戏数据分析的统一知识源，同时管理 Codex 和 Claude 的共享运行源文件。`main` 中的正式知识、项目资料、Skills、Hooks、`AGENTS.md`/`CLAUDE.md` 和维护脚本共同组成可复用的工作环境。

## 内容边界

```text
knowledge/
├─ platform/                 数数、飞书、Git 等平台规则与操作边界
├─ methods/                  跨项目通用方法、工作流、检查清单
└─ projects/<project>/       单个游戏的业务、埋点、指标、身份与历史问题

.agents/skills/              共享 Skill 源文件
.codex/                      Codex 配置与 Hook 源文件
.claude/                     Claude 配置与 Hook 源文件
AGENTS.md / CLAUDE.md        两个平台的全局工作约定
schemas/                     文档格式契约
scripts/                     同步、索引、校验和全局安装脚本
inbox/                       尚未复核的候选资料，不是正式口径
```

`knowledge/` 保存可以被后续任务直接引用的事实、规则和定义；一次分析的 SQL、截图、报告和会话记录不进入这里。项目事件、属性、用户主体、APPID、时区和指标口径只能写在对应的 `knowledge/projects/<project>/`，不能放进通用方法或 Skill。

## 当前工作流

| 工作 | 主要知识入口 | 交付物 |
| --- | --- | --- |
| 游戏数据分析 | `knowledge/platform/thinkingdata/` + 项目目录 | 分析方案、看板结果或获批执行的 SQL |
| 埋点方案设计 | 平台埋点规范 + 项目埋点基线 + 需求资料 | 可评审的项目埋点方案 |
| 埋点验收 | 验收流程 + 项目看板/版本看板 + 项目历史问题 | 验收结论、异常清单、必要的 SQL 证据 |
| 知识维护 | `index.md` + 目标页面 + 文档契约 | 正式页面或 `inbox/` 候选、索引和校验结果 |
| 报告交付 | 已验证的分析结果 + 飞书交付要求 | 飞书文档、表格、看板或分析资产 |
| 平台操作 | `knowledge/platform/` + 对应工具 Skill | 可验证的数数、飞书或 GitLab 操作 |

共同原则：先从 `index.md` 定位，再读取平台规则和目标项目页面；项目口径缺失、冲突或过期时先确认，不用其他项目的定义替代。

## 已有知识与待补内容

完整页面列表见 [知识索引](index.md)。

| 范围 | 已有内容 | 使用边界 |
| --- | --- | --- |
| [数数平台](knowledge/platform/thinkingdata/README.md) | 公司埋点标准、数据类型与身份、验收流程、项目空间与看板操作 | 公司流程摘要及原始资料入口，不是数数官方手册的完整镜像 |
| [通用方法](knowledge/methods/README.md) | 数据质量检查、埋点设计、埋点验收 | 提供方法，不替代游戏口径 |
| [战魂铭人](knowledge/projects/zhansoul-mingren/business/game-overview.md) | 业务概览、身份与付费口径、埋点基线、验收与历史问题 | APPID、数数项目 ID 等配置尚未补齐；版本背景以页面复核日期为界 |
| [大江湖](knowledge/projects/dajianghu/data-contract/tracking-plan-current.md) | 埋点方案基线 | APPID、数数项目 ID、时区和用户主体尚未补齐 |

两个游戏尚无独立的指标定义页。页面中的 `draft` 表示待最终确认，`approved` 表示已复核，`retired` 表示不再适用；收进仓库不等于已经确认。来源链接和历史版本限制是知识的依据，予以保留。

## Codex、Claude 与本地仓库

GitLab `main` 是正式知识源；本地仓库是其工作副本。Codex 和 Claude 的全局运行目录是从本仓库安装的副本，服务所有游戏工作目录。更新仓库源文件后，分别执行对应安装脚本才能更新全局运行副本：

```powershell
node scripts/install-global-codex.mjs
node scripts/install-global-claude.mjs
```

安装后的运行副本绑定本机知识库路径；Git 管理的源文件保持可移植。SessionStart Hook 尝试同步仓库并提示位置，PreToolUse Hook 用于危险操作检查。Hook 不会自动把整库正文读入任务。

首次使用时克隆一次即可：

```powershell
git clone https://gitlab.chilly.room/liyanzhun/llm_wiki.git
Set-Location .\llm_wiki
node scripts/install-global-codex.mjs
node scripts/install-global-claude.mjs
```

日常更新可手工执行：

```powershell
node scripts/sync-knowledge.mjs
```

同步脚本先 fetch；仅在工作区干净、位于 `main` 且没有本地领先或分叉时快进更新。功能分支、有本地修改或分叉时只提示，不覆盖内容。启动同步依赖 Hook 已安装、启用并获运行许可，失败时可使用上述命令手动同步。

正式变更使用分支和 Merge Request 进入 `main`。只改知识正文，同步后即可读取；改动规则、Skill 或 Hook 源文件，还需运行对应安装脚本。CLI 安装和授权独立配置，不由知识库安装脚本完成。

## 新建或更新知识

1. 先确认内容属于平台、通用方法、具体项目还是候选资料。
2. 未复核资料先放入 `inbox/`，AI 提炼内容放入 `inbox/generated/`；核对来源和适用范围后再整理到正式目录。项目知识另需确认身份、时区和相关字段。
3. 正式页面保留稳定 `id`、状态、负责人、复核日期和来源；纯文字整理不改变语义复核日期。
4. 更新后运行：

```powershell
node scripts/knowledge-tool.mjs build-index
node scripts/knowledge-tool.mjs validate --check-index
git diff --check
```

可直接在 GitLab 分支编辑 Markdown，也可提供资料让 Agent 修改本地仓库；本地编辑、commit、push 和合并是不同步骤。新增游戏从 `knowledge/projects/_template/` 复制，设置唯一项目标识和页面 ID，并补齐 `project.yaml`。文档格式见 [文档契约](.agents/skills/knowledge-maintenance/references/document-contract.md)。

## 数数与飞书

数数查询和分析资产操作通过已授权的 `ae-cli` 及对应 AE Skill 完成。执行查询前必须核对项目、APPID、时区、日期范围和项目口径，并向用户展示完整 SQL，获明确批准后才执行。飞书用于读取公司资料和交付结果，不替代项目知识中的指标与埋点定义。

## 安全

不要把令牌、Cookie、私钥、`.env`、授权缓存、真实设备标识或用户级明细提交到仓库；不要使用强制推送或破坏性 Git 操作。
