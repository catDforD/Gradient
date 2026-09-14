---
title: "Codex as a platform: build on the open agent harness"
source: "https://developers.openai.com/blog/codex-as-a-platform"
author:
published:
created: 2026-08-21
description: "Build Codex into the products and workflows your users already know."
type: source-note
aliases:
  - "Codex 作为平台：构建于开放 Agent Harness 之上"
tags:
  - "clippings"
  - "type/source-note"
  - "topic/agent"
---
# Codex as a platform: build on the open agent harness

Most people know Codex through the [App](https://developers.openai.com/codex/app), [Command-Line Interface](https://developers.openai.com/codex/cli), or [IDE Extension](https://developers.openai.com/codex/ide). Those experiences are important, but they are only a few of the ways the same underlying system can be used.

The [open-source Codex harness](https://github.com/openai/codex) is what powers all these experiences. It helps models gather context, reason through tasks, use tools, operate within configured boundaries, request approval, and carry work forward.

That changes what developers can build. Instead of asking every team to move its work into a general-purpose coding assistant, you can bring the agent into software designed around the actual job: an engineering workflow, an operations dashboard, a security investigation, a customer-support console, or an internal application built for one specialized team.

<!-- codex-learning-note:start id="intro-guide" -->
> [!note] 中文学习笔记
> 中文题名：Codex 作为平台：构建于开放 Agent Harness 之上。阅读主线是：Codex 的可复用价值不只在模型，而在能管理上下文、工具、审批与持续执行的 harness；再把这套循环嵌入已有业务界面。下文按“循环 → 开放层 → 集成层 → 工作流与案例”展开。相关：[[AI 与 Coding]]。
<!-- codex-learning-note:end -->

## The reusable part is the agent loop

A capable agent is more than a prompt and a model response. It needs a way to understand a task, maintain context over time, inspect relevant information, call tools, expose progress, handle failures, request human approval when necessary, and return a useful result.

That surrounding execution system is the harness.

Harness design can materially change results: on [ARC-AGI-3](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/), retained reasoning and context compaction raised GPT-5.6 Sol’s score from 13.3% to 38.3% while reducing output tokens sixfold.

We built the Codex harness to manage conversation state, stream execution, use tools, enforce configured sandbox and approval policies, and carry work across turns. With [Codex app-server](https://developers.openai.com/codex/app-server), we expose those capabilities through a documented client protocol: applications can create threads, start turns, receive events, and handle approval requests.

If you are building software that needs an agent, you can start with Codex instead of inventing a new runtime, then decide what the surrounding application should own.



<!-- codex-learning-note:start id="section-reusable-agent-loop" -->
> [!note] 中文学习笔记
> 本节把 agent 定义为“模型＋执行系统”：上下文维护、工具调用、边界与审批共同决定结果。文中用 ARC-AGI-3 的分数变化说明 harness 可能改变能力表现；这是作者报告的案例，不等于对所有任务的因果保证。它为后文选择集成层提供了判断标准。
<!-- codex-learning-note:end -->
## An open harness developers can inspect and adapt

Because the harness is open source, you can inspect the layer between your application and the model, understand how it behaves, and adapt the integration to fit your product.

That gives developers control over the parts that make the agent fit their product:

- The interface. A team can keep its existing dashboards, editors, queues, maps, records, and approval flows instead of forcing every interaction into a generic chat window.
- Context and tools. An application can expose the systems, documents, data, and actions that matter for a particular workflow, including application-owned [MCP services](https://developers.openai.com/codex/extend/mcp).
- Operational boundaries. The host application can decide where an agent runs, which files or tools it can access, which actions require approval, how work is observed, and how results return to the system of record.

We publish the [Codex CLI](https://developers.openai.com/codex/cli), [app-server](https://developers.openai.com/codex/app-server), and [official Codex SDK](https://developers.openai.com/codex/codex-sdk) as open-source components. Our [open-source components guide](https://developers.openai.com/codex/open-source) lists what is available and where each component lives.

The open-source layer is the harness and integration surface; model access and managed services remain separate.



<!-- codex-learning-note:start id="section-open-harness" -->
> [!note] 中文学习笔记
> 开放源码让团队能检查并改造模型与应用之间的层，控制界面、上下文/工具和运行边界。这里的“控制”是集成与治理能力，并不表示模型服务本身开源；作者明确区分了 harness 与模型访问。
<!-- codex-learning-note:end -->
## Choose the right integration layer

Building on Codex does not require the same integration for every use case.

- For a script, CI job, or one-off background task, [codex exec](https://developers.openai.com/codex/non-interactive-mode) can run a bounded agent workflow and return structured output.
- For application code that needs to start, resume, or stream Codex tasks, the [official Codex SDK](https://developers.openai.com/codex/codex-sdk) provides a direct programmatic interface.

For a runnable example, see the [Codex SDK documentation](https://learn.chatgpt.com/docs/codex-sdk).

Use Codex app-server when the agent is part of the product itself. It lets your application connect to a local Codex process, keep conversations open, stream events, interrupt work, expose tools, and respond to approval requests. The SDK simplifies common programmatic workflows; app-server gives product teams direct control over the lifecycle and user experience.



<!-- codex-learning-note:start id="section-integration-layer" -->
> [!note] 中文学习笔记
> 本节按工作形态区分 codex exec、SDK 与 app-server：一次性任务偏向 exec，程序化编排偏向 SDK，需要持久会话、事件流和审批时才用 app-server。分类依据是生命周期与交互控制需求，实际选择仍取决于产品约束。
<!-- codex-learning-note:end -->
## Build software around the workflow

The most interesting opportunity is not to reproduce the Codex app with a different logo, but to build software that reflects how a specific person or team already works:

A security analyst might need an investigation queue, recent alerts, affected services, and an approval step before opening a remediation ticket. A support engineer might need account history, product logs, internal documentation, and a draft response. A product team might want a task board where moving an issue into a ready state begins a scoped implementation workflow.

In each example, the interface is an important part of the experience. It tells the agent what the user is looking at, gives it the right tools, and gives the user a place to review what happens next.

![Architecture diagram showing an application-owned interface, business context, and consent; Codex app-server agent loop and sandboxed execution; and application-owned MCP data and actions.](https://developers.openai.com/images/blog/codex-platform-agent-stack.webp)

<!-- codex-learning-note:start id="figure-1" -->
> [!note] 中文学习笔记
> 图 1 的读图提示：左侧是应用拥有的界面、业务上下文与同意机制，中间是 app-server 的 Agent 循环和沙箱，右侧是应用拥有的 MCP 数据与动作；箭头表达职责边界而非数据吞吐量。
<!-- codex-learning-note:end -->

Figure 1. Your application owns product context, business rules, and tools; Codex app-server provides the agent loop and sandboxed execution.



<!-- codex-learning-note:start id="section-build-around-workflow" -->
> [!note] 中文学习笔记
> 作者主张围绕真实工作界面构建 Agent，而不是复制一个通用聊天框。界面负责提供业务上下文、工具和复核位置，Agent 负责调查与提出行动；这与前文“应用拥有边界”的分工一致。
<!-- codex-learning-note:end -->
## Example: Relay

We built Relay as a sample operations application on Codex app-server. It places an agent beside a fictional shipment dashboard, connects it to application-owned MCP tools, and requires human approval before a shipment is rebooked.

The user does not start by writing a prompt from scratch. They select a shipment and click an action such as **Compare recovery**. The application supplies the relevant context, Codex retrieves the latest sample operational data, the agent explains the available options, and any consequential write requires approval.

Codex can then use the application’s MCP tools to fetch current data before recommending—or, after approval, taking—an action. When a tool changes the underlying record, the application refreshes its business view. The harness handles the agent loop, conversation state, streamed activity, and tool interaction; the product continues to own its dashboard, records, and controls.

Relay uses fictional seeded data, but the integration pattern is general. The same pattern could power incident response, account operations, research workflows, or other applications where an agent should work inside an existing product experience.

![Relay shipment operations dashboard showing an exception queue, shipment details, and a Codex agent investigating a delayed shipment.](https://developers.openai.com/images/blog/codex-platform-relay-operations.webp)

<!-- codex-learning-note:start id="figure-2" -->
> [!note] 中文学习笔记
> 图 2 的读图提示：看板中的异常队列与 shipment 详情提供业务状态，旁侧 Agent 负责调查；人工审批是从建议到改订动作之间的闸门。
<!-- codex-learning-note:end -->

Figure 2. Relay embeds Codex in a shipment operations dashboard, with application-owned MCP tools and human approval for consequential actions.



<!-- codex-learning-note:start id="section-example-relay" -->
> [!note] 中文学习笔记
> Relay 案例把 shipment 看板、应用自有 MCP 工具和人工审批串成闭环。它使用虚构数据，论证的是集成模式而非业务效果；关键控制点是有后果的写操作必须经过批准，并在记录变化后刷新业务视图。
<!-- codex-learning-note:end -->
## What developers are building

This pattern is already showing up in public implementations:

- [
	GitHub and JetBrains
	](https://github.blog/changelog/2026-07-07-codex-as-agent-provider-and-agentic-enhancements-in-jetbrains-ides/)
	bring Codex into existing IDE workflows.
- [
	Cisco
	](https://blogs.cisco.com/ai/from-an-idea-to-a-live-app-on-cisco-in-minutes)
	uses the Codex SDK in App Builder inside Cisco Cloud Control.
- [
	Thrive Holdings and Crete
	](https://openai.com/index/building-self-improving-tax-agents-with-codex/)
	use Codex in a tax-preparation workflow that incorporates practitioner feedback. Their pilot processed 7,000 returns and reduced preparation time by about a third.

These examples are not limited to engineering: the same pattern applies to support teams investigating customer issues, operations teams coordinating workflows, security teams triaging incidents, sales teams researching accounts, and marketing teams developing campaigns. In each case, the application provides the context, tools, and approvals, while Codex powers the underlying agent loop.



<!-- codex-learning-note:start id="section-what-developers-building" -->
> [!note] 中文学习笔记
> 公开案例显示同一模式已延伸到 IDE、企业 App Builder 和税务流程。案例规模与成效来自作者引用的项目报告，不能直接外推为普遍收益；可迁移的共性是应用提供上下文、工具与审批。
<!-- codex-learning-note:end -->
## Build beyond the obvious

<!-- codex-learning-note:start id="section-build-beyond-obvious" -->
> [!note] 中文学习笔记
> 结尾把论点提升为产品设计原则：仪表盘、时间线、地图和记录是人理解工作的媒介，Agent 应增强这些界面而非抹平它们。它回扣全文的所有权边界，并把 exec、SDK、app-server 作为不同落点。
<!-- codex-learning-note:end -->


For many kinds of work, the essential context is grounded in a dashboard, a timeline, a map, a document, or a system record. Those views are not there to be pretty: it is how people actually understand what is happening, make decisions, and stay in control.

The opportunity is not to replace those interfaces with a universal chat box, but to make them more capable by giving them an agent that can understand the work, investigate the right context, propose a next step, and take an approved action.

The Codex app, CLI, and IDE extension show what the harness can do. By making the harness open source, we give developers a way to inspect those capabilities, integrate them, and adapt them to their own products and workflows.

If you want to build with the Codex harness, start with the [open-source Codex repository](https://github.com/openai/codex), then choose the integration that fits your product: [codex exec](https://developers.openai.com/codex/non-interactive-mode) for noninteractive jobs, the [Codex SDK](https://developers.openai.com/codex/codex-sdk) for programmatic agent workflows, or [Codex app-server](https://developers.openai.com/codex/app-server) for applications that need persistent conversations, streamed events, and approval handling.
