---
title: "LLM Internals - Self-Attention and Multi-Head Attention"
date: 2026-07-12T19:02:00+05:30
summary: "Part 3 of my LLM Internals notes from Vizuara: why attention was needed, how Q/K/V self-attention works, causal masking, dropout, and multi-head attention."
tags: ["llm", "attention", "transformers"]
categories: ["AI"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is the third post in my LLM Internals notes series based on Vizuara's [LLM Internals playlist](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSgsLAr8YCgCwhPIJNNtexWu).

The [first post](/blog/llm-internals-transformers-to-gpt/) was about transformers and GPT at a high level.

The [second post](/blog/llm-internals-tokenization-embeddings-position/) was about tokenization, embeddings, and position.

This post is about the main operation inside transformers:

```text
attention
```

The core idea is simple:

```text
When building a representation for one token,
look at the other relevant tokens and combine information from them.
```

The details are where the magic is.

## Why attention was needed

Before transformers, recurrent neural networks were a common choice for sequence problems.

The RNN idea is:

```text
process one token at a time
carry a hidden state forward
```

For short sequences this can work well.

But for long sentences, the final hidden state has to carry a lot of information. If the decoder only receives the final state, then details from early tokens may get compressed or lost.

For translation, this is a problem.

Word-by-word translation is not enough. The model needs grammar, context, and alignment between parts of the input and parts of the output.

In 2014, Bahdanau attention improved encoder-decoder RNNs by letting the decoder selectively look at different parts of the input sequence at each decoding step.

Then in 2017, transformers took the next step:

```text
Maybe we do not need recurrence at all.
Maybe attention itself can be the main operation.
```

That is the shift.

## Self-attention

Self-attention means the sequence attends to itself.

In translation attention, there may be two different sequences:

```text
source sentence -> target sentence
```

In self-attention, we are working inside one sequence:

```text
token 1, token 2, token 3, ...
```

Each token builds a better representation by looking at the other tokens in the same sequence.

Suppose the sentence is:

```text
Your journey starts with one step
```

When creating the representation for `journey`, the model may need information from `Your`, `starts`, and maybe the rest of the phrase.

When creating the representation for `step`, the model may care about `journey`, `starts`, and `one`.

So instead of each token being represented in isolation, self-attention creates context-aware vectors.

## A simplified attention calculation

Start with token embeddings:

```text
x1, x2, x3, ..., xn
```

For a token, say `x2`, we want to calculate a new vector:

```text
z2
```

This new vector should contain information from `x2` and the other relevant tokens.

The first question is:

```text
How relevant is each token to x2?
```

One simple way is to use dot products.

If two vectors point in similar directions, their dot product is large. If they are less aligned, the dot product is smaller.

So we compute attention scores:

```text
score(x2, x1)
score(x2, x2)
score(x2, x3)
...
score(x2, xn)
```

Then we normalize those scores with softmax so that they become weights:

```text
a21, a22, a23, ..., a2n
```

These weights sum to 1.

Finally, we take a weighted sum:

```text
z2 = a21 x1 + a22 x2 + a23 x3 + ... + a2n xn
```

That is the core of attention:

```text
score relevance -> normalize -> weighted sum
```

## Query, key, and value

Real transformer attention does not directly use the same vector for everything.

Instead, each input vector is projected into three different vectors:

```text
query
key
value
```

These are created using learned weight matrices:

```text
Q = X Wq
K = X Wk
V = X Wv
```

{{< figure src="/images/llm-internals/qkv-attention.png" alt="Query, key, value, and scaled dot-product attention" >}}

The intuition is:

```text
query: what the current token is looking for
key:   what each token offers for matching
value: the information each token contributes
```

The attention scores are computed using queries and keys:

```text
scores = Q K^T
```

Then softmax converts the scores into attention weights.

Those weights are applied to values:

```text
context = softmax(Q K^T) V
```

So queries and keys decide where to look.

Values contain what gets copied into the output.

## Why scale by sqrt(d_k)?

The actual transformer formula is:

```text
Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V
```

The division by `sqrt(d_k)` is there for stability.

If the key/query dimension is large, dot products can become large in magnitude. Large values going into softmax can make the distribution too sharp too early.

That can hurt learning because softmax may put almost all probability on one position.

Scaling keeps the dot products in a more controlled range.

So the intuition is:

```text
Scale before softmax so attention weights stay numerically stable.
```

## Causal attention

GPT is autoregressive.

When predicting the next token, it should not be allowed to look at future tokens.

For example, while processing:

```text
Your journey starts with one step
```

the representation for `Your` should not use `journey`, `starts`, or anything after it.

Otherwise the model would cheat during training by looking at the answer.

This is why GPT uses causal attention, also called masked attention.

{{< figure src="/images/llm-internals/causal-attention-mask.png" alt="Causal attention mask hiding future tokens" >}}

The mask blocks future positions.

In matrix form, the model masks the upper triangular part of the attention score matrix. Those future positions are set to negative infinity before softmax.

After softmax:

```text
e^(-infinity) = 0
```

So future tokens receive zero attention weight.

This ensures:

```text
token i can attend only to tokens 1 through i
```

That is exactly what we need for next-token prediction.

## Dropout in attention

Dropout is another regularization trick.

The basic idea is:

```text
randomly turn off some activations during training
```

This prevents the model from depending too heavily on a small set of neurons or connections.

In attention, dropout can be applied to attention weights or other parts of the transformer block.

If dropout probability is `p`, some entries are set to zero during training, and the remaining entries are scaled appropriately so the expected magnitude stays consistent.

At inference time, dropout is disabled.

The point is not to make prediction random at inference time. The point is to make training more robust and reduce overfitting.

## Multi-head attention

One attention calculation gives one way to look at the sequence.

But language has many relationships happening at once:

- subject-verb relationships,
- nearby phrase relationships,
- long-distance references,
- punctuation structure,
- semantic similarity.

Multi-head attention lets the model learn multiple attention patterns in parallel.

{{< figure src="/images/llm-internals/multi-head-attention.png" alt="Multi-head attention with query, key, value projections and merged heads" >}}

Instead of one attention head, we split the representation into multiple heads.

Each head has its own learned projections for queries, keys, and values.

Each head computes attention independently.

Then the outputs are concatenated and projected back.

In shape terms, suppose:

```text
d_out = 768
num_heads = 12
```

Then each head has dimension:

```text
head_dim = d_out / num_heads = 64
```

Each head works in its own 64-dimensional subspace. After all heads finish, their outputs are combined back into a 768-dimensional vector.

Because the full dimension is split across heads, the total cost is roughly similar to doing single-head attention over the full dimension. But it improves model quality because different heads can specialize in different relationships.

## The main takeaway

Attention is a way to build context-aware token representations.

Self-attention lets tokens in the same sequence communicate.

Queries and keys decide relevance.

Values provide the content that gets mixed.

Causal masking prevents GPT from looking into the future.

Multi-head attention lets the model learn several different attention patterns at the same time.

In the next post, we will place this attention module inside the full GPT block and look at layer normalization, feed-forward networks, residual connections, training loss, and sampling.
