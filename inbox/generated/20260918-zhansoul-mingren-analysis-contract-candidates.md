# 战魂铭人分析事件与属性口径候选（2026-09-18）

> 状态：AI 从当前分析会话提炼的原始记录。关键冲突已由用户在 2026-09-18 复核，但仍不是线上字段验证结果。
> 项目：`zhansoul-mingren`（战魂铭人）
> 提议复核人：`data-analytics`
> 复核结果：2026-09-18 用户已确认关键冲突选择，并已写入 `data-contract/analysis-fields.md`、`data-contract/identity-and-payment.md`、`metrics/player-segmentation.md` 和 `decisions/known-data-issues.md` 的 draft 知识。

## 使用边界

- 本页区分三类信息：已有项目知识草稿支撑的约束、当前用户明确指定但尚未线上核验的口径、与现有知识冲突或尚未定义的待确认项。
- 线上字段是否存在、类型、枚举、分区覆盖和事件生效版本，仍须通过数数事件详情或窄范围诊断确认。
- 当前 `project.yaml` 尚未配置 `app_id`、`project_id` 和 `query_cluster`；未确认前不能据此执行 AE 查询。
- 当前会话尚未形成可认定为正式口径的支付事件、退款、币种和金额结算定义。

## 2026-09-18 复核结论

- 渠道采用 `#vp@channel_fix`。
- 商品采用 `#vp@combine_sku_name_item_name`。
- 付费事件采用 `claim_order`、`order_finish`。
- 难度采用 `#vp@num_difficult_level`。
- 付费主体采用 `#user_id`，活跃主体采用 `#device_id`。
- 金额采用 `#vp@order_price_total`；币种、实付、折扣和退款语义仍需线上确认。
- 纯新增是日粒度：`#vp@lifetime_formal = 0`。
- 版本新增是版本窗口内的新增玩家 cohort，跨窗口去重。
- 7 日回流包含 14 日和 30 日回流，集合关系为 `30 日 ⊆ 14 日 ⊆ 7 日`。
- 汇总求和时改用互斥口径：30 日优先，其次 14 日、7 日；活跃留存是非纯新增且非 7 日回流。
- 下方“原始冲突记录”保留为提炼时的历史状态，实际执行以正式 draft 页面为准。
## 一、已有项目知识草稿支撑的约束

| 主题 | 可复用结论 | 现有来源 |
| --- | --- | --- |
| 项目时区 | `Asia/Shanghai`，自然日从 00:00 开始 | `knowledge/projects/zhansoul-mingren/project.yaml` |
| 非付费主体 | 新分析默认按 `#device_id` 去重；不用 `account_id` 或 `user_id` 代替 | `data-contract/identity-and-payment.md` |
| 付费主体 | 服务端付费通常没有 `#device_id`，使用 `#user_id` 或服务端访客主体 | `data-contract/identity-and-payment.md` |
| 迁移渠道路径 | 迁移渠道付费记录从 2024-07-19 起才完整；分析日期早于该边界时不能按现行口径解释 | `data-contract/identity-and-payment.md` |
| 事件族边界 | 单人 `enter_level`/`game_over` 与局域网、远联事件族不能混算；`enter_level` 和 `game_over` 也不能当作同一个战斗事件 | `data-contract/tracking-plan-current.md` |
| 付费事件边界 | `purchases_trigger`、`purchases_success`、`purchases_fail`、`order_finish`、`claim_order`、`refund_order` 是不同生命周期，不能仅凭事件名推导付费人数或收入 | `data-contract/identity-and-payment.md` |
| 埋点版本边界 | 在线埋点方案混有历史版本；执行前核对版本生效、数数方案状态和更新日志 | `data-contract/tracking-plan-current.md`、`decisions/known-data-issues.md` |
| 资产优先级 | 新英雄、皮肤、活动和礼包优先映射已有看板；SQL 作为现有资产无法回答时的兜底 | `decisions/known-data-issues.md` |

## 二、本会话明确指定的事件

