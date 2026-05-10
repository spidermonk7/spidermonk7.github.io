---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  spacing: "4rem"

sections:
  - block: resume-biography-3
    content:
      username: admin
      text: ""
      button:
        text: View CV
        url: uploads/cv_shaoyang_cui-3.pdf
    design:
      css_class: "home-hero"

  - block: markdown
    id: research-focus
    content:
      title: Current Directions
      subtitle: ""
      text: |-
        My core interest lies in deconstructing the concept of intelligence through the lens of Cognitive Science and Neuroscience to architect next-generation AI and step towards AGI. 

        - **Cognitive Models** top-down work on theory-of-mind(ToM), consciousness, internal representations, and world-model-like structure.
        - **Neural Computation** bottom-up models inspired by neural circuits and detailed neuron dynamics.
        - **Agentic Systems** practical research on LLM agents, workflow design, evaluation, and failure analysis in real tasks.

        Currently, I am focused on bridging these disciplines to investigate the functional mechanisms of Theory-of-Mind (ToM) within Large Language Models, seeking to discern whether their emergent behaviors stem from genuine cognitive reasoning or sophisticated statistical mimicry.

        I am open to collaborations and internship opportunities in Cognitive Science, Artificial Intelligence and computational neuroscience.
    design:
      css_class: home-research
      columns: "1"

  - block: collection
    content:
      title: Selected Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      css_class: home-featured
      view: article-grid
      columns: 2

  - block: collection
    content:
      title: Current Projects
      subtitle: Follow active experiments and current builds.
      filters:
        folders:
          - ongoing-projects
    design:
      css_class: home-stream
      view: article-grid
      columns: 2

  - block: collection
    content:
      title: Recent Notes
      subtitle: Recent notes on what I read, practiced, and learned.
      filters:
        folders:
          - post
      count: 4
    design:
      css_class: "home-stream home-stream-alt"
      view: article-grid
      columns: 2
---
