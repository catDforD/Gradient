---
id: "node:ReAct"
type: method
domain: agent
aliases:
  - Reasoning + Acting
  - ReAct prompting
  - ReAct 范式
  - 推理-行动交替
tags:
  - topic/agent/architecture
sources:
  - "https://arxiv.org/abs/2210.03629"
  - "https://www.langchain.com/blog/planning-agents"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#项目与 Agent 工程]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites:
    - "[[Tool Calling]]"
  related:
    - "[[Plan-and-Execute]]"
attributes: {}
confidence: 高
status: active
---

# ReAct

> ReAct 是让模型在解决任务时交替生成推理轨迹（Thought）与具体行动（Action，如调用工具或查询环境），并依据观察结果（Observation）循环修正的提示范式；它不包含多智能体协作，也不预先一次性生成完整计划。

## 展开

- 机制：Thought → Action → Observation 循环。推理用于制定、跟踪、修改和修复计划，行动用于从外部环境（如 Wikipedia API、网页界面）获取信息，观察结果再进入下一轮推理。
- 出处：Yao et al., *ReAct: Synergizing Reasoning and Acting in Language Models*（arXiv 2210.03629，ICLR 2023），在 HotpotQA、FEVER、ALFWorld、WebShop 上验证，仅需 1–2 个示例。
- 与 CoT 的差别：论文报告 ReAct 相比纯思维链减少幻觉与错误传播；在交互决策任务上，相比模仿学习与强化学习基线的绝对成功率分别高 34 和 10 个百分点。推理轨迹同时提升可解释性。
- 代价：每一步行动都要一次 LLM 调用，长任务成本高；因为没有全局计划，长程任务容易迷失方向。这也是 [[Plan-and-Execute]] 出现的动因。
- 适用场景：需要动态环境反馈、步骤间强依赖的交互式任务，例如检索问答、网页操作、游戏环境。
- 面经中的对应考察：ReAct 与 CoT 的区别及适用场景，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#项目与 Agent 工程]]。
- 来源：[arXiv 2210.03629](https://arxiv.org/abs/2210.03629)、[LangChain Blog · Planning Agents](https://www.langchain.com/blog/planning-agents)（访问：2026-09-25）。
