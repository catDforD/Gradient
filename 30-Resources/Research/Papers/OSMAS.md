---
type: paper-note
aliases:
  - OSMAS 笔记
tags:
  - type/paper-note
  - topic/agent/multi-agent
  - topic/agent
---

# OSMAS

相关：[[AI 与 Coding]] · [[PTC]]

论文：[[Design Once, Adapt Efficiently - OSMAS.pdf|Design Once, Adapt Efficiently: Multi-Agent System Generation via Optimized Pools]]

核心方法叫 **OSMAS / One-Shot Multi-Agent System**。

## 1. 总结

这篇论文想解决 **LLM-based Multi-Agent System 自动设计中的效率—适应性矛盾**。作者认为，已有方法大致有两类问题：一类是训练/搜索出一个固定 MAS，然后所有 query 都用同一个系统，不能适应不同问题；另一类是每个 query 都重新优化 MAS，虽然灵活，但成本高、质量不稳定。论文将这个问题概括为：如何既 **离线优化一次**，又能在推理时 **按 query 快速组合出合适的 MAS**。

论文提出的核心思想是借鉴 **one-shot NAS**：先构建一个可复用的 “Super MAS”，里面包含优化好的 agent 和 topology，然后推理时不从零搜索，而是从池子里检索、组合、轻微适配。作者把 MAS 设计从 “research every time” 转成 “build once, compose efficiently”。
![[osmas-20260702153550.png]]
### **OSMAS 整体流程**

**第一阶段：Super MAS Training。**  
这个阶段离线优化三个组件：agent profile、prompt、topology。具体来说，先通过 feedback-driven self-refinement 初始化和优化 agent profiles；然后在给定 topology 下用 TextGrad 类似的 textual gradient 方法优化所有 agent 的 prompt；最后固定 profile 和 prompt，用多目标进化算法优化 topology。训练结束后得到两个池子：**Agent Pool** 和 **Topology Pool**。Agent Pool 存储完整 agent 规格，包括 profile、prompt 和 operator；Topology Pool 存储训练 query 与对应高性能 topology 的配对。

**第二阶段：Pool-Based MAS Generation。**  
给定一个新 query，系统使用一个轻量级 orchestrator，从 Agent Pool 中选取/适配 agent，从 Topology Pool 中检索相似的 query-topology exemplar，然后通过 in-context learning 生成一个 query-specific MAS。这个 MAS 不需要在线重新优化，而是复用离线优化得到的 agent 和 topology 模板。

方法细节上，论文把 agent 视为由 **operator、profile、prompt** 构成的子图；topology 则被拆成 agent 内部 operator 结构和 agent 之间的连接关系。agent 间 topology 被建模为 DAG。作者使用的 operator 包括 Direct、CoT、ReAct、Multi-CoT、SelfRefine 和 Self-Consistency-Ensemble。

### **实验结果**

实验部分，作者在五个 benchmark 上评估：**GSM8K、MATH、HumanEval、MBPP 和 HotpotQA**，覆盖数学推理、代码生成和多跳问答等任务。baseline 包括 IO、CoT、Self-Consistency、MultiPersona Debate、Self-Refine、LLM-Debate、GEPA、GPTSwarm、ADAS、AgentSquare 和 AFlow。实现上，OSMAS 用 gpt-4o 做 prompt optimizer，用 gpt-4o-mini 做 topology evolution 和 agent inference 的 executor。

结果上，OSMAS 在五个 benchmark 上都报告了最优性能，平均分为 **81.8**，高于 AFlow 的 **79.8**，具体数据可见表 2。消融实验显示，profile initialization 和 prompt optimization 的贡献最大，具体数据可见表 3。

![[osmas-20260702153900.png]]

总结：**这篇论文提出了一个“先离线优化池子，再在线检索组合”的自动 MAS 生成框架，用 Agent Pool + Topology Pool 来兼顾性能、成本和 query-level 适应性。**

---

## 2. 优劣点

 ### **优点**
- **profile、prompt、topology 这些 MAS 的构成能够解耦合**
	论文指出 prompt 是自然语言，topology 是结构化图，直接联合优化不太自然。因此它采用类似 bi-level/co-optimization 的方式：先优化 prompt，再固定 prompt 优化 topology。这个设计可以降低搜索空间复杂度，也更方便分析每个模块的作用。

