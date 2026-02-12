---
permalink: /publications/researchgym/
title: "ResearchGym: Evaluating AI Agents in the Full Scientific Inquiry Loop"
---

**Under Review — ICML 2026**{: .notice--warning}

---

## Motivation

![Scientific Inquiry Loop](/Papers/UnderReview/ResearchGym/researchgym_1.png)

Real scientific research is not a one-shot task --- it is an iterative *inquiry loop*. Researchers (1) formulate questions, (2) generate hypotheses, (3) design studies, (4) conduct experiments, and then report results back to refine their understanding, eventually reaching (5) a solution. While LLM-based agents are increasingly applied to scientific workflows, existing benchmarks typically evaluate only fragments of this lifecycle, making it difficult to assess whether an agent can sustain coherent reasoning across the full process.

## Benchmark Coverage

![Benchmark Comparison](/Papers/UnderReview/ResearchGym/table1.png)

The table above compares ResearchGym's coverage against 14 existing benchmarks across four key stages: subtopic proposal, study design, study execution, and result analysis. Most prior work covers only a subset of the lifecycle. **RG-30** is the first benchmark to cover subtopic proposal, study design, and result analysis together, enabling end-to-end evaluation of the scientific inquiry loop.

## The ResearchGym Framework

![ResearchGym Framework](/Papers/UnderReview/ResearchGym/researchgym.png)

ResearchGym formalizes each research project as a **Research Tree** --- a directed acyclic graph (DAG) of logical dependencies with four node types: Topic, Subtopic, Study-Result, and Conclusion. The left panel shows the tree structure; the right panel illustrates the interactive inquiry loop between the agent and the environment.

At each step, the environment presents a research direction and asks the agent to propose a study. The environment then refines the proposal, executes the study, and returns results. The agent must interpret findings, update beliefs, and decide whether to explore new subtopics, redo studies, or draw conclusions. This multi-turn interaction captures the iterative, feedback-driven nature of real scientific discovery.

## Key Findings

- **Erosion of Marginal Capabilities:** As agents engage in long-horizon interactions, they exhibit "cognitive tunneling" --- their critical judgment and ability to detect anomalies degrades significantly compared to their intrinsic baselines
- **Interpolation-Extrapolation Boundary:** Agent performance drops sharply on papers published after their training data cutoff, implying that apparent competence is driven largely by parametric memory rather than genuine extrapolative reasoning
- These findings highlight that scaling context alone is insufficient; achieving qualified AI scientists may require architectural innovations or strong human supervision
