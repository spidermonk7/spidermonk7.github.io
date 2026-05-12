---
title: "Grid Cell Notes 02: Multiple Waves and Velocity Projection"
date: 2026-05-12
math: true
summary: "Extend the oscillatory-interference picture to multiple waves by fixing the movement direction and projecting velocity onto each preferred direction through cos(theta_i)."
tags:
  - Grid Cell
  - Computational Neuroscience
  - Mathematical Modeling
authors:
  - admin
---

In the first note, I only kept the simplest aligned case: one wave, one preferred direction, and motion parallel to that direction. That already gives a clean stripe-like firing periodicity with spacing

$$
d=\frac{2\pi}{\beta}.
$$

Now I want to move one step closer to the full grid-cell picture by introducing multiple waves.

## Fixed movement direction, multiple preferred directions

I now assume:

- the animal moves at constant speed $v$
- the movement direction is fixed
- wave $i$ has preferred direction $\theta_i$
- $\Phi_0$ is still the background pacemaker phase

The projection of velocity onto wave $i$ is

$$
v\cos\theta_i,
$$

where $\theta_i$ is the angular difference between the fixed movement direction and the preferred direction of wave $i$.

So the frequency of wave $i$ becomes

$$
\omega_i=\omega_0+\beta v\cos\theta_i.
$$

The relative phase drift satisfies

$$
\frac{d}{dt}\Delta\Phi_i=\omega_i-\omega_0=\beta v\cos\theta_i.
$$

Therefore, the re-alignment period of wave $i$ is

$$
T_i=\frac{2\pi}{\beta v\cos\theta_i}.
$$

If I care about the distance measured along wave $i$'s own preferred direction, then during one re-alignment period the effective displacement is the projected velocity multiplied by the period:

$$
d_i=(v\cos\theta_i)T_i=\frac{2\pi}{\beta}.
$$

So the key point is:

- the time between two re-alignments depends on $\cos\theta_i$
- but the distance measured along the preferred direction of that wave is still the same constant $2\pi/\beta$

The projection factor changes how quickly phase accumulates in time, not the preferred-direction spacing set by $\beta$.

## One wave

With only one preferred direction, the picture is still the stripe case from Note 01. The wave repeatedly re-aligns with the pacemaker after every projected distance

$$
\frac{2\pi}{\beta},
$$

so the firing pattern is a family of parallel bands orthogonal to that wave vector.

## Two waves

Now add a second preferred direction. Each wave has its own projected phase drift,

$$
\frac{d}{dt}\Delta\Phi_1=\beta v\cos\theta_1,\qquad
\frac{d}{dt}\Delta\Phi_2=\beta v\cos\theta_2.
$$

Each wave alone would define its own stripe family. When both are present, the firing pattern is strongest where the two stripe families cross. So the geometry is no longer a single banded pattern; it becomes a lattice of pairwise crossings.

The main role of $\theta_1$ and $\theta_2$ is to control the angle between those two stripe families, and therefore the shape and spacing of the crossing structure.

## Three waves

Adding a third preferred direction gives a third stripe family. Now the most salient firing locations are the points where all three families come into alignment at once.

This is the step that moves the picture from simple stripe crossings toward the familiar grid-like arrangement. In the symmetric case, when the preferred directions are separated in a balanced way, the triple intersections become distributed across space in a regular pattern.

So in this note the logic is:

1. each wave contributes a stripe family
2. each stripe family is controlled by its projected phase drift
3. pairwise crossings already create localized structure
4. three-wave crossings push that structure toward a grid-cell-like firing pattern
## A geometric superposition picture

A simple geometric way to write the multi-wave field is

$$
w_i(x)=\cos(k_i^\top x+\phi_i),
$$

where the orientation of $k_i$ is tied to $\theta_i$.

Then the combined field is

$$
s(x)=\frac{1}{N}\sum_{i=1}^{N} w_i(x),
$$

and the firing map is produced through a readout

$$
g(x)=f(s(x)).
$$

This is still a simplified spatial picture, but it is a useful bridge between the oscillatory phase-drift intuition and the 2D firing pattern we want to understand.

## Interactive sketch

The demo below keeps the model at this geometric-superposition level. You can introduce one wave, then two, then three, while adjusting the key parameters:

- $\beta$
- $\theta_1$
- $\theta_2$
- $\theta_3$

The left panel shows the active waves and their superposition in a 1D slice. The right panel shows each wave's stripe family in its own color, together with highlighted intersections.

{{< gridcell-multiwave-demo >}}

## What this note adds

Compared with Note 01, the conceptual change is small but important:

1. Motion is no longer assumed to be aligned with every wave.
2. Each wave sees only the projected component $v\cos\theta_i$.
3. Different waves therefore drift against the pacemaker at different rates in time.
4. Each wave still carries the same preferred-direction spacing $2\pi/\beta$.
5. Their combined interference can move from stripes to crossings and eventually to grid-like firing.

The next step after this note is to stop treating the pattern as static geometry and instead directly simulate phase accumulation while a rat moves through space.
