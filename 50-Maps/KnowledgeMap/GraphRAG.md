---
id: "node:GraphRAG"
type: method
domain: rag
aliases:
  - Graph RAG
  - Microsoft GraphRAG
  - 图检索增强生成
  - 图 RAG
tags:
  - topic/rag
sources:
  - "https://arxiv.org/abs/2404.16130"
  - "https://arxiv.org/html/2404.16130v2"
  - "https://microsoft.github.io/graphrag/index/default_dataflow/"
  - "https://microsoft.github.io/graphrag/index/methods/"
  - "https://microsoft.github.io/graphrag/query/global_search/"
  - "https://microsoft.github.io/graphrag/query/local_search/"
  - "https://microsoft.github.io/graphrag/cli/"
  - "https://github.com/microsoft/graphrag/releases"
  - "[[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#RAG 与编码模型]]"
relations:
  broader_than:
    - "[[RAG]]"
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 高
status: active
---

# GraphRAG

> GraphRAG 是微软提出的图式 RAG 方法：先用 LLM 从语料抽取实体—关系知识图谱，再对图做层级社区发现并为每个社区预生成摘要，查询时用社区摘要（全局）或实体邻域（局部）而非单纯向量相似度来组装上下文。

## 展开

- **它解决的不是「找得更准」，而是「答不了全局题」**。论文摘要指出 RAG fails on global questions directed at an entire text corpus（如「数据集的主要主题是什么」），因为这本质是 query-focused summarization 而非检索任务；官方 Global Search 文档更直白：baseline RAG *relies on a vector search of semantically similar text content… there is nothing in the query to direct it to the correct information*。
- **索引六阶段**（官方 Dataflow）：Phase 1 Compose TextUnits（切块）→ Phase 2 Document Processing → Phase 3 Graph Extraction（实体 / 关系抽取 → 实体 / 关系摘要 → 可选 claim 抽取）→ Phase 4 Graph Augmentation（社区发现）→ Phase 5 Community Summarization → Phase 6 Text Embedding。社区发现使用 Louvain / Leiden（论文 §2.2 引 Traag et al. 2019）。
- **全局搜索是 map-reduce**：社区摘要分批 → 各自产出 rated intermediate response → ranking + filtering → 聚合成最终答案。论文实验条件为 C0–C3（根层到低层社区摘要）、TS（对原文直接 map-reduce）、SS（向量 RAG），结论是根层社区摘要 *at a fraction of the token cost* 达到与其他全局方法相当的效果。
- **局部搜索混合结构化与非结构化上下文**：先用实体描述向量召回实体，再沿 entity → text unit / community report / relationship / covariate 展开候选，各自 ranking + filtering 后拼装。
- **DRIFT Search**（Dynamic Reasoning and Inference with Flexible Traversal）：Primer 阶段用 query 与 top-K 语义相关社区报告比对，给出初步答案与追问；Follow-Up 阶段用 local search 细化，是全局与局部的折中。
- **成本痛点有官方数字**：Methods 文档「Choosing a Method」称 *we estimate graph extraction to constitute roughly 75% of indexing cost*；FastGraphRAG 用 NLTK / spaCy 的名词短语加共现关系替代 LLM 抽取，更便宜但图更噪。这是回答「GraphRAG 的难点」最可靠的一手依据。

## 增量更新

- **支持，且早于 1.0**。GitHub Releases 时间线核实：`v0.3.3`（2024-09-10）加入 incremental indexing 的 entrypoints（仅 API）→ `v0.4.0`（2024-11-06）加入增量索引、增量更新配置、按时间段的朴素社区合并、关系合并、更新时计算新增与删除输入 → `v0.4.1`（2024-11-09）加入 update CLI 入口。而 1.0 里程碑博客发布于 2024-12-16。**常见说法「增量更新随 1.0 而来」是错的。**
- 当前接口（官方 CLI Reference）：`graphrag update` 更新已有知识图谱索引并把新索引写入 `update_output` 目录；另有 `graphrag index --method <standard|fast|standard-update|fast-update>`。核验时最新版为 `v3.2.0`（2026-09-24）。
- 合并语义（读 main 分支源码得出，**版本敏感**，核实日期 2026-09-25）：`index/update/incremental_index.py::get_delta_docs` 用文档 `title` 与旧 `documents` 表做差集得到 new / deleted；`update/entities.py::_group_and_resolve_entities` 按实体 `title` 合并、重排 `human_readable_id`、把 description 聚成列表，且 `degree` 取 `"first"`，源码内留有 TODO 称可用整图重算。可写入的结论：**只按标题识别新增与删除，已入库文档的内容修改不会被重新抽取；图 degree 不重算。** 这两条来自源码而非官方文档声明。
- 官方文档没有增量专页：仓库 `docs/` 下 33 个 md 无一讲 update，增量能力只体现在 CLI Reference 与 `index/outputs.md`（communities 表的 `period`、`size` 字段注明用于增量合并）。
- 别名边界：`FastGraphRAG` **不作为本节点别名**——它既指微软的 `--method fast`，也是第三方独立开源项目，会触发别名冲突。`nano-graphrag`、`LightRAG`、`LazyGraphRAG` 的能力细节未核验，不写入。
- 面经中的对应考察：GraphRAG 的难点与增量场景，见 [[20-Areas/实习与求职/面试题与经验/AI-Agent与大模型岗位面经汇总-01至05-07-08#RAG 与编码模型]]。
- 来源：[arXiv 2404.16130](https://arxiv.org/abs/2404.16130)、[全文 v2](https://arxiv.org/html/2404.16130v2)、[Dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/)、[Methods](https://microsoft.github.io/graphrag/index/methods/)、[Global Search](https://microsoft.github.io/graphrag/query/global_search/)、[Local Search](https://microsoft.github.io/graphrag/query/local_search/)、[CLI](https://microsoft.github.io/graphrag/cli/)、[Releases](https://github.com/microsoft/graphrag/releases)（访问：2026-09-25）。注：`microsoft.com/en-us/research/blog/*` 原文在本环境地域受限，标题与日期经官方镜像核实、正文未读，引用以 microsoft.github.io 为准。
