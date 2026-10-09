---
id: project.zhansoul-mingren.analysis-fields
title: 战魂铭人核心分析事件与属性口径
scope: project
project: zhansoul-mingren
status: draft
owner: data-analytics
reviewed_at: 2026-10-09
tags: [zhansoul-mingren, events, properties, identity, payment, out-of-battle-growth]
---

# 战魂铭人核心分析事件与属性口径

## 适用范围

本页记录版本活跃、留存、付费、渠道、商品、难度分层和彼岸试炼渗透率分析采用的核心事件与属性。字段选择已于 2026-09-18 由项目分析人员确认，但线上字段类型、枚举、版本范围和分区覆盖仍需在数数后台核验后才能执行。

## 数据表与主体

- 客户端事件表：`ta.v_event_5`。
- 用户属性表：`ta.v_user_5`。
- 事件表通过 `#user_id` 关联用户表 `#user_id`；非付费客户端行为分析主体通常使用 `#device_id`。

## 事件口径

| 事件 | 业务含义 | 主体 | 使用范围与边界 |
| --- | --- | --- | --- |
| `tap_start` | 点击开始游戏，作为活跃事件 | `#device_id` | DAU、版本日均 DAU、渠道 DAU、分层活跃分母 |
| `enter_level` | 进入关卡 | `#device_id` | 彼岸试炼渗透率分子；当前只使用单人事件族 |
| `game_over` | 关卡结束与结算 | `#device_id` | 通关、难度分层和关卡结果分析；不与 `enter_level` 合并为一个事件 |
| `claim_order` | 服务端订单事件 | `#user_id` | 当前项目采用的付费事件之一；须确认订单生命周期和去重规则 |
| `order_finish` | 服务端订单完成事件 | `#user_id` | 当前项目采用的付费事件之一；不能默认与 `claim_order` 相加后等于唯一付费订单数 |
| `purchases_trigger`、`purchases_success`、`purchases_fail` | 客户端购买链路 | 客户端主体 | 与服务端订单事件分开，不用于替代服务端收入 |
| `refund_order` | 退款链路 | 服务端主体 | 与付费成功和商品收入分开处理 |
| `commit_invite_code` | 提交邀请码（活动） | 待核验 | 2026-07-28 至 2026-09-01 邀请码活动；用于从新增留存中剔除参与该活动的玩家 |

`ta@claim_order_finish` 是此前的虚拟事件交接口径，不是可直接过滤的底层 `$part_event` 值。当前项目分析采用 `claim_order`、`order_finish`；执行前应确认虚拟事件展开规则、两个底层事件的关系和同一订单去重方式。

单人 `enter_level`、`game_over` 与局域网、远联事件族不能混算。当前彼岸试炼分层只使用客户端单人 `enter_level` 和 `game_over`，不使用 `remote_enter_level`。

## 局外养成系统事件

| 系统 | 事件 | 业务含义/边界 |
| --- | --- | --- |
| 角色升级 | `hero_level_up` | 角色升级行为 |
| 金莲花园 | `garden_plant_event_202606` | 金莲花园种植等行为 |
| 宠物乐园 | `interact_PetParadies_202606` | 宠物喂养、宠物解锁等交互行为 |
| 配饮料 | `talk_mary_202606` | 配饮料行为；见闻3级解锁 |
| 领主技能 | `talk_ken_202606` | 解锁领主技能行为；见闻10级解锁 |
| 道魂净化 | `esrBall_claim_identified` | 道魂净化行为 |
| 道魂重铸 | `esrBall_merged` | 道魂重铸行为；获得模拟战通关掉落的第一个道魂后开放 |
| 道魂洗练 | `esrBall_refined` | 道魂洗练行为 |
| 道魂升级 | `esrBall_upgrade` | 道魂升级行为 |
| 六道之力重铸 | `sixCycleOrb_merged` | 六道之力重铸行为；获得空间碎片通关掉落的第一个六道之力后开放 |
| 六道之力洗练 | `sixCycleOrb_refined` | 六道之力洗练行为 |
| 修罗之力加点 | `asura_power_add` | 修罗之力加点行为；见闻20级解锁，修罗角色使用 |
| 道具占星 | `talk_crystallBall_202606` | 道具占星行为；需结合 `crystalball_interact_type` 识别有效类型 |

