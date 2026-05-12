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

This first note starts from a more basic hypothesis: grid-like firing may emerge progressively as theta-related plane waves are introduced one by one, and the relative phase of each wave with respect to the theta rhythm changes where constructive interference produces strong firing.

## A minimal interference model

Let the 2D position be $x \in \mathbb{R}^2$. A simple way to write each traveling component is:

$$
w_k(x) = \cos\left( \frac{2\pi}{\lambda} u_k^\top x + \varphi_k \right),
$$

where:

- $\lambda$ controls the spatial scale
- $\varphi_k$ is the phase of the $k$-th wave relative to the theta rhythm
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

Each wave by itself only creates a periodic stripe-like modulation. The key step is the accumulation:

$$
s(x) = \frac{1}{3} \sum_{k=1}^{3} w_k(x),
$$

followed by a simple firing readout

$$
g(x) = f(s(x)),
$$

where $f$ is a thresholding or sharpening nonlinearity. In that sense, the conceptual order is:

- introduce one wave and inspect its firing effect
- introduce a second wave and observe how phase difference creates interference
- introduce a third wave and see how the firing map becomes more grid-like

This is still not a full grid-cell theory, but it is a clean way to visualize how relative phase can sculpt the final firing map.

## What to look for

The main qualitative effects are:

- With only wave 1, the firing result is still stripe-like.
- Adding wave 2 introduces interference structure, and the phase difference between the two waves begins to matter.
- Adding wave 3 makes the full interference geometry available and can support localized grid-like peaks.
- Changing a wave's phase relative to theta shifts where constructive interference lands in space.
- Changing wave orientation changes the geometry of the interference pattern itself.
- Increasing the readout nonlinearity sharpens peaks and makes the firing map look more cell-like.

## Interactive sketch

Use the tabs below to progressively introduce wave 1, wave 2, and wave 3. For each active wave, you can set its orientation, amplitude, and phase relative to theta. The upper region visualizes the raw wave superposition, while the lower region shows the grid cell firing map produced after the firing readout. This keeps the progression from plane waves to firing explicit.

{{< gridcell-lattice-demo >}}

## Why this is only a starting point

This picture is helpful, but it is incomplete.

Real grid-cell theory quickly brings in questions such as:

- Why are multiple modules needed?
- How does path integration update phase over time?
- What dynamical mechanism stabilizes the lattice?
- How does a population of grid cells support decoding?

Those are the questions I want this column to gradually move toward. For now, the point is narrower: build a manipulable geometric intuition before moving into full coding theory or attractor dynamics.
