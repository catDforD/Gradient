---
id: "node:Harness"
type: concept
domain: agent
aliases: []
tags:
  - topic/agent/harness
sources:
  - "[[30-Resources/AI/Agent/Codex 作为平台：构建于开放 Agent Harness 之上#The reusable part is the agent loop]]"
  - "[[30-Resources/AI/Agent/长时运行 Agent 的有效 Harness#The long-running agent problem]]"
  - "[[30-Resources/AI/Agent/托管 Agent 的扩展与脑手解耦#Don’t adopt a pet]]"
  - "[[30-Resources/AI/Agent/编排器税：保护工作记忆的多 Agent 实践#Acknowledgments]]"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#项目与 Agent 工程]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[Tool Calling]]"
attributes: {}
confidence: 中
status: active
---

# Harness

> Harness 是模型之外负责执行的那一层系统：它维持跨回合的上下文、调用工具、约束运行边界、处理审批与失败，并让工作继续推进；模型只在这一层提供的循环里做推理。它不包含模型本身，也不包含模型服务的托管部分。

## 展开

- 来源把可复用的那部分称为 agent loop，把包围它的执行系统称为 harness：理解任务、维护上下文、检查相关信息、调用工具、暴露进度、处理失败、请求人工审批、返回结果，都由这一层承担。
- harness 设计会直接改变能力表现。在 ARC-AGI-3 上，保留推理并压缩上下文后，作者报告分数从 13.3% 升到 38.3%，同时输出 token 降到约六分之一。这是单个被报告案例，不是对所有任务的保证。
- Claude Agent SDK 被描述为通用的 agent harness，自带 compaction 等上下文管理能力，因此可以跨多个上下文窗口持续工作；但来源也指出，仅靠压缩并不足以支撑复杂工程任务。
- harness 里编码了关于「模型做不到什么」的假设，模型升级后这些补偿机制可能变成负担，需要被持续质疑。见 [[30-Resources/AI/Agent/托管 Agent 的扩展与脑手解耦#Don’t adopt a pet]]。
- 开源 harness 会暴露多个集成面：Codex 除了 App、CLI 和 IDE 扩展，还提供 `codex exec`、SDK 与 app-server；其中 app-server 让应用自己保留会话、事件流与审批处理。来源明确区分 harness 与模型访问，二者不一起开源。
- 与 [[Tool Calling]] 的关系：harness 负责把模型提出的工具调用路由到实际执行体并处理结果，工具调用机制本身不包含上下文管理、运行边界与审批。
