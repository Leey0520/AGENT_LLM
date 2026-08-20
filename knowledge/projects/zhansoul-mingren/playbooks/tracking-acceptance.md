---
id: project.zhansoul-mingren.tracking-acceptance
title: 战魂铭人版本埋点验收执行单
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [zhansoul-mingren, tracking, acceptance, dashboard]
---

# 战魂铭人版本埋点验收执行单

## 决策顺序

1. 先打开当前版本看板 [5_2384_0](https://ta.chilly.tech/#/panel/panel/5_2384_0)，检查版本新增模式、渗透率、游戏次数、通关率和复玩率是否已有报表。
2. 新常驻模式、塔拉卡试炼、签到漏斗等优先复用同一版本看板；兑换活动可参考 [5_15942](https://ta.chilly.tech/#/panel/panel/5_15942)，H5 灯神活动可参考 [5_1834_0](https://ta.chilly.tech/#/panel/panel/5_1834_0)。
3. 新英雄、新礼包通常先更新已有基础看板映射，不默认新建看板。
4. 看板无法覆盖时，按公司验收流程进入数数“数据验收”“事件分析”“实时数据”。SQL 只在前三步不能回答时使用。

## 战魂主体和范围

- 非付费事件按 `#device_id` 去重；迁移包、TapTap 和付费例外见 [用户主体与付费口径](../data-contract/identity-and-payment.md)。
- 付费检查使用 `ta@claim_order_finish` 及推荐属性，不把客户端 `purchases_success` 直接当成最终收入。
- 每次验收记录版本号、渠道、测试设备、测试时间、看板或事件范围；跨客户端和服务端时说明主体差异。

## 版本执行

- 测试组打包前、打包后各按测试用例触发；修复后使用相同账号/设备和相同事件范围重测。
- 未上线版本上线当天早、中两轮看核心事件，下午再验收全部事件；已上线迭代版本上线当天至少验收一次核心事件。
- 三轮中都查实时数据，重点看重复上报、持续上报、缓存补发和未入库延迟。
- 对 `enter_level`/`game_over`、网络版本、道魂/技能/Boss 对象组，分别核对父行、子属性、类型、空值和枚举，不把一个父属性打勾视为完整通过。

## 汇报

```text
战魂【版本】埋点验收汇总
验收范围：版本新增内容 + 新增/活跃/留存/付费核心埋点
验收结果：核心数据是否正常；新增内容哪一项异常
异常数据解决：修复包/热更/继续跟进，复测时间
```
