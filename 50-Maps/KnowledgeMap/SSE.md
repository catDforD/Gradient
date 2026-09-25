---
id: "node:SSE"
type: concept
domain: engineering
aliases:
  - Server-Sent Events
  - server-sent events
sources:
  - "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"
  - "[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 05｜AI Agent 开发｜2026-04-15]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[Streamable HTTP]]"
attributes: {}
confidence: 高
status: active
---

# SSE

> SSE（Server-Sent Events）是一种基于 HTTP 的服务器到客户端单向事件流机制，客户端建立连接后，服务器以事件流持续发送数据，客户端不能通过同一 SSE 连接向服务器发送事件。

## 展开

- MDN 将 server-sent events 描述为服务器向前端持续推送事件的单向连接；客户端使用 `EventSource` 接收事件。
- 服务器端响应使用 `text/event-stream` 媒体类型；事件由文本块组成，并以空行分隔。
- SSE 适合服务器主动向客户端推送连续事件；它本身不提供客户端到服务器的双向消息通道。
- 来源：[MDN · Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)（访问：2026-09-24）。
- 面经中的对应考察题：[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]。

