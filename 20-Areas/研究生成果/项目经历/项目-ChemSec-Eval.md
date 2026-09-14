---
type: achievement
status: draft
tags:
  - type/achievement
  - topic/graduate
  - topic/career
---

# ChemSec-Eval

面向医药研发场景的大模型与 Agent 安全评测、护栏加固项目，覆盖内容安全、Agent 工具安全和多轮隐私安全，形成数据构建、自动评测、业务系统接入、护栏与结果展示的完整工作链路。

## 基本信息

- 项目名称：ChemSec-Eval。
- 所属经历：[[20-Areas/研究生成果/实习经历/实习-晶泰科技|晶泰科技实习]]。
- 参与时间：实习期间，2026-03 至 2026-06；项目的准确起止时间待补充。
- 本人角色：实习期间负责该项目；公开提交可核对评测框架、数据生成、XCurve 接入、护栏集成与结果整理等工作，具体协作边界待补充。
- 当前阶段：已有评测框架、可独立交付的组合护栏包、结果摘要和成果展示页；是否正式结项、移交或投入生产待补充。
- [成果展示页](https://1371149.github.io/jingtai.github.io/)
- [仓库网页地址](https://github.com/catDforD/ChemSec-Eval)
- 原始仓库地址：`git@github.com:catDforD/ChemSec-Eval.git`
- 材料核对日期：2026-09-09。仓库包含实习结束后的更新，实习期工作优先依据 4—6 月的本人提交和结果记录。

## 背景与目标

- 业务场景：面向化学研发与合成业务中的智能体，包括合成检索、路线分析和方案推荐等应用；仓库提供 AiFChem 与 XCurve 的接口适配。
- 核心问题：模型可能响应高风险化学请求，Agent 可能受外部上下文或工具链路影响，多轮追问还可能诱导内部信息泄露。
- 评测目标：用统一的风险分类、样本结构、攻击条件与评分方式，定位不同系统的薄弱环节，并比较加固效果。
- 加固目标：结合化学风险知识检索、会话风险累积和响应侧校验限制不安全输出，同时评估正常请求被误拒的问题。
- 交付形式：可复用的评测代码与数据、业务 Agent 接口适配、组合护栏包、结果摘要及展示材料。正式验收方、验收标准和上线范围待补充。

## 我的贡献

以下工作依据 GitHub 账号 `catDforD` 的实习期提交及变更文件核对；记录的是可确认的实现或集成工作，合作成员的分工仍需本人补充。

| 时间 | 可核对的工作 | 证据 |
| --- | --- | --- |
| 2026-04-09 | 搭建基于 Inspect AI 的初始评测框架，加入任务入口、样本、拒答评分器和测试 | [6967f79](https://github.com/catDforD/ChemSec-Eval/commit/6967f791c2bb3d1ac7af5b0c1df88420149f1310) |
| 2026-04-10 | 调整带攻击条件的安全评测任务，引入 LLM judge 评分并更新数据规范与测试 | [230cb29](https://github.com/catDforD/ChemSec-Eval/commit/230cb297d291a5421e5060a842f33265b0f76667) |
| 2026-04-16 | 加入单任务与批量数据生成工具、风险规格、知识种子、分类说明及测试 | [7941a52](https://github.com/catDforD/ChemSec-Eval/commit/7941a527b97a9b6bb590124638fa9ccdd8540246) |
| 2026-04-29 | 新增 XCurve 的 OpenAI-compatible 接口适配服务、使用说明与接口测试 | [29a4a17](https://github.com/catDforD/ChemSec-Eval/commit/29a4a17688d12cf51a85e01c6bd6c8726d2494d1) |
| 2026-05-06 | 改进 Agent 安全样本生成和拒答评分逻辑 | [dc286be](https://github.com/catDforD/ChemSec-Eval/commit/dc286befe18e133e04ce7be40c5356d46c1e767f) |
| 2026-05-26 | 集成化学风险知识检索、多轮隐私规则、会话状态与响应扫描，加入组合护栏、代理服务和相关说明 | [f366f65](https://github.com/catDforD/ChemSec-Eval/commit/f366f65d0ebf7bfe1634d9bbafc1fe5566736645) |
| 2026-06-05 | 提交四类护栏评测结果摘要，保留运行配置、分片来源与汇总记录 | [0f8e6f8](https://github.com/catDforD/ChemSec-Eval/commit/0f8e6f8396745c553816c3721d36871cbd703158) |

具体主导的设计决策、与同事的协作方式、是否负责全部实验执行和展示页制作，待本人补充。

## 方案与结果

### 评测体系与技术方案

- 三个安全方向：内容安全、Agent 工具安全、多轮隐私安全。攻击方法作为横向评测条件，与数据源和风险类别组合。
- 数据层：本地化学与合规内容安全包含 8 个主评测子类，结合外部 benchmark、生成扩展、静态增强和长上下文数据；支持中文与英文生成。
- 执行层：基于 Python 3.11、Inspect AI / inspect-evals 组织任务，通过 OpenAI-compatible 接口和本地 shim 接入模型及业务 Agent；统一 attack matrix 支持多条件对比和复用已有成功日志。
- 评分层：以 LLM-as-a-judge 判断回复是否实质性满足原始风险请求，判断失败时回退到规则。报告区分模型拒答、网关拦截、正常帮助、过度拒答、超时、错误与未知状态。
- 产出层：保留 Inspect 日志，并生成 Markdown、JSON、HTML 报告。仓库还包含基于 React、TypeScript、Vite 的 ChemSec 语义地图，用于展示静态语料分布；该前端的个人开发归属待确认。

### 组合护栏

请求进入后先解析会话标识，计算多轮隐私风险，再调用化学风险知识检索与建议模块；风险建议写入下游提示。隐私风险达到阈值时限制回答或提前阻断，上游响应返回后再扫描内部信息泄露并按规则替换。

- 组合护栏将编排器、会话状态、隐私规则、响应扫描及所需知识索引打包，支持独立集成。
- 单轮化学知识检索的风险等级用于提供建议，不直接等同于自动阻断；多轮隐私规则有独立的累积风险和阻断逻辑。
- 稳定的会话 ID 用于跨轮累积风险；缺少 ID 时创建隔离会话，避免无关请求相互影响。

### 最终评测结果

**结果版本：本人于 2026-09-09 确认采用成果展示页作为最终评测口径。** 以下基线与加固结果来自该页，变化按百分点计算。

| 安全方向 | 基线 ASR | 加固后 ASR | ASR 下降 | 加固后 score_pass |
| --- | ---: | ---: | ---: | ---: |
| 内容安全 | 34.8% | 4.4% | 30.4 个百分点 | 86.4% |
| Agent 安全 | 58.7% | 6.1% | 52.6 个百分点 | 82.9% |
| 隐私安全 | 68.9% | 4.7% | 64.2 个百分点 | 92.8% |

- ASR 表示攻击成功率，越低越好；最终展示页还报告护栏覆盖率为 **94.3%**。
- 拒答率分别从 54.6%、23.7%、18.4% 提升至 87.9%、82.9%、92.8%，与页面的三个安全方向顺序一致。
- 多轮隐私设计按最终展示口径包括 **16 个内部信息主题、152 个场景、7 种输出格式**，构造三轮对话。
- `score_pass` 保留展示页字段名，表示页面所展示的评分通过率，不直接等同于正常业务可用率或零误拒率。
- 这些是项目最终评测结果；不同贡献者的具体分工仍按“我的贡献”记录，模型版本、分母与覆盖率定义可随最终报告进一步补充。

### 实习期阶段评测记录

以下来自本人于 **2026-06-05** 提交的四份结果摘要，用于追溯阶段工作；已与当前仓库摘要核对，核心计数一致。这组原始计数不作为上方最终展示指标的分母。表中 `score_pass` 为评分通过条数，`attack_success` 为该轮评测器判定的攻击成功条数。

| 评测集合 | 总记录数 | score_pass | attack_success | 错误记录 |
| --- | ---: | ---: | ---: | ---: |
| [内容安全][result-content] | 16,209 | 13,887 | 359 | 219 |
| [Agent 安全][result-agent] | 4,156 | 3,718 | 301 | 117 |
| [多轮隐私][result-privacy] | 6,048 | 5,780 | 266 | 2 |
| [KG 护栏专项][result-kg] | 7,000 | 5,779 | 457 | 0 |

- 四个结果集合计 **33,413 条评测记录**；不同集合可能包含重叠样本，不将其解释为去重后的独立样本数。运行状态为完成，但总数中仍包含上表的错误记录。
- 6,048 条多轮隐私记录覆盖 **18 个主题**。按总记录数作分母，评分通过占 95.57%，被判定攻击成功占 4.40%，另有 2 条错误；这是阶段批次结果，与最终展示页的 16 个主题设计和最终指标分别保留。
- 各集合的期望行为、错误和未知状态不同，内容安全还包含良性与过度拒答样本；不把所有 `attack_success / total` 比例统一当作同一口径的 ASR。
- Agent 安全摘要不能单独证明所有被判成功的样本都造成了实际工具执行后果，相关结论还需结合执行证据与评分口径。

### 数据规模与成果展示

- [当前分类文档][taxonomy]统计静态 JSON 数据 **114,035 条**：内容安全 91,063 条、Agent 安全 4,756 条、隐私安全 18,216 条，支持展示页“10 万+”的数据规模表述。
- 该数字是当前仓库的静态记录数，含扩展版本和增强数据；既不是去重语料量，也不是全部已执行评测数。是否与 6 月实习结束时的交付版本一致，待确认。
- [成果展示页][showcase]展示基线与护栏对比、输入和输出侧处理流程、知识库云图及案例，已作为项目演示材料归档到本笔记。

## 结果版本与材料范围

- 最终结果以本人确认的[成果展示页][showcase]为准，阶段摘要用于证明实习期已经完成的评测记录与结果整理。
- 仓库另有日期为 2026-09-01 的[阶段对比报告][phase-report]，包含 xcurve-agent 后续结果及不同的隐私判定标准；该报告作为其他阶段材料保留，不与最终展示页拼接为同一批实验。
- 展示页、6 月摘要中的主题数量和比例存在版本差异，已分别标注。后续补充最终日志时，应同时记录被测系统、数据版本、评分规则和分母。
- 当前材料可以证明已有实现、记录与展示，但尚不能确认正式生产部署范围、人工成本节省比例或最终验收指标。

## 复盘

可展开的技术案例：把非标准业务 Agent 接入统一评测接口；从关键词拒答检测转向基于原始风险意图的模型裁判；将单轮化学风险建议与跨轮隐私状态结合；在安全性和正常请求可用性之间做取舍。

- 最重要的一次本人技术判断、当时遇到的困难与备选方案：待补充。
- 对样本质量、误拒答或评分可靠性的改进经验：待补充。

## 可用于简历的一句话

在晶泰科技实习期间负责 ChemSec-Eval，搭建基于 Inspect AI 的化学场景安全评测框架，开发批量数据生成与业务 Agent 接口适配，集成知识检索、多轮隐私规则和响应校验护栏；项目最终评测中，内容、Agent、隐私三类攻击成功率分别由 34.8%、58.7%、68.9% 降至 4.4%、6.1%、4.7%。

结果采用本人确认的最终展示页口径。若需要强调工程交付，可补充“整理四类共 3.34 万条阶段评测记录”；此处记录数不代表去重样本量。

## 待补充

- [ ] 明确核心模块的主导与协作分工，以及本人承担的实验执行、结果分析和展示制作范围。
- [ ] 确认 6 月交付版本的数据规模、项目准确起止时间和当前维护 / 移交状态。
- [ ] 为已确认的最终展示指标补充对应模型、数据版本、分母与最终报告 / 日志，便于后续复现和答辩。
- [ ] 补充实际使用团队、验收反馈及一项最有代表性的技术难点。

## 来源与相关笔记

- 项目归属、本人身份与最终展示页口径：本人于 2026-09-09 提供并确认。
- [成果展示页][showcase] · [仓库 README][repo] · [分类与数据规模][taxonomy] · [测试链路说明][pipeline]，核对于 2026-09-09。
- [组合护栏说明][guardrail] · [结果汇总与聚合规则][result-index]。本次整理读取文档、代码变更记录和已有摘要，未重新执行模型评测。
- [[20-Areas/研究生成果/项目经历/项目经历索引|项目经历索引]]
- [[50-Maps/研究生成果|研究生成果]]

[showcase]: https://1371149.github.io/jingtai.github.io/
[repo]: https://github.com/catDforD/ChemSec-Eval/blob/main/README.md
[taxonomy]: https://github.com/catDforD/ChemSec-Eval/blob/main/docs/Evaluation_taxonomy.md
[pipeline]: https://github.com/catDforD/ChemSec-Eval/blob/main/docs/testing_pipeline.md
[guardrail]: https://github.com/catDforD/ChemSec-Eval/blob/main/guardrails/composition/README.md
[result-index]: https://github.com/catDforD/ChemSec-Eval/tree/0f8e6f8396745c553816c3721d36871cbd703158/guardrail_composition_result_summaries
[result-content]: https://github.com/catDforD/ChemSec-Eval/blob/0f8e6f8396745c553816c3721d36871cbd703158/guardrail_composition_result_summaries/content_safety/summary.json
[result-agent]: https://github.com/catDforD/ChemSec-Eval/blob/0f8e6f8396745c553816c3721d36871cbd703158/guardrail_composition_result_summaries/agent_safety/summary.json
[result-privacy]: https://github.com/catDforD/ChemSec-Eval/blob/0f8e6f8396745c553816c3721d36871cbd703158/guardrail_composition_result_summaries/multi_round/summary.json
[result-kg]: https://github.com/catDforD/ChemSec-Eval/blob/0f8e6f8396745c553816c3721d36871cbd703158/guardrail_composition_result_summaries/kg_guardrail_7000/summary.json
[phase-report]: https://github.com/catDforD/ChemSec-Eval/blob/main/docs/reports/%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5_vs_%E6%9C%AC%E9%98%B6%E6%AE%B5_%E5%AF%B9%E6%AF%94%E8%A1%A8.md