当前未确认道魂净化、道魂洗练、道魂升级、金莲花园、宠物乐园等系统存在独立解锁事件或独立解锁条件；分析时不得自行补充。

### 道具占星

- 有效占星行为事件：`talk_crystallBall_202606`。
- 有效行为筛选：`crystalball_interact_type IN ('选择羁绊', '加点')`。
- `选择羁绊`和`加点`是事件属性值，不拆分为两个系统。
- 用户属性 `unlock_system` 为列表类型，包含 `ESRBall` 时表示道具占星已解锁。

## 主线与完整对局事件

### 主线模式

主线空间碎片模式包括：`空间碎片-终章`、`空间碎片-兽`、`空间碎片-狱`、`空间碎片-天人`、`空间碎片-修罗`、`空间碎片-诡`、`空间碎片-人`。

- 单局难度属性：`#vp@num_difficult_level`，表示该局难度。
- 通关成功状态：`reward_calculate IN ('success', 'success_special')`。

### 完整对局结束事件

- 其他模式：`game_over`。
- 模拟战：`end_fireDanceMode`。
- 战场模式：`end_survivalMode`。

上述事件分别表示对应模式的完整一局结束；按模式使用时不得重复合并同一模式事件。

## 属性口径

| 属性 | 业务含义 | 本项目采用值/规则 | 待核验项 |
| --- | --- | --- | --- |
| `#device_id` | 客户端设备主体 | 非付费分析按此去重 | 空值覆盖和迁移渠道差异 |
| `#user_id` | 服务端用户主体 | 付费分析按此去重 | 与服务端访客主体的关系 |
| `#vp@channel_fix` | 渠道字段 | 目标渠道精确值：`TapTap`、`IOS`、`GP`；`TapTap` 区分大小写，不能写成 `Taptap` | 与旧推荐字段 `#vp@distro_id` 的覆盖差异 |
| `#vp@combine_sku_name_item_name` | 商品/SKU 名称 | 分商品付费人数和金额 | 与旧推荐字段 `#vp@total_item_name` 的粒度差异 |
| `#vp@item_sku_name_type` | 商品类别 | 按商品类别看付费人数、付费率和构成 | 与 `#vp@combine_sku_name_item_name` 的层级关系、枚举和空值 |
| `#vp@order_price_total` | 订单金额合计 | 分商品金额、ARPU 分子 | 币种、原价/实付、折扣、退款冲减和跨订单汇总 |
| `#vp@num_difficult_level` | 主线难度 | 按设备历史最高通关难度分层 | 线上字段类型、空值、值域及与物理字段 `difficult_level` 的关系 |
| `adventure_level` | 用户冒险见闻等级 | 用户表中的见闻等级属性 | 线上字段类型、快照时点和空值 |
| `adventureLevel_level` | 见闻等级升级后的等级属性 | 随 `adventureLevelUp` 事件记录见闻等级变化 | 线上字段类型、与用户表 `adventure_level` 的一致性 |
| `unlock_system` | 已解锁的功能/玩法列表 | 列表包含 `ESRBall` 时表示道具占星已解锁 | 列表元素类型、快照时点和历史版本覆盖 |
| `crystalball_interact_type` | 道具占星交互类型 | 有效分析值为 `选择羁绊`、`加点` | 其他枚举值及空值含义 |
| `mode_name` | 模式名称 | `彼岸试炼`；分层模式为 7 个空间碎片模式 | 精确枚举值和版本生效范围 |
| `reward_calculate` | 结算方式 | `success`、`success_special` 视为胜利 | 大小写、空值和历史版本差异 |
| `#vp@lifetime_formal` | 客户端生命周期/正式玩家标记 | `= 0` 表示纯新增；非 0 用于活跃留存判断 | 类型、空值和用户属性快照时点 |
| `#vp@is_d7_return2` | 7 日回流标记 | 布尔值；最近 7 日未 `tap_start` | 类型、空值和包含关系 |
| `#vp@is_d14_return2` | 14 日回流标记 | 布尔值；最近 14 日未 `tap_start` | 类型、空值和包含关系 |
| `#vp@is_d30_return` | 30 日回流标记 | 布尔值；最近 30 日未 `tap_start` | 类型、空值和包含关系 |
| `#event_time` | 事件时间 | 日粒度统计；服务端事件从 0 时区转北京时间时增加 8 小时 | 客户端事件不要重复加 8 小时 |
| `$part_date` | 事件分区日期 | 查询分区过滤 | 动态标签匹配时需确认报表使用事件时间动态参数 |
| `$part_event` | 事件名 | 纵向筛选事件 | 虚拟事件不能直接作为底层事件值 |

