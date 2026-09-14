---
title: "Scientific computing in the age of agentic AI"
source: "https://openai.com/index/scientific-computing-agentic-ai/#case-study-helixforge"
author:
published: 2026-07-28
created: 2026-08-03
description: "A new field report shows how scientists use AI coding agents to modernize scientific computing, accelerating software development and discovery in genomics and beyond."
type: source-note
aliases:
  - "Agentic AI 时代的科学计算"
tags:
  - "clippings"
  - "type/source-note"
  - "topic/scientific-computing"
---
# Scientific computing in the age of agentic AI

A field report shows how scientists are using coding agents to modernize scientific software for genomics and other data-rich fields.

Scientific computing is a core pillar of modern research across academia and industry. Yet the software needed to analyze scientific information has struggled to keep pace with the rapid rate of data generation. Many widely used research tools began as code accompanying a research paper, built by small academic teams with limited engineering experience and minimal time for packaging, testing, optimization, or long-term support. The result is scientific infrastructure that often depends on slow, fragile workflows requiring constant maintenance. These constraints impede the pace of discovery.

AI agents are beginning to change that equation. By lowering the costs of engineering work and taking on tedious implementation tasks, they can help researchers prototype ideas more quickly, pursue projects that were previously impractical, and more easily maintain software over the long term. As a result, scientific software becomes more efficient and better maintained, freeing researchers to spend more time on discovery.

We’re sharing an exploratory field report of eight agent-assisted scientific computing projects primarily in the life sciences; five using Codex alone, and three using a combination of Codex and Claude Code. The report brings together case studies written by the teams behind each project and identifies recurring themes. The projects range from routine maintenance and targeted optimization to large-scale language migrations and GPU-native redesigns. Contributors report that agents significantly accelerated software development and maintenance, in some cases helping small teams take on work that would otherwise have required far more time or specialized engineering support. But they also highlight the persistent challenge of establishing clear, long-term responsibility and stewardship of the resulting tools.

Contributors consistently describe a shift in the researchers’ role from implementation to verification and orchestration: specifying what to build, defining how to measure correctness, and deciding when a project is ready to ship. In this emerging model, the researchers remain in control of the scientific direction and quality bar, but with velocity uplift provided by agentic assistance

