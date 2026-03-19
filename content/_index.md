---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "5rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/cv_shaoyang_cui.pdf
    design:
      css_class: dark
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
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

        **Top-down**: Investigating high-level cognitive phenomena such as intention, consciousness, and world modeling.

        **Bottom-up**: Building biologically grounded computational models inspired by neural systems and circuit-level mechanisms.

        I am open to collaborations and internship opportunities in neuroscience and NeuroAI.
    design:
      columns: "1"

  - block: collection
    content:
      title: Ongoing Projects
      subtitle: Follow the active experiments and builds.
      filters:
        folders:
          - ongoing-projects
    design:
      view: article-grid
      columns: 3

  - block: collection
    id: myblogs
    content:
      title: My Blogs
      subtitle: Notes on what I recently read, practiced, and learned.
      filters:
        folders:
          - post
    design:
      view: article-grid
      columns: 3

  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 1

  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation

  - block: collection
    id: talks
    content:
      title: Recent & Upcoming Talks
      filters:
        folders:
          - event
    design:
      view: article-grid
      columns: 1

  - block: collection
    id: awards
    content:
      title: Awards & Honors
      filters:
        folders:
          - award
    design:
      view: article-grid
      columns: 2
---
