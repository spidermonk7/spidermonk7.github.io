---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

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
      title: '📚 My Research'
      subtitle: ''
      text: |-
        My research focuses on understanding and explaining the essence of Intelligence, aspiring to create Artificial General Intelligence (AGI). I pursue this goal through two complementary approaches:

        **Top-down**: Analyzing and interpreting intelligence from a macroscopic perspective, focusing on studies of intention, consciousness, and world models. I leverage existing AI technologies to explain and replicate intelligent phenomena.

        **Bottom-up**: Based on computational neuroscience, I aim to mimic the computational logic of biological intelligence through detailed models, including brain-like architectures, brain region analysis, and simulation of detailed neuron models.
        
        I am actively seeking internship opportunities in neuroscience laboratories to gain hands-on experimental experience. Please reach out to collaborate! 🧠
    design:
      columns: '1'
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
      columns: 2
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
