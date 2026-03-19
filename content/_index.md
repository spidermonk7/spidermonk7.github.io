---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  spacing: "5rem"

sections:
  - block: resume-biography-3
    content:
      username: admin
      text: ""
      button:
        text: Download CV
        url: uploads/cv_shaoyang_cui.pdf
    design:
      css_class: dark
      background:
        color: black
        image:
          filename: background.png
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false

  - block: markdown
    content:
      title: Research Focus
      subtitle: ""
      text: |-
        I focus on understanding how intelligence emerges and how to build AI systems that are explainable, robust, and genuinely useful.

        **Top-down**: investigating high-level cognition such as intention, consciousness, and world models.

        **Bottom-up**: developing biologically grounded computational models inspired by neural systems and circuit-level mechanisms.

        I am open to collaborations and internship opportunities in neuroscience and NeuroAI.
    design:
      columns: "1"

  - block: collection
    content:
      title: Ongoing Projects
      subtitle: Follow active experiments and current builds.
      filters:
        folders:
          - ongoing-projects
    design:
      view: article-grid
      columns: 3

  - block: collection
    content:
      title: Latest from My Blogs
      subtitle: Recent notes on what I read, practiced, and learned.
      filters:
        folders:
          - post
      count: 3
    design:
      view: article-grid
      columns: 3

  - block: collection
    content:
      title: Selected Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 1
---
