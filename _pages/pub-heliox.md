---
permalink: /publications/heliox/
title: "HelioX: A GPU-Native Framework for Simulation and Training of Biophysically Detailed Networks"
---

**Under Review — ICML 2026**{: .notice--warning}

---

## System Architecture

![HelioX Architecture](/Papers/UnderReview/HelioX/heliox.png)

Biophysically detailed neural networks (BDNs) are a promising frontier for brain-inspired AI, but general-purpose deep learning frameworks suffer from a fundamental mismatch with their irregular, tree-structured biological complexity. HelioX is a GPU-native engine that bridges this gap with a "GPU-to-Biophysics" paradigm.

The architecture above shows three tightly integrated layers:

**Top: C++ Template Abstraction Layer and Multi-Stream Execution.** A unified single-source code base is specialized at compile time into GPU (via NVCC) and CPU (via GCC/Clang) objects, which are combined into a heterogeneous application. On the GPU side, multiple CUDA streams execute ionic current calculations, ODE construction, and conductance calculations concurrently, maximizing hardware utilization.

**Middle: Simulation and Training Pipeline.** Starting from a Python interface, users build biophysically detailed neural network models and preprocess spike inputs. The pipeline flows through spike processing, ODE construction, ODE solving, and state variable updates (simulation), followed by analytical gradient calculation and optimizer steps (training). The simulation and model parameters update in a closed loop.

**Bottom: Efficient Spike Handling and Unified Framework.** A fast-path spike delivery mechanism checks a 4-byte spike counter on the GPU --- if no spikes occurred (the common case), the cost is O(1) with no host involvement. Only when spikes are detected does the system fall back to host-mediated transfer at O(#spikes) cost. The right panel shows how the simulation framework and learning framework share efficient variable access, enabling seamless end-to-end differentiable training.

## Key Results

- Outperforms standard simulators (NEURON) by **orders of magnitude** in both speed and scalability
- Surpasses prior GPU-based solvers through custom-fused CUDA kernels for the Dendritic Hierarchical Scheduling (DHS) algorithm
- Successfully trains **deep biophysical MLPs** (3--5 layer) on MNIST with stable accuracy
- Trains the **BAAIWorm C. elegans** organism-scale model on a single consumer GPU, reducing memory from ~32GB to ~6GB
- Provides a modular Python API for constructing multi-layer biophysical architectures with ease
