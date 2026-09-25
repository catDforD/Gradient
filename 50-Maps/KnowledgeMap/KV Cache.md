---
id: "node:KV Cache"
type: concept
domain: llm
aliases:
  - key-value cache
  - KV 缓存
  - 键值缓存
tags:
  - topic/llm
sources:
  - "https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/"
  - "https://arxiv.org/abs/2309.06180"
  - "https://blog.vllm.ai/2023-06-20/vllm.html"
  - "https://docs.vllm.ai/en/latest/design/prefix_caching.html"
  - "https://arxiv.org/abs/2311.03285"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#实习与项目]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[LoRA]]"
attributes: {}
confidence: 高
status: active
---

# KV Cache

> KV Cache（键值缓存）是自回归 Transformer 推理解码阶段的专用缓存，把已生成 token 的 Key / Value 张量驻留 GPU 显存以避免重复计算；它不是通用缓存，也不改变模型的数学结果。

## 展开

- 为什么存在（NVIDIA 原文）：解码阶段 *each token depends on the key and value tensors of all previous tokens*，因此 *to avoid recomputing all these tensors for all tokens at each time step, it's possible to cache them in GPU memory*。
- 粒度：通常每层一份 KV cache；推理时 GPU 显存的两大占用是模型权重与 KV cache。
- 随序列线性增长（已核验公式）：每 token 字节数 = `2 × num_layers × (num_heads × dim_head) × precision_in_bytes`（因子 2 对应 K 与 V）；总量 = `batch_size × sequence_length × 2 × num_layers × hidden_size × sizeof(FP16)`。官方算例：Llama 2 7B、FP16、batch=1、seq=4096 → 约 2 GB。
- 结构级压缩：MQA（多查询注意力，跨头共享 K/V）与 GQA（分组查询，K/V 头数少于 Q 头数，Llama 2 70B 采用）通过减少存储的 K/V 头数来降低显存。
- 与 PagedAttention 的关系：静态过量预分配（如按最大 2,048 预留）造成浪费与碎片，vLLM 称既有系统因此浪费 60%–80% 显存。PagedAttention 借鉴操作系统虚拟内存分页，把每序列 KV cache 切成固定 token 数的 block，经 block table 映射到非连续物理块、按需分配，浪费只发生在最后一块（实测 <4%），吞吐较 FasterTransformer / Orca 提升 2–4 倍。
- 前缀缓存（vLLM 文档）：复用已处理请求的 KV cache block，当后续 prompt 前缀 token 匹配时命中，以 *avoid redundant prompt computations*；文档称其 *almost a free lunch*，实现依赖 block pool、满块哈希、引用计数与 free queue 淘汰。
- 与 [[LoRA]] 的关系限定在**服务系统层**：S-LoRA 的 Unified Paging 用同一内存池管理不同秩的动态 adapter 权重与不同序列长度的 KV cache 张量。两者一个属训练/微调期、一个属推理/解码期，并非原理相关。
- 未核验、不写入事实的内容：Hugging Face Transformers 的 KV cache 文档页多次无法访问，`DynamicCache`、`SlidingWindowCache`、量化 KV cache 等 API 级变体未验证。
- 来源：[NVIDIA · Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)、[arXiv 2309.06180 (PagedAttention)](https://arxiv.org/abs/2309.06180)、[vLLM Blog](https://blog.vllm.ai/2023-06-20/vllm.html)、[vLLM Prefix Caching](https://docs.vllm.ai/en/latest/design/prefix_caching.html)、[arXiv 2311.03285 (S-LoRA)](https://arxiv.org/abs/2311.03285)（访问：2026-09-25）。
