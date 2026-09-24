---
id: "node:Tool Calling"
type: concept
domain: agent
aliases: []
tags:
  - topic/agent/tool-calling
sources:
  - "[[30-Resources/Tech/PTC#两种模式的根本区别]]"
  - "[[30-Resources/Tech/PTC#PTC 最重要的优势]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related: []
attributes: {}
confidence: 中
status: active
---

# Tool Calling

> Tool Calling 是模型选择并调用外部工具、再根据工具结果继续决定后续步骤的交互机制。

## 展开

普通 Tool Calling 中，模型在工具调用和工具结果之间持续参与；工具结果通常直接进入模型上下文。PTC 在这个机制之上，把多次工具调用、循环、分支和中间结果处理交给程序执行。
