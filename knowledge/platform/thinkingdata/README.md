---
id: platform.thinkingdata.overview
title: ThinkingData 数数平台工作入口
scope: platform
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [thinkingdata, ta, tracking, routing]
---

# ThinkingData 数数平台工作入口

这组页面只保存公司在数数平台上的实际工作规则，不保存某个游戏的指标结论。做任何埋点设计、埋点验收或数数查询时，先按下面顺序读取：

1. [埋点设计标准](tracking-design-standard.md)：决定事件、属性、类型和上报方式。
2. [数据类型与用户身份](data-types-and-identity.md)：决定字段类型、对象结构、去重主体和历史迁移例外。
3. [埋点验收流程](tracking-acceptance-workflow.md)：决定先看哪里、验收几轮、异常如何回测。
4. [项目空间与看板操作](dashboard-and-project-operations.md)：决定项目空间、看板、标签和监控的设置。

项目差异必须回到 `knowledge/projects/<project>/`。例如战魂铭人的迁移包身份规则不能复制给大江湖；大江湖的事件和指标也不能从战魂铭人借用。

## 在线工具边界

- 飞书文档、表格和多维表是公司流程与项目资料的来源；读取时只提取正文、单元格和字段定义，不把截图或图片识别结果写进知识库。
- GitLab Markdown 是 Codex 的本地可检索副本。更新资料后，先同步仓库，再阅读本页和对应项目页。
- `ae-cli` 是数数在线查询和资产操作入口。任何执行 SQL 或写入数数方案前，先确认项目、主体、时区和版本范围，并把完整 SQL 展示给用户审批。
- 随附的通用 tracking Skill 只是参考实现，不能覆盖公司规范或具体项目历史。

## 资料入口

- [埋点培训文档](https://chillyroom.feishu.cn/wiki/CPSVwvyX9ilbsFkhw0ycGxNqntF)
- [埋点规范](https://chillyroom.feishu.cn/docx/XNxwdOMAPoLGdUx3wQxcLgcPnOg)
- [埋点验收工作流程](https://chillyroom.feishu.cn/docx/SxyydHREhoiB4xx2qlNcHQ3fnsh)
- [各类工作执行标准](https://chillyroom.feishu.cn/docx/ZGC3djoDgoIV3vxVqJlcpOjdnTb)
