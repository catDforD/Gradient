---
id: "node:Plan-and-Execute"
type: method
domain: agent
aliases:
  - plan-then-execute
  - planner-executor
  - 规划-执行
  - 先规划后执行
tags:
  - topic/agent/architecture
sources:
  - "https://www.langchain.com/blog/planning-agents"
  - "https://arxiv.org/abs/2305.04091"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 05｜AI Agent 开发｜2026-04-15]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites:
    - "[[Tool Calling]]"
  related: []
attributes: {}
confidence: 高
status: active
---

# Plan-and-Execute

> Plan-and-Execute 是先由规划器（planner）一次性生成完整多步计划、再由执行器（executor）逐步执行、必要时经重规划器（replanner）修订计划的智能体编排模式；它与 [[ReAct]] 的单步交替循环相对，本身不特指某一具体框架实现。

## 展开

- 三阶段循环：Planning Step（LLM 把任务分解为子步骤列表）→ Execute Step（常用较小模型或一个 ReAct agent 执行单步）→ Re-Plan Step（依据执行结果决定继续或修订计划）。
- 收益（LangChain 官方博客陈述）：避免每次工具调用都请求昂贵的大模型，因而更快更省；强制模型先想清楚整体目标，更适合长程（long-horizon）任务。
- 学术源头：该模式是工程实践综合出的名称，LangChain 官方引用 Plan-and-Solve Prompting（Wang et al. 2023，arXiv 2305.04091）、ReWOO、LLMCompiler 与 BabyAGI。「起源于单一论文」的说法不成立。
- 权衡：初始计划基于不完整信息，环境剧变时依赖重规划；单步执行的反馈粒度粗于 ReAct。
- 与 [[ReAct]] 的选择：步骤可预先分解、执行相对确定、对成本敏感的长链任务倾向 Plan-and-Execute；需要频繁环境反馈、步骤强依赖的交互任务倾向 ReAct。
- 面经中的对应考察：两种模式的应用场景对比，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 05｜AI Agent 开发｜2026-04-15]]。
- 来源：[LangChain Blog · Planning Agents](https://www.langchain.com/blog/planning-agents)、[arXiv 2305.04091](https://arxiv.org/abs/2305.04091)（访问：2026-09-25）。
