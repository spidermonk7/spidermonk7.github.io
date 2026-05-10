---
title: "HelioX: A GPU-Native Framework for Simulation and Training of Biophysically Detailed Networks"
authors:
- admin
date: "2026-05-10T00:00:00Z"
publishDate: "2026-05-10T00:00:00Z"
publication_types: ["paper-conference"]
publication: "*International Conference on Machine Learning (ICML 2026)*"
publication_short: "ICML 2026"

abstract: Biophysically detailed neural networks provide intrinsic spatio-temporal structure for brain-inspired AI, but their irregular dendritic topology is poorly matched to dense deep learning runtimes. HelioX is a GPU-native framework that unifies high-performance simulation and scalable training for biophysically detailed models via custom-fused CUDA kernels, analytical gradient propagation, and multi-stream concurrency. Across numerical and learning benchmarks, HelioX achieves strong speed and memory efficiency while preserving simulation fidelity, and enables deep biophysical MLP training and organism-scale C. elegans model fitting on consumer GPUs.

summary: Accepted at ICML 2026. HelioX provides a GPU-native simulation-and-training stack for biophysically detailed neural networks, with substantial improvements in throughput, memory efficiency, and scalability.

tags:
- Computational Neuroscience
- Brain-Inspired AI
- GPU Systems
- Biophysical Neural Networks
featured: true

url_pdf: '20412_HelioX_A_GPU_Native_Fram.pdf'
url_code: ''
url_poster: ''
url_project: '/project/heliox/'
url_slides: ''
url_source: ''
url_video: ''
image:
  filename: featured.jpg

slides: ""
---

Accepted at **ICML 2026**.

HelioX introduces a GPU-native path to train and simulate biophysically detailed neural networks at practical scale. Instead of forcing biological models into dense ANN-oriented execution paths, it aligns runtime design with dendritic structure and simulation dynamics.

## Teaser

![HelioX Teaser](/project/heliox/Figures/teasor.jpg)

## Key Contributions

- **GPU-to-Biophysics Design**: Custom-fused CUDA kernels for dendritic hierarchical scheduling and gradient propagation
- **Unified Simulation + Training Runtime**: End-to-end loop from simulation state updates to parameter optimization
- **Efficiency at Scale**: Significant improvements in throughput and memory usage across simulation and training workloads
- **Large-Scale Feasibility**: Demonstrated on deep biophysical MLPs and organism-scale *C. elegans* fitting tasks on consumer GPUs

## Numerical Fidelity and Throughput

![HelioX Figure 2 Results](/project/heliox/Figures/Figure2.jpg)

## Organism-Scale Training

![HelioX Worm Training Results](/project/heliox/Figures/worm.jpg)

## Why It Matters

Biophysically detailed neurons carry rich temporal and spatial computation that point-neuron abstractions cannot directly capture. HelioX lowers the engineering and hardware barriers for using these models in trainable AI systems, making detailed-neuron research more practical for both computational neuroscience and brain-inspired learning.
