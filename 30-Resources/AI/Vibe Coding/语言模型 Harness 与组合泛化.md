---
type: source-note
title: "Language model harnesses are compositional generalizers"
aliases:
  - "语言模型 Harness 与组合泛化"
source: "https://alexzhang13.github.io/blog/2026/harness/"
author:
  - "[[Alex L. Zhang]]"
published:
created: 2026-07-24
description: "Harnesses can lead to compositional generalization: we observe a property in training RLMs, in which similarly structured tasks are viewed as isomorphic and all individual LM calls in the harness become in-distribution."
tags:
  - "clippings"
  - "type/source-note"
  - "topic/llm-agent"
  - "topic/harness"
  - "topic/rlm"
---

# Language model harnesses are compositional generalizers

<!-- codex-learning-note:start id="title-navigation" -->
> [!note] 中文题名与关联
> 中文题名：**语言模型 Harness 与组合泛化**  
> 相关：[[AI 与 Coding]] · [[PTC]]
<!-- codex-learning-note:end -->

Harnesses can lead to compositional generalization: we observe a property in training RLMs, in which similarly structured tasks are viewed as isomorphic and all individual LM calls in the harness become in-distribution.

**Modern post-training has become a brute-force paradigm of curating ever more environments and ever longer training horizons.** In large part, this is because frontier Transformers are still poor at *compositional generalization*, the ability to solve unseen problems by composing familiar ones. Unless our models compose the individual lessons they learn, scaling will have slower returns than it should, as every new domain will demand its own investment in the form of training data.

