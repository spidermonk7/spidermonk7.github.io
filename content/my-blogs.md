---
title: My Blogs
date: 2026-03-18
type: landing
aliases:
  - /post/

design:
  spacing: '4.5rem'

sections:
  - block: markdown
    content:
      title: My Blogs
      subtitle: 记录我最近看到的、学到的、做到的。
      text: |-
        这是我的公开学习日志。

        我用统一结构持续记录：
        - 今天看到的
        - 今天学到的
        - 下一步行动

        每篇都尽量简短、具体、可复用。
    design:
      columns: '1'

  - block: collection
    content:
      title: All Blog Notes
      filters:
        folders:
          - post
    design:
      view: article-grid
      columns: 3
---
