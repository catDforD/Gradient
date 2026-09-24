---
name: knowledge-graph
description: 从用户明确指定的文章或面经文件中提取知识图谱候选，生成审核报告；确认后再写入 50-Maps/KnowledgeMap/。不扫描整个仓库，不把面经回答直接当成事实。
---

# 知识图谱整理

这是本仓库知识图谱整理的正式 skill。完整的字段、分类和审核细节以 `.zcode/commands/BuildKnowledgeNodes.md` 为准；执行前先读取该文件，以及以下规则文件：

- `50-Maps/KnowledgeMapRule/知识图谱框架.md`
- `50-Maps/KnowledgeMapRule/本体登记.md`
- `50-Maps/KnowledgeMapRule/知识词表.md`
- `_Templates/概念.md`

只处理用户消息中明确给出的文件路径。没有指定路径时要求用户提供路径，不扫描整个仓库；路径不存在时停止并报告。

文章资料提取 `concept`、`method`、`entity` 候选、原文证据和关系建议。面经提取问题、考察节点和待验证主张，不把面试者回答直接写成知识事实。

首次运行只写入 `tmp/knowledge-graph/review/` 下的审核报告，不创建或修改正式节点，不修改来源文件。用户确认具体候选后，才按 `_Templates/概念.md` 写入 `50-Maps/KnowledgeMap/`，并运行：

```text
node .zcode/scripts/validate-knowledge-map.mjs
```

未经用户明确确认，不提交或推送 Git。
