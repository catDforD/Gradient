---
id: "node:RAG"
type: method
domain: rag
aliases:
  - Retrieval-Augmented Generation
  - 检索增强生成
tags:
  - topic/rag
sources:
  - "https://arxiv.org/abs/2312.10997"
  - "https://microsoft.github.io/graphrag/query/global_search/"
  - "https://arxiv.org/abs/2404.16130"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#多阶段 RAG 与文档处理]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 中
status: active
---

# RAG

> RAG（检索增强生成）是在生成前先从外部知识源检索相关内容、再把检索结果与问题一起送入语言模型的方法；基线形态依赖对语义相似文本做向量检索，它不改动模型权重。

## 展开

- 基线形态的能力边界（Microsoft GraphRAG 官方文档原文）：baseline RAG *relies on a vector search of semantically similar text content*，因此面对指向整个语料的全局性问题时 *there is nothing in the query to direct it to the correct information*。这划出了朴素 RAG 的适用边界，也是 [[GraphRAG]] 的出发点。
- 分类：Gao et al. 的综述（arXiv 2312.10997）在摘要中给出 Naive / Advanced / Modular RAG 三分法。该综述把重排与上下文压缩归入 Advanced RAG 的检索后增强，这一细分位于正文、本次只核验到摘要层级，故不作为确定结论引用。
- 检索侧的两条正交改进路线，在本库分别建节点：
  - [[混合检索]]：并行多路互补召回（词法 + 语义）再融合，解决单一信号的召回盲区。
  - [[多阶段检索]]：串联多级、先廉价高召回再昂贵高精度精排，解决 recall 与 precision 的成本权衡。
- 图式路线：[[GraphRAG]] 先用 LLM 抽取实体—关系图并做社区摘要，再据以组装上下文。
- 面经中的对应考察：RAG 流程、分类、评估、分块、多模态与增量更新，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent开发岗位面经汇总-2026年4月-01至07#多阶段 RAG 与文档处理]] 与 [[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#RAG 与编码模型]]。
- 本节点的定位：作为 `domain: rag` 的上位概念存在，供上述方法节点挂 `broader_than`。RAG 评估体系、分块策略、多模态 RAG 等子主题尚未建节点，属待建目标。
- 来源：[arXiv 2312.10997 · RAG for LLMs: A Survey](https://arxiv.org/abs/2312.10997)、[GraphRAG · Global Search](https://microsoft.github.io/graphrag/query/global_search/)、[arXiv 2404.16130](https://arxiv.org/abs/2404.16130)（访问：2026-09-25）。
