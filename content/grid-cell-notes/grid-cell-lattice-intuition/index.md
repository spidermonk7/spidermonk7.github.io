---
title: "Grid Cell Notes 01: Oscillatory Interference, Phase Drift, and Grid Spacing"
date: 2026-05-12
math: true
summary: "A first note on oscillatory interference notation, phase drift relative to a pacemaker, and why the spatial scale can become a cell-specific constant."
tags:
  - Grid Cell
  - Computational Neuroscience
  - Mathematical Modeling
authors:
  - admin
---

This column is meant to be a running notebook. I do not want it to be limited to prose. For grid cells, intuition often becomes much clearer when formulas and visual structure are placed side by side, and even clearer when some parameters can be manipulated directly.

This first note starts from a more specific oscillatory-interference hypothesis: each direction-tuned wave is compared against a background pacemaker, and motion changes the frequency of the direction-tuned wave. That frequency shift produces a time-varying phase difference, and the repeated realignment of phases gives a spatial firing scale.

## Symbol setup

To keep the notation fixed, I will use:

- $\theta_i$: the preferred direction of wave $i$
- $\Phi_0$: the phase of the background pacemaker in the brain
- $\Phi_i$: the phase of wave $i$
- $\omega_0$: the baseline angular frequency of the pacemaker
- $\beta$: the gain that converts velocity projection into frequency shift
- $v(t)$: the animal's instantaneous speed

If the animal moves with heading $\psi(t)$, then the velocity component projected onto wave $i$ is proportional to

$$
v(t)\cos(\psi(t)-\theta_i).
$$

So a more precise version of the frequency rule is

$$
\omega_i(t) = \omega_0 + \beta\, v(t)\cos(\psi(t)-\theta_i).
$$

If I specialize to motion along the preferred direction of wave 1, then $\psi(t)=\theta_1$, so for that wave:

$$
\omega_1(t) = \omega_0 + \beta\, v(t).
$$

This is the cleanest case, and it matches the intuition you were aiming at.

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
\frac{d}{dt}\Delta \Phi_i(t)=\beta\, v(t)\cos(\psi(t)-\theta_i).
$$

So your basic intuition is correct: once movement changes the frequency of wave $i$, the phase difference $\Phi_i-\Phi_0$ is no longer fixed and starts drifting over time.

For constant speed and constant heading, this becomes

$$
\Delta \Phi_i(t)=\Delta \Phi_i(0)+\beta\, v\cos(\psi-\theta_i)t.
$$

## Re-alignment period

Constructive re-alignment happens whenever the phase difference changes by another multiple of $2\pi$. If speed and heading are constant, then the time between successive re-alignments is

$$
T_i = \frac{2\pi}{\beta\, v\cos(\psi-\theta_i)}.
$$

Here I would slightly correct your notation:

- If $\Delta \Phi_i$ means the phase difference itself, then it changes with time and should not appear directly in the denominator.
- The denominator should be the **rate of phase drift**, i.e. $\dot{\Delta \Phi_i}$, equivalently the frequency difference $\omega_i-\omega_0$.

So the precise statement is:

$$
T_i=\frac{2\pi}{\omega_i-\omega_0}
=\frac{2\pi}{\beta\, v\cos(\psi-\theta_i)}.
$$

This part of your reasoning is essentially right once that notation is cleaned up.

## Spatial spacing: one important distinction

This is the place where I would make the biggest correction.

If you ask for the **distance traveled by the animal along its actual trajectory** between two re-alignments, then

$$
d_{\text{traj},i}=vT_i=\frac{2\pi}{\beta\cos(\psi-\theta_i)}.
$$

This is **not** generally a constant. It depends on the angle between the movement direction and the preferred direction of the wave.

But if you ask for the **projected displacement along the preferred axis of wave $i$**, then

$$
d_{\parallel,i}=v\cos(\psi-\theta_i)\,T_i
=v\cos(\psi-\theta_i)\frac{2\pi}{\beta\, v\cos(\psi-\theta_i)}
=\frac{2\pi}{\beta}.
$$

This quantity is indeed a constant, determined only by $\beta$.

So your final statement is correct in a slightly more precise form:

- $2\pi/\beta$ is the spacing measured along the wave's preferred axis
- it is not, in general, the distance traveled along an arbitrary trajectory
- if the animal moves exactly along the preferred direction, then the two notions coincide

That distinction is important, because it is exactly what lets the same mechanism create direction-dependent stripe periodicity that later combines into a 2D grid pattern.

## From one wave to grid-cell firing

For one wave alone, repeated phase realignment gives a direction-dependent stripe-like firing pattern.

If I write the wave activity abstractly as

$$
w_i(x)=\cos\!\big(k_i^\top x+\phi_i\big),
$$

then one wave gives only one family of stripes. Two waves introduce interference between stripe families. Three waves with different preferred directions make it possible for repeated constructive overlap to localize into grid-like firing peaks.

So the conceptual progression is:

1. Motion changes oscillator frequency through velocity projection.
2. Frequency mismatch with the pacemaker creates phase drift.
3. Repeated phase realignment sets a spatial scale.
4. One wave gives stripes, while multiple direction-tuned waves can combine into a 2D grid-like firing pattern.

## Interactive sketch

The current demo still uses a simplified geometric wave-superposition picture. I am keeping it for now, because it is useful for intuition about how one wave, two waves, and three waves change the resulting pattern.

Later, I want to add a more faithful demo: control a moving rat in a 2D scene, update the three direction-tuned waves according to velocity-dependent phase drift, and then simulate the resulting grid-cell firing pattern over the trajectory.

{{< gridcell-lattice-demo >}}

## Why this is only a starting point

This picture is still incomplete.

Real grid-cell theory quickly brings in questions such as:

- How should the pacemaker itself be modeled?
- How exactly do three or more direction-tuned oscillators interact?
- Why are multiple modules needed?
- How does path integration update phase over time?
- What dynamical mechanism stabilizes the lattice?
- How does a population of grid cells support decoding?

Those are the questions I want this column to gradually move toward. For now, the point is narrower: make the phase-drift logic precise before moving into a full spatial simulation.
