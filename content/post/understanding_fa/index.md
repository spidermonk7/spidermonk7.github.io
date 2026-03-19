---
title: Learning Notes - the Flash-Attention  
date: 2026-03-19
math: true
summary: Why flash attention helps the inferences of Large Language Models.
tags:
  - Design
  - Hugo
  - Personal Branding
authors:
  - admin
---



# Motivation
Everything started with a phone call. My girlfriend asked me:

"Honey, you've mentioned that you successfully installed *FlashAttention* on your new cluster. What is that?"

"Oh, it's a Python library that helps with LLM inference, and maybe training too. Without *FlashAttention*, LLMs can easily run into CUDA OOM during inference."

I answered without really thinking.

"Cool. How does it work?"

"..."

And then I realized: I actually had no idea how *FlashAttention* works, or why it reduces the memory complexity of LLM inference.

That was the moment I decided to really look into *FlashAttention*, build my own blog page, and start recording the important technical ideas I learn along the way.

And also, always remember to be someone who keeps asking why.

# Background

After searching, I found that *FlashAttention* reduce the memory complexity of LLM inference mainly through optimize the calculation of [Softmax]

In LLMs, softmax appears in more than one place, but the one that matters most for understanding *FlashAttention* is the softmax inside the attention mechanism.

At a high level, self-attention works like this: for each token, the model computes how much attention it should pay to every previous token. Those raw attention scores are first computed, and then softmax turns them into a proper probability distribution.

More concretely, given query, key, and value matrices $Q$, $K$, and $V$, the attention scores are:

$$
S = \frac{QK^\top}{\sqrt{d_k}}
$$


where $M_{ij} = -\infty$ for positions that should be masked.

Then softmax is applied **row by row** over the key dimension:

$$
P_{ij} = \frac{\exp(S_{ij})}{\sum_j \exp(S_{ij})}
$$

This step converts the raw scores into normalized attention weights. Each row now sums to 1, which means the model can interpret them as "how much this token attends to each previous token."

Finally, these attention weights are used to combine the value vectors:

$$
O = PV
$$

So the full attention pipeline is:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

## What softmax is doing here

The role of softmax is simple but important:

- It turns arbitrary similarity scores into non-negative **normalized** weights.
- It amplifies larger scores and suppresses smaller ones.
- It makes the model focus on the most relevant context tokens when forming the output.

Without softmax, the attention scores would just be raw numbers. The model would have no clean way to interpret them as relative importance.

## Why this matters for *FlashAttention*

This is exactly the expensive part in standard attention.

To compute attention in the usual way, we often materialize the full score matrix $QK^\top$ and then the full softmax result. If the sequence length is $N$, then this matrix is of size $N \times N$, which leads to very high memory cost.

*FlashAttention* does **not** change the mathematical definition of softmax. Instead, it computes the same result more carefully, in a tiled / blockwise way, so that it avoids storing the full attention matrix in GPU memory.

So when people say *FlashAttention* reduces memory usage, they do **not** mean it removes softmax. They mean it computes the same softmax-based attention more efficiently.


At first glance, a single attention head does not seem too expensive.

For example, if $L=512$ and each number takes 2 bytes, then one $L \times L$ score matrix costs:

$$
512 \times 512 \times 2 = 524288 \text{ bytes} \approx 0.5 \text{ MB}
$$

However, in a real transformer we usually have multiple heads, multiple layers, and additional tensors such as attention probabilities, Q/K/V activations, and KV cache.

If we include the head dimension, the score matrix memory for one layer is roughly:

$$
B \times H \times L^2 \times \text{bytes per element}
$$

For example, with $B=1$, $H=32$, $L=4096$, and 2 bytes per element, the attention score matrix alone is already about 1 GB for a single layer.

And this is only one intermediate tensor. That is why attention becomes a serious memory bottleneck for long sequences.


**Why do we have to store such a large tensor?**


$$
P_{ij} = \frac{\exp(S_{ij})}{\sum_j \exp(S_{ij})}
$$

In a naive implementation, we usually store both $S$ and the normalized matrix $P$.
**Why? Because softmax is not just a pointwise operation. For each row, it needs to look at all the elements in that row, compute their relative scale, and normalize them.**
So the implementation often materializes the whole matrix first, and only then moves on to the next step.

After that, we compute:

$$
O = PV
$$

So in the standard pipeline, the model often stores large intermediate tensors such as:

- the score matrix $S$
- the softmax result $P$
- and sometimes extra temporary values used for numerical stability

This is why attention becomes so memory-hungry.
The real issue is not just the formula itself, but the way the computation is scheduled and stored in memory.

And this is exactly where *FlashAttention* comes in.

The key idea of *FlashAttention* is: maybe we do not need to store the full $L \times L$ matrix at all.
Instead of materializing the whole attention matrix in GPU memory, *FlashAttention* computes attention block by block, while still producing the exact same final result.

In other words, *FlashAttention* does not change the mathematics of attention.
It changes the order of computation, so that the GPU does much less memory movement and avoids storing those massive intermediate tensors.

# Flash Attention
