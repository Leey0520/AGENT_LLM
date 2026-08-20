---
id: candidate.tracking-knowledge-onboarding-20260820
title: 埋点知识库接入与来源审阅草稿（2026-08-20）
scope: method
status: draft
owner: 李彦谆
reviewed_at: 2026-08-20
tags: [candidate, tracking, feishu, thinkingdata, gitlab]
---

# 埋点知识库接入与来源审阅草稿

## 目的

把公司通用标准、数数操作知识、项目业务知识、当前埋点方案和历史遗留问题分层放入 GitLab Markdown 知识库。此文件是候选审阅记录，不是可直接执行的业务口径。

## 来源清单

| 来源 | 状态 | 处理方式 |
| --- | --- | --- |
| 飞书埋点培训文档 | 待授权 | `lark-cli` 当前缺少用户身份和 `wiki:node:retrieve`，未总结内容 |
| 飞书埋点规范 | 待授权 | 授权后用 `docs +fetch --doc` 完整读取 |
| 飞书埋点验收工作流程 | 待授权 | 授权后与用户确认的“看板优先、SQL 兜底”对照 |
| 飞书各类工作执行标准 | 待授权 | 授权后读取全文和嵌入表格/Base |
| 战魂铭人交接、设计拆解、总项目知识库 | 待授权 | 授权后逐个 Wiki 解析并提取项目历史、禁区和口径 |
| `大江湖_埋点方案_20260820.xlsx` | 已读取 | 进入 `knowledge/projects/dajianghu/`，保持 `draft` |
| `战魂铭人_埋点方案_20260820.xlsx` | 已读取 | 进入 `knowledge/projects/zhansoul-mingren/`，保持 `draft` |
| `thinkingdata-tracking-design.zip` | 已读取 | 作为设计参考，不直接安装或覆盖公司规则 |
| `thinkingdata-online-tracking-acceptance.zip` | 已读取 | 作为验收参考；公司实际流程优先 |

## ZIP 参考包吸收结果

### 埋点设计参考

- 设计前先读取当前项目数数元数据/埋点方案、官方规则和项目历史。
- 优先复用已有事件、属性、显示名和类型；对象/对象组必须展开子属性，禁止嵌套对象组。
- 设计输出需要做事件名、显示名、属性名、类型、枚举、公共/私有属性边界和用户/事件属性边界冲突检查。
- 这些规则只能作为方法参考，不能替代公司埋点规范，也不能把通用模块模式直接套进某个游戏。

### 在线验收参考

- 没有证据时不能写“通过”；应区分未上报、属性未上报、类型异常、枚举异常、数据不合理、样本不足和待复测。
- 默认样本、时区、严重级别和输出结构来自参考 Skill，实际项目需以公司验收流程和版本看板为准。
- 参考 Skill 是“事件分析优先、SQL 兜底”；用户确认的公司流程是“版本看板优先、现有看板次之、SQL 最后”，后者覆盖前者。

## 建议的最终落位

- 平台层：`knowledge/platform/thinkingdata/`，保存数数 SDK、数据类型、跨端 ID、公共属性、CLI 路由和安全边界。
- 方法层：`knowledge/methods/`，保存跨项目的设计检查、验收检查和证据分级，不保存最终项目指标口径。
- 项目层：`knowledge/projects/dajianghu/`、`knowledge/projects/zhansoul-mingren/`，保存各自的业务、事件、属性、身份、版本和历史问题。
- 候选层：`inbox/generated/`，保存未授权来源、未复核摘要、冲突清单和待确认问题。

## 待用户授权与复核

1. 运行 `lark-cli.cmd auth login`，授予用户身份和 `wiki:node:retrieve`。
2. 重新抓取 7 个飞书来源；对 Wiki 先 `wiki +node-get`，对 docx 再 `docs +fetch --doc`，并检查嵌入 Sheets/Base。
3. 确认两个项目的数数 `project_id`、APPID、时区、主用户主体、观察范围和当前看板目录。
4. 对工作簿中的空说明、`161`/`163` 值、历史事件后缀、对象组子属性和支付生命周期逐项复核。
5. 复核通过后，将平台和项目页面从候选/草稿提升为正式页面；任何未确认内容继续留在 `inbox/generated/`。

## 附件指纹

- `大江湖_埋点方案_20260820.xlsx`：`DC973A3838C279D085AE6D3B4D7615237866113B79CDBCE4EA1941451299B17B`
- `战魂铭人_埋点方案_20260820.xlsx`：`F1C9FEA4BBD6E3166088931F95850CE3FB38356E2DC8CC9A72291E2CAE1B6DB3`
- `thinkingdata-tracking-design.zip`：`43B7AA3BFB371895A893E53F7B65C73DD0797438BB86041A3DA7558080ECDA8A`
- `thinkingdata-online-tracking-acceptance.zip`：`F31A40B4E06C1BF64EABDB7F09CC16BDDC09B9B6F37C38B4690DD98E3E1659F0`
