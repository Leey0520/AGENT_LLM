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

## Codex、Claude 与本地仓库

GitLab `main` 是正式知识源；本地仓库是其工作副本。Codex 和 Claude 的全局运行目录是从本仓库安装的副本，服务所有游戏工作目录。更新仓库源文件后，分别执行对应安装脚本才能更新全局运行副本：

```powershell
node scripts/install-global-codex.mjs
node scripts/install-global-claude.mjs
```

安装脚本不会把个人绝对路径、令牌或授权缓存写入 GitLab。Hook 只负责会话启动时的安全同步和环境检查，不替代知识读取；真正的知识内容始终来自本地仓库的 Markdown。

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

同步脚本只在工作区干净、位于 `main` 且没有本地领先或分叉时快进更新；有本地修改或分叉时停止并提示，不覆盖内容。正式变更使用分支和 Merge Request，合并到 `main` 后再同步并重新安装全局副本。

## 新建或更新知识

1. 先确认内容属于平台、通用方法、具体项目还是候选资料。
2. 新知识先放入 `inbox/`；确认项目、来源、版本范围、APPID、时区、主体和字段含义后，再整理到 `knowledge/`。
3. 正式页面保留稳定 `id`、状态、负责人、复核日期和来源；不要把对话提示、编辑过程、文件统计或截图说明写成知识。
4. 更新后运行：

```powershell
node scripts/knowledge-tool.mjs build-index
node scripts/knowledge-tool.mjs validate --check-index
git diff --check
```

## 数数与飞书

数数查询和分析资产操作通过已授权的 `ae-cli` 及对应 AE Skill 完成。执行查询前必须核对项目、APPID、时区、日期范围和项目口径，并向用户展示完整 SQL，获明确批准后才执行。飞书用于读取公司资料和交付结果，不替代项目知识中的指标与埋点定义。

## 安全

不要把令牌、Cookie、私钥、`.env`、授权缓存、真实设备标识或用户级明细提交到仓库；不要使用强制推送或破坏性 Git 操作。
