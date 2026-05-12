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


## Why focus on relative phase

Before writing down formulas, the key intuition is this: in an oscillatory-interference view of grid cells, what matters is not an isolated wave by itself, but how one oscillation lines up against another.

Here the background pacemaker provides one oscillatory reference, and the direction-tuned wave provides another. If their peaks keep overlapping, the interference is strong. If they drift apart, the interference weakens.

So if we assume that a grid cell tends to fire when wave peaks align strongly enough, then the central object to track is not the absolute phase of either oscillation alone, but their **relative phase**.

That is why the quantity

$$
\Phi_i - \Phi_0
$$

becomes the natural variable. Once motion changes the frequency of the direction-tuned wave, this relative phase starts to drift. Every time the two waves come back into peak alignment, the interference becomes strong again, and that repeated re-alignment is what sets a spatial firing period.

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

## Re-alignment: first think with constant speed

The next question is: when do the two waves meet again at their peaks?

The clean way to say it is not “when $\Delta\Phi_i(t)=2\pi$”, because the initial relative phase may not be zero. What matters is that the **change** in relative phase reaches another full cycle:

$$
\Delta\Phi_i(t)-\Delta\Phi_i(0)=2\pi.
$$

Under the constant-speed assumption,

$$
\Delta \Phi_i(t)=\Delta \Phi_i(0)+\beta vt,
$$

so the re-alignment condition becomes

$$
\beta vt = 2\pi.
$$

From this, the time between successive peak re-alignments is

$$
T_i = \frac{2\pi}{\beta v}.
$$

This is the first way to think about the problem:

1. Assume $v$ is constant.
2. Solve for the time it takes the relative phase to accumulate another $2\pi$.
3. Convert that time interval into a traveled distance.

In one such period, the animal moves

$$
d=vT_i=v\frac{2\pi}{\beta v}=\frac{2\pi}{\beta}.
$$

So under constant speed, the firing spacing is already a constant determined only by $\beta$.

## Re-alignment: now remove the constant-speed assumption

The more interesting question is whether this result depends on $v$ being constant.

It turns out that it does not.

Instead of solving for a fixed period $T_i$, we can directly track accumulated phase drift:

$$
\frac{d}{dt}\Delta\Phi_i(t)=\beta v(t).
$$

Integrating from time $0$ to time $t$ gives

$$
\Delta\Phi_i(t)-\Delta\Phi_i(0)=\int_0^t \beta v(\tau)\, d\tau.
$$

If we ask for the next firing event, we impose the same re-alignment condition:

$$
\Delta\Phi_i(t)-\Delta\Phi_i(0)=2\pi.
$$

So we obtain

$$
\int_0^t \beta v(\tau)\, d\tau = 2\pi.
$$

Pulling $\beta$ out,

$$
\beta \int_0^t v(\tau)\, d\tau = 2\pi.
$$

But

$$
\int_0^t v(\tau)\, d\tau
$$

is exactly the distance traveled along this direction during that interval. Therefore the firing distance satisfies

$$
d=\int_0^t v(\tau)\, d\tau=\frac{2\pi}{\beta}.
$$

This is the more robust formulation:

- it does not require constant speed
- it only requires that movement stays along the preferred direction
- it shows directly that the relevant spatial spacing is fixed by $\beta$

So the realignment story can be understood in two equivalent ways:

1. Constant-speed view: solve for the re-alignment period first, then multiply by speed.
2. Integral view: accumulate phase drift until it reaches $2\pi$, and read off the distance directly.

The second view is the stronger one, because the conclusion survives even when $v(t)$ changes over time.

## Interpretation

The logic can now be summarized very compactly:

1. The background pacemaker oscillates at $\omega_0$.
2. Motion along the preferred direction changes the wave frequency to $\omega_0+\beta v$.
3. That creates a phase drift rate of $\beta v(t)$ relative to the pacemaker.
4. Each time the accumulated phase drift reaches another $2\pi$, the peaks re-align.
5. The traveled distance associated with that re-alignment is
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
