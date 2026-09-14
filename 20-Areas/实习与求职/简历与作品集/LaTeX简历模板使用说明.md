---
type: resume-template-guide
status: ready
tags:
  - topic/career
---

# LaTeX 简历模板使用说明

## 模板来源

- [用户提供的介绍页面](https://tiankuizhang.github.io/files/00CV_CN/)
- [实际模板仓库 billryan/resume 的中文分支](https://github.com/billryan/resume/tree/zh_CN)
- [上游压缩包](https://github.com/billryan/resume/archive/zh_CN.zip)
- 下载日期：2026-09-09。
- 原始压缩包大小：104,475,597 字节（约 99.6 MiB）；50 个压缩包条目，已通过 ZIP CRC 完整性检查。

介绍页面指向上述开源模板。本次保存的是中文分支的完整源代码与依赖文件，并非网页作者个人简历 PDF 的源文件。

## 本地入口

- [[20-Areas/实习与求职/简历与作品集/LaTeX简历模板-billryan/resume-zh_CN/resume-zh_CN.tex]]：中文简历主文件。
- [[20-Areas/实习与求职/简历与作品集/LaTeX简历模板-billryan/resume-zh_CN/resume.tex]]：英文简历。
- [[20-Areas/实习与求职/简历与作品集/LaTeX简历模板-billryan/resume-zh_CN/resume_photo.tex]]：带照片的示例。
- [[20-Areas/实习与求职/简历与作品集/LaTeX简历模板-billryan/resume-zh_CN/README.md]]：上游详细说明。
- [[20-Areas/实习与求职/简历与作品集/LaTeX简历模板-billryan/resume-zh_CN.zip]]：原始压缩包备份。

## 开始使用

- 建议先复制整个源码文件夹作为个人简历工作副本，保留原始模板。
- 修改中文主文件中的姓名、联系方式、教育背景、经历和技能；示例内容不代表你的真实经历。
- 保持主文件与同目录的样式文件、字体文件夹一起使用，勿只复制一个 tex 文件。
- 在源码目录下选择 XeLaTeX 编译器，编译中文主文件：

```text
xelatex resume-zh_CN.tex
```

- 也可以将完整压缩包上传到 Overleaf，选择中文主文件，并将编译器设为 XeLaTeX。
- 文献引用、字体切换和格式定制方法见上游 README。
- 当前电脑可检测到 XeLaTeX，但本次仅下载和检查文件完整性，未执行编译或安装额外宏包。
- 编译产生的日志和临时文件放到知识库的 tmp 目录；正式简历 PDF 可保存到简历与作品集或统一的附件目录。

## 许可

上游模板为 MIT 许可，完整 LICENSE 随源码保存；上游明确说明字体不包含在该 MIT 授权范围内，字体使用以各自许可为准。

## 相关导航

- [[50-Maps/实习与求职]]
- [[20-Areas/实习与求职/简历与作品集/蓝色单栏简历模板使用说明]]