| 事件 | 本会话用途 | 主体与边界 | 状态 |
| --- | --- | --- | --- |
| `tap_start` | 活跃事件；DAU、版本日均 DAU、渠道 DAU、分层活跃分母 | 客户端事件，按 `#device_id` 去重 | 用户明确指定；未与 `app_on_active` 做等价确认 |
| `enter_level` | 进入关卡；彼岸试炼渗透率分子 | 客户端单人事件族，按 `#device_id` 去重 | 用户明确指定；不使用 `remote_enter_level` |
| `game_over` | 关卡结束/结算；难度分层通关判定 | 客户端单人事件族，按 `#device_id` 去重 | 用户明确指定；不与其他战斗事件合并 |
| `claim_order` | `ta@claim_order_finish` 返回空后，用户要求尝试的底层订单事件 | 服务端；按 `#user_id` | 会话临时替代方案，不能据此认定完整付费成功口径 |
| `order_finish` | 与 `claim_order` 一起尝试的底层订单事件 | 服务端；按 `#user_id` | 会话临时替代方案，不能据此认定完整付费成功口径 |
| `ta@claim_order_finish` | 现有项目知识中的付费虚拟事件 | 虚拟事件，不是底层 `$part_event` 值，需确认展开规则 | 现有知识推荐；会话中发现直接查询为空/不可直接过滤 |
| `purchases_trigger`、`purchases_success`、`purchases_fail` | 客户端购买链路事件 | 与服务端订单事件分开 | 现有知识仅确认生命周期不同，不能混算 |
| `refund_order` | 退款链路 | 与付费成功和商品收入分开 | 现有知识仅确认不能与付费成功混算 |
| `remote_enter_level` 及远联/局域网结算事件 | 非当前单人分析范围 | 与单人事件族分开 | 本会话明确排除 |

## 三、本会话明确指定的属性

| 属性 | 业务含义 | 本会话用途 | 主体/类型/风险 |
| --- | --- | --- | --- |
| `$part_date` | 事件分区日期 | 查询分区过滤 | 必须用带引号的字符串谓词；看板标签动态匹配时，SQL 需使用事件时间动态参数 |
| `$part_event` | 事件名 | 纵向识别事件 | 虚拟事件 `ta@claim_order_finish` 不能直接作为底层 `$part_event` 过滤 |
| `#event_time` | 事件发生时间 | 日粒度统计和服务端时区转换 | 服务端事件按用户要求 `DATE_ADD('hour', 8, "#event_time")` 转为北京时间；客户端事件避免重复加 8 小时 |
| `#device_id` | 客户端设备主体 | 活跃、进入关卡、难度分层去重 | 非付费主键；服务端订单通常缺失，不能用它统计服务端付费人数 |
| `#user_id` | 服务端用户主体 | 付费人数、ARPU、ARPPU、商品收入 | 用户明确指定为付费主键；与 `#device_id` 不能无说明直接联结 |
| `mode_name` | 玩法/模式名称 | 彼岸试炼分子、7 个空间碎片分层范围 | 已知值：`彼岸试炼`、`空间碎片-终章`、`空间碎片-天人`、`空间碎片-狱`、`空间碎片-兽`、`空间碎片-人`、`空间碎片-诡`、`空间碎片-修罗` |
| `reward_calculate` | 关卡结算方式 | 通关判定 | 已知值：`success`、`fail`、`quit`、`success_special`；用户定义 `success` 或 `success_special` 为胜利 |
| `#vp@num_difficult_level` | 主线难度 | 按最高通过难度给设备分层 | 用户明确指定；物理字段可能为 `difficult_level` 文本字段，线上字段名、类型和空值必须先诊断 |
| `#vp@channel_fix` | 渠道修正字段 | 筛选 `TapTap`、`IOS`、`GP` 并看渠道走势 | 用户明确指定；渠道值大小写敏感，`TapTap` 不可写为 `TAPTAP`；现有知识推荐字段为 `#vp@distro_id`，存在冲突 |
| `#vp@combine_sku_name_item_name` | 组合商品/SKU 名称 | 分单件商品统计付费人数和金额，Top 8 + 其他 | 用户明确指定；现有知识推荐商品属性为 `#vp@total_item_name`，是否等价未确认 |
| `#vp@order_price_total` | 订单金额合计 | 分商品日均付费金额、ARPU 分子 | 用户明确指定；币种、原价/实付、折扣、退款冲减和跨订单汇总语义未确认 |
| `#vp@lifetime_formal` | 客户端生命周期/正式玩家标记 | 纯新增和活跃留存分层 | 用户定义纯新增为 `= 0`；服务端另有可能的 `#vp@lifetime_formal_server`，不能混用 |
| `#vp@is_d7_return2` | 7 日回流标记 | 7 日回流玩家分层 | 用户说明为布尔值；线上类型、缺失值和与其他回流层是否互斥未确认 |
| `#vp@is_d14_return2` | 14 日回流标记 | 14 日回流玩家分层 | 用户说明为布尔值；线上类型、缺失值和与其他回流层是否互斥未确认 |
| `#vp@is_d30_return` | 30 日回流标记 | 30 日回流玩家分层 | 用户说明为布尔值；线上类型、缺失值和与其他回流层是否互斥未确认 |

## 四、用户分层候选定义

