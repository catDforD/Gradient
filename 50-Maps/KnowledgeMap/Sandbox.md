---
id: "node:Sandbox"
type: concept
domain: agent
aliases: []
tags:
  - topic/agent/harness
sources:
  - "[[30-Resources/AI/Agent/托管 Agent 的扩展与脑手解耦#Decouple the brain from the hands]]"
  - "[[30-Resources/AI/Agent/托管 Agent 的扩展与脑手解耦#Many brains, many hands]]"
relations:
  broader_than: []
  instantiates: []
  prerequisites: []
  related:
    - "[[Harness]]"
attributes: {}
confidence: 中
status: active
---

# Sandbox

> Sandbox 是模型运行自己生成的代码、修改文件的隔离执行环境。它把模型的动作限制在可丢弃的边界内，因此一次失败可以当作一条工具调用错误处理，而不必抢救整个会话。

## 展开

- 在托管 Agent 的设计里，沙箱是可替换的执行体：它被当作「手」，harness 用工具调用按需创建，接口只有「名称加输入进、字符串出」。harness 不需要知道沙箱是容器、手机还是模拟器。
- 沙箱故障按工具调用错误回传给模型；需要重试时按标准配方重新创建，而不是修复原容器。这与「把执行环境当作可替换资源而不是需要照料的个体」是同一个思路。
- 沙箱必须与凭证分离。如果模型生成的代码能在沙箱里读到 token，那么一次提示注入就足以让攻击者拿到凭据，并开出新的、不受限的会话；来源给出的结构性做法是把 token 绑定在资源上或存放在沙箱外的 vault 中，外部调用经由代理换发凭证。
- 会话状态不放在沙箱里：事件日志独立于执行环境存在，因此沙箱重启不丢失会话记录。
- 与 [[Harness]] 的关系：沙箱由 harness 通过工具调用创建和驱动，本身不决定何时执行什么。
