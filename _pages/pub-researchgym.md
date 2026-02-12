---
permalink: /publications/researchgym/
title: "ResearchGym: Evaluating AI Agents in the Full Scientific Inquiry Loop"
---

**Under Review — ICML 2026**{: .notice--warning}

---

## Abstract

While LLM-based agents are increasingly applied to scientific workflows, a fundamental question remains: Are current models truly qualified for the dynamic and uncertain process of scientific discovery? Existing evaluations, often limited to static tasks, fail to distinguish between genuine reasoning and rote memorization.

ResearchGym is a diagnostic environment designed to probe the epistemic limits of agents by formalizing scientific inquiry into interactive "Research Trees." By representing research as directed acyclic graphs (DAGs) of logical dependencies, ResearchGym simulates the full scientific inquiry loop --- from initial hypothesis formulation and study design to result interpretation and belief updating.

## Key Findings

- **Erosion of Marginal Capabilities:** As agents engage in long-horizon interactions, they exhibit "cognitive tunneling," where critical judgment degrades significantly compared to intrinsic baselines
- **Interpolation-Extrapolation Boundary:** Agent performance drops on papers published after their training data cutoff, implying competence is driven by parametric memory rather than extrapolative reasoning
- Built the **RG-30** benchmark: a curated suite of 30 interactive environments from CNS-level neuroscience papers
