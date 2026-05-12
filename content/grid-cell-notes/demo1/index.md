---
title: "demo1"
date: 2026-05-12
summary: "A first dynamic demo: steer a rat through a 2x2 arena, watch phase-driven waves evolve, and accumulate a fading grid-cell firing map."
tags:
  - Grid Cell
  - Computational Neuroscience
  - Interactive Demo
authors:
  - admin
---

This page is the first step from static geometry toward an actual moving-animal simulation.

The setup is intentionally simple:

- the arena is a fixed $2\times 2$ square
- the rat is controlled by `W`, `A`, `S`, `D`
- the right side shows four moving waves: `theta`, `wave 1`, `wave 2`, `wave 3`
- the middle panel accumulates the cell's firing as the rat moves

The heatmap keeps earlier firing locations, but gradually fades them, so the spatial pattern can emerge from the trajectory itself rather than from a pre-drawn lattice.

{{< gridcell-rat-walk-demo >}}
