---
permalink: /publications/tradecraft/
title: "Implicit Theory of Mind in LLM Agent Decision-Making"
---

**Under Review — ICLR 2026**{: .notice--warning}

---

## Overview

![TradeCraft Game Overview](/Papers/UnderReview/tradeCraft/tradecraft.png)

Theory of Mind (ToM) is often claimed to emerge in large language models, yet it remains unclear whether LLM-based agents implicitly rely on ToM during concrete decision-making rather than explicit verbal reasoning. We study this question in TradeCraft --- a turn-based multi-player trade-and-craft game where players negotiate, trade items, and synthesize new ones according to Minecraft-inspired crafting rules. Each player holds a private crafting goal, and must strategically acquire resources through social interaction while concealing their true intentions.

As shown above, during the **Trade** phase, agents propose and respond to offers with natural language messages, engaging in deception and strategic reasoning (e.g., Steve hides his real target while requesting resources). In the **Craft** phase, agents use accumulated items to execute crafting chains toward their goals.

## ToM Measurement Protocol

![ToM Demo](/Papers/UnderReview/tradeCraft/tom_demo.png)

We augment agents' decision processes with explicit Theory of Mind structures of varying orders. The figure above illustrates how an agent's reasoning unfolds across proposal and crafting stages. On the right, we show how **zero-order** vs **first-order** ToM affects item value estimation: with first-order ToM, agents form beliefs about opponents' goals and adjust their valuations accordingly, leading to more strategic accept/reject decisions.

## Task Difficulty

![Difficulty Chart](/Papers/UnderReview/tradeCraft/diff_chain.png)

TradeCraft supports configurable difficulty through its compositional crafting system. The difficulty chart plots **chain length** (number of crafting steps to reach the target) against **trade count** (number of trades needed), with circle size indicating occurrence frequency. The inset shows an example crafting route with branching dependencies and probabilistic smelting outcomes, demonstrating the combinatorial complexity agents must navigate.

## Results: Heterogeneous ToM Effects Across Models

![Trend Results](/Papers/UnderReview/tradeCraft/trend.png)

A key finding is that increasing ToM order produces **qualitatively opposite trends** across different models. The figure plots **Decision Consistency** (how well beliefs align with actions) against **Strategic Slope** (how strategically agents value items) for zero-order, first-order, and second-order ToM across GPT-4o, O3, O4-mini, and GPT-5 (Medium).

- **GPT-4o** shows a clear upward trajectory: higher ToM order leads to both more strategic valuations and more consistent decisions
- **O3** exhibits a similar but more moderate positive trend
- **O4-mini** and **GPT-5** show mixed or even reversed patterns, suggesting that explicit ToM scaffolding can sometimes degrade performance in certain model architectures

These heterogeneous effects reveal that higher-order mental state reasoning is incorporated into decision policies in qualitatively different ways across models.
