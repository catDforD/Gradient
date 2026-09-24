---
id: "node:PTC"
type: method
domain: agent
aliases:
  - Programmatic Tool Calling
tags:
  - topic/agent/tool-calling
sources:
  - "[[30-Resources/Tech/PTC#两种模式的根本区别]]"
  - "[[30-Resources/Tech/PTC#PTC 最重要的优势]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites:
    - "[[Tool Calling]]"
  related: []
attributes: {}
confidence: 中
status: active
---

# PTC

> PTC（Programmatic Tool Calling）是一种让模型生成程序、由程序组织多次工具调用和控制流的方法。

## 展开

PTC 将循环、分支、并发调用、重试、聚合和中间结果过滤交给程序运行时处理，模型只在需要理解意图或做语义判断时介入。它建立在 Tool Calling 之上，但把多步工具编排从连续的模型对话转为一次生成程序后的确定性执行。
