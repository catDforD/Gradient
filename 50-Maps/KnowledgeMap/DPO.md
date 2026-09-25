---
id: "node:DPO"
type: method
domain: llm
aliases:
  - Direct Preference Optimization
  - 直接偏好优化
tags:
  - topic/llm
sources:
  - "https://arxiv.org/abs/2305.18290"
  - "https://arxiv.org/html/2305.18290v3"
  - "https://huggingface.co/docs/trl/main/en/dpo_trainer"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[PPO]]"
attributes: {}
confidence: 高
status: active
---

# DPO

> DPO（Direct Preference Optimization）通过对奖励模型做闭式重参数化、把 RLHF 化为单个偏好分类（最大似然）损失的对齐方法：直接拉大偏好对的对数似然差，无需显式奖励模型、无需在线采样，只需策略模型和冻结的参考模型。

## 展开

- 目标函数：最大化 `σ(β[log πθ(y⁺|x)/πref(y⁺|x) − log πθ(y⁻|x)/πref(y⁻|x)])`，等价于 Bradley-Terry 偏好模型加隐式奖励 `r*(x,y) = β·log(πθ/πref)`。论文副标题即 *Your Language Model is Secretly a Reward Model*（全文与 TRL 文档双向核验）。
- 所需模型：策略模型 + 参考模型（TRL 默认取训练前的初始策略）；不训练奖励模型、不做 RL 采样（摘要原文：*eliminating the need for sampling from the LM during fine-tuning*）。
- 优点：稳定、轻量、几乎无需调超参（摘要原文）；在情感控制上超过 PPO-based RLHF，在单轮对话任务上与之持平或更优，且实现显著更简单。
- 局限：依赖离线偏好对数据，而非在线交互（由摘要语境的直接推论，论文未单列一节讨论）。
- 工程支持：TRL 提供 `DPOTrainer`，并官方支持以 [[LoRA]] 作为参数高效底座（`LoraConfig`）。
- 与 [[PPO]] 的关系：互为替代方案，DPO 论文以 PPO-based RLHF 为对照基线；对称关系按本体规则只在 DPO 一侧登记。
- 引用注意：**不要引用 `dpo.github.io`**——该域名现指向无关的个人站点，已核实内容不符。
- 未核验、不写入事实的内容：「Zephyr 等开源模型采用 DPO」本次未核验。
- 面经中的对应考察：见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]。
- 来源：[arXiv 2305.18290](https://arxiv.org/abs/2305.18290)、[全文 v3](https://arxiv.org/html/2305.18290v3)、[TRL · DPO Trainer](https://huggingface.co/docs/trl/main/en/dpo_trainer)（访问：2026-09-25）。
