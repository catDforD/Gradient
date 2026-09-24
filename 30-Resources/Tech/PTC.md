---
type: concept
aliases:
  - Programmatic Tool Calling
tags:
  - type/concept
  - topic/agent
  - topic/agent/tool-calling
---

# PTC

相关：[[AI 与 Coding]] · [[OSMAS]]

> 普通 Tool Calling 把工具当成一个个按钮；PTC 把工具变成模型可以编程调用的函数库。

  ## 两种模式的根本区别

  普通 Tool Calling 的循环是：

  模型判断下一步
  → 调一个工具
  → 工具结果全部进入上下文
  → 模型再次判断
  → 再调一个工具
  → ...

  PTC 则是：

  模型生成一段程序
  → 程序自己循环、分支、并发调用工具
  → 在运行时处理全部中间结果
  → 只把最终精简结果返回模型

  也就是把每一步都需要 LLM 参与的“对话式编排”，变成“生成一次程序，然后确定性执行”。

  ## PTC 最重要的优势

  ### 1. 减少模型推理轮次

  假设要检查 50 个服务的健康状态。

  普通调用可能需要：

  1. 模型获取服务列表。
  2. 模型读取列表。
  3. 发起 50 个工具调用。
  4. 模型读取结果。
  5. 再查询失败服务的日志。
  6. 模型重新分析。

  PTC 可以直接生成：

  const services = await tools.list_services();

  const statuses = await Promise.all(
    services.map(service =>
      tools.check_health({ service_id: service.id })
    )
  );

  const failed = statuses.filter(x => !x.healthy);
  text(JSON.stringify(failed));

  50 次外部工具调用可能依然存在，但不再需要 50 次模型思考。

  因此，PTC 减少的主要是：

  - 模型 API 往返次数
  - 推理延迟
  - token 消耗
  - 模型在简单流程控制上的工作量

  注意：它不一定减少工具调用数量，而是减少“模型介入次数”。

  ### 2. 中间结果不会污染上下文

  这是现代 PTC 非常重要、甚至比控制流更实际的优势。

  例如读取一张一万行的表，只想知道：

  > 哪些员工超出了预算？

  普通 Tool Calling 往往是：

  工具返回一万行
  → 一万行进入模型上下文
  → 模型从中筛选和求和

  PTC 可以在执行环境中完成过滤：

  const expenses = await tools.get_expenses({ quarter: "Q3" });

  const totals = aggregateByEmployee(expenses);
  const exceeded = totals.filter(x => x.spent > x.budget);

  text(JSON.stringify(exceeded));

  模型最终可能只看到 5 条结果，而不是一万行原始数据。

  这带来几个效果：

  - 上下文不容易被工具结果挤满。
  - 长对话和真正重要的信息得以保留。
  - 模型不用阅读大量无关字段。
  - 大数据不会在多个工具之间反复复制。

  ### 3. 代码天然表达控制流和数据流

  一次普通 function call 只能表达：

  调用哪个函数，以及传什么参数

  程序则可以表达：

  - for 循环
  - if/else
  - 并发
  - 重试
  - 提前停止
  - 异常处理
  - 聚合和排序
  - 一个工具的结果作为另一个工具的参数

  例如：

  const users = await tools.list_users();

  for (const user of users) {
    const orders = await tools.list_orders({ user_id: user.id });

    if (orders.some(order => order.overdue)) {
      // 继续查询详细数据
    }
  }

  普通工具调用描述的是一个动作，PTC 描述的是一套策略。

  即使模型 API 支持 parallel tool calls，也主要只能解决“参数已经提前知道的一组并行调用”。PTC 还能处理后一次
  调用依赖前一次结果的情况。

  ### 4. 把确定性计算交给程序

  LLM 擅长：

  - 理解用户意图
  - 语义判断
  - 制定大致计划
  - 解释结果

  但不擅长稳定地：

  - 求和几百个数字
  - 精确复制长字符串
  - 对复杂 JSON 做 join
  - 去重和排序
  - 执行几十次相同判断
  - 在大量中间结果中保持状态

  这些正好是程序擅长的事情。

  PTC 最深层的优势可以表达为：

  > 把确定性的工作从概率模型中移出去。

  理想分工是：

  LLM：决定做什么，以及哪些地方需要语义判断
  程序：负责循环、条件、计算和数据变换
  工具：负责读取数据和影响外部世界

  ### 5. 工具之间真正变得可组合

  普通 Tool Calling 中，工具结果通常是给模型阅读的一段消息。

  PTC 中，工具结果是程序里的普通值：

  const customer = await tools.get_customer({ id: "123" });
  const orders = await tools.list_orders({
    customer_id: customer.id
  });

  因此数据传递不再依赖模型：

  - 阅读结果
  - 理解字段
  - 重新生成 JSON
  - 把它复制给下一个工具

  这会减少复制错误、字段遗漏和格式幻觉。

  ### 6. 有潜力获得更好的隐私和安全边界

  如果 PTC 运行时设计得好：

  - 沙箱里没有 API key。
  - 没有任意网络。
  - 没有任意文件系统。
  - 只能调用显式授权的工具。
  - 中间敏感数据可以不进入模型上下文。

  例如，程序可以把客户数据从工具 A 传给工具 B，但只向模型输出：

  {"updated_records": 128}

  不过这不是 PTC 自动带来的安全性。没有真正沙箱和能力限制的 PTC，反而是任意代码执行风险。

  ### 7. 更容易测试、回放和审计

  自然语言中的流程判断往往是隐式的；程序则可以保存下来：

  if (status.failed && retryCount < 2) {
    await retry();
  }

  配合执行 trace，可以看到：

  - 模型生成了什么程序
  - 程序调用了哪些工具
  - 使用了哪些参数
  - 哪一步失败
  - 最后为什么得到这个结果

  同一段程序还可以重放或做单元测试。这让 agent 从“难以观察的对话行为”更接近普通软件系统。

  ## 它并非所有场景都更好

  PTC 适合：

  - 三次以上的相关工具调用
  - 循环和批处理
  - 大型工具结果的过滤、聚合
  - 调用之间存在数据依赖
  - 确定性计算较多

  直接 Tool Calling 更适合：

  - 只需调用一个工具
  - 需要模型完整查看原始结果和引用

  所以好的系统通常是混合模式：

  查一次天气 → 直接调用

  扫描 100 个文件并归纳匹配项 → PTC


  你可以这样描述 PTC：

  > 性的控制流与数据流交给程序执行，从而减少模型推理轮次、降低上下文消耗，并提高复杂工具组合的可靠性和扩展
  > 性。

  更短一点就是：

  > PTC 的价值不是让 LLM 更会调用单个工具，而是让它能用代码组织一整套工具工作流。
