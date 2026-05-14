---
title: "Grid Cell Notes 04: From fMRI to Grid-Cell-Like Coding"
date: 2026-05-14
math: true
summary: "How to infer grid-cell-like coding from right entorhinal fMRI: estimate a hidden grid orientation, test hexadirectional modulation out-of-sample, and rule out confounds."
tags:
  - Grid Cell
  - fMRI
  - Entorhinal Cortex
  - Computational Neuroscience
authors:
  - admin
---

This note is about a practical question I kept encountering:

How do we move from noisy fMRI in the right entorhinal cortex (Right EC) to a defensible claim of **grid-cell-like coding**?

The short answer is: we do not look for literal hexagonal "spots" in BOLD images. We test whether Right EC activity is modulated by movement direction with a **60-degree periodicity**.

If movement direction aligns with a latent grid orientation, BOLD is higher; if it is offset by 30 degrees, BOLD is lower. This is the classic **hexadirectional modulation** logic.

## 1) Start from trajectory, not static location

Suppose the participant moves in a virtual environment and we track position:

$$ (x(t), y(t)) $$

Instantaneous movement direction is

$$ \theta(t)=\mathrm{atan2}(y(t+\Delta t)-y(t), x(t+\Delta t)-x(t)) $$

In practice, low-speed or stationary periods are excluded. The directional model is about motion direction during navigation, not occupancy.

## 2) Estimate grid orientation in Right EC

The standard modeling idea is that many grid cells in a local EC population can share a common orientation (while differing in spatial phase). At voxel level, phase-specific structure can average out, but orientation-locked directional modulation can remain.

For each time point, construct:

$$ \cos(6\theta(t)),\ \sin(6\theta(t)) $$

The factor 6 encodes six-fold rotational symmetry (60-degree periodicity).

Fit a GLM on training data (for example, N-1 runs):

$$ \mathrm{BOLD}_{EC}(t)=\beta_{\cos}\cos(6\theta(t))+\beta_{\sin}\sin(6\theta(t))+\mathrm{nuisance\ regressors} $$

Then recover the putative grid orientation:

$$ \phi=\frac{1}{6}\mathrm{atan2}(\beta_{\sin},\beta_{\cos}) $$

Because of 60-degree periodicity, $\phi$ is defined modulo 60 degrees.

## 3) Test in independent data (critical)

The key methodological constraint is avoiding circularity:
do not estimate $\phi$ and test $\phi$ on the same data.

Use cross-validation (for example leave-one-run-out): estimate $\phi$ on training runs, test on held-out run, rotate folds, then average.

In test data, build:

$$ \cos(6(\theta(t)-\phi)) $$

Then fit:

$$ \mathrm{BOLD}_{RightEC}(t)=\beta_{\mathrm{hex}}\cos(6(\theta(t)-\phi))+\mathrm{nuisance\ regressors} $$

If $\beta_{\mathrm{hex}} > 0$, Right EC is stronger when $\theta$ aligns with
$\phi + k\cdot60^\circ$ than when it is shifted toward $\phi + 30^\circ + k\cdot60^\circ$.

This is the aligned > misaligned signature.

## 4) Intuitive visualization

A useful check is directional binning:

- aligned bins: $\phi \pm 15^\circ$ and every 60-degree repetition
- misaligned bins: $\phi+30^\circ \pm 15^\circ$ and every 60-degree repetition

Plot Right EC beta by bins. A consistent aligned > misaligned gap supports the model.

## 5) Group-level significance

A common inference flow:

1. Estimate one $\beta_{\mathrm{hex}}$ per subject.
2. Run one-sample t-test or permutation test at group level.
3. Restrict inference to Right EC ROI with proper correction (for example small-volume correction / FWE).
4. Verify effect is significantly above zero.

More conservative pipelines also do voxel-wise inference in EC with permutation + TFCE + FWE correction.

## 6) Necessary control analyses

A 6-fold effect alone is not enough. I would treat these controls as mandatory:

1. Symmetry controls: test 4-, 5-, 7-, 8-fold models. The effect should be specific to 6-fold.
2. Behavioral/perceptual confounds: control speed, head direction, turning angle, visual flow, button/motor effects, and head motion artifacts.
3. Direction sampling balance: ensure movement directions are not heavily skewed by task geometry.
4. Stability/coherence checks:
   - similar $\phi$ across runs
   - non-random orientation structure within Right EC (for example Rayleigh-type checks).

## 7) What conclusion is valid

A careful claim is:

> Right EC BOLD shows significant six-fold directional modulation relative to an estimated grid orientation, replicated out-of-sample and stronger than non-6-fold control symmetries. This supports a grid-cell-like population code in Right EC.

What I should avoid saying:

> fMRI proves single-neuron grid cells in Right EC.

fMRI supports **population-level grid-like representation**, not direct single-cell firing-field proof.

## One-line takeaway

Right EC grid-like signal in fMRI means:
estimate hidden orientation $\phi$ on independent data, then show BOLD is higher for $\theta=\phi+k\cdot60^\circ$ than for $\theta=\phi+30^\circ+k\cdot60^\circ$, with 6-fold specificity and confounds controlled.

## References

- Doeller CF, Barry C, Burgess N. [Evidence for grid cells in a human memory network](https://pubmed.ncbi.nlm.nih.gov/20090680/). *Nature*. 2010.
- Doeller Lab copy of the paper PDF: [Evidence for grid cells in a human memory network](https://doellerlab.com/wp-content/uploads/2015/08/doeller-nature-2010.pdf).
- Nature Communications (2024): [Grid-like entorhinal representation of an abstract value space during prospective decision making](https://www.nature.com/articles/s41467-024-45127-z).
- Null/constraint evidence in passive navigation context: [Failure to detect entorhinal grid-like signals in a passive virtual navigation paradigm](https://pub.dzne.de/record/285920/export/hx?ln=en).
