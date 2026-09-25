---
type: moc
aliases:
  - AI & Coding
tags:
  - type/moc
  - topic/agent
---

# AI 与 Coding

本地图是当前 vault 中 AI、Agent 与编程实践知识的导航入口。

主题词表：[[知识词表]]。

## AI Coding 与 Agent

- [[Vibe Coding]]：个人观察与实践反思
- [[Claude Code]]：Claude Code 的机制资料
- [[Coding Agent 工具与渠道]]：工具、计划与渠道整理
- [[AI Coding 与 Agent 课程]]：待学习课程
- [[AI 时代说“是”的成本变化]]：用受约束的试做把范围争论转为证据

## Agent 系统与技术概念

- [[OSMAS]]：多智能体系统生成论文笔记
- [[PTC]]：Programmatic Tool Calling 概念笔记
- [[Tool Calling]]：模型选择并调用外部工具的交互机制
- [[ReAct]]：Thought-Action-Observation 交替循环的提示范式
- [[Plan-and-Execute]]：先整体规划再逐步执行、必要时重规划的编排模式
- [[LangGraph]]：用图显式建模 Agent 流程的低层级编排框架与运行时
- [[SSE]]：服务器到客户端的单向事件流机制
- [[Streamable HTTP]]：MCP 的 HTTP 流式传输方式
- [[MCP]]：把 AI 应用连接到外部系统的开放标准
- [[Harness]]：模型之外负责上下文、工具、边界与审批的执行层
- [[Sandbox]]：模型运行自己生成代码的隔离执行环境
- [[语言模型 Harness 与组合泛化]]：以 RLM 为例理解 harness 如何支持组合泛化
- [[长时运行 Agent 的有效 Harness]]：跨上下文窗口持续推进编码任务的环境与交接设计
- [[构建多 Agent 研究系统]]：编排、评估与生产可靠性的多 Agent 研究系统实践
- [[托管 Agent 的扩展与脑手解耦]]：随模型演进调整 harness，并解耦推理与执行
- [[Codex 作为平台：构建于开放 Agent Harness 之上]]：用开放 harness 将 Agent 嵌入具体产品工作流
- [[Agentic AI 时代的科学计算]]：Agent 辅助科学软件的案例、验证与长期维护
- [[编排器税：保护工作记忆的多 Agent 实践]]：以认知局部性与上下文隔离理解多 Agent 成本

## RAG 与检索

- [[RAG]]：检索增强生成的上位概念与基线形态边界
- [[GraphRAG]]：实体—关系图加社区摘要的图式 RAG
- [[混合检索]]：并行多路召回（BM25 + 向量）与 RRF / 分数融合
- [[多阶段检索]]：串联的召回—重排漏斗与其成本动因

## 模型训练与推理优化

- [[LoRA]]：冻结权重、只训低秩矩阵的参数高效微调
- [[KV Cache]]：自回归解码阶段缓存 K/V 张量的机制与显存代价
- [[PPO]]：截断代理目标的策略梯度算法，RLHF 中需四个模型
- [[DPO]]：把 RLHF 化为偏好分类损失，免去显式奖励模型
- [[GRPO]]：用组内相对优势替代 critic 的 PPO 变体

## 模型与能力资料

- [[Kimi K3 开放前沿智能技术博客]]：Kimi K3 的规模、编程、知识工作和基准资料
- [[谁在乎模型]]：从 Amp 默认模型切换观察模型差异、任务难度、上下文与复核

## 编程实践

- [[编码技巧]]：可复用的编码经验
- [[PImpl 惯用法与 C++26 std.indirect]]：隐藏实现细节的 C++ PImpl 及 C++26 值语义指针

## 工程与算法基础

- [[WebSocket]]：基于 TCP、经 HTTP Upgrade 建立的全双工双向协议
- [[动态规划]]：重叠子问题保存复用的方法与其遍历方向约束
- [[最长递增子序列]]：O(n²) DP 与 O(n log n) 贪心加二分两条路线
- [[目标和]]：回溯、记忆化、按和域 DP 与 0-1 背包计数转化

## 使用约定

- 新捕捉的内容先放进 `00-Inbox`，处理后再移入对应主题。
- 一篇笔记至少连接一个主题地图或相关概念；新主题出现时在此处补充入口。
- 参考资料和论文保存在 `30-Resources`，原始附件放入 `_Assets`。
