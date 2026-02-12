---
permalink: /publications/heliox/
title: "HelioX: A GPU-Native Framework for Simulation and Training of Biophysically Detailed Networks"
---

Under review at **ICML 2026**.

## Abstract

Biophysically detailed neural networks represent a promising frontier for brain-inspired AI, offering intrinsic spatio-temporal dynamics to enhance the expressivity and computational density of deep learning systems. However, general-purpose deep learning frameworks suffer from a fundamental mismatch between their dense parallel optimizations and the irregular, tree-structured complexity of biological mechanisms.

HelioX is a GPU-native framework designed to unify high-performance simulation with scalable training. Unlike approaches that adapt biology to existing deep learning tools, HelioX adopts a "GPU-to-Biophysics" paradigm --- tailoring the underlying GPU parallelism to biological structures by implementing custom-fused CUDA kernels for both the Dendritic Hierarchical Scheduling (DHS) algorithm and its gradient propagation.

## Key Contributions

- **GPU Native Simulation Engine:** Custom CUDA kernels based on the DHS method, maximizing hardware utilization for complex dendritic structures
- **Effective Training Module:** GPU-native support for specialized gradient algorithms of detailed neurons, with a modular Python API for constructing multi-layer biophysical architectures
- **System Validation:** Outperforms standard simulators (NEURON) by orders of magnitude in speed and scalability; successfully trains deep biophysical MLPs and organism-scale networks (e.g., BAAIWorm C. elegans model) on a single consumer GPU
