---
id: "node:PPO"
type: method
domain: llm
aliases:
  - Proximal Policy Optimization
  - 近端策略优化
tags:
  - topic/llm
sources:
  - "https://arxiv.org/abs/1707.06347"
  - "https://huggingface.co/blog/the_n_implementation_details_of_rlhf_with_ppo"
  - "https://arxiv.org/abs/2402.03300"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]"
relations:
  broader_than:
    - "[[强化学习]]"
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 高
status: active
---

# PPO

> PPO（Proximal Policy Optimization）是一族策略梯度强化学习算法，用截断（clipped）代理目标限制单次策略更新幅度；在 RLHF 中它优化奖励模型给出的期望奖励，需同时维护策略、参考、奖励、价值四个模型。

## 展开

- 目标函数：`max E[min(r(θ)·Â, clip(r(θ), 1−ε, 1+ε)·Â)]`，其中 `r(θ)` 是新旧策略概率比，优势 `Â` 由 GAE 与学习到的价值函数 `V_ψ` 估计。arXiv 摘要称其为可做多轮 minibatch 更新的 *surrogate objective*；截断形式经 DeepSeekMath 论文式 (1) 转述与 Hugging Face 官方博客（clip 系数 0.2、clipfrac 指标）交叉核验。
- 所需模型：策略模型 + 参考模型（用于自适应 KL 惩罚）+ 奖励模型 + 价值模型；DeepSeekMath 原文指出价值模型通常与策略模型同规模。
- 优点：兼具 TRPO 的稳定性但实现更简单、经验样本复杂度更好（arXiv 摘要原文）。
- 缺点：四模型的显存与工程开销大；DPO 论文摘要称 RLHF-PPO *复杂且常不稳定*，Hugging Face 博客也记录了大量实现陷阱。
- 应用：原论文用于机器人运动与 Atari；作为 critic-based 算法被广泛用于 LLM 的 RL 微调阶段（DeepSeekMath 引 Ouyang et al. 2022，即 InstructGPT）。
- 与同族方法的关系：[[GRPO]] 是论文自述的 PPO 变体（用组内相对优势替代价值模型）；[[DPO]] 则完全绕开显式奖励模型与在线采样。三者对比正是面经「RL 到底在优化什么」的落点。
- 证据说明：PPO 2017 原论文无 arXiv HTML 版（ar5iv 亦不可达），截断目标的细节以两个独立二手来源交叉核验，可靠性等同。`broader_than: [[强化学习]]` 的目标节点尚未建立，属待建目标。
- 面经中的对应考察：介绍 PPO、DPO、GRPO 以及 RL 到底在优化什么，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]。
- 来源：[arXiv 1707.06347](https://arxiv.org/abs/1707.06347)、[HF Blog · RLHF with PPO 实现细节](https://huggingface.co/blog/the_n_implementation_details_of_rlhf_with_ppo)、[arXiv 2402.03300](https://arxiv.org/abs/2402.03300)（访问：2026-09-25）。