Training data is not the only lever, of course. For the past few years, we’ve attacked harder tasks by *scaffolding* the Transformer, first with chain-of-thought reasoning, then with tool use, and so on. Yet across all of this, *generalization* itself has been left to the underlying neural network and to its [2017 token-level inductive biases](https://arxiv.org/abs/1706.03762). We argue that better generalization is largely the job of what today is called a *harness*. A harness is the program that sits between the external world and the neural network: it decides how to encode the current state of the environment, which can be arbitrarily long and complex, into one or more inputs to the LLM and how to determine the next action. **The primary job of the harness should be to carry a higher-level inductive bias that can reduce unfamiliar and complex problems to compositions of simpler ones for the underlying neural network.**

Concretely, we think a good harness is one that **shapes each call to the underlying Transformer so that every observation is *locally in-distribution***, i.e. each Transformer call handles a prompt that is in-distribution with respect to its training data. In fact, a good harness can frequently reduce problems that seem to require breakthroughs in post-training into almost mundane capabilities of the existing generation of language models. We first showed a version of this for long context processing [nearly a year ago](https://alexzhang13.github.io/blog/2025/rlm/) and, in this post, we show that this principle extends to the efficiency of *learning* itself. That is, **what a model learns through a well-designed harness generalizes across task lengths and across domains** far better than training the neural network on its own does.

We test this by using reinforcement learning (RL) to train a Recursive Language Model (RLM), a harness in which the model offloads its context and defers execution to programmatic decomposition and recursive sub-calls. The results are summarized in Figure 1. Training on only short tasks generalizes to held-out tasks 8–32x longer, with roughly 10x the eval lift with the same train lift over training the underlying Transformer directly. Moreover, training on one domain transfers to other domains at a far better rate than that of a vanilla Transformer.

![Figure 1: Length and strategy generalization lift](https://alexzhang13.github.io/assets/img/lm_compo/fig1b_length_strategy_generalization_lift.png)

Figure 1. We train Qwen3-30B-A3B-Instruct-2507 as an RLM and as a base Transformer (+ YaRN) on a suite of tasks, and plot train and eval lift. On the left, we independently train 6 different short task environments, and evaluate on the same task environments, but a split that is 8-32x longer in context length. On the right, we train on 3 different task environments, and evaluate on 3 different domains that use a similar decomposition strategy. We find that the eval lift for the RLM matches or exceeds the train lift, while the base Transformer struggles to generalize. In some length-generalization experiments, we find that the RLM starts with a non-generalizable solution that only works on short tasks but eventually discovers a more generalizable decomposition strategy, yielding a higher eval lift than train lift.

<!-- codex-learning-note:start id="figure-1" -->
> [!note] 中文学习笔记
> 这张图比较的不是绝对分数，而是“训练提升能有多少迁移到评测”。左侧测试从短任务到 8–32 倍长任务的长度外推，右侧测试表面领域不同但分解策略相似的跨域迁移。作者强调：RLM 的 eval lift 更接近 train lift，而直接训练 Transformer 往往只提高训练域表现。
<!-- codex-learning-note:end -->

We observe this generalization effect because the RLM harness induces an equivalence relation between tasks with latent similarities, meaning the RLM’s main context sees nearly the same token-level trajectory between these tasks. This is illustrated in Figure 2. These results suggest that, similar to tuning model architectures and training recipes, well-designed harnesses can reduce the cost of curating more data and generating longer rollouts while increasing the coverage of tasks solvable through post-training.

![Figure 2: RLM trajectory isomorphism across BrowseComp-Plus and OOLONG](https://alexzhang13.github.io/assets/img/lm_compo/fig1a_rlm_trajectory_isomorphism.png)

Figure 2. An illustrated example of a Recursive Language Model (RLM) harness on two different tasks, BrowseComp-Plus and OOLONG, which can (in theory) see the exact same trajectory on the root LM's context window by deferring task-specific queries to its sub-calls and moving information through REPL variables. If the RLM trained on one task, it would generalize to the other because the root LM now can see them as isomorphic. This isomorphism occurs when two tasks share latent structure that the RLM can exploit programmatically using sub-calls, while offloading domain-specific information as sub-tasks. In other words, the harness induces a quotient set (Hi/Q) over all trajectories, reducing similar tasks to the same token trajectory.

<!-- codex-learning-note:start id="figure-2" -->
> [!note] 中文学习笔记
> Figure 2 展示全文的核心机制：两个任务的领域词汇不同，但根模型只看到相似的控制流程；具体数据被放进 REPL 变量和子调用。所谓“同构”并不是任务内容相同，而是根模型所经历的 token 轨迹和决策结构足够相似。
<!-- codex-learning-note:end -->

<!-- codex-learning-note:start id="intro-guide" -->
> [!note] 中文学习笔记
> **开篇阅读导图：**文章的论证链是：Transformer 的组合泛化不足 → harness 可以携带更高层的归纳偏置 → 把复杂/OOD 任务拆成每次调用都较熟悉的 LID 子问题 → RLM 通过上下文卸载和程序化子调用实现这种抽象 → 实验观察到更好的跨长度与跨领域迁移。后文分别解释理论动机、RLM 机制、实验结果与局限。
<!-- codex-learning-note:end -->

## Better scaling requires compositional generalization.

Open problems in AI often boil down to challenges of getting deep neural networks (DNNs) to generalize. This is the issue that modern post-training attempts to bandage with targeted environments based on perceived applications. In this post, we argue that the perhaps boring old concept of **compositional generalization**, which is the ability to solve unseen problems by composing familiar concepts and patterns, is becoming painfully clear as a necessary and scalable meta-capability that we must begin to prioritize in modern AI systems.

We argued before, via the [**Mismanaged Geniuses Hypothesis (MGH)**](https://alexzhang13.github.io/blog/2026/mgh/)

- **The Mismanaged Geniuses Hypothesis**   [\[link\]](https://alexzhang13.github.io/blog/2026/mgh/)  
	A. Zhang, Z. Li, O. Khattab.  
	2026.

\[1\]

, that tasks which humans care about solving, can apparently almost always be decomposed rather naturally into sub-tasks that are not only far simpler but also which are not far beyond the current generation of language models. Compositional generalization is key for leveraging this in practice and enabling our systems’ reachable task space to extend beyond their training set’s direct coverage, especially for tasks that may look nothing alike in their surface-level tokens while sharing some underlying structure.

![Figure 3: MGH long-task decomposition](https://alexzhang13.github.io/assets/img/lm_compo/fig2_mgh_long_task_decomposition.png)

Figure 3. Human-defined tasks and their artifacts that we use to train our models on (e.g. web data) are inherently bounded, but longer form tasks have a describable structure that can be effectively decomposed. The key is that the decomposition itself is short and simple.

<!-- codex-learning-note:start id="figure-3" -->
> [!note] 中文学习笔记
> 图中的重点是“任务长度”和“分解规则长度”并不需要同步增长。现实任务及训练样本有长度上限，但描述如何拆解任务的策略可能仍然短而可复用；组合泛化依赖的是学会这种结构，而不是记住每种长任务的完整轨迹。
<!-- codex-learning-note:end -->

Sadly, if the past few years of astronomic spending on training language models are any indication, Transformers and other existing neural sequence models are, at best, unreliable at compositional generalization. Though it seems very plausible that compositional generalization may emerge at a vanilla neural level, it just doesn’t seem that the basic differentiable neural operations [put together 5 years after AlexNet](https://arxiv.org/abs/1706.03762) are particularly optimal when it comes to encoding the inductive biases we need for training our language systems. Indeed, precisely because we now have such powerful priors and models of language, we think it is time to seriously ask whether our inductive biases that aren’t simply geometric or about simple symmetries but which can begin to live at a far higher level of abstraction.

<!-- codex-learning-note:start id="section-compositional-generalization" -->
> [!note] 中文学习笔记
> **本节小结：**组合泛化是把已经学会的概念和操作重新组合，用于未直接训练过的问题。作者认为仅靠增加环境、数据和 rollout 长度，会让每个新领域都继续产生独立成本；更可扩展的方向是让系统学习可跨任务复用的分解方式。这里表达的是作者的研究立场，并不是已经证明 Transformer 永远无法在网络内部获得组合泛化。
<!-- codex-learning-note:end -->

## The capacity for compositional generalization can live in the harness.

We’re often interested in *agents,* which describes any loop in which some policy observes some state

$$
s
$$

and perform an action

$$
a
$$

to interact with an environment

$$
E
$$

. Given a state

$$
s
$$

, it’s tempting to simply serialize

$$
s
$$

into a prompt and tokenize that as-is for a Transformer to become our policy. But because the state and action space can be arbitrarily large and complex, we learned the hard way as a field to introduce a *harness*

$$
H: s \rightarrow a
$$

which is the program that sits between the external world and the neural network: it decides how to encode the current state of the environment, which can be arbitrarily long and complex, into one or more inputs to the LLM and how to determine the next action.

<!-- codex-learning-note:start id="harness-definition" -->
> [!note] 中文学习笔记
> 这里的 harness 不只是“工具调用框架”，而是从环境状态到动作的整套中间程序。它决定模型看见什么、信息如何分块、哪些结果返回主上下文，以及下一步由谁执行。因此 harness 的设计本身就在给系统加入归纳偏置。
<!-- codex-learning-note:end -->

Traditionally, we think of harnesses like Claude Code or Codex as necessary because of their ability to invoke external tools inside a complicated environment. But that’s just part of the agent. We think that **a more fundamental power of the harness is the ability to simplify the arbitrarily complex state**

**$s$**

**into potentially many smaller observations

$$
o
$$

that each individual LM call in the harness can properly handle**. We know that Transformers are unreliable at compositional generalization, so we can rely on the harness to define higher-level inductive biases. Designing anything may trigger your bitter-lesson instincts, but there’s no free lunch: it is *scalable* inductive biases that allow our neural networks to learn and generalize in the first place.

Luckily, we can put this in a way that facilitates *improved* scaling. **A good harness is a harness that *reduces unfamiliar problems to familiar ones* and *reduces complex problems to simple ones*.** In other words, even if the state

$$
s
$$

is out-of-distribution (OOD) to what any individual language model call was trained for, a good harness produces observations

$$
o
$$

that are ***locally in-distribution (LID)***, which we define as every individual LM call over this observation being in-distribution with respect to the training data.

![Figure 4: Locally in-distribution LM systems](https://alexzhang13.github.io/assets/img/lm_compo/fig3_locally_in_distribution.png)

Figure 4. Good harnesses are designed so each individual LM call sees a prompt that is locally "in-distribution" with what it has learned during training, even if the full task trajectory itself is out-of-distribution (OOD).

<!-- codex-learning-note:start id="figure-4" -->
> [!note] 中文学习笔记
> **LID（locally in-distribution）**关注的是单次模型调用，而不是完整任务是否见过。一个整体 OOD 的长任务，如果能被拆成若干模型熟悉的短观察，每次调用仍可能保持 LID。这个定义解释了为什么“把所有信息塞进一个不断增长的上下文”与“按需卸载并调用子任务”会有不同的泛化行为。
<!-- codex-learning-note:end -->

Sadly, existing harness designs such as Claude Code and Codex fail at facilitating locally in-distribution (LID) observations for the underlying neural network. In particular, they fundamentally rely on flooding the context window of the Transformer with interleaved task-specific information, tool call outputs, and reasoning that get continuously appended. Yes, this supplies plenty of context to the model, but these bloated histories quickly fall out of the training distribution, manifesting in the “ [context rot](https://www.trychroma.com/research/context-rot) ” phenomenon that we often observe in practice.

Instead, we propose that a good harness should **enable individual LM calls to see structurally similar tasks as isomorphic**, enabling compositional generalization. Formally, a harness induces an equivalence operator

$$
\sim_{H}
$$

over the set of all task states

$$
\mathcal{T}
$$

, meaning structurally similar tasks fall under the same harness-induced equivalence class

[^1]

and produce similar sets of observations for the neural network involved. For most harnesses that use a main LM with sub-agents, we can understand this argument with respect to the main context, assuming the sub-agents deal with small, individually in-distribution sub-tasks.

Good harnesses induce equivalence classes over tasks, and thereby enable far better and more composable learning. A well-designed harness not only reduces the space of learnable trajectories to a small

$$
\mathcal{T} / \sim_{H}
$$

, but it also generalizes to a wider class of trajectories than the set of available training tasks, including those that do not fit in the base model’s context window.

<!-- codex-learning-note:start id="section-harness-capacity" -->
> [!note] 中文学习笔记
> **本节小结：**作者把 harness 的价值从“连接工具”提升为“变换问题表示”。好的 harness 应隐藏任务特定噪声，让结构相似的问题进入同一个近似等价类，使主模型反复面对熟悉的观察模式。对 Agent 设计的直接启示是：上下文管理不仅为了节省 token，也可能影响模型能否复用已经学会的策略。
<!-- codex-learning-note:end -->

## RLMs are surprisingly good at compositional generalization.

### Equivalence classes over trajectories induced by the RLM harness.

An ideal harness decomposes a task such that the main context is abstracted to **literally** appear token-for-token similar for similar problems, i.e. those that fall under the same harness-induced equivalence class

$$
[\tau^\prime] = \lbrace\tau \in \mathcal{T} : \tau^\prime \sim \tau\rbrace
$$

. This isomorphism enables generalizations of the form: *if a system can solve task X, it should transitively be able to solve task Y*.

![Figure 5: Context offloading and programmatic sub-agent calling](https://alexzhang13.github.io/assets/img/lm_compo/fig4_context_offloading_programmatic_subcalls.png)

Figure 5. We compare how context offloading and programmatic sub-agent calling, two primary components of the RLM, enable the root LM to view two different problems as the same / similar. (1) Standard agent methods stuff the entire query and context as a prefix to the prompt. Between two different tasks, this prefix significantly changes the output distribution of the model, even if the tasks are solved the same way. Context offloading allows similar problems to be viewed as the same. (2) Standard agent methods use tool calls, which return information directly to the main context. Programmatic sub-agent calling allows intermediate computations and information to be stored in the REPL, so the main context does not need to see task-specific information, which can alter its output distribution.

<!-- codex-learning-note:start id="figure-5" -->
> [!note] 中文学习笔记
> 图中两项机制缺一不可：**context offloading** 避免把完整任务内容作为主提示前缀；**programmatic sub-agent calling** 则避免工具和子代理结果自动回灌主上下文。二者共同让领域数据停留在变量和子调用中，而根模型主要处理可复用的控制策略。这与 [[PTC]] 中“中间结果留在程序运行时”的思想直接相关。
<!-- codex-learning-note:end -->

The Recursive Language Model (RLM) harness is designed around abstracting tasks by their decomposition and deferring input-specific information to sub-calls. In this sense, RLMs view similarly decomposed problems as isomorphic

[^2]

, and it achieves this by:

**(1) Context offloading**, where input-specific context is passed as a symbolic variable so the root language model call does not directly see it, enables different problems to appear similar at the first step. Recently, several scaffolds have adopted this feature as a form of context management (see [Anthropic’s Managed Agents blog](https://www.anthropic.com/engineering/managed-agents)). On its own, context offloading does not prevent environment feedback and/or sub-agent information from returning back to the main context. Over long trajectory horizons, the main context becomes OOD, breaking LID.

**(2) Programmatic sub-agent calling**, where sub-agents and also normal tools are treated as functions in a code REPL, allow the root LM to selectively choose information and pass around information across further tool calls and sub-agents without the root LM itself ever needing to see it. This includes tool and sub-call outputs, which can be stored in variables in memory directly and accessed by future sub-calls. Programmatic sub-calling is equally as important as context offloading for abstracting task-specific information away from the main context.

<!-- codex-learning-note:start id="section-trajectory-equivalence" -->
> [!note] 中文学习笔记
> **小结：**RLM 所追求的不是让不同任务产生完全相同的答案，而是让根模型执行相似的“程序骨架”。领域相关内容交给子调用，根模型学习分块、筛选、聚合和递归等分解策略；如果新任务共享这套骨架，训练经验就更可能迁移。
<!-- codex-learning-note:end -->

### RLMs can train on short tasks and generalize to longer, unseen tasks.

It is widely known that training Transformer-based LMs on a domain at a particular context length does not necessarily generalize to longer context lengths

- **Exploring Length Generalization in Large Language Models**   [\[PDF\]](http://arxiv.org/pdf/2207.04901.pdf)  
	C. Anil, Y. Wu, A. Andreassen, A. Lewkowycz, V. Misra, V. Ramasesh, A. Slone, G. Gur-Ari, E. Dyer, B. Neyshabur.  
	2022.

\[2\]

. A large chunk of mid-training and post-training work in production models like [Qwen 3.x](https://arxiv.org/abs/2505.09388), [Kimi K2.x](https://arxiv.org/abs/2507.20534), [GLM 5.x](https://arxiv.org/abs/2602.15763), etc. has been dedicated to carefully introducing longer and longer data into the training mix so LMs can learn to handle those context lengths, and then again many modern applications commonly exceed those lengths. The length generalization issue especially impacts standard agent designs like [ReAct](https://arxiv.org/abs/2210.03629)

- **ReAct: Synergizing Reasoning and Acting in Language Models**   [\[PDF\]](http://arxiv.org/pdf/2210.03629.pdf)  
	S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, Y. Cao.  
	International Conference on Learning Representations. 2023.

\[3\]

, [CodeAct](https://arxiv.org/abs/2402.01030)

- **Executable Code Actions Elicit Better LLM Agents**   [\[PDF\]](http://arxiv.org/pdf/2402.01030.pdf)  
	X. Wang, Y. Chen, L. Yuan, Y. Zhang, Y. Li, H. Peng, H. Ji.  
	International Conference on Machine Learning. 2024.

\[4\]

, [Claude Code](https://code.claude.com/docs/en/overview), [Codex](https://openai.com/codex/), etc. which as we mentioned, rely on appending observations to a growing prefix history of context.

We hypothesize that for RLMs, similar tasks of a different length can fall under the same equivalence class under

$$
\sim_{RLM}
$$

. In the following experiment, we explore how training only the root LM of an RLM exclusively on short sequences can generalize sequences an order of magnitude longer, as we posit that the decomposition, and hence the trajectory the RLM’s root LM sees on both settings, are nearly identical.

We consider a suite of 6 different environments across different axes of length: varying the input length, output length, and number of instructions. We explicitly train only on a split containing short tasks, and evaluate on a split only containing significantly longer tasks within the same domain. Across all the settings below, we train for 150 steps (batch size 64, 4 rollouts per) with `prime-rl` ([Decoupled PPO](https://verl.readthedocs.io/en/latest/algo/rollout_corr_math.html#decoupled-ppo-achieving-batch-size-invariance)

- **Batch size-invariance for policy optimization**   [\[PDF\]](http://arxiv.org/pdf/2110.00641.pdf)  
	J. Hilton, K. Cobbe, J. Schulman.  
	Advances in Neural Information Processing Systems. 2022.

\[5\]

with GRPO-like advantages + KL loss) and evaluate every 10 steps.

- [**MRCRv2**](https://github.com/google-deepmind/eval_hub/tree/master/eval_hub/mrcr_v2) (64k, 2-needle setting to 2M, 8-needle setting). A commonly reported benchmark in frontier model reports, the premise is to find the
	$$
	i
	$$
	th instance of needle sentence that answers some query within a large corpus of conversation data.
- [**GraphWalks**](https://huggingface.co/datasets/openai/graphwalks) (<128K to >1M setting). Another commonly reported benchmark in frontier model reports, the premise is to extract nodes from a graph that satisfy some simple constraint.
- [**LongBenchPro**](https://arxiv.org/abs/2601.02872) (32k to 256k setting, English-only). A suite of multiple choice-style questions spanning 11 different QA, code, and reasoning style problems.
- [**OOLONG**](https://arxiv.org/abs/2511.02817) \[trec-coarse\] (32k to 256k setting). A set of aggregation style questions to answer statistics about a dataset of information.
- [**OOLONG-Pairs**](https://arxiv.org/abs/2512.24601) (8k to 32k input, 7k to 146k output setting). A modified variant of OOLONG to find pairs of elements in the OOLONG dataset satisfying certain constraints.
- [**Ada-LEval**](https://arxiv.org/abs/2404.06480) \[best-answer\] (8k to 128k setting). Given a question and a large number of potential candidate and distractor answers, pick out the most suitable to answer the question.

We plot both the training reward on short tasks (translucent) and the evaluation reward (dark) on the longer version of the tasks. We compare training an RLM, an RLM where we nudge it to state the decomposition it wants to perform, and a base Transformer (with YaRN for longer settings). We use [**Qwen3-30B-A3B-Instruct-2507**](https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507) as the model for all settings.

![Figure 6: Length generalization training curves](https://alexzhang13.github.io/assets/img/lm_compo/fig5_length_generalization_curves.png)

Figure 6. Across six benchmarks with length-varying splits, we train Qwen3-30B-A3B-Instruct-2507 as an RLM with a decomposition hint, a base RLM, and on its own as a Transformer, on short splits of the environment. We evaluate on longer splits 8-32x longer at every 10 step checkpoint, and plot both the evaluation score on the long eval, and train reward on short task (smoothed) over 150 steps. We also plot a frontier model, GPT-5.5, with the RLM harness as a point of comparison. The Transformer on MRCRv2 baseline was omitted because it cannot fit 2M tokens in context, even with context extension.

<!-- codex-learning-note:start id="figure-6" -->
> [!note] 中文学习笔记
> 读图时要同时看浅色训练曲线和深色长任务评测曲线。关键现象是：RLM 只在短任务上训练，长任务评测仍随训练改善；基线 Transformer 即使训练奖励上升，长任务评测往往较平。图中还包含“提示模型主动分解”的变体，说明系统是否学到长度无关的策略会显著影响外推。
<!-- codex-learning-note:end -->

Across all six tasks, the RLM yields significantly better eval results on long tasks by training exclusively on short tasks, beating out the base Transformer by a significant margin even when starting with a lower step-0 eval performance. On MRCRv2, GraphWalks, OOLONG, and OOLONG-Pairs, the trained Qwen3-30B-A3B-Instruct-2507 RLM approaches or exceeds an RLM with a frontier model, GPT-5.5 on the long eval, while far exceeding the base Transformer.

**RLM eval performance on longer tasks more closely matches the train reward on shorter tasks.** On all six tasks, the RLM yields significant improvements in performance on the long eval relative to its starting, step-0 eval performance. The base Transformer generally yields flat eval performance despite the train reward growing and often exceeding the train reward of the RLM, suggesting *what is learned by the Transformer does not extrapolate to the longer setting*.

**Why length generalization occurs and where it fails.** In all of the environments above, the strategy the RLM learns to solve the short tasks is roughly equivalent to that of the strategy needed to solve the longer tasks, and because the root LM’s view of the long task with the context offloaded looks near token-for-token identical to the short task, the RLM has effectively seen the same task during training. In other words, many tasks share the same equivalence class across length. The primary difference is the number of sub-calls and the content of the sub-calls themselves, each of which handle an in-distribution sub-task. Length generalization occurs because the RLM learns a generalizable strategy, *but this is not always guaranteed*. In many of the short settings above, one viable strategy is to just offload the entire problem to a single sub-call and return this as a solution, effectively becoming equivalent to the long-context Transformer baseline.

We include the “nudge to decompose” user message variant (a condensed version [of the addendum in the RLM repository](https://github.com/alexzhang13/rlm/blob/main/rlm/utils/prompts.py#L147)) to illustrate this point, which helps in the case of MRCRv2, where the RLM does not learn the right, generalizable strategy across length. In the training of RLMs and locally in-distribution LM systems as a whole, a whole area of study is how much supervision / distillation is required to get the system to converge to a generalizable solution over a non-generalizable solution. Our intuition is that at scale, no supervision is necessary, but for the sake of sample efficient learning, [some form of supervision or hint is helpful](https://noahziems.com/pedagogical-rl).

<!-- codex-learning-note:start id="length-generalization" -->
> [!note] 中文学习笔记
> **长度泛化的条件：**短任务和长任务必须能使用同一种与长度无关的分解策略。RLM 仍可能在短任务上学到捷径，例如把整个问题交给一次子调用；这种策略无法外推。文章因此把“怎样让训练收敛到可泛化分解”列为仍需监督、提示或蒸馏研究的开放问题。
<!-- codex-learning-note:end -->

### RLMs can generalize to unseen tasks that share latent structure observed in training.

The previous section showed that RLMs can learn to view tasks and their length-extrapolated variants as isomorphic by abstracting them as the same task in the root model. For length extrapolation in particular, if the RLM learns a length-agnostic strategy, it quickly generalizes to longer lengths. We can take this intuition to generalization on tasks with shared decompositions: if the RLM learns a strategy that generalizes from one domain to another (e.g. applying sorting, filter and search, MapReduce, etc.) it can similarly generalize by abstracting away the domain-specific tokens, and viewing the two problems as equivalent.

We consider 3 domains in which the context and query are referring to completely different domains, but the actual underlying strategy is roughly the same.

- **OOLONG (trec-coarse questions → spam questions).** Training on aggregation tasks about Jeopardy TREC questions and evaluating on aggregation tasks about questions whose answer is either SPAM or HAM.
- **OBLIQ-Bench Analogues (writing → math).** Training on tasks about searching for essays that seem to be written by the same author, and evaluating on tasks about searching for math problems that require the same reasoning process. Train and eval metric are nDCG@10.
- **OBLIQ-Bench Descriptive (Twitter stance → Wildchat errors).** Training on tasks about finding tweets that satisfy a certain stance, and evaluating on tasks about searching for Wildchat conversations containing errors. Train and eval metric are nDCG@10.
![Figure 7: Strategy generalization training curves](https://alexzhang13.github.io/assets/img/lm_compo/fig6_strategy_generalization_curves.png)

Figure 7. Across three benchmarks with length-varying splits, we train Qwen3-30B-A3B-Instruct-2507 as an RLM and on its own as a Transformer, on one environment domain. We evaluate on a different environment split at every 20 step checkpoint, and plot both the evaluation score and train reward (smoothed) over 500 steps.

<!-- codex-learning-note:start id="figure-7" -->
> [!note] 中文学习笔记
> 这里测试的是比长度变化更强的迁移：训练域和评测域的词元与主题不同，只共享潜在操作结构，例如搜索、筛选、聚合或按同一标准分类。作者观察到 RLM 的跨域 eval 趋势更贴近训练收益，而基线较容易只适应训练域或答案格式。
<!-- codex-learning-note:end -->

We similarly find that the RLM exhibits clear generalization capabilities on **completely different domains** than the one it trained on, while the base Transformer struggles to meaningfully improve. Similar to in the length generalization experiments, initial improvements in eval performance on OBLIQ-Bench during the base Transformer training generally come from learning to follow the proper answer format, which quickly diminishes. Interestingly, *the train reward of the base Transformer generally exceeds that of the RLM despite clear gaps in performance on the eval*. Instead, the train reward of the RLM closely matches the trend of the eval reward, despite being on a completely different domain.

Even more than the length generalization, these experiments have completely different token distributions between train and test, as the main similarity is in the latent task structure that the model must learn to exploit. Like in length generalization, these results suggest the internal mechanisms of the Transformer struggle to decompose the tasks into composable patterns that generalize.

**On the cost of training harnesses like RLMs.** On similarly-sized tasks, the RLM incurs an extra runtime and memory cost over naively training a Transformer. In particular, across both the length and strategy generalization experiments, the runtime of RLM training is 1.5-3x longer than the base Transformer counterparts due to multiple steps per sample and waiting on sub-calls. However, this cost scales well with task complexity, as training a Transformer on longer context / horizon tasks is significantly more expensive. Even training a simple ReAct agent on the tasks above on an 8xH100 is difficult for a 30B model due to context bloat.

<!-- codex-learning-note:start id="strategy-generalization" -->
> [!note] 中文学习笔记
> **跨域结果与代价：**实验支持的是“共享分解结构时可以迁移”，并非任意领域间都能泛化。RLM 训练还要承担多步执行、子调用等待和额外内存，文中报告相近任务上的运行时间约为基线的 1.5–3 倍；它的优势要结合长上下文训练本身的高成本来判断。
<!-- codex-learning-note:end -->

### How close are unseen RLM task trajectories to train trajectories?

It is rather difficult to characterize whether a prompt

$$
x
$$

is “in-distribution” for a language model, but we can use benchmark performance as a proxy for this kind of thing — e.g., LMs can solve most AIME problems, so we consider these tasks to be “in-distribution”. For agent trajectories, which are often long, multiple turns, and filled with extra fluff like tool calls and harness tokens, it is even harder to determine whether two trajectories will exhibit the same output distribution behavior.

If the RLM produces a trajectory on an unseen task that is *token-for-token* identical to a trajectory generated during a training task, then we could easily argue that these two tasks are in the same equivalence class under

$$
\sim_{RLM}
$$

and are viewed as isomorphic. Unfortunately, even small, one-token perturbations can semantically change the meaning of a text sequence, so arguing that

$$
P_x
$$

and

$$
P_{x^\prime}
$$

have some bounded difference is difficult. In the **Appendix**, we discuss some proxies for determining whether two trajectories fall under the same equivalence class. Below, we provide various examples of eval trajectories from our experiments that are similar to some train trajectory on a different task.

<!-- codex-learning-note:start id="trajectory-examples-guide" -->
> [!note] 中文学习笔记
> 接下来是一组很长的训练/评测轨迹对照。阅读时不必逐行理解数据内容，重点观察两点：根模型是否使用相同的程序化步骤（解析、筛选、批量子调用、计数），以及领域特定信息是否主要留在变量或子调用中。原文保留全部轨迹，便于核对作者所谓“策略相似”具体表现在哪里。
<!-- codex-learning-note:end -->

1 / 9token\_lcs 0.824NEARLY\_IDENTICAL · 93/100

```python
print(f"Context length: {len(context)} characters")
print(f"First 500 characters:\n{context[:500]}")
print(f"Last 500 characters:\n{context[-500:]}")
```

```
Context length: 78138 characters
First 500 characters:
The following lines contain 787 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'location', 'human being', 'entity', 'abbreviation', 'numeric value', 'description and abstract concept'.

You will be asked to answer questions about the aggregate label statistics across all 787 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.

Date: Apr 18, 2022
Last 500 characters:
al name ?
Recall: the preceding lines contain 787 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'location', 'human being', 'entity', 'abbreviation', 'numeric value', 'description and abstract concept'.

You will be asked to answer questions about the aggregate label statistics across all 787 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.
```

REPL variables `['answer', 'context_0', 'context']`

User

Turn 2/20:

```python
# Split the context into lines to inspect the structure
lines = context.strip().split('\n')
print(f"Total number of lines (questions): {len(lines)}")
print(f"First 5 lines:\n{lines[:5]}")
print(f"Last 5 lines:\n{lines[-5:]}")
```

```
Total number of lines (questions): 794
First 5 lines:
["The following lines contain 787 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'location', 'human being', 'entity', 'abbreviation', 'numeric value', 'description and abstract concept'.", '', 'You will be asked to answer questions about the aggregate label statistics across all 787 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.', '', 'Date: Apr 18, 2022 || User: 35142 || Instance: What does NAFTA stand for ?']
Last 5 lines:
['Date: Feb 28, 2024 || User: 84271 || Instance: What video format was an alternative to VHS ?', 'Date: Sep 02, 2024 || User: 26503 || Instance: When Mighty Mouse was conceived , what was his original name ?', "Recall: the preceding lines contain 787 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'location', 'human being', 'entity', 'abbreviation', 'numeric value', 'description and abstract concept'.", '', 'You will be asked to answer questions about the aggregate label statistics across all 787 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.']
```

REPL variables `['answer', 'context_0', 'context', 'lines']`

User

Turn 3/20:

```python
# Filter out the header/footer lines and keep only the actual question lines
# We can identify real data lines by presence of "User: " and "Instance: "
data_lines = []
for line in lines:
    if "User: " in line and "Instance: " in line:
        data_lines.append(line.strip())

print(f"Number of valid data lines: {len(data_lines)}")
print(f"Sample of valid data lines:\n{data_lines[:5]}")
```

```
Number of valid data lines: 787
Sample of valid data lines:
['Date: Apr 18, 2022 || User: 35142 || Instance: What does NAFTA stand for ?', 'Date: Feb 17, 2023 || User: 85055 || Instance: What does A&W of root beer fame stand for ?', 'Date: Apr 06, 2022 || User: 26503 || Instance: What is the name of the vaccine for chicken pox ?', 'Date: Nov 16, 2024 || User: 92741 || Instance: What was the name of the American ship sunk by a mine in Havana harbor , causing the Spanish-American war ?', 'Date: Dec 22, 2022 || User: 72517 || Instance: How long does it take the Milky Way Galaxy to make one revolution ?']
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'data_lines', 'line']`

User

Turn 4/20:

```python
# Extract user IDs and questions from data_lines
# Format: "Date: ... || User: <id> || Instance: <question>"
user_id_question_pairs = []
for line in data_lines:
    parts = line.split(" || ")
    user_id = None
    question = None
    for part in parts:
        if part.startswith("User: "):
            user_id = part.split("User: ")[1]
        elif part.startswith("Instance: "):
            question = part.split("Instance: ")[1]
    if user_id and question:
        user_id_question_pairs.append((user_id, question))

print(f"Sample of (User ID, Question): {user_id_question_pairs[:5]}")
```

```
Sample of (User ID, Question): [('35142', 'What does NAFTA stand for ?'), ('85055', 'What does A&W of root beer fame stand for ?'), ('26503', 'What is the name of the vaccine for chicken pox ?'), ('92741', 'What was the name of the American ship sunk by a mine in Havana harbor , causing the Spanish-American war ?'), ('72517', 'How long does it take the Milky Way Galaxy to make one revolution ?')]
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'data_lines', 'line', 'user_id_question_pairs', 'parts', 'user_id', 'question', 'part']`

User

Turn 5/20:

```python
# Now, filter only the instances where User ID is 62297
target_user_id = "62297"
target_questions = [q for u, q in user_id_question_pairs if u == target_user_id]

print(f"Number of questions from user {target_user_id}: {len(target_questions)}")
print(f"Sample of such questions:\n{target_questions[:3]}")
```

```
Number of questions from user 62297: 9
Sample of such questions:
['What is the abbreviated form of the National Bureau of Investigation ?', 'How many miles is it to Ohio from North Carolina ?', 'What does SIDS stand for ?']
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'data_lines', 'line', 'user_id_question_pairs', 'parts', 'user_id', 'question', 'part', 'target_user_id', 'target_questions']`

User

Turn 6/20:

```python
# Now we need to classify each of the 9 questions from user 62297 into their labels
# We'll use the LLM to classify each question into one of: 'numeric value', 'entity', 'location', 'description and abstract concept', 'abbreviation', 'human being'

# Extract only the questions for user 62297
questions_62297 = [q for u, q in user_id_question_pairs if u == target_user_id]

# Define the prompt for classification
classification_prompt_template = (
    "Classify the answer to the following question into one of these categories: "
    "'numeric value', 'entity', 'location', 'description and abstract concept', 'abbreviation', 'human being'. "
    "Do not explain, only return the category.\n\n"
    "Question: {question}"
)

# Prepare list of prompts for batch classification
prompts = [
    classification_prompt_template.format(question=q) for q in questions_62297
]

# Batch query LLM for classification
labels = llm_query_batched(prompts)

# Display the labels
print(f"Labels for user {target_user_id}:\n{list(zip(questions_62297, labels))}")
```

```
Labels for user 62297:
[('What is the abbreviated form of the National Bureau of Investigation ?', 'abbreviation'), ('How many miles is it to Ohio from North Carolina ?', 'numeric value'), ('What does SIDS stand for ?', 'abbreviation'), ("What is the biggest \`\` thing '' humans have made ?", 'entity'), ("What does the \`\` c '' stand for in the equation E=mc2 ?", 'abbreviation'), ('Who fired Maria Ybarra from her position in San Diego council ?', 'human being'), ('Who was Red Grange ?', 'human being'), ('What is Toulmin logic ?', 'description and abstract concept'), ('How long does it take the moon to revolve around the Earth ?', 'numeric value')]
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'data_lines', 'line', 'user_id_question_pairs', 'parts', 'user_id', 'question', 'part', 'target_user_id', 'target_questions', 'questions_62297', 'classification_prompt_template', 'prompts', 'labels']`

User

Turn 7/20:

```python
# Count frequencies of 'numeric value' and 'description and abstract concept' for user 62297
numeric_count = labels.count('numeric value')
desc_abstract_count = labels.count('description and abstract concept')

print(f"Numeric value count: {numeric_count}")
print(f"Description and abstract concept count: {desc_abstract_count}")
```

```
Numeric value count: 2
Description and abstract concept count: 1
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'data_lines', 'line', 'user_id_question_pairs', 'parts', 'user_id', 'question', 'part', 'target_user_id', 'target_questions', 'questions_62297', 'classification_prompt_template', 'prompts', 'labels', 'numeric_count', 'desc_abstract_count']`

User

Turn 8/20:

```python
# Compare the counts
if numeric_count > desc_abstract_count:
    comparison = "more common than"
elif numeric_count < desc_abstract_count:
    comparison = "less common than"
else:
    comparison = "same frequency as"

answer["content"] = f"numeric value is {comparison} description and abstract concept"
answer["ready"] = True
```

```
REPL variables: ['answer', 'context_0', 'context', 'lines', 'data_lines', 'line', 'user_id_question_pairs', 'parts', 'user_id', 'question', 'part', 'target_user_id', 'target_questions', 'questions_62297', 'classification_prompt_template', 'prompts', 'labels', 'numeric_count', 'desc_abstract_count', 'comparison']
```

```python
print(f"Context length: {len(context)} characters")
print(f"First 500 characters:\n{context[:500]}")
print(f"Last 500 characters:\n{context[-500:]}")
```

```
Context length: 618252 characters
First 500 characters:
The following lines contain 6374 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'numeric value', 'human being', 'entity', 'description and abstract concept', 'location', 'abbreviation'.

You will be asked to answer questions about the aggregate label statistics across all 6374 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.

Date: May 21, 20
Last 500 characters:
 feet ?
Recall: the preceding lines contain 6374 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'numeric value', 'human being', 'entity', 'description and abstract concept', 'location', 'abbreviation'.

You will be asked to answer questions about the aggregate label statistics across all 6374 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.
```

REPL variables `['answer', 'context_0', 'context']`

User

Turn 2/20:

```python
# Split the context into lines to inspect the structure
lines = context.strip().split('\n')
print(f"Total number of lines (questions): {len(lines)}")
print(f"First 5 lines:\n{lines[:5]}")
print(f"Last 5 lines:\n{lines[-5:]}")
```

```
Total number of lines (questions): 6381
First 5 lines:
["The following lines contain 6374 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'numeric value', 'human being', 'entity', 'description and abstract concept', 'location', 'abbreviation'.", '', 'You will be asked to answer questions about the aggregate label statistics across all 6374 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.', '', 'Date: May 21, 2022 || User: 82483 || Instance: What is the difference between fatalism and determinism ?']
Last 5 lines:
['Date: Sep 15, 2022 || User: 49582 || Instance: Who killed Caesar ?', 'Date: Apr 07, 2024 || User: 74968 || Instance: What U.S. state has the lowest highest elevation at 6 feet ?', "Recall: the preceding lines contain 6374 general-knowledge questions, one per line. Each question has an answer that can be described as one of 6 categories: 'numeric value', 'human being', 'entity', 'description and abstract concept', 'location', 'abbreviation'.", '', 'You will be asked to answer questions about the aggregate label statistics across all 6374 examples in this dataset. Do not try to guess, estimate, or approximate the result. Calculate the exact answer given these datapoints.']
```

REPL variables `['answer', 'context_0', 'context', 'lines']`

User

Turn 3/20:

```python
# Remove header and footer lines (non-question lines)
# We'll keep only lines that contain "User:" and "Instance:"
questions = []
for line in lines:
    if "User:" in line and "Instance:" in line:
        questions.append(line.strip())

print(f"Number of valid question lines after filtering: {len(questions)}")
print(f"Sample of 5 valid lines:\n{questions[:5]}")
```

```
Number of valid question lines after filtering: 6374
Sample of 5 valid lines:
['Date: May 21, 2022 || User: 82483 || Instance: What is the difference between fatalism and determinism ?', 'Date: Jun 14, 2025 || User: 56003 || Instance: How many years did Shea & Gould practice law in Los Angeles ?', 'Date: Feb 26, 2022 || User: 65797 || Instance: What is the quantity of American soldiers still unaccounted for from the Vietnam war ?', 'Date: Dec 08, 2022 || User: 19185 || Instance: Where were the 196 Summer Olympics held ?', 'Date: Feb 24, 2023 || User: 55400 || Instance: What does the word LASER mean ?']
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'questions', 'line']`

User

Turn 4/20:

```python
# Extract user IDs and instances from the valid questions
# Format: "Date: ... || User: <ID> || Instance: <question>"
user_id_to_question = []
for q in questions:
    # Split by " || " and extract User and Instance
    parts = q.split(" || ")
    user_id = None
    instance = None
    for part in parts:
        if part.startswith("User:"):
            user_id = part.split(":")[1].strip()
        elif part.startswith("Instance:"):
            instance = part.split(":", 1)[1].strip()
    if user_id and instance:
        user_id_to_question.append((user_id, instance))

print(f"Total (User ID, Question) pairs: {len(user_id_to_question)}")
print(f"Sample of 5 pairs:\n{user_id_to_question[:5]}")
```

```
Total (User ID, Question) pairs: 6374
Sample of 5 pairs:
[('82483', 'What is the difference between fatalism and determinism ?'), ('56003', 'How many years did Shea & Gould practice law in Los Angeles ?'), ('65797', 'What is the quantity of American soldiers still unaccounted for from the Vietnam war ?'), ('19185', 'Where were the 196 Summer Olympics held ?'), ('55400', 'What does the word LASER mean ?')]
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'questions', 'line', 'user_id_to_question', 'q', 'parts', 'user_id', 'instance', 'part']`

User

Turn 5/20:

```python
# Now, filter only the instances where User ID is 84905
target_user_id = "84905"
filtered_questions = [q for q in user_id_to_question if q[0] == target_user_id]

print(f"Number of questions from user ID {target_user_id}: {len(filtered_questions)}")
print(f"Sample of 5 questions from user {target_user_id}:\n{filtered_questions[:5]}")
```

```
Number of questions from user ID 84905: 15
Sample of 5 questions from user 84905:
[('84905', 'How much did Alaska cost when bought from Russia ?'), ('84905', 'What is Toulmin logic ?'), ('84905', 'Boxing Day is celebrated on what date ?'), ('84905', 'How is saline used in medicine ?'), ('84905', 'Who did Napolean defeat at Jena and Auerstadt ?')]
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'questions', 'line', 'user_id_to_question', 'q', 'parts', 'user_id', 'instance', 'part', 'target_user_id', 'filtered_questions']`

User

Turn 6/20:

```python
# Now, we need to classify each of these 15 questions from user 84905 into their label categories.
# We'll use the LLM to classify each question's answer type.

# Extract just the questions for classification
question_list = [q[1] for q in filtered_questions]

# Use llm_query_batched to classify all 15 questions at once
# Prompt: "Classify the answer type of the following question into one of: 'numeric value', 'entity', 'location', 'description and abstract concept', 'abbreviation', 'human being'. Only return the category."
prompts = [
    f"Classify the answer type of the following question into one of: 'numeric value', 'entity', 'location', 'description and abstract concept', 'abbreviation', 'human being'. Only return the category.\nQuestion: {q}"
    for q in question_list
]

# Perform batch classification
labels = llm_query_batched(prompts)
print(f"Labels for user 84905's questions: {labels}")
```

```
Labels for user 84905's questions: ['numeric value', 'description and abstract concept', 'numeric value', 'description and abstract concept', 'human being', 'human being', 'entity', 'description and abstract concept', 'human being', 'description and abstract concept', 'human being', 'human being', 'abbreviation', 'numeric value', 'entity']
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'questions', 'line', 'user_id_to_question', 'q', 'parts', 'user_id', 'instance', 'part', 'target_user_id', 'filtered_questions', 'question_list', 'prompts', 'labels']`

User

Turn 7/20:

```python
# Count occurrences of 'human being' and 'description and abstract concept'
count_human_being = labels.count('human being')
count_description_abstract = labels.count('description and abstract concept')

print(f"Count of 'human being': {count_human_being}")
print(f"Count of 'description and abstract concept': {count_description_abstract}")
```

```
Count of 'human being': 5
Count of 'description and abstract concept': 4
```

REPL variables `['answer', 'context_0', 'context', 'lines', 'questions', 'line', 'user_id_to_question', 'q', 'parts', 'user_id', 'instance', 'part', 'target_user_id', 'filtered_questions', 'question_list', 'prompts', 'labels', 'count_human_being', 'count_description_abstract']`

User

Turn 8/20:

```python
# Compare the counts
if count_human_being > count_description_abstract:
    comparison = "more common than"
elif count_human_being < count_description_abstract:
    comparison = "less common than"
else:
    comparison = "same frequency as"

# Final answer format
answer["content"] = f"human being is {comparison} description and abstract concept"
answer["ready"] = True
```

```
REPL variables: ['answer', 'context_0', 'context', 'lines', 'questions', 'line', 'user_id_to_question', 'q', 'parts', 'user_id', 'instance', 'part', 'target_user_id', 'filtered_questions', 'question_list', 'prompts', 'labels', 'count_human_being', 'count_description_abstract', 'comparison']
```

**Remark.** The ideal behavior is for the root LM to learn to abstract away information about the domain, and isolate decomposable behavior about a task, while deferring domain-specific information to sub-calls. In many cases, the RLM will still choose to print out task-specific information and pass it back to the main context. While this behavior is often undesirable from a generalization perspective (and can likely be trained out if done carefully), we still find that across all experiments, the strategies used by the RLM during evals closely mimic those learned during training. This includes both general, programmatic sub-agent calling strategies like chunking and fanning out sub-calls, as well as general programmatic strategies like `regex` calls.

### The Scaling Picture and Moving Forward

It is easy to walk away from these powerful early results thinking that we should all be tinkering with harness designs or imposing our problem-specific intuitions around overly structured programmatic strategies such as MapReduce or dynamic programming. But make no mistake, doing that we will inevitably run afoul of the bitter lesson and fall by the wayside within months.

Instead, we’re making a different argument. **Scaling data will remain the biggest driver of progress, but the machinery that we feed that data into and its inductive biases are what will determine the coefficients of that scaling.** And as things stand today, it seems that the returns on scaling Transformers and related neural architectures are just not budging in terms of being poor compositional generalizers. We think this is because their narrow design space of mostly differentiable neural operators misses something fundamental.

But thanks to language as a powerful substrate for which we have been able to train at scale for the past several years, the architecture of our AI systems is no longer limited to simple differentiable operators or to low-level geometric inductive biases. We can now encode far higher-level and more symbolic inductive biases and train our systems end-to-end with RL, and we have shown in this post that through context offloading and programmatic sub-agents, the RLM architecture is one that can be far superior to a vanilla Transformer at generalization, across lengths and domains. And at its core, this all is about an extremely simple but important idea in harness design: make sure these systems can learn to reduce complex problems to sequences of individually and locally in-distribution observations.

In short, better returns on scaling require compositional generalization, and the capacity for compositional generalization looks like it has to largely live in what today we refer to as a harness, but which in the future may blur quite seriously with what we consider the fundamental architecture of our frontier AI systems.

<!-- codex-learning-note:start id="scaling-takeaway" -->
> [!note] 中文学习笔记
> **主文结论：**作者并不主张停止扩展数据或用手写工作流取代学习，而是认为 harness 的高层归纳偏置会影响规模化收益的“系数”。RLM 的启示是：让系统学习把复杂任务转成一系列局部熟悉的观察，可能比单纯延长主上下文更利于复用训练所得策略。
<!-- codex-learning-note:end -->

### Appendix

Recall that we are interested in characterizing how close harness trajectories on unseen tasks are to what they learned during training. It is rare for two LM trajectories to be token-for-token identical, but taking some liberties with rough smoothness assumptions on the LM as a function of its input, what we really care about is whether two trajectories are close enough under some metric so their output distributions are almost the same.

<!-- codex-learning-note:start id="appendix-guide" -->
> [!note] 中文学习笔记
> 附录尝试把“轨迹看起来相似”变成可计算的代理指标。需要注意，这些字符串距离并不能直接证明两个提示会产生相同输出分布；它们只是用编辑距离、n-gram 重合和长度比例等方法，近似检查评测轨迹是否更接近训练中见过的轨迹。
<!-- codex-learning-note:end -->

It is very hard to formalize the above in an empirically meaningful way; we would need to know some properties about the function defined by the LM, a distance metric on input prompts that are within some

$$
\delta
$$

\-ball, and a distance metric on the output logits that are within some

$$
\epsilon
$$

\-ball. As a basic start, we are interested in, for some distance metric

$$
d(\cdot,\cdot)
$$

, the difference between the root LM trajectory of the RLM during evaluation and training. We can define “isomorphic” here loosely as two prompts have some distance less than

$$
\epsilon
$$

, but as mentioned earlier a more rigorous treatment of this topic is likely necessary. We generally just want to understand and find, for this distance metric, what is the average distance of the *closest* training pair to the evaluation rollouts? In other words, at training step

$$
t
$$

, for trajectories

$$
x
$$

, the set of evaluation samples

$$
\mathcal{E}_t
$$

, and the set of training samples

$$
\mathcal{T}_{\leq t}
$$

that occurred before, we compute (with a bit of abuse of notation):

$$
\mathbb{E}_{e \sim \mathcal{E}_{t}} \left[\underset{\tau \in \mathcal{T}_{\leq t}}{min} d \left(x_{\tau} , x_{e}\right)\right] \approx \frac{1}{\left|\mathcal{E}_{t}\right|} \underset{e \in \mathcal{E}_{t}}{\sum} \underset{\tau \in \mathcal{T}_{\leq t}}{min} d \left(x_{\tau} , x_{e}\right)
$$

We plot the similarity, i.e.

$$
1 - d(\cdot,\cdot)
$$

, of the average eval rollout of the best RLM vs. base Transformer checkpoint to any training trajectory that occurred before it. We consider the following distance metrics:

| Plot label | Metric | Distance definition  $$ d(x_{\text{train}}, x_{\text{eval}}) $$ |
| --- | --- | --- |
| **Edit** | Token-level, length-normalized Levenshtein Distance | Let  $$ \mathrm{Lev}(\cdot,\cdot) $$  be token-level Levenshtein distance and define normalized similarity  $$ \mathrm{LevSim}(a,b)=1-\dfrac{\mathrm{Lev}(a,b)}{\max(\lVert a\rVert,\lVert b\rVert)} $$  . Then  $$ d(a,b)=1-\mathrm{LevSim}(a,b)=\dfrac{\mathrm{Lev}(a,b)}{\max(\lVert a\rVert,\lVert b\rVert)}. $$ |
| **Contain** | 3-gram word containment | Let  $$ N_3(x) $$  be the multiset of word 3-grams in  $$ x $$  . Then (asymmetric):  $$ d(x_{\text{train}},x_{\text{eval}})=1-\frac{\lvert N_3(x_{\text{eval}})\cap N_3(x_{\text{train}})\rvert}{\lvert N_3(x_{\text{eval}})\rvert}. $$ |
| **Jaccard** | 3-gram Jaccard | $$ d(x_{\text{train}},x_{\text{eval}})=1-\frac{\lvert N_3(x_{\text{eval}})\cap N_3(x_{\text{train}})\rvert}{\lvert N_3(x_{\text{eval}})\cup N_3(x_{\text{train}})\rvert}. $$ |
| **Weighted Jaccard** | Weighted Jaccard | Let  $$ c_x(t) $$  be the token (or n-gram) count of type  $$ t $$  in  $$ x $$  . Then  $$ d(x_{\text{train}},x_{\text{eval}})=1-\frac{\sum_t \min\!\big(c_{x_{\text{train}}}(t),c_{x_{\text{eval}}}(t)\big)}{\sum_t \max\!\big(c_{x_{\text{train}}}(t),c_{x_{\text{eval}}}(t)\big)}. $$ |
| **Length** | Length Ratio | (Content-blind) with sequence length  $$ \lVert x\rVert $$  :  $$ d(x_{\text{train}},x_{\text{eval}})=1-\frac{\min(\lVert x_{\text{train}}\rVert,\lVert x_{\text{eval}}\rVert)}{\max(\lVert x_{\text{train}}\rVert,\lVert x_{\text{eval}}\rVert)}. $$ |

![Figure 8: Similarity of eval vs closest train trajectories](https://alexzhang13.github.io/assets/img/lm_compo/fig7_trajectory_similarity.png)

Figure 8. Across the 5/6 length generalization experiments that include a base Transformer and the 3 strategy generalization experiments, we plot the average distance of the eval trajectories of the best training checkpoint to its nearest training trajectory it has seen before. We plot across 5 different distance metrics to highlight how much closer RLM trajectories on unseen tasks look than an appended context baseline like a base Transformer.

Figure 8 illustrates the general point that the root LM’s trajectories share more similarities to the trajectories it sees during training, which primarily comes from context offloading. However, the plots above don’t fully capture the semantic similarities between these trajectories (e.g. it doesn’t say anything about if the RLM generally chooses the same decomposition strategy as its train trajectories).

A more principled distance metric will factor in token similarity and semantic similarity, but it is at least clear from the proxy metrics above that what the RLM’s individual LM calls see, even across a longer time horizon, are much closer to what they may see during training than just a base LM call.

<!-- codex-learning-note:start id="figure-8" -->
> [!note] 中文学习笔记
> Figure 8 的多个指标都试图回答：对每条 eval 轨迹，历史 train 轨迹中最接近的一条有多相似。RLM 在这些代理指标上通常更接近训练轨迹，符合“上下文卸载让根调用保持熟悉”的解释；但作者也明确承认，词元相似不能完整代表语义或分解策略相同。
<!-- codex-learning-note:end -->

### Acknowledgements

Special thanks to Braden Hancock and the Laude Institute for generously providing several 8xH100 nodes on short notice to help run these experiments through the Laude Slingshots program. Alex thanks his wonderful labmates at MIT OASYS and Noah Ziems for helpful feedback while writing the blog.

<!-- codex-learning-note:start id="section-rlm-evidence" -->
> [!note] 中文学习笔记
> **全文证据小结：**文章用长度外推、跨领域迁移和轨迹相似度三组证据支持同一个假设：当 harness 让根模型在不同任务中看到更一致的控制轨迹时，训练收益更容易迁移。限制包括额外运行成本、可能学到短任务捷径，以及“轨迹等价”尚缺乏严格而语义充分的度量。
<!-- codex-learning-note:end -->

## Citation

You can cite this blog here:

```
@article{zhang2026harnesses,
  title   = "Language model harnesses are compositional generalizers",
  author  = "Zhang, Alex and Khattab, Omar",
  year    = "2026",
  month   = "July",
  url     = "https://alexzhang13.github.io/blog/2026/harness/"
}
```

### Footnotes

1. For the sake of being pedantic, in order for this equivalence class construction to hold, we need some notion of "equivalence" to be based on fitting inside of an epsilon-ball centered at some point in trajectory / token-space under some distance metric, rather than purely distance between two trajectories. If this doesn't make sense just ignore it, but if you're curious how we can collapse "similar" trajectories to the same equivalence class without breaking transitivity, this is how.
2. Notably, the argument below holds recursively, as we can treat each offloaded sub-agent as its own instance with its own “main” context. This is the intended design of an RLM being recursive, but it is not strictly necessary for maintaining locally in-distribution observations.

### References

[^1]: The Mismanaged Geniuses Hypothesis   [\[link\]](https://alexzhang13.github.io/blog/2026/mgh/)  
Zhang, A., Li, Z. and Khattab, O., 2026.

[^2]: Exploring Length Generalization in Large Language Models   [\[PDF\]](http://arxiv.org/pdf/2207.04901.pdf)  
Anil, C., Wu, Y., Andreassen, A., Lewkowycz, A., Misra, V., Ramasesh, V., Slone, A., Gur-Ari, G., Dyer, E. and Neyshabur, B., 2022.

[^3]: ReAct: Synergizing Reasoning and Acting in Language Models   [\[PDF\]](http://arxiv.org/pdf/2210.03629.pdf)  
Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K. and Cao, Y., 2023. International Conference on Learning Representations.

[^4]: Executable Code Actions Elicit Better LLM Agents   [\[PDF\]](http://arxiv.org/pdf/2402.01030.pdf)  
Wang, X., Chen, Y., Yuan, L., Zhang, Y., Li, Y., Peng, H. and Ji, H., 2024. International Conference on Machine Learning.

[^5]: Batch size-invariance for policy optimization   [\[PDF\]](http://arxiv.org/pdf/2110.00641.pdf)  
Hilton, J., Cobbe, K. and Schulman, J., 2022. Advances in Neural Information Processing Systems.
