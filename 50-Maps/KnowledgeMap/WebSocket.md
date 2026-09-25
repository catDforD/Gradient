---
id: "node:WebSocket"
type: concept
domain: engineering
aliases:
  - WebSockets
  - WebSocket API
  - RFC 6455
  - ws
  - wss
tags:
  - topic/engineering/backend
sources:
  - "https://www.rfc-editor.org/rfc/rfc6455.txt"
  - "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
  - "https://html.spec.whatwg.org/multipage/web-sockets.html"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 05｜AI Agent 开发｜2026-04-15]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[SSE]]"
attributes: {}
confidence: 高
status: active
---

# WebSocket

> WebSocket 是基于 TCP、经 HTTP Upgrade 握手建立的全双工双向通信协议（RFC 6455），浏览器通过 `WebSocket` API 在同一条长连接上同时收发文本或二进制消息，无需轮询。

## 展开

- RFC 6455 摘要原文：*enables two-way communication*，由 *an opening handshake followed by basic message framing, layered over TCP* 组成；设计目标是取代依赖多开 HTTP 连接的轮询方案（XMLHttpRequest、iframe、long polling）。
- 握手：客户端发 `GET` 并带 `Upgrade: websocket`、`Connection: Upgrade`、`Sec-WebSocket-Key`、`Sec-WebSocket-Version: 13`；服务器回 `101 Switching Protocols` 与 `Sec-WebSocket-Accept`（把 Key 拼接固定 GUID `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 后做 SHA-1 再 base64）。非 101 即握手失败。
- 协议边界：RFC §1.7 称其为 *an independent TCP-based protocol. Its only relationship to HTTP is that its handshake is interpreted by HTTP servers as an Upgrade request.* URI 方案 `ws://` 默认端口 80，`wss://`（TLS）默认 443。
- 帧规则：客户端发往服务器的帧**必须**掩码（无论是否使用 TLS），服务器帧**必须不**掩码；支持分片与 Close / Ping / Pong 控制帧。
- API：MDN 称其打开 *a two-way interactive communication session*；WHATWG 定义 `readyState` 为 CONNECTING 0 / OPEN 1 / CLOSING 2 / CLOSED 3，`send()` 接受字符串、Blob 或 BufferSource 且为异步（仅写入缓冲），`binaryType` 取 `"blob"` 或 `"arraybuffer"`。
- 典型场景（RFC §1.1 列举）：游戏、股票行情、多人协同编辑、实时服务端界面、即时通讯。

## 与 SSE 的对照

| 维度 | WebSocket | [[SSE]] |
| --- | --- | --- |
| 方向 | 双向全双工 | 单向，MDN 原文 *you can't send events from a client to a server* |
| 底层 | 独立 TCP 协议，仅借 HTTP 做 Upgrade | 普通 HTTP 响应，`Content-Type: text/event-stream`，强制 UTF-8 |
| 自动重连 | 规范未定义任何自动重连 | 规范强制自动重连 |
| 断点续传 | 无 | `id:` 字段 + `Last-Event-ID` 请求头 |
| 二进制 | 支持 | 不支持 |

重连差异经规范全文词频交叉验证：WHATWG `web-sockets.html` 中 `reconnect` / `reestablish` / `reconnection time` 均出现 0 次；`server-sent-events.html` 中分别为 12 / 11 / 3 次，并在 §9.2.3 定义了规范性的 *reestablish the connection* 算法。SSE 侧还可用 `retry:` 指定重连间隔、用 HTTP 204 No Content 告知客户端停止重连。

- 面经中的对应考察：SSE 和 WebSocket 的区别，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 05｜AI Agent 开发｜2026-04-15]]。
- 来源：[RFC 6455](https://www.rfc-editor.org/rfc/rfc6455.txt)、[MDN · WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)、[WHATWG · Web sockets](https://html.spec.whatwg.org/multipage/web-sockets.html)、[WHATWG · Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)（访问：2026-09-25）。