![Diagram mapping agent-assisted scientific software projects across a spectrum from maintenance to workflow redesign.](https://images.ctfassets.net/kftzwdyauwt9/yq83nguvq0Yx5Xpq8cX4t/24d5a9fe629effb81f2f2fce3b0ece29/diagram1-desktop-dark.svg?w=3840&q=80)

<!-- codex-learning-note:start id="figure-agent-spectrum" -->
> [!note] 中文学习笔记
> 图示把项目放在“维护”到“工作流重设计”的连续谱上。读图时注意它表达的是案例范围与工程任务类型，不是性能排名；这也解释了为何验证和托管要求会随改动尺度变化。
<!-- codex-learning-note:end -->

<!-- codex-learning-note:start id="intro-guide" -->
> [!note] 中文学习笔记
> 中文题名：Agentic AI 时代的科学计算。整体阅读导图：文章先交代科学软件的工程瓶颈，再以八个项目的田野报告归纳“实现 → 验证 → 编排 → 维护”的新分工，最后讨论 stewardship（长期托管）与归属。作者的材料是探索性回顾，成效数字应与具体基准和项目语境一起理解。相关：[[AI 与 Coding]]。
<!-- codex-learning-note:end -->

## Case studies

#### Created a faster, more accurate tool for simulating mutations

HelixForge is a GPU-native rewrite of BAMSurgeon, a tool that inserts specified mutations into real sequencing reads. On a benchmark involving real human data, HelixForge reduced runtime by about 60x, produced mutation frequencies closer to the requested targets, and resolved several artifact-generating bugs.

> *Agentic coding helped us replace a slow, CPU-bound genomics workflow for synthetic genome generation with a robust CUDA architecture that is roughly 60 times faster and more efficient in a matched benchmark. We learned that agents can accelerate implementation and iteration, while defining biological correctness, priorities, and validation of the results still largely requires human scientific judgment.*

—Mamad Ahangari, Varun Goyal, and Hassan Masoudi



<!-- codex-learning-note:start id="section-case-studies" -->
> [!note] 中文学习笔记
> 本节用 HelixForge 这一案例展示 Agent 如何把 CPU 流程改写为 CUDA，并在特定真实人类数据基准上取得约 60 倍加速与更接近目标的突变频率。加速与生物学正确性是两条不同验收线，后者仍依赖研究者判断；案例为后文“验证优先”主题提供证据。
<!-- codex-learning-note:end -->
## Recurring themes

Though the projects varied widely in scope, they demonstrated that coding agents are making engineering labor and expertise less of a constraint in scientific computing. Now, the bottleneck is validating an AI agent’s output, which still depends on human judgement.

Across case studies, agents handled specific, well-scoped requests effectively but could not reliably judge whether their work was scientifically valid or met expectations. Indeed, agents often expressed confidence even when their work contained clear errors. Human reviewers therefore needed to find reliable ways to validate the results. The strongest approaches used an external reference or measurable acceptance target such as exact output agreement, parity with an existing tool, appropriate statistical behavior, or answers established in advance using simulated data.

Another recurring theme was that the projects generally proceeded in stages using feedback-driven iterations rather than as one-shot approaches. Contributors broke down broad goals into smaller changes, then used intermediate benchmarks and test systems to evaluate and refine the agents’ work. Agents often produced initial implementations quickly, but resolving edge cases and subtle numerical differences took much longer. Completing the “last mile” of an implementation often took the most work.

Overall, these case studies suggest that agents are enabling researchers to spend less time on implementation and more time directing the scientific work. People define the goal, break down complex projects into manageable chunks, and judge whether results are scientifically valid. By easing longstanding engineering constraints, agents expand what researchers can build while freeing them to focus on the scientific questions and decisions that matter most.



<!-- codex-learning-note:start id="section-recurring-themes" -->
> [!note] 中文学习笔记
> 跨案例的共同结论是：实现劳动变便宜后，瓶颈转向验证科学有效性。可靠做法是设置外部参照或可测验收目标，并通过小步迭代处理边界条件；Agent 的自信表达不能替代实验、统计行为或既有工具的一致性检查。
<!-- codex-learning-note:end -->
## Long-term stewardship remains essential

The maintenance gap in research software has long slowed iteration and limited reproducibility and reliability. Published studies of “ [research code ⁠](https://doi.org/10.1038/s41597-022-01143-6) ” and [omics tools ⁠](https://doi.org/10.1371/journal.pbio.3000333) have found that published software often fails to properly install in a fresh computing setup or run as documented, forcing researchers to spend substantial time on configuration and debugging. Even routine improvements can save researchers time and reduce computing demands, while performance-based refactoring and rewrites can deliver larger gains.

But lower implementation costs also make it easier to produce many similar rewrites, fragmenting users and spreading the expert attention required to keep any one tool reliable. That makes long-term stewardship and attribution essential. Mature scientific software carries undocumented conventions, compatibility requirements, and user trust that translating the source code alone cannot reproduce.

The case studies illustrate several possible paths forward. Changes to MHCflurry and cyvcf2 were incorporated into their original upstream projects, while rustar-aligner moved under new community stewardship because the original project had been abandoned. Where coordination with existing maintainers is available, it should begin as early as possible. When a separate implementation is necessary, it needs a clear owner and a credible maintenance plan. Without that, today’s modern rewrite can become tomorrow’s abandoned code rather than reliable scientific infrastructure.

This field report is retrospective and exploratory, but the case studies point to a practical shift in how scientific software is developed. Coding agents such as Codex can significantly lower the cost of maintenance, migration, optimization, and new implementations. Their long-term scientific value still depends on human decisions around what to build, how to verify it, and who will maintain it. The deeper change is not simply that researchers can produce more software, but that they can focus more of their effort on defining, validating, and stewarding the tools.

These case studies show that agents can already accelerate the pace of iteration in scientific computing. As coding agents improve, researchers will be able to spend less time keeping analysis pipelines running and more time advancing their fields.



<!-- codex-learning-note:start id="section-long-term-stewardship" -->
> [!note] 中文学习笔记
> 本节指出低实现成本也会带来重复重写、用户分散和维护注意力稀释，因此必须明确上游协作、负责人和维护计划。文中把代码可运行性、兼容约定与用户信任视为软件资产；这是对前文效率叙事的限制条件。
<!-- codex-learning-note:end -->
## Keep reading[How enabling two settings tripled our scores on the ARC-AGI-3 benchmark](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/)

[

Research

](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/)
