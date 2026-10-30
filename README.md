# 游戏数据分析知识库

这是面向人和 AI 的游戏数据分析共享知识库，用于统一平台规则、分析方法和各游戏的数据口径，同时保存 Codex、Claude 的共享工作规则与维护脚本。

**GitHub 的 `main` 是唯一正式知识源；本地仓库是工作副本。分支用于修改和评审，`inbox/` 用于存放尚未复核的候选资料。** 文档进入 `main` 不代表业务内容已获批准，还要看页面的状态和适用范围。

仓库地址：[Leey0520 / AGENT_LLM](https://github.com/Leey0520/AGENT_LLM)。仓库包含内部资料，应保持私有。

## 1. 知识库解决什么问题

- **统一依据**：业务、埋点、指标、身份和历史问题有可追溯的来源，避免分析时临时猜测。
- **隔离项目**：通用方法可以复用，但不同游戏的事件、属性和指标口径不能混用。
- **复用流程**：分析、埋点设计、验收和知识维护遵循共同的工作规则。
- **保留历史**：通过 Git 记录每次修改，使用 Pull Request 评审后进入正式版本。

知识库不是原始数据仓库，也不是分析产物堆放区。单次任务的 SQL、数据导出、截图和报告应放在游戏工作目录；仅把经整理、可复用且有来源的知识纳入这里。目录约定见 [工作目录说明](docs/workspaces.md)。

## 2. 目录与知识入口

```text
knowledge/
├─ platform/                 数数等平台规则、工具边界
├─ methods/                  跨项目通用分析方法与检查清单
└─ projects/<project>/       各游戏的业务、埋点、指标、身份与历史问题

index.md                     自动生成的知识索引，查知识先从这里开始
inbox/generated/             AI 提炼但尚未复核的候选知识
.agents/skills/              仓库维护的通用工作流程源文件
AGENTS.md / CLAUDE.md         Codex / Claude 的共享工作约定
.codex/ / .claude/           两个平台的配置与 Hook 源文件
scripts/                     同步、索引、校验、安装等维护脚本
schemas/                     正式知识文档的格式契约
docs/                        仓库使用说明，不属于游戏业务知识
```

| 需要了解什么 | 从哪里开始 |
| --- | --- |
| 所有知识页面与审核状态 | [知识索引](index.md) |
| 数数平台与公司埋点规范 | [数数平台入口](knowledge/platform/thinkingdata/README.md) |
| 通用分析、埋点设计与验收方法 | [通用方法](knowledge/methods/README.md) |
| 游戏项目资料的组织规则 | [项目知识入口](knowledge/projects/README.md) |
| 战魂铭人资料 | [业务概览](knowledge/projects/zhansoul-mingren/business/game-overview.md)，其他页面从索引定位 |
| 大江湖资料 | [埋点方案基线](knowledge/projects/dajianghu/data-contract/tracking-plan-current.md) |
| 新游戏建档 | [项目模板](knowledge/projects/_template/) |
| 工具操作与安全边界 | [平台工具边界](knowledge/platform/tool-boundaries.md) |

页面状态：`draft` 表示尚待最终确认，`approved` 表示已复核，`retired` 表示不再适用。具体项目配置、指标和适用版本以对应页面为准，不根据其他游戏或旧报告补猜。

## 3. 如何使用与维护知识

### 查阅与分析

1. 确认本地正式版本已同步，再从 `index.md` 定位相关页面；不必加载整个仓库。
2. 先读相关平台规则，再读目标游戏的业务、配置、数据契约和指标定义。
3. 口径缺失、冲突或过期时先确认，不跨游戏套用。
4. 数数查询前展示完整 SQL、项目、APPID、时区和日期范围，获得明确批准后再执行；飞书用于资料读取和报告交付，不替代知识库口径。

### 新增与修改

1. 判断内容属于平台、通用方法、具体项目还是候选资料。
2. AI 从对话、材料或分析中提炼的新知识先放入 `inbox/generated/`，未经明确复核不直接作为正式口径。
3. 正式页面遵守 [文档契约](.agents/skills/knowledge-maintenance/references/document-contract.md)：保持稳定 `id`，填写状态、负责人、来源和复核日期；新增游戏先完成 `project.yaml`。
4. 生成索引、运行校验、检查完整差异，通过分支和 Pull Request 合入 `main`。

正式内容只保存可复用事实、规则、项目定义和来源，不混入会话经过、临时排错记录或修改日志。不要手工编辑 `index.md` 中的知识列表。

## 4. 首次在一台电脑上使用

准备 Git、可运行仓库脚本的 Node.js，以及有权访问本私有仓库的 GitHub 账号。先完成 GitHub 的 Git 访问授权；不要把密码或 Token 写进命令、文档或聊天。

### 4.1 下载仓库：只需克隆一次

在准备存放仓库的父目录打开 PowerShell：

```powershell
git clone https://github.com/Leey0520/AGENT_LLM.git
Set-Location .\AGENT_LLM
git status
```

`clone` 会创建本地文件夹，下载文件和 Git 历史，并把 GitHub 地址记录为远端 `origin`。已有本地仓库时，不需要为了同步反复克隆。文件夹叫什么不影响使用。

### 4.2 按使用的平台安装共享工作规则

```powershell
# 使用 Codex 时执行
node scripts/install-global-codex.mjs

# 使用 Claude 时执行
node scripts/install-global-claude.mjs
```

Codex 安装脚本将共享 Skills 安装到用户级 `~/.agents/skills/`，将规则和 Hooks 安装到 `$CODEX_HOME`（未设置时为 `~/.codex/`）；Claude 使用其用户级运行目录。运行副本绑定本机知识库位置，仓库源文件保持可移植。

这些脚本不负责安装或授权数数、飞书等外部 CLI。Hook 是否生效取决于是否安装、启用并获运行许可；启动同步不会自动读取整库正文。移动本地知识库位置后，需要从新位置重新安装以更新绑定路径。

首次提交前，如果 Git 提示缺少作者信息，可只为当前仓库配置。将示例内容替换为你的姓名和提交邮箱；不希望公开邮箱时，可使用 GitHub 提供的 noreply 地址。

```powershell
git config user.name "你的提交姓名"
git config user.email "你的提交邮箱"
```

作者信息不是 GitHub 登录授权，两者互不替代。

## 5. Git 基础：保存、提交、上传不是一回事

```text
编辑并保存文件
    ↓ git add：选择本次修改
暂存区
    ↓ git commit：保存为本地版本
本地提交
    ↓ git push：上传到 GitHub 分支
远端分支
    ↓ Pull Request 评审并合并
远端 main：正式版本
    ↓ 同步
本机或其他电脑的本地 main
```

| 名词 | 含义 |
| --- | --- |
| 工作区 | 当前打开和编辑的文件 |
| 暂存区 | 已选好、准备进入下一次提交的内容 |
| commit / 提交 | 本地的一次版本记录，不等于上传 |
| 分支 | 独立的修改线路；本仓库以 `main` 为正式版本 |
| origin | 远端仓库的别名；本仓库应指向 GitHub |
| origin/main | 本机记录的远端 `main` 状态，需 fetch 才能刷新 |
| PR / Pull Request | 请求把修改分支合入 `main`，供检查和评审 |

## 6. 日常同步：只想拿到最新知识

以下维护命令都在本地知识库根目录执行。若不在根目录，先用 `Set-Location` 进入你实际存放仓库的文件夹。

**逐步执行，每步看结果；有报错或未提交修改时先停下，不要直接复制执行后续命令。**

### 第一步：看状态

```powershell
git status
```

有未提交修改时，先决定继续完成并提交、另行保留，还是确认放弃；不要直接覆盖。确认工作区干净后，再继续。

### 第二步：切回正式分支并安全同步

```powershell
git switch main
node scripts/sync-knowledge.mjs
```

同步脚本先执行 `git fetch --prune origin`，再检查当前状态：

| 情况 | 脚本行为 |
| --- | --- |
| 干净的 `main`，本地只是落后 | 安全快进到上游版本 |
| 本地与上游一致 | 提示已经是最新版本 |
| 有未提交修改 | 获取远端状态，但不自动合并 |
| 在功能分支 | 获取远端状态，但不更新当前分支 |
| 本地 `main` 领先或已分叉 | 提示处理，不自动推送或改写历史 |

**“已 fetch”或“跳过”不等于本地文件已经更新。** 脚本负责安全下载，不负责上传，也不在多个远端之间自动双向同步。

若希望理解对应的 Git 命令：在干净的本地 `main` 上运行 `git pull --ff-only origin main`，会获取并仅允许快进更新。它不会先替你切到 `main`；历史分叉时会拒绝，不自动制造合并提交。

只更新知识正文，同步后即可读取；如果更新了共享工作规则、Skills 或 Hooks，再运行对应平台的安装脚本。已有会话是否重新加载以实际工具表现为准，必要时新建会话检查。

## 7. 修改并上传：推荐的完整流程

### 第一步：从最新的 main 开始

先按上一节检查工作区并同步。确认成功后，新建本次修改分支：

```powershell
git switch -c codex/wiki-update
```

这是示例分支名。每次独立修改使用新名字，例如添加任务简称或日期；如果名字已存在且要继续原任务，使用 `git switch codex/wiki-update`，不要再次加 `-c`。

### 第二步：修改文件并校验

修改完成后执行：

```powershell
node scripts/knowledge-tool.mjs build-index
node scripts/knowledge-tool.mjs validate --check-index
git diff --check
git status
git diff
```

- `build-index` 生成知识索引，索引如有变化，也需随相关修改提交。
- `validate --check-index` 检查文档契约和索引一致性，不替代业务口径审核。
- `git diff --check` 检查部分空白格式问题，不检查业务正确性。
- `git diff` 查看已跟踪文件中尚未暂存的修改；新文件仍需单独打开检查。

若修改了 Codex 安装脚本，还应执行：

```powershell
node --check scripts/install-global-codex.mjs
node --test scripts/test-install-global-codex.mjs
```

### 第三步：只选择本次要提交的文件

下面以修改 `README.md` 为例；其他任务按实际文件路径替换，只选择已经检查过的文件。路径相对于仓库根目录。

```powershell
git add -- README.md
git diff --cached
```

需要提交多个文件时，可在 `git add --` 后列出多个路径；生成的 `index.md` 有变化时一并选择。不要未经检查就把所有文件暂存。暂存后如果继续编辑，还需再次 add 才能把后续修改纳入本次提交。

### 第四步：保存本地版本并上传分支

确认暂存内容正确后：

```powershell
git commit -m "docs: 补充知识库说明"
git push -u origin codex/wiki-update
```

提交说明和分支名按本次任务调整。`-u` 为分支建立上游关联；以后继续在该分支修改时，检查后重新 add、commit，再运行 `git push` 即可。

**未提交的文件不会因为 push 而自动上传。推送到修改分支，也不等于更新了正式 main。**

### 第五步：在 GitHub 创建并合并 PR

1. 打开 GitHub 仓库的 **Pull requests → New pull request**，或使用 push 输出的创建入口。
2. 确认 **base 为 `main`，compare 为本次修改分支**。
3. 填写修改目的、范围和已完成的检查，审阅 Files changed。
4. 满足评审和仓库要求后，由有权限的人合并；不要绕过保护规则。

合并后，确认本地工作区干净，切回 `main` 并同步：

```powershell
git switch main
node scripts/sync-knowledge.mjs
```

至此完成“本地修改 → 上传分支 → 评审合并 → 本地取回正式版本”的闭环。直接在 GitHub 网页编辑也应使用分支和 PR；网页上的修改不会自动出现在本地。仓库提供本地校验脚本，不要假设网页编辑后一定有自动校验。

## 8. 常用 Git 指令速查

| 指令 | 作用与注意事项 |
| --- | --- |
| `git status` | 查看分支、修改、暂存和跟踪状态 |
| `git status --short --branch` | 状态的简洁版本 |
| `git diff` | 查看已跟踪文件的未暂存修改 |
| `git diff --cached` | 查看本次准备提交的内容，含已暂存的新文件 |
| `git fetch origin` | 刷新远端记录，不把更新合入当前分支 |
| `git switch main` | 切换到本地 main，不负责下载更新 |
| `git pull --ff-only origin main` | 把远端 main 整合到当前分支；仅在干净的 main 上用于日常同步 |
| `git switch -c 分支名` | 新建分支并切换过去 |
| `git add -- 文件路径` | 将指定文件当时的修改放入暂存区，不上传 |
| `git commit -m "说明"` | 把暂存内容保存为本地提交 |
| `git push -u origin 分支名` | 上传指定分支并设置上游 |
| `git log --oneline -10` | 查看最近 10 次提交 |
| `git branch -vv` | 查看本地分支和跟踪关系 |
| `git remote -v` | 查看远端地址，确认 origin 是否指向本仓库 |

常见状态：`M` 是修改，`A` 是已暂存新增，`D` 是删除，`??` 是未跟踪新文件；短状态中的左右两列分别对应暂存区和工作区。`ahead` 表示本地领先记录的上游，`behind` 表示落后；远端比较以最近 fetch 为准。

## 9. 常见问题与安全边界

- **add 选错文件，还未提交**：可用 `git restore --staged -- 文件路径` 取消暂存，工作区内容保留。不要把它和不带 `--staged` 的恢复混淆，后者可能丢弃工作区修改。
- **同步提示有本地修改或分叉**：先保留现场并检查 `git status`、差异和历史，不为“同步成功”而覆盖文件。
- **push 被拒绝或出现冲突**：停止后续操作，核对双方修改和分支保护要求；不要使用强制推送解决。
- **登录、权限或证书错误**：保留错误并处理授权，不把 Token 发进聊天，不关闭 TLS 校验。
- **换电脑**：重新克隆并安装所需的共享工作规则；数数、飞书等 CLI 与外部工具需独立安装和授权。
- **GitHub 与其他远端**：如额外配置了备份远端，它不会自动与 origin 双向同步，操作前用 `git remote -v` 确认目标。

禁止提交 `.ae-cli/`、`secure-tokens/`、`.env`、`auth.json`、令牌、Cookie、私钥、授权缓存、真实设备标识或用户级明细；`.gitignore` 不能替代提交前审查。禁止强制推送、破坏性回退或绕过 TLS 校验。

## 10. 参考

- [Git 官方入门](https://git-scm.com/docs/gittutorial)
- [Git pull 与快进更新](https://git-scm.com/docs/git-pull)
- [GitHub Pull Request 操作](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests)
- [Codex 自定义与 Skills](https://learn.chatgpt.com/docs/customization/overview)
