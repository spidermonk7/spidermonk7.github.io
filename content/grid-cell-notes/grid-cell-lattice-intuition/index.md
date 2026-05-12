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

This first note starts from a more basic hypothesis: grid-like firing may emerge from the interference of several theta-related traveling waves, and the relative phases of those waves determine where firing is strong.

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

so the three wave components differ by $60^\circ$ in orientation. A minimal superposition model is then

$$
s(x) = \frac{1}{3} \sum_{k=1}^{3} w_k(x),
$$

followed by a simple firing readout

$$
g(x) = f(s(x)),
$$

where $f$ is a thresholding or sharpening nonlinearity. This is still not a full grid-cell theory, but it is a clean way to visualize how relative phase can sculpt the final firing map.

## What to look for

The main qualitative effects are:

- With one wave, the response is just a striped spatial modulation.
- With two waves, interference appears, but it is still not grid-like.
- With three waves at 60-degree offsets, the superposition can support hexagonal firing structure.
- Changing the relative theta phases shifts where constructive interference happens.
- Increasing the readout nonlinearity sharpens peaks and makes the field look more cell-like.

## Interactive sketch

Use the controls below to vary the wavelength, orientation, and the three relative theta phases. The point of this demo is not to jump directly to the final grid pattern, but to show the path from one wave, to two-wave interference, to three-wave superposition and firing.

{{< gridcell-lattice-demo >}}

## Why this is only a starting point

This picture is helpful, but it is incomplete.

Real grid-cell theory quickly brings in questions such as:

- Why are multiple modules needed?
- How does path integration update phase over time?
- What dynamical mechanism stabilizes the lattice?
- How does a population of grid cells support decoding?

Those are the questions I want this column to gradually move toward. For now, the point is narrower: build a manipulable geometric intuition before moving into full coding theory or attractor dynamics.
