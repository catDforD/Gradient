---
id: "node:GRPO"
type: method
domain: llm
aliases:
  - Group Relative Policy Optimization
  - 组相对策略优化
tags:
  - topic/llm
sources:
  - "https://arxiv.org/abs/2402.03300"
  - "https://arxiv.org/html/2402.03300v3"
  - "https://huggingface.co/docs/trl/main/en/grpo_trainer"
  - "https://arxiv.org/html/2501.12948v1"
  - "https://github.com/deepseek-ai/DeepSeek-Math"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]"
relations:
  broader_than:
    - "[[PPO]]"
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 高
status: active
---

# GRPO

> GRPO（Group Relative Policy Optimization）是 DeepSeek 提出的 PPO 变体：对同一提示从旧策略采样 G 个输出，用组内奖励的均值与标准差归一化后的相对优势替代价值（critic）模型估计的基线，在保留奖励模型与 KL 约束的同时省去与策略同规模的价值模型。

## 展开

- 目标函数：与 PPO 同款的截断代理目标，但优势改为 `Â_i = (r_i − mean(r)) / std(r)`，奖励来自奖励模型或可验证的奖励函数（论文全文与 TRL 文档核验）。
- 所需模型：策略模型 + 参考模型 + 奖励模型 / 奖励函数；**不需要价值（critic）模型**——论文原文 *foregoes the critic model, instead estimating the baseline from group scores*。
- 优点：价值模型通常与策略模型同规模，去掉后显著降低显存与计算开销（摘要原文：*optimizing the memory usage of PPO*）；组内对比也贴合奖励模型的相对比较性质（TRL 文档）。
- 应用：DeepSeekMath-Instruct 的结果监督 RL、过程监督 RL 与迭代 RL（论文 §4.1）；DeepSeek-R1 论文明确以 GRPO 为 RL 框架；TRL 提供 `GRPOTrainer`，官方支持 `--use_peft` 与 [[LoRA]] 组合。官方代码见 DeepSeek-Math 仓库（论文正文所载）。
- 实现差异提示：TRL 版本额外含对参考策略的 KL 惩罚项，且其归一化方式与原文存在细微差别，照搬论文公式时需注意。
- 关系说明：`broader_than: [[PPO]]` 依据论文原文自述 *a variant of Proximal Policy Optimization (PPO)*，GRPO 是更具体的主题。不再写 `broader_than: [[强化学习]]`——经 PPO 传递可达，本体禁止手写传递闭包。
- 未核验、不写入事实的内容：DeepSeek-V3 使用 GRPO（本次仅核验 DeepSeekMath 与 R1）。
- 面经中的对应考察：见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#面经 01｜AI 应用开发工程师｜2026-04-28]]。
- 来源：[arXiv 2402.03300 (DeepSeekMath)](https://arxiv.org/abs/2402.03300)、[全文 v3](https://arxiv.org/html/2402.03300v3)、[TRL · GRPO Trainer](https://huggingface.co/docs/trl/main/en/grpo_trainer)、[DeepSeek-R1](https://arxiv.org/html/2501.12948v1)（访问：2026-09-25）。
