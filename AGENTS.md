# Repository Guidelines

## 项目结构与内容组织

这是一个 Obsidian 知识库，不包含可构建的应用代码。按 PARA 思路存放内容：`00-Inbox/` 用于待整理的快速记录；`10-Projects/` 为有明确终点的项目；`20-Areas/` 为持续关注的领域；`30-Resources/` 收录课程、论文、书籍和工具资料；`40-Archive/` 存放已结束内容；`50-Maps/` 放主题导航（MOC）。

新笔记先进入 `00-Inbox/`，整理后移动到对应主题目录。图片、PDF 等原始附件放在 `_Assets/images/`、`_Assets/pdfs/`；临时导出或中间文件放 `tmp/`，不要把它们当作正式知识内容。复用 `_Templates/` 中的模板创建结构化笔记。

## 笔记格式与命名

使用 UTF-8 编码的 Markdown。文件名应简短、可搜索，并优先使用清晰的中文主题名，例如 `Programmatic Tool Calling.md` 或 `编码技巧.md`；避免无意义的 `新建笔记.md`、`test.md`。

笔记以一个一级标题开头，并在需要分类时使用 YAML frontmatter。沿用已有字段和值，例如：

```yaml
---
type: book-note
status: unread
tags: [type/book-note]
---
```

标题层级从 `#` 递进，不跳级；列表使用 `- `。引用库内内容时使用 Obsidian 链接，如 `[[AI 与 Coding]]`。新增或整理主题笔记后，至少链接一个相关 MOC，并在相应的 `50-Maps/` 导航页补充入口。

## 校验与本地使用

没有构建、格式化或自动化测试命令。提交前请在 Obsidian 中打开笔记，确认 Markdown 渲染正常、内部链接可解析、附件路径存在，且 YAML 分隔符和缩进有效。不要编辑 `.obsidian/workspace.json` 等个人工作区状态文件，除非任务明确涉及仓库配置。

## 提交与评审

当前目录没有 Git 历史，因此没有既定提交格式。若后续纳入版本控制，使用简洁的祈使式提交信息，例如 `docs: 添加 PTC 概念笔记`。变更说明应列出新增或移动的笔记、更新的 MOC 及附件；涉及图片或复杂排版时附上 Obsidian 预览截图。避免在同一变更中混入无关的批量重命名或配置改动。
