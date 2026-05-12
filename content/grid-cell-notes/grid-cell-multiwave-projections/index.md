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

And along the actual movement direction, the spacing associated with wave $i$ is

$$
d_i=vT_i=\frac{2\pi}{\beta\cos\theta_i}.
$$

So once multiple preferred directions are present, the effective spatial periodicity is no longer the same for all waves. It is modulated by the projection factor $\cos\theta_i$.

## One wave

With only one wave, the result is still a stripe-like grating. The firing field is periodic in one direction only, so this is not yet a full 2D grid.

## Two waves

With two waves, two stripe families interfere.

Qualitatively, this gives:

- crossings between the two stripe systems
- elongated or rhombic interference structure
- stronger spatial localization than one wave alone

But in general, two waves are still not enough to produce the familiar hexagonal grid-cell pattern. The geometry remains too anisotropic.

## Three waves

With three waves, the picture changes qualitatively.

If the three preferred directions are arranged with roughly symmetric angular offsets, then the stripe families can overlap in a much more balanced way. In that case, constructive interference can recur at localized positions across the plane, producing a grid-like firing layout.

This is the core geometric intuition:

- one wave gives one stripe family
- two waves give crossings and interference structure
- three appropriately arranged waves can support a 2D grid-like firing pattern

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

The left panel shows the active waves and their superposition in a 1D slice. The right panel shows the corresponding 2D firing pattern.

{{< gridcell-multiwave-demo >}}

## What this note adds

Compared with Note 01, the conceptual change is small but important:

1. Motion is no longer assumed to be aligned with every wave.
2. Each wave sees only the projected component $v\cos\theta_i$.
3. Different waves therefore drift against the pacemaker at different rates.
4. Their combined interference can move from stripes to crossings and eventually to grid-like firing.

The next step after this note is to stop treating the pattern as static geometry and instead directly simulate phase accumulation while a rat moves through space.
