---
title: "Grid Cell Demo 03: From Grid Cells to fMRI Hexadirectional Signal"
date: 2026-05-14
summary: "Why random spatial phases can cancel voxel-level grid fields while six-fold directional modulation survives in Right EC BOLD."
tags:
  - Grid Cell
  - fMRI
  - Entorhinal Cortex
  - Interactive Demo
authors:
  - admin
math: true
---

This demo addresses one specific conceptual question:

Why can different spatial phases wash out voxel-level grid firing fields in fMRI, but not necessarily wash out the 60-degree periodic signal?

The mechanism is a separation of what is phase-sensitive vs what is phase-insensitive at the population level.

## Short intuition

For a single cell, a simplified spatial response can be written as

$$ r_i(x)=f\!\left(\sum_{m=1}^{3}\cos(k_m^\top x+\varphi_{im})\right), $$

where $\varphi_{im}$ are cell-specific phases.

Inside one voxel, fMRI averages many cells:

$$ \bar r(x)=\frac{1}{N}\sum_{i=1}^{N} r_i(x). $$

If phases $\varphi_{im}$ are spread out, peaks of some cells align with troughs of others at the same position, so the position-locked lattice contrast is reduced in the average.

But the directional component is modeled as a shared orientation-dependent term, for example:

$$ h_i(\theta)\propto \cos(6(\theta-\phi)), $$

with roughly common $\phi$ in a local EC population. This term has the same 60-degree periodic structure across cells, so averaging does not cancel it in the same way.

After HRF convolution, the voxel BOLD can still show detectable hexadirectional modulation.

## What to try in the demo

1. Increase `cells per voxel` and keep `phase distribution = uniform`.
   - You should see **single-cell spatial map** keep structure while **voxel map** gets flatter.
2. Keep many cells but raise `hex amplitude`.
   - `beta_hex` and `Aligned - Misaligned` usually remain positive.
3. Edit `HRF kernel`.
   - You can test how temporal smoothing reshapes the final BOLD-level directional profile.
4. Switch phase distribution between `uniform`, `clustered`, and `bimodal`.
   - Clustered phases preserve more spatial contrast; uniform phases cancel more.

{{< gridcell-fmri-demo >}}
