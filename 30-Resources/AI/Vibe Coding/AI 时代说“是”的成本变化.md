---
title: "The cost of saying yes has changed"
source: "https://github.blog/engineering/the-cost-of-saying-yes-has-changed/"
author:
  - "[[Dalia Abuadas]]"
published: 2026-07-18
created: 2026-08-03
description: "The cost of writing code dropped; the cost of owning it didn't. A framework for deciding which changes are actually cheap in the AI era."
type: source-note
aliases:
  - "AI 时代说“是”的成本变化"
tags:
  - clippings
  - type/source-note
  - topic/engineering/ai-coding
---
# The cost of saying yes has changed

The most expensive part of a small feature request used to be writing the code. Now it’s usually the meeting about whether or not to write the code.

That’s a real shift, and it quietly breaks a lot of engineering instincts. Engineers learn early that most “small asks” aren’t small: they need tests, a rollout plan, someone to think through the edge cases and own the behavior after it ships. A two-hour change can become a two-week distraction if it touches the wrong part of the system. So we push back. Is this really needed? Does it belong in this release? Does it change a contract we already agreed to? I’m not giving that instinct up.

But it rests on an assumption that’s quietly breaking, which is that writing the first version of the code is the expensive step. For a specific class of change, it no longer is. If you can tell those changes apart from the rest, you can replace “is this in scope?” with a question you can answer in thirty minutes instead of a two-day debate.

<!-- codex-learning-note:start id="intro-guide" -->
> [!note] 中文学习笔记
> 中文题名：AI 时代说“是”的成本变化。整体阅读导图：作者从“先争论范围”转向“先做一个受约束的探针”，再区分生成成本与所有权成本，最后给出把纪律移到证据附近的工作法。核心判断不是一律答应，而是更快为不确定性定价。相关：[[AI 与 Coding]]。
<!-- codex-learning-note:end -->

## The debate often costs more than the patch

Here’s a pattern I keep seeing. Someone asks for a small change such as surfacing a `last_active_at` timestamp that already exists in the backend on a settings page. The team spends forty minutes in a thread. One person says it sounds risky. Someone remembers a related migration from two years ago. Someone mentions the deadline. Eventually we land on “probably a day or two, could be more,” with low confidence, primarily because nobody has actually tried it.

That process made sense when trying was the expensive part. You had to stop what you were doing, load the context into your head, make the change by hand, write the tests, then discover the second- and third-order consequences. When the first attempt is cheap, defending the boundary can cost more than crossing it.

An agent can produce that first patch in the time the thread takes to warm up. It’s not free and definitely not automatically correct. But it is cheap enough that the smart move is often to stop guessing and look at a real diff.



<!-- codex-learning-note:start id="section-debate-cost" -->
> [!note] 中文学习笔记
> 本节的论点是：当首个实现足够便宜时，反复猜测范围可能比做一个真实 diff 更贵。示例中的 `last_active_at` 只是说明性场景，真正价值在于用试做暴露未知依赖，而非承诺所有小需求都能快速完成。
<!-- codex-learning-note:end -->
## The first patch is a price check, not the product

The mistake is to treat the generated patch as the deliverable. It isn’t. It’s a probe. It turns an abstract scope argument into a concrete artifact you can interrogate:

- Does it touch the files you expected, or does it sprawl across five packages?
- Are the tests obvious, or does the change resist being tested?
- Does it preserve the existing abstractions?
- Does it quietly require a new product decision?
- Would you be comfortable owning this behavior six months from now?

Those are better questions than “does this feel like scope creep?” because now you’re arguing from evidence instead of vibes. If the `last_active_at` field comes back as a four-line diff with a passing test, ship it. The debate was the expensive part. However, if that same request comes back touching the auth middleware, you’ve learned the request was never small. Not only that, you learned this in thirty minutes instead of two days.

This is not letting the AI decide. It’s using the AI to make human judgment cheaper and better-informed.