| 分层 | 用户口径 | 去重主体 | 待确认点 |
| --- | --- | --- | --- |
| 纯新增玩家 | `#vp@lifetime_formal = 0` | `#device_id` | `NULL` 是否代表未定义、是否与回流层冲突 |
| 7 日回流玩家 | `#vp@is_d7_return2 = true` | `#device_id` | 布尔值真实类型与缺失值 |
| 14 日回流玩家 | `#vp@is_d14_return2 = true` | `#device_id` | 是否与 7 日/30 日回流重叠 |
| 30 日回流玩家 | `#vp@is_d30_return = true` | `#device_id` | 是否与其他回流层重叠 |
| 活跃留存玩家 | `#vp@is_d7_return2 = false` 且 `#vp@lifetime_formal <> 0` | `#device_id` | 是否应排除 d14/d30 回流，用户本轮未明确 |

> 当前五类分层没有证明互斥。若直接相加会重复计数；正式看板必须先确认各回流标记的互斥规则，或按优先级建立唯一分层。

## 五、可复用指标口径候选

| 指标 | 分子 | 分母/去重 | 时间窗口与备注 |
| --- | --- | --- | --- |
| DAU | `tap_start` 的去重设备数 | `#device_id` | 按北京时间自然日 |
| 版本日均 DAU | 各日 DAU 的均值 | `#device_id` | 版本窗口不统一，按分析目标声明；本页不设项目级默认窗口 |
| 渠道版本日均 DAU | 指定 `#vp@channel_fix` 下的各日 DAU 均值 | `#device_id` | 精确值为 `TapTap`、`IOS`、`GP`；版本范围 2025-05 至 2026-08，不含 2026-09 |
| 分层版本日均活跃人数 | 各日对应分层去重活跃设备数均值 | `#device_id` | 分层口径见上表；回流层重叠问题未解决 |
| 纯新增次日/3/7/14/30 日留存率 | 版本上线后相应留存日仍活跃的纯新增去重设备数 | 该版本纯新增去重设备数 | 用户要求在上线后 30 日窗口取平均；未成熟留存日必须排除，不得以 0 计入分母 |
| 活跃留存/回流玩家留存率 | 相应分层留存日活跃设备数 | 同分层基准设备数 | 沿用同一成熟度规则；分层仍需确认互斥 |
| 付费率 | 付费用户数 | 活跃用户数 | 付费用 `#user_id`，活跃通常用 `#device_id`；主体不一致时必须先定义映射或明确限制 |
| ARPU | 付费金额 | 活跃用户数或指定分母 | 本会话角色 ARPU 明确要求分母用 `#user_id`、周期 30 天；其他 ARPU 不可自动沿用该分母 |
| ARPPU | 付费金额 | 付费用户数 | 使用 `#user_id`；金额字段和退款语义未确认 |
| 日均付费人数-分 SKU | 每日按用户去重的付费人数，按商品 Top 8 + 其他分组 | `#user_id` | 商品属性冲突见第三节；每天先按用户去重，再汇总 |
| 日均付费金额-分 SKU | 每日金额，按商品 Top 8 + 其他分组 | `#user_id` 与订单金额 | 用户指定 `#vp@order_price_total`；币种、退款和折扣未确认 |
| 彼岸试炼渗透率 | 当日 `enter_level` 且 `mode_name = '彼岸试炼'` 的去重设备数 | 当日 `tap_start` 的去重设备数 | 按最高通过难度分层；2026-07-28 至 2026-08-28；客户端单人事件；北京时间 |

## 六、版本日期候选基线

用户最终确认只保留 2025 年 5 月版本至 2026 年 8 月周年庆版本，2026 年 9 月版本不计入。以下日期为用户提供，尚未与官方更新日志逐项复核：

| 版本上线日 | 版本 |
| --- | --- |
| 2025-05-27 | 2025 五月版本 2.10.0 |
| 2025-07-17 | 2025 七月版本 |
| 2025-08-12 | 2025 八月版本 |
| 2025-09-16 | 2025 九月小版本 |
| 2025-10-21 | 2025 十月版本 |
| 2025-11-20 | 2025 十一月版本；用户明确纠正原列表日期 |
| 2025-12-11 | 2025 十二月圣诞版本 |
| 2026-02-03 | 2026 年 2 月春节版本 |
| 2026-03-31 | 2026 三月版本 |
| 2026-05-13 | 2026 五月版本 |
| 2026-06-18 | 2026 六月版本 |
| 2026-07-28 | 2026 暑假七月版本 |
| 2026-08-18 | 2026 八月周年庆版本 |

## 七、彼岸试炼分层候选口径

