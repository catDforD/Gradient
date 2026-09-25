---
id: "node:LoRA"
type: method
domain: llm
aliases:
  - Low-Rank Adaptation
  - 低秩适配
  - 低秩微调
tags:
  - topic/llm
sources:
  - "https://arxiv.org/abs/2106.09685"
  - "https://arxiv.org/abs/2305.14314"
  - "https://huggingface.co/docs/trl/dpo_trainer"
  - "https://huggingface.co/docs/trl/grpo_trainer"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#面经 07]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[DPO]]"
    - "[[GRPO]]"
attributes: {}
confidence: 高
status: active
---

# LoRA

> LoRA（Low-Rank Adaptation）是一种参数高效微调方法，冻结预训练权重、仅向 Transformer 各层注入可训练的低秩分解矩阵来学习下游任务增量；它不是全量微调，也不是推理期缓存或量化技术。

## 展开

- 机制（论文原文）：*freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture*，从而大幅减少下游任务的可训练参数量。
- 量级收益（原文数字）：相比用 Adam 微调 GPT-3 175B，可训练参数减少 10,000 倍，GPU 显存需求降低 3 倍。
- 质量与延迟：在 RoBERTa、DeBERTa、GPT-2、GPT-3 上与全量微调持平或更优；训练吞吐更高，且与 adapter 类方法不同，**不引入额外推理延迟**（权重可合并回原模型）。
- 理论依据：论文附带对语言模型适配中 rank-deficiency（秩亏）的实证研究，用以解释低秩为何有效。
- 变体 QLoRA（arXiv 2305.14314，已核验）：梯度穿过冻结的 4-bit 量化预训练模型回传到 LoRA 适配器；三项创新为 NF4（4-bit NormalFloat）、Double Quantization（量化量化常数）、Paged Optimizers（应对显存峰值）。可在单张 48GB GPU 上微调 65B 模型并保持全 16-bit 微调的任务性能；其 Guanaco 模型族在 Vicuna benchmark 上达 ChatGPT 的 99.3%，单卡微调约 24 小时。
- 与对齐方法的关系：TRL 的 DPOTrainer 与 GRPOTrainer 官方支持以 LoRA 作为参数高效底座（`LoraConfig` / `--use_peft`），因此常与 [[DPO]]、[[GRPO]] 组合使用。
- 未核验、不写入事实的内容：具体秩取值（r=1/2/4/8/64）、缩放系数 alpha、「仅注入 Wq/Wv」等实现细节不在论文摘要中；DoRA、AdaLoRA 等其他变体未经核验。
- 缺口提示：最自然的父概念是「参数高效微调 / PEFT」，本库尚无该节点。
- 来源：[arXiv 2106.09685](https://arxiv.org/abs/2106.09685)、[arXiv 2305.14314 (QLoRA)](https://arxiv.org/abs/2305.14314)、[TRL DPO Trainer](https://huggingface.co/docs/trl/dpo_trainer)、[TRL GRPO Trainer](https://huggingface.co/docs/trl/grpo_trainer)（访问：2026-09-25）。
