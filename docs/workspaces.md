---
id: method.game-workspace-convention
title: 游戏工作目录与双平台协作约定
scope: method
status: draft
owner: data-analytics
reviewed_at: 2026-09-07
tags: [method, workspace, governance, codex, claude]
---

# 游戏工作目录与双平台协作约定

本页是本地资料组织说明，不是游戏分析方法或业务口径。

## 资料归属

- 知识库仓库：保存可复用知识、共享 Skill 和两平台运行源文件，随 Git 管理。
- 游戏工作目录：保存该游戏的需求资料、分析脚本、数据、图表和报告。
- 全局运行目录：保存安装后的规则、Skill 和 Hook，供不同游戏目录调用同一知识库。

## 工作目录示例

```text
<游戏名>\
├─ 参考资料\
└─ 专题·分析\<任务名>\
   ├─ work\             脚本与中间文件
   └─ outputs\          报告、图表与结论证据
```

目录结构可按实际工作调整，Codex 和 Claude 可共用同一批资料与产物。仓库安装与同步见 [README](../README.md)。
