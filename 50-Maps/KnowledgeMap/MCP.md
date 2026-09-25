---
id: "node:MCP"
type: entity
domain: agent
aliases:
  - Model Context Protocol
tags:
  - topic/agent/tool-calling
sources:
  - "https://modelcontextprotocol.io/docs/getting-started/intro"
  - "https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture"
  - "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports"
  - "https://www.anthropic.com/news/model-context-protocol"
  - "[[30-Resources/AI/Agent/Codex 作为平台：构建于开放 Agent Harness 之上#An open harness developers can inspect and adapt]]"
  - "[[30-Resources/AI/Agent/托管 Agent 的扩展与脑手解耦#Decouple the brain from the hands]]"
  - "[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#项目与 Agent 工程]]"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#Agent 状态与工具工程]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[Tool Calling]]"
    - "[[Streamable HTTP]]"
attributes: {}
confidence: 高
status: active
---

# MCP

> MCP（Model Context Protocol）是一个开放标准，用统一的客户端—服务器协议把 AI 应用连接到外部系统：数据源、工具和工作流由 MCP 服务器暴露，AI 应用通过 MCP 客户端连接并取用。

## 展开

- 官方定位：MCP 是「连接 AI 应用与外部系统的开源标准」，并把它比作 AI 应用的 USB-C 接口——像 USB-C 提供统一的设备连接方式一样，MCP 提供 AI 应用连接外部系统的统一方式。
- 起源：Anthropic 于 2024-11-25 发布，由 David Soria Parra 与 Justin Spahr-Summers 创建；发布时定位为「连接 AI 助手与数据所在系统的标准」，以开源项目、SDK 和参考服务器实现的形式推进。
- 角色划分：MCP 主机（AI 应用）为每个 MCP 服务器创建一个 MCP 客户端，每个客户端维持一条专用连接；服务器可以是本地进程（stdio），也可以是远程服务（Streamable HTTP）。
- 分层：数据层定义基于 JSON-RPC 2.0 的消息、能力与版本发现；传输层定义通信通道与认证。因此同一套消息格式可以在不同传输上运行。
- 服务器端原语：tools（可被调用的可执行函数）、resources（向 AI 应用提供上下文的数据源）、prompts（可复用的交互模板）。客户端用列表方法发现这些原语，工具通过 `tools/call` 执行。
- 版本差异：在 2026-07-28 修订中，协议被描述为无状态——每个请求在 `_meta` 中携带协议版本与该请求相关的能力，服务器通过 `server/discover` 公布支持的版本；客户端原语 sampling 与 logging 在该版本被标记为废弃。
- 与 [[Tool Calling]] 的关系：MCP 解决的是工具与数据来源如何被标准化暴露和接入；模型选择并请求调用哪个工具仍属于 [[Tool Calling]] 机制。
- 与 [[Streamable HTTP]] 的关系：Streamable HTTP 是 MCP 的两种标准传输之一，替代 2024-11-05 版本的 HTTP+SSE 传输。
- 本库来源中的用法：应用可以向 harness 暴露自有的 MCP 服务（见 Codex 一文）；托管 Agent 中模型经代理调用 MCP 工具，OAuth token 存放在沙箱外的 vault 里，harness 不接触凭证。
- 面试中的对应考察题：MCP 版本兼容（[[20-Areas/实习与求职/面试题与经验/小红书-Agent服务端开发实习-一面面经#项目与 Agent 服务端]]）。题目只证明它是考察主题，不构成协议事实。
- 来源：[MCP · What is the Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)、[MCP · Architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)、[MCP Specification · Transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)、[Anthropic · Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)（访问：2026-09-24）。
