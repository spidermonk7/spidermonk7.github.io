---
title: "Grid Cell Notes 01: Lattice Intuition from Three Plane Waves"
date: 2026-05-12
math: true
summary: "A first note on how hexagonal grid-like fields can emerge from the interference of three oriented periodic components."
tags:
  - Grid Cell
  - Computational Neuroscience
  - Mathematical Modeling
authors:
  - admin
---

This column is meant to be a running notebook. I do not want it to be limited to prose. For grid cells, intuition often becomes much clearer when formulas and visual structure are placed side by side, and even clearer when some parameters can be manipulated directly.

This first note starts from a minimal mathematical picture: a grid-like field as the interference pattern of three periodic components arranged at roughly 60-degree offsets.

## A minimal interference model

Let the 2D position be $x \in \mathbb{R}^2$. A simple way to write a periodic spatial response is:

$$
g(x) = \sum_{k=1}^{3} \cos\left( \frac{2\pi}{\lambda} u_k^\top (x - \phi) \right),
$$

where:

- $\lambda$ controls the spatial scale
- $\phi \in \mathbb{R}^2$ is a phase offset
- $u_k$ are unit vectors pointing in three preferred directions

One common choice is

$$
u_k =
\begin{bmatrix}
\cos(\theta + 2\pi k / 3) \\
\sin(\theta + 2\pi k / 3)
\end{bmatrix},
\qquad k = 0,1,2
$$

so the three wave components differ by $60^\circ$ in orientation. The resulting superposition is not yet a full biophysical model of a grid cell, but it already captures the geometric regularity that makes the code interesting.

## What to look for

The main qualitative effects are:

- Increasing the scale stretches the lattice spacing.
- Rotating the preferred directions rotates the whole pattern.
- Changing the phase translates the lattice without changing its geometry.
- Increasing nonlinearity sharpens peaks and makes the field look more cell-like.

## Interactive sketch

Use the controls below to vary the lattice scale, orientation, phase, and sharpness. This is only a compact visualization, but it is already useful for developing intuition about what a structured periodic code is actually doing in space.

{{< gridcell-lattice-demo >}}

## Why this is only a starting point

This picture is helpful, but it is incomplete.

Real grid-cell theory quickly brings in questions such as:

- Why are multiple modules needed?
- How does path integration update phase over time?
- What dynamical mechanism stabilizes the lattice?
- How does a population of grid cells support decoding?

Those are the questions I want this column to gradually move toward. For now, the point is narrower: build a manipulable geometric intuition before moving into full coding theory or attractor dynamics.
