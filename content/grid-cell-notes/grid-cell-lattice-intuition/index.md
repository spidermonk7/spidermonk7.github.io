---
title: "Grid Cell Notes 01: Oscillatory Interference Along a Preferred Direction"
date: 2026-05-12
math: true
summary: "A first note on oscillatory interference when motion is aligned with a wave's preferred direction, and why the resulting firing spacing becomes a cell-specific constant."
tags:
  - Grid Cell
  - Computational Neuroscience
  - Mathematical Modeling
authors:
  - admin
---

This column is meant to be a running notebook. I do not want it to be limited to prose. For grid cells, intuition often becomes much clearer when formulas and visual structure are placed side by side, and even clearer when some parameters can be manipulated directly.

This first note focuses on the simplest case of the oscillatory-interference picture: the animal moves along the preferred direction of one wave, that wave changes frequency relative to a background pacemaker, and the drifting phase difference generates a fixed firing spacing.

## Why focus on relative phase

Before writing down formulas, the key intuition is this: in an oscillatory-interference view of grid cells, what matters is not an isolated wave by itself, but how one oscillation lines up against another.

Here the background pacemaker provides one oscillatory reference, and the direction-tuned wave provides another. If their peaks keep overlapping, the interference is strong. If they drift apart, the interference weakens.

So if we assume that a grid cell tends to fire when wave peaks align strongly enough, then the central object to track is not the absolute phase of either oscillation alone, but their **relative phase**.

That is why the quantity

$$
\Phi_i - \Phi_0
$$

becomes the natural variable. Once motion changes the frequency of the direction-tuned wave, this relative phase starts to drift. Every time the two waves come back into peak alignment, the interference becomes strong again, and that repeated re-alignment is what sets a spatial firing period.

## Symbol setup

To keep the notation fixed, I will use:

- $\theta_i$: the preferred direction of wave $i$
- $\Phi_0$: the phase of the background pacemaker in the brain
- $\Phi_i$: the phase of wave $i$
- $\omega_0$: the baseline angular frequency of the pacemaker
- $\beta$: the gain that converts motion into frequency shift
- $v(t)$: the animal's instantaneous speed

In this note, I only consider the case where the animal is moving exactly along the preferred direction of wave $i$. Under that assumption, the frequency of the wave changes according to

$$
\omega_i(t)=\omega_0+\beta v(t).
$$

So the directional dependence is absorbed into the assumption itself: I am already on the preferred axis of this wave.

## Phase drift relative to the pacemaker

The key quantity is not just the absolute phase of a wave, but the phase difference relative to the background pacemaker:

$$
\Delta \Phi_i(t)=\Phi_i(t)-\Phi_0(t).
$$

Its time derivative is

$$
\frac{d}{dt}\Delta \Phi_i(t)=\omega_i(t)-\omega_0.
$$

Therefore,

$$
\frac{d}{dt}\Delta \Phi_i(t)=\beta\, v(t).
$$

So your basic intuition is correct: once movement changes the frequency of wave $i$, the phase difference $\Phi_i-\Phi_0$ is no longer fixed and starts drifting over time.

If the speed is constant, this becomes

$$
\Delta \Phi_i(t)=\Delta \Phi_i(0)+\beta vt.
$$

## Re-alignment period

Constructive re-alignment happens whenever the phase difference changes by another multiple of $2\pi$. If the speed is constant, then the time between successive re-alignments is

$$
T_i = \frac{2\pi}{\beta v}.
$$

This is the one place where I would still correct the notation slightly:

- If $\Delta \Phi_i$ means the phase difference itself, then it changes with time and should not appear directly in the denominator.
- The denominator should be the **rate of phase drift**, i.e. $\dot{\Delta \Phi_i}$, equivalently the frequency difference $\omega_i-\omega_0$.

So the precise statement is:

$$
T_i=\frac{2\pi}{\omega_i-\omega_0}
=\frac{2\pi}{\beta v}.
$$

So under the aligned-motion assumption, your expression is right after this notation cleanup.

## Spatial spacing

Now the key point is very clean. During one re-alignment period, the animal moves a distance

$$
d=vT_i.
$$

Substituting the expression for $T_i$ gives

$$
d=v\frac{2\pi}{\beta v}=\frac{2\pi}{\beta}.
$$

So in the aligned-direction case, your conclusion is correct:

- the firing spacing is a constant
- this constant is
  $$
  d=\frac{2\pi}{\beta}
  $$
- it depends only on the cell parameter $\beta$
- it does not depend on the current speed $v$

This is exactly the clean result you were aiming for.

## Interpretation

The logic can now be summarized very compactly:

1. The background pacemaker oscillates at $\omega_0$.
2. Motion along the preferred direction changes the wave frequency to $\omega_0+\beta v$.
3. That creates a phase drift rate of $\beta v$ relative to the pacemaker.
4. Re-alignment happens every
   $$
   T=\frac{2\pi}{\beta v}.
   $$
5. In that time the animal travels
   $$
   d=\frac{2\pi}{\beta}.
   $$

So one wave already gives a stripe-like periodic firing structure with a spacing fixed by $\beta$. The next conceptual step is then to ask how several direction-tuned waves, each with its own preferred direction, can combine to form a 2D grid-like firing pattern.

## Interactive sketch

The demo for this note is intentionally restricted to the one-wave case. It keeps only one preferred direction and assumes the movement direction is parallel to it, matching the assumptions of the derivation above.

{{< gridcell-single-wave-demo >}}

Later, I want to add a more faithful demo: control a moving rat in a 2D scene, update several direction-tuned waves according to velocity-dependent phase drift, and then simulate the resulting grid-cell firing pattern over the trajectory.

## Why this is only a starting point

This picture is still incomplete, even in the aligned-direction case.

Real grid-cell theory quickly brings in questions such as:

- How should the pacemaker itself be modeled?
- How exactly do several direction-tuned oscillators interact?
- Why are multiple modules needed?
- How does path integration update phase over time?
- What dynamical mechanism stabilizes the lattice?
- How does a population of grid cells support decoding?

Those are the questions I want this column to gradually move toward. For now, the point is narrower: make the one-direction phase-drift logic precise before moving into a full spatial simulation.