<!-- codex-learning-note:start id="section-first-patch-probe" -->
> [!note] 中文学习笔记
> 生成补丁被定位为探针：文件范围、测试难度、抽象保持和潜在产品决策都能在审查时显现。作者把“从感觉争论转为证据”作为改进点，同时强调这不是把决策交给 AI，而是降低人类判断成本。
<!-- codex-learning-note:end -->
## Cheap to write is not the same as cheap to own

Here’s the trap, and it’s the most important distinction of the AI era. A **change is not cheap just because the code was cheap to generate. It’s cheap only if a human can confidently review and own the result.**

A thousand-line diff that technically passes but nobody wants to own is not a cheap change. It’s a deferred cost. So the dividing line in that case isn’t “can an agent write this?” It’s “can a person validate it?”

- Adding a display field that already exists in the backend is usually cheap.
- Changing authorization behavior is not cheap, no matter how clean the diff.
- Refactoring a well-tested helper is usually cheap.
- Changing data-retention semantics is not cheap.

Plenty of changes still deserve a hard no even when the code is trivial. This includes anything that moves the product contract, creates a support burden, or touches privacy, billing, or compliance. AI lowers the cost of *producing* a candidate. It does nothing to lower the cost of *owning* one.



<!-- codex-learning-note:start id="section-cheap-to-own" -->
> [!note] 中文学习笔记
> 本节给出最重要的边界：只有当人能自信验证并长期负责时，改动才真正便宜。权限、留存、隐私、计费和合规等契约性变化即使代码很短也不便宜；这是对“生成快”指标的所有权修正。
<!-- codex-learning-note:end -->
## Move scope discipline closer to the evidence

Traditionally, scope discipline happened before implementation, because implementation was the expensive thing to protect. Now some of that discipline can move to review. That doesn’t mean skipping planning. It means being precise about which planning actually pays off.

Before relitigating a small change, ask for a constrained attempt. The constraints are the whole point.

Produce the smallest possible patch. Keep it behind the existing feature flag. Don’t change the public contract. Add or update tests. List every file you touched and call out anything risky.

If the agent can’t produce a clean patch under those constraints, the request was bigger than you thought, and you know it carries a real ownership cost before anyone commits to it. If it can, that tells you something too. Either way you’ve replaced “is this in scope?” with “here’s what it costs. Do we want to pay it?”



<!-- codex-learning-note:start id="section-scope-evidence" -->
> [!note] 中文学习笔记
> 建议把范围纪律落实为约束：最小补丁、既有 feature flag、不改公共契约、补测试、列出文件并标注风险。若无法在这些边界内产出清晰结果，需求本身就暴露出更高的所有权成本。
<!-- codex-learning-note:end -->
## The new skill is pricing uncertainty

<!-- codex-learning-note:start id="section-pricing-uncertainty" -->
> [!note] 中文学习笔记
> 结论把工程能力表述为快速定价不确定性：识别伪装成实现问题的产品决策，判断审查是否比编写更难，并在低风险场景用 Agent 做受限尝试。范围蔓延仍存在，但“新代码都太贵”已不再是充分理由。
<!-- codex-learning-note:end -->


The best engineers in an AI-assisted world won’t be the ones who say yes to everything, and they won’t be the ones who reflexively say no. They’ll be the ones who can price uncertainty fast. They’ll know when a request is a product decision wearing an implementation costume, when review will be harder than writing, and when a change is small enough that the fastest responsible answer is to just try it.

That last one is genuinely new. “Try it and see” used to mean pulling a developer off other work. Now, for the right kind of task, it means handing an agent a bounded assignment and using the result to make a better call. Less time guessing, more time supervising. Less time treating implementation as a black box, more time evaluating concrete artifacts.

Scope creep is still real. But “no, because any new code is too expensive” is a much weaker argument than it was two years ago. The cost of producing code has dropped. The cost of understanding, reviewing, and owning it didn’t. So the question worth asking shifted from “is this more work?” to “where’s the real cost?” And sometimes, for a small, bounded change, the real cost is just finding out.
