---
id: "node:Streamable HTTP"
type: concept
domain: agent
aliases: []
sources:
  - "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports"
  - "[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 高
status: active
---

# Streamable HTTP

> 一句话定义：Streamable HTTP 是 MCP 的一种 HTTP 传输方式：服务器提供同时支持 POST 和 GET 的单一 MCP 端点，客户端通过 POST 发送 JSON-RPC 消息，服务器可返回单个 JSON 对象或使用 SSE 流式返回消息。

## 展开

- MCP 官方传输规范要求服务器提供一个同时支持 POST 和 GET 的单一 MCP endpoint。
- 客户端发送的每条 JSON-RPC 请求、通知或响应都通过新的 HTTP POST 请求提交。
- 对 JSON-RPC 请求，服务器可以返回 `application/json` 的单个 JSON 对象，也可以返回 `text/event-stream` 以启动 SSE 流；因此 SSE 是 Streamable HTTP 可选的响应流机制，不等同于 Streamable HTTP 本身。
- 该传输方式面向 MCP 的客户端—服务器通信，并支持服务器向客户端发送流式消息、通知或请求。
- 来源：[MCP Specification · Transports · Streamable HTTP](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)（访问：2026-09-24）。
- 面经中的对应考察题：[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]。

