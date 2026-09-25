---
id: "node:LangGraph"
type: entity
domain: agent
aliases:
  - LangGraph 框架
  - langgraph
tags:
  - topic/agent/architecture
sources:
  - "https://docs.langchain.com/oss/python/langgraph/overview"
  - "https://docs.langchain.com/oss/python/langgraph/graph-api"
  - "https://docs.langchain.com/oss/python/langgraph/persistence"
  - "https://docs.langchain.com/oss/python/langgraph/memory"
  - "https://docs.langchain.com/oss/python/langgraph/use-subgraphs"
  - "https://docs.langchain.com/oss/python/langgraph/fault-tolerance"
  - "https://github.com/langchain-ai/langgraph"
  - "[[20-Areas/实习与求职/面试题与经验/小红书-Agent开发实习生-一面面经-AIGC小白入门记#3. LangGraph 中三个子图如何传递数据]]"
  - "[[20-Areas/实习与求职/面试题与经验/小红书Agent开发实习生一面-百度Agent面经-杰尼龟#Agent 工作流与 LangGraph]]"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#Agent 状态与工具工程]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[Tool Calling]]"
    - "[[Harness]]"
attributes: {}
confidence: 高
status: active
---

# LangGraph

> LangGraph 是 LangChain 团队开源的低层级 Agent 编排框架与运行时，用图（State / Nodes / Edges）显式建模 Agent 流程，提供持久化执行、流式输出与人机协同；它不是模型、不是 Prompt 库，也不提供预置 Agent 架构。

## 展开

- 官方定位原文：*a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents*，并强调 *very low-level, and focused entirely on agent orchestration*。预置架构属 LangChain 的 `create_agent`，规划 / 子代理 / 文件系统等「电池全含」能力属更上层的 harness（如 Deep Agents）。可脱离 LangChain 单独使用。
- **State / StateGraph**：State 由 schema（TypedDict / dataclass / Pydantic）加每个 key 的 reducer 构成。节点接收当前 state、**返回部分更新**，由 reducer 合并（默认覆盖，`add_messages` 则为追加）。执行基于 message passing，灵感来自 Google Pregel，按离散 super-step 推进。面经截图答案「节点读取 State、返回更新后的 State、沿边传给下一节点」与此一致。
- **Checkpoint 与 Memory 的关系**（面试常问「区别」，官方文档并不把二者对立）：持久化层有两套互补系统——**Checkpointers** 保存线程内（thread-scoped）的图状态快照，**Stores** 保存图状态之外、按自定义 namespace 的跨线程数据。对应的记忆划分是：短期记忆 = 线程作用域，由 checkpointer 实现；长期记忆 = 跨线程 / 跨会话，由 Store 实现。文档明确 *Checkpointers are required for ... Memory*，即 checkpoint 是短期记忆的实现机制而非替代品。准确答法：checkpoint 是持久化快照，memory 是能力概念。
- **子图（subgraphs）**：官方定义是「被用作另一个图中节点的图」。共享 state key 时可直接 `add_node(compiled_subgraph)`；schema 不同则在节点内调用并做转换。**默认不独立运行**：`checkpointer=None` 时继承父图 checkpointer 且每次调用从头开始；设为 `True` 可跨调用累积（per-thread，但不支持并行工具调用，会产生 checkpoint namespace 冲突）；设为 `False` 则完全无状态、不支持 interrupt。父图必须已编译 checkpointer，子图的持久化特性才生效。
- **节点重跑与失败恢复**：checkpoint 只在 super-step 边界保存，不在节点函数中途保存；恢复时受影响节点会**从函数开头整体重跑**，暂停前已发生的副作用会再次执行，因此官方要求节点逻辑幂等。同一 super-step 内已成功的节点通过 pending writes 保留、不重跑；Replay 时 checkpoint 之前的节点跳过、之后的全部重跑（含 LLM / API 调用，interrupt 必然重新触发）。容错由 retries、timeouts、error_handler 提供，故障可从最后一个成功 step 重启，失败上下文（`NodeError`）本身也被 checkpoint，故 resume-safe。durability 分 `exit` / `async` / `sync` 三档。
- 与 [[Harness]] 的关系：官方产品页把栈分为 framework / runtime / harness 三层，LangGraph 属 runtime 层，harness 构建其上。
- 来源：[LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)、[Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)、[Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)、[Memory](https://docs.langchain.com/oss/python/langgraph/memory)、[Use subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs)、[Fault tolerance](https://docs.langchain.com/oss/python/langgraph/fault-tolerance)（访问：2026-09-25）。旧域名 `langchain-ai.github.io/langgraph/*` 已 301 迁移到 docs.langchain.com。