- **显著的成本优势**
	作者使用 NSGA-III 多目标进化优化算法 来优化 topology ，LLM 主要用在 agent 执行上，比较像 AFlow 的优化，能更省 API 调用成本。
	- 训练成本：仅为 AFlow 的 **15.4%**
	- 生成成本：每次查询仅 $0.0013，是总推理成本的 37.3%
	![[osmas-20260703095551.png]]

### **缺点**
- **核心创新组合了很多工作，原创性可能比较欠缺**
	OSMAS 的各个组成部分：
	- profile evolution：借鉴 EvoAgent
	- prompt optimization：用 TextGrad https://github.com/zou-group/textgrad
	- operator space：借鉴 AFlow/EvoFlow
	- topology evolution：用 NSGA-III
	创新的部分是将这些组合成 Agent Pool + Topology Pool MAS generation 框架，原创性较弱。

- **实验采用的数据集都比较过时**
	![[osmas-20260703091855.png]]
	如图中所示的这些数据集本是用来测 LLM 的能力的，而且还比较简单，完全无法突出 Multi-Agent-Systems 的 Agent 能力。这个问题可能比较严重，很多基础问答类的任务根本没必要用 MAS ，所宣称的降低成本远远高于一次能力较强模型的问答成本，强行使用 MAS 就没有意义了。

- **论文提出的 OSMAS 泛化能力并未得到验证**
	OSMAS 目前只在 GPT-4o / GPT-4o-mini 上验证了，没有在其它模型上进行过测试所以泛化性也未得到验证。
	![[osmas-20260703093337.png]]

- **query adaptivity 消融增益很小**
	OSMAS 是 query-adaptive MAS generation，也就是会对一个新 query 能生成一个 query-specific MAS。但是就 MATH 消融结果来说，去掉 query adaptivity 后得分只下降了 0.3 。反而去掉 prompt optimization 或 profile initialization 则分别下降了 6.6 和 10.3 。这就让人感觉性能提升主要来自更好的 profiles/prompts 而非 query-level topology adaptation。
	![[osmas-20260703103057.png]]

--- 

## 3. 问题：

### **关于核心 claim：query adaptivity 是否真的关键？**

OSMAS 的提升到底来自 query-adaptive generation，还是来自更好的 profile/prompt optimization？从消融来看，去掉 query adaptivity 只掉 0.3，而去掉 prompt optimization 掉 6.6，去掉 profile initialization 掉 10.3。这说明 query adaptivity 对 MATH 的贡献很小。作者应该在所有 benchmark 上报告 “without query adaptivity” 的结果，并分析哪些 query 真的需要不同 topology。
- Q1：为什么 query adaptivity 是论文核心卖点，但 ablation 中收益这么小？
- Q2：不同 query 生成的 topology 差异有多大？是否只是大多数 query 都生成相似的  topology？
- Q3：能否展示 case study：同一任务中不同 query 分别需要不同 agent 数量、operator 和连接方式？

### **关于泛化、鲁棒性和实验数据集设置的问题**

论文目前验证的任务还是偏标准 benchmark。对于真实 agent 系统，通常还会有动态环境、工具调用失败、长上下文、多轮交互、外部检索、状态更新等问题。
- Q4：训练好的 Agent Pool / Topology Pool 能否跨 dataset 复用？例如 MATH 上训练的数学 agent 能否迁移到 GSM8K？
- Q5：如果换成开源模型，比如 Qwen、Llama、DeepSeek，pool 是否仍然有效？
- Q6：是否测试过更真实的工具型任务，比如 web browsing、database QA、software engineering repo-level task？
- Q7：为什么选择在单个 LLM 已能较好解决的 benchmark 上验证 MAS 设计？这些任务是否真的需要 multi-agent 协作？
- Q8：在 GSM8K 上，IO 已达 87.5%，OSMAS 92.5% 的提升是否主要来更好的 prompt/profile？一个更复杂的 agent 系统是否"杀鸡用牛刀"？
- Q9：是否应该在更能体现 MAS 价值的任务上验证？例如：
	- 长上下文多文档推理（需要多个 agent 分别处理不同文档再整合）
	- 多工具链协作任务（需要 planner + executor + verifier 等明确分工）
	- 需要多轮外部检索的复杂 QA
	- 软件工程 repo-level 任务（如 ChatDev 展示的完整项目开发）

--- 
