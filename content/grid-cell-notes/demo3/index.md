---
title: "Grid Cell Demo 03: From Grid Cells to fMRI Hexadirectional Signal"
date: 2026-05-14
summary: "A voxel-level fMRI demo: generate synthetic Right EC BOLD, decode population phi with train/test GLM, and compare recovered orientation against ground truth."
tags:
  - Grid Cell
  - fMRI
  - Entorhinal Cortex
  - Interactive Demo
authors:
  - admin
math: true
---

This demo now focuses only on voxel-level fMRI outputs and decoding.

Core intuition:

1. Within one voxel, many cells with different spatial phases can reduce position-locked map contrast after averaging.
2. But if local cells share a similar grid orientation $\phi$, the six-fold directional term can survive at population level.
3. After HRF convolution, we can still decode hexadirectional structure from BOLD.

Decoding protocol in this page:

1. Use first half of time points as training data.
2. Fit $\cos(6\theta)$ and $\sin(6\theta)$ GLM terms to estimate population $\hat\phi$.
3. Use second half as test data.
4. Build test regressor $\cos(6(\theta-\hat\phi))$ and estimate test $\beta_{\text{hex}}$.
5. Compare recovered $\hat\phi$ against ground-truth $\phi$ (modulo 60 degrees).
6. Visualize aligned vs misaligned bins and directional preference on a 360-degree polar plot.

You can customize:

- voxel cell count
- initial phase distribution
- HRF kernel
- signal/noise settings
- trajectory length

and inspect how recovery quality changes.

{{< gridcell-fmri-demo >}}
