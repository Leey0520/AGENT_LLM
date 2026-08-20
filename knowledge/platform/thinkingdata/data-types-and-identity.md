---
id: platform.thinkingdata.data-types-and-identity
title: 数数数据类型与用户身份规则
scope: platform
status: draft
owner: data-analytics
reviewed_at: 2026-08-20
tags: [thinkingdata, data-type, identity, sdk]
---

# 数数数据类型与用户身份规则

## 数据类型

| 数数类型 | 上报形式 | 工作限制 |
| --- | --- | --- |
| 数值 | `123`、`1.23` | 范围约为 `-9E15` 至 `9E15`；设计时给出业务范围。 |
| 文本 | 字符串 | 默认上限约 2KB；ID 和枚举值要有中文映射。 |
| 时间 | `yyyy-MM-dd HH:mm:ss` 或带毫秒格式 | 日期也按时间上报，例如 `yyyy-MM-dd 00:00:00`。 |
| 布尔 | `true` / `false` | 不用字符串 `"true"` 代替布尔。 |
| 列表 | `[]` 或字符串列表 | 元素会转为字符串，最多 500 个元素；无内容明确上报 `[]`。 |
| 对象 | 一个结构体 | 最多约 100 个子属性，不可嵌套对象或对象组。 |
| 对象组 | 多个同类结构体的数组 | 最多约 500 个对象，不可嵌套对象或对象组。 |

对象和对象组要在方案中登记父属性，在对象结构中登记子属性；子属性名使用 `parent.key`。空对象组不能只传 `[]` 期待平台识别结构，按规范需要用 `[{}]` 触发对象组结构识别，再由验收确认实际子属性。

## 首次入库与类型错误

数数第一次入库会根据第一条数据判断字段类型。若程序把数值、布尔、列表或对象错误地当成文本上报，不能只在方案表改类型：先修正上报，再联系数数管理员删除错误历史元数据并重新触发。历史错误类型和当前正确类型不能在 SQL 里静默混用。

## 平台预置属性

正式项目默认打开 ThinkingData 预置属性。至少检查 `#account_id`、`#distinct_id`、`#device_id`、`#event_time`、`#zone_offset` 以及地区、系统等字段是否按项目实际接入方式产生。`#account_id`、`#distinct_id` 的含义由项目交接文档确定，不能从通用模板推断。

## 通用身份原则

- 账号主体、设备主体、访客主体是不同层级，查询去重前必须明确使用哪一个。
- 客户端和服务端上报要绑定同一用户；若服务端没有设备字段，付费查询通常不能直接按设备主体去重。
- 迁移、换包、跨端合并会改变主体关系。项目若有迁移历史，必须在项目页写出按日期和渠道的例外，不能沿用通用主体。

## 证据

- [埋点规范](https://chillyroom.feishu.cn/docx/XNxwdOMAPoLGdUx3wQxcLgcPnOg) 的数据类型 Sheet：`FC12sGyZvhBvjXt58MOciZ4Wn7g`。
- [埋点培训文档](https://chillyroom.feishu.cn/wiki/CPSVwvyX9ilbsFkhw0ycGxNqntF)