## 主体规则

- 活跃、新增、回流、关卡和难度分层使用 `#device_id`。
- 付费人数、ARPPU 和付费主体使用 `#user_id`。
- 付费率、ARPU 等同时需要付费和活跃口径的指标，必须明确分子、分母主体；`#user_id` 与 `#device_id` 不能无说明直接联结。
- 迁移渠道付费记录从 2024-07-19 起才完整。早于该日期的付费结果不能直接按现行口径解释。
- 服务端付费事件不携带 `#device_id`，设备主体无法直接关联付费；需要按人统计「活跃∩付费」时，用客户端活跃事件 `tap_start` 上携带的 `#user_id` 作为桥梁。
- 埋点方案中 `tap_start` 的属性示例含 `#device_id` 和 `account_id`（凉屋账号ID），不含 `#user_id`；`#user_id` 是数数系统属性，登录后由 SDK 写入，登录前的 `tap_start` 可能为空，按人统计活跃前须先验证覆盖率。

## 时间规则

- 项目时区为 `Asia/Shanghai`。
- 服务端事件按 0 时区上报时，使用 `DATE_ADD('hour', 8, "#event_time")` 转为北京时间。
- 客户端事件按北京时间自然日统计，不对已经处于北京时间的 `#event_time` 重复加 8 小时。
- 分区过滤使用字符串条件，例如 `"$part_date" BETWEEN '2026-07-27' AND '2026-08-28'`。
- 看板使用「标签动态匹配」筛选时，SQL 报表必须显式带入【事件时间】动态参数 `${PartDate:ds}`，否则会报 `$part_date属性获取失败`。

## 用户表可用属性

以下来自埋点方案【#用户数据】页签，属于方案记录，线上类型、快照时点和空值仍须核验。

| 属性 | 业务含义 |
| --- | --- |
| `account_id` | 凉屋账号ID |
| `device_id` | 设备号 |
| `create_time` | 首次启动时间 |
| `first_order_time` | 首次充值时间 |
| `last_pay_time` | 最后一次充值时间 |
| `adventure_level` | 冒险见闻等级 |

## 关联口径

- 玩家分层、纯新增、版本新增和回流包含关系见 `metrics/player-segmentation.md`。
- 用户主体与迁移限制见 `data-contract/identity-and-payment.md`。
- 付费、首次付费和商品指标见 `metrics/payment-metrics.md`。
- 玩家分层和留存见 `metrics/player-segmentation.md`。
- 彼岸试炼渗透率见 `metrics/mode-penetration.md`。
- 版本上线日索引见 `business/version-calendar.md`。
- 线上字段未确认时的执行风险见 `decisions/known-data-issues.md`。

## 证据

- 2026-09-18 项目分析口径确认：字段冲突由项目分析人员选择。
- 2026-09-23 项目分析人员确认：局外养成系统事件、占星筛选、解锁条件、主线模式和完整对局事件口径。
- 2026-10-09 项目分析人员确认：商品类别、邀请码事件、活跃与付费主体搭桥、用户表字段、动态事件时间参数及 TapTap 大小写口径。
- `data-contract/identity-and-payment.md`
- `data-contract/tracking-plan-current.md`
- `decisions/known-data-issues.md`