| 项 | 候选定义 |
| --- | --- |
| 分层主体 | 每个 `#device_id` 一个静态标签 |
| 分层时间 | 全历史截至 2026-08-28；不是每日动态重算 |
| 有效模式 | 7 个空间碎片模式 |
| 有效通关 | `game_over` 且 `reward_calculate IN ('success','success_special')` |
| 分层值 | `MAX(#vp@num_difficult_level)`；无通关记录归为“未通关”，计入分母 |
| 分子 | 当日 `enter_level` 且 `mode_name = '彼岸试炼'` 的去重设备数 |
| 分母 | 当日 `tap_start` 的去重设备数 |
| 时间 | 2026-07-28 至 2026-08-28，含首尾；北京时间 |
| 作弊过滤 | 用户明确不排除 |
| 风险 | 静态回看会把 8/28 才通关的设备追认到 7/28；若业务需要“当日为止难度”，必须另建动态口径 |

## 八、原始冲突记录（已被上方复核结论取代）

| 编号 | 冲突/缺口 | 现有知识或事实 | 本会话指定 | 处理建议 |
| --- | --- | --- | --- | --- |
| 1 | 渠道字段 | `#vp@distro_id` | `#vp@channel_fix` | 先在数数属性详情和窄查询中确认两者关系、覆盖和渠道值 |
| 2 | 商品字段 | `#vp@total_item_name` | `#vp@combine_sku_name_item_name` | 确认是否为同一商品粒度；不能默认等价 |
| 3 | 付费事件 | `ta@claim_order_finish` 虚拟事件 | `claim_order`、`order_finish` | 先确认虚拟事件规则和底层事件生命周期；不能直接把两个事件相加当收入 |
| 4 | 难度字段 | 埋点方案物理字段可能为 `difficult_level` 文本 | `#vp@num_difficult_level` | 在线诊断字段名、类型、空值和值域后再分层 |
| 5 | 付费/活跃主体 | 付费 `#user_id`，活跃 `#device_id` | 用户要求角色 ARPU 分母用 `#user_id` | 其他付费率/ARPU/ARPPU 如需设备分母，必须先定义用户与设备的映射 |
| 6 | 金额语义 | 现有知识未定义币种、折扣和退款 | `#vp@order_price_total` | 明确实付、原价、退款、跨订单和币种后再计算收入 |
| 7 | 回流分层 | 现有知识未证明 d7/d14/d30 互斥 | 用户分别给出五个分层 | 建立优先级或互斥规则；否则只能分别看，不能求和 |
| 8 | 留存均值 | 未成熟日不应视为 0 | 用户明确纠正过 2026-07/08 版本 | 只对已达到对应留存日的日纳入均值，并输出有效天数 |
| 9 | 版本窗口 | 会话中曾出现多种窗口写法 | 2026-10-09 用户确认不存在统一窗口 | 正式口径按指标分别声明窗口；本页不设项目级默认窗口 |
| 10 | AE 环境 | 项目知识仍为空 | 会话未提供 APPID/集群 | 补齐项目配置并完成在线字段核验后再执行 |

## 九、证据与来源

- 当前会话：`01a09dae-0528-7d13-b463-81d962e12d4d`，会话工作目录 `C:\Users\Administrator\Documents\战魂铭人`。
- `knowledge/projects/zhansoul-mingren/project.yaml`
- `knowledge/projects/zhansoul-mingren/data-contract/identity-and-payment.md`
- `knowledge/projects/zhansoul-mingren/data-contract/tracking-plan-current.md`
- `knowledge/projects/zhansoul-mingren/decisions/known-data-issues.md`
- `knowledge/projects/zhansoul-mingren/business/game-overview.md`
- 用户在本会话中提供的事件、属性、版本日期、指标窗口和分层定义。

## 十、晋升前最小核验

1. 用一日的 `$part_event`、`mode_name`、`reward_calculate` 诊断查询确认事件和枚举。
2. 用属性详情或窄查询确认 `#vp@num_difficult_level`、`#vp@channel_fix`、`#vp@combine_sku_name_item_name`、`#vp@order_price_total` 的真实字段名、类型和空值。
3. 确认 `ta@claim_order_finish` 的虚拟事件规则，以及 `claim_order`/`order_finish` 的生命周期关系。
4. 确认付费主体和活跃主体能否在同一指标中安全使用；不能时分别定义并注明限制。
5. 确认 d7/d14/d30 回流互斥性，以及 `#vp@lifetime_formal = 0` 是否包含缺失值。
6. 确认金额的币种、实付口径、退款冲减和观察窗口。
7. 确认版本日期与官方更新日志一致，再由 `data-analytics` 复核后拆分晋升到正式项目知识。
