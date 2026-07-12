---
title: "LLM Internals - GPT Architecture, Training, and Generation"
date: 2026-07-12T19:03:00+05:30
summary: "Part 4 of my LLM Internals notes from Vizuara: GPT blocks, layer norm, GELU, feed-forward layers, residual connections, training loss, perplexity, and sampling."
tags: ["llm", "gpt", "training"]
categories: ["AI"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is the fourth post in my LLM Internals notes series based on Vizuara's [LLM Internals playlist](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSgsLAr8YCgCwhPIJNNtexWu).

The [first post](/blog/llm-internals-transformers-to-gpt/) was about transformers and GPT at a high level.

The [second post](/blog/llm-internals-tokenization-embeddings-position/) was about tokenization and embeddings.

The [third post](/blog/llm-internals-self-attention/) was about self-attention.

This final post puts the pieces together:

```text
token embeddings
+ positional embeddings
+ transformer blocks
+ output head
+ training loss
+ sampling
```

The goal is to understand the GPT-style flow from input tokens to generated text.

## The GPT block

A GPT model is built by stacking transformer blocks.

At a high level, each block has:

```text
masked multi-head attention
feed-forward network
layer normalization
residual connections
```

The input and output dimensions of a transformer block are usually the same.

So if the input sequence is represented as:

```text
batch_size x num_tokens x embedding_dim
```

then after the block, the shape is still:

```text
batch_size x num_tokens x embedding_dim
```

The block changes the representation, but preserves the outer shape. This is what lets us stack the same kind of block many times.

For GPT-2 small, the model has 12 transformer blocks with embedding dimension 768.

## The full flow

For a prompt like:

```text
Every effort moves you
```

the flow is:

```text
text -> token IDs -> token embeddings -> add positional embeddings
     -> transformer blocks -> final layer norm -> output head -> logits
```

The output head maps each final token representation to a vector of vocabulary-size scores.

If the vocabulary size is 50,257, then each token position gets:

```text
50257 logits
```

Each logit corresponds to one possible next token.

To generate the next token, we usually take the logits from the last position:

```text
Every effort moves you
                   ^
              use this position
```

Those logits are converted into probabilities, and then a token is selected.

The selected token is appended to the prompt, and the process repeats.

## Layer normalization

Training deep neural networks is difficult because values and gradients can become unstable across many layers.

Layer normalization helps by normalizing activations.

For a vector:

```text
[1.1, 0.8, 2.3, 4.4]
```

we compute its mean and variance, then transform each element:

```text
x_norm = (x - mean) / sqrt(variance + epsilon)
```

After normalization, the vector has roughly:

```text
mean = 0
variance = 1
```

This improves training stability.

One important detail:

```text
layer normalization normalizes across the feature dimension,
not across the batch dimension.
```

So it does not depend on the batch size in the same way batch normalization does.

Modern GPT-style models commonly use layer normalization around the attention and feed-forward sublayers, often in a pre-norm arrangement where normalization happens before the sublayer.

## Feed-forward network

After attention, each token representation is passed through a feed-forward network.

This is applied independently to each token position.

For GPT-style models, the feed-forward network usually expands the dimension and then projects it back.

For example:

```text
768 -> 3072 -> 768
```

The middle dimension is often 4 times larger.

Why expand?

One intuition is that the model temporarily gets a larger space to transform and mix features, then compresses back to the original embedding size so the next block can continue.

The shape is preserved at the block level:

```text
input:  batch_size x num_tokens x 768
middle: batch_size x num_tokens x 3072
output: batch_size x num_tokens x 768
```

## GELU activation

Between the two linear layers, GPT-style models often use GELU.

ReLU is simpler:

```text
ReLU(x) = x if x > 0
ReLU(x) = 0 if x <= 0
```

But ReLU can create dead neurons if a neuron gets stuck outputting zero.

GELU is smoother. It is roughly:

```text
GELU(x) = x * Phi(x)
```

where `Phi(x)` is the cumulative distribution function of the standard Gaussian distribution.

The intuition is:

```text
large positive values pass through
large negative values are mostly suppressed
values near zero are handled smoothly
```

This smoothness makes GELU work well in transformer architectures.

## Residual connections

Residual connections are also called skip connections.

The idea is:

```text
output = sublayer(input) + input
```

So if a layer computes `f(x)`, the block returns:

```text
f(x) + x
```

This gives gradients a cleaner path backward through the network.

Without residual connections, gradients can become progressively smaller as they move back through many layers. This slows or blocks learning.

With residual connections, the gradient has a path that can skip the sublayer.

That is why very deep networks became easier to train once residual connections became common.

## Output head

After the final transformer block, the model has one vector per token position.

For GPT-2 small, each vector has dimension 768.

The output head maps:

```text
768 -> vocabulary size
```

So if the vocabulary size is 50,257:

```text
768 -> 50257
```

The result is a logits vector.

Each element corresponds to one token in the vocabulary.

Softmax converts logits into probabilities:

```text
probabilities = softmax(logits)
```

Then the model chooses a token from that distribution.

The simplest strategy is argmax:

```text
choose the token with the highest probability
```

But generation often uses sampling instead, because always picking the highest-probability token can make text repetitive and less creative.

## Training loss

During training, the model predicts the next token at every position.

Suppose the input token IDs are:

```text
[128, 314, 217]
```

The targets are shifted:

```text
128 -> 314
314 -> 217
```

For each position, the model outputs a probability distribution over the vocabulary.

We look at the probability assigned to the correct target token.

If the correct token gets high probability, the loss is low.

If the correct token gets low probability, the loss is high.

The standard loss is cross-entropy, which for the correct token is equivalent to negative log probability:

```text
loss = -log(p_correct)
```

If `p_correct` moves toward 1, the loss moves toward 0.

So training tries to adjust all model weights so that the correct next token gets higher probability.

## Perplexity

Perplexity is another way to report language-model loss.

It is related to the average cross-entropy loss per token:

```text
perplexity = exp(loss)
```

Lower perplexity is better.

One rough intuition:

```text
perplexity is like the effective number of choices
the model is confused between.
```

If perplexity is close to the vocabulary size, the model is almost randomly choosing among many tokens.

If perplexity is much lower, the model is assigning probability mass more intelligently.

This is not a perfect measure of all behavior we care about, but it is a useful training/evaluation signal for next-token prediction.

## The pretraining loop

The pretraining loop is the usual deep-learning loop:

```text
for each epoch:
  for each batch:
    reset gradients
    run the model forward
    compute loss
    run backward pass
    update weights
```

Every major step in the GPT architecture is differentiable:

- embeddings,
- attention,
- layer normalization,
- feed-forward layers,
- output head,
- softmax/cross-entropy loss.

So backpropagation can compute gradients for the parameters.

Then the optimizer updates the weights:

```text
w = w - learning_rate * gradient
```

This happens for all trainable parameters, across many batches and many training steps.

## Where the parameters are

The parameter count comes from several places.

Token embeddings:

```text
vocab_size x embedding_dim
```

Positional embeddings:

```text
context_length x embedding_dim
```

Multi-head attention projections:

```text
Wq, Wk, Wv, and output projection
```

Feed-forward network:

```text
embedding_dim -> 4 * embedding_dim -> embedding_dim
```

Output head:

```text
embedding_dim -> vocab_size
```

In GPT-2 small, the final reported parameter count is about 124 million. One reason this is lower than a naive count is weight tying: the model can reuse the token embedding matrix for the output projection.

This was a useful detail in the notes because it makes the architecture feel less mysterious. The big parameter count is not coming from one magical component. It is the sum of many large matrices.

## Temperature

After the model produces logits, we need to choose the next token.

Temperature controls randomness by scaling logits before softmax:

```text
scaled_logits = logits / temperature
```

If temperature is low, the distribution becomes sharper.

The model becomes more deterministic and tends to choose high-probability tokens.

If temperature is high, the distribution becomes flatter.

The model becomes more random and explores lower-probability tokens more often.

So:

```text
low temperature  -> safer, more predictable
high temperature -> more varied, more risky
```

Temperature is not changing what the model knows. It is changing how we sample from what the model predicted.

## Top-k sampling

Top-k sampling restricts the next-token choice to only the `k` most likely tokens.

{{< figure src="/images/llm-internals/top-k-sampling.png" alt="Top-k sampling narrowing or widening the candidate token set" >}}

For example, if:

```text
k = 50
```

then all tokens outside the top 50 are removed from consideration.

Usually this is done by setting their logits to negative infinity before softmax.

Then the model samples from the remaining top-k tokens.

This reduces the chance of selecting very unlikely nonsense tokens while still allowing more variety than pure argmax.

Temperature and top-k are often used together:

```text
logits -> top-k filtering -> temperature scaling -> softmax -> sample
```

The exact order can vary by implementation, but the idea is to control the tradeoff between coherence and randomness.

## The main takeaway

A GPT-style model is a stack of repeated transformer blocks.

Token and positional embeddings create the input vectors.

Masked multi-head attention lets each token use previous context.

Feed-forward layers transform each token representation.

Layer normalization and residual connections make deep training stable.

The output head converts vectors into vocabulary logits.

Cross-entropy trains the model to assign high probability to the correct next token.

Sampling strategies like temperature and top-k decide how deterministic or creative generation should be.

The whole thing is built from familiar pieces:

```text
matrix multiplication
softmax
normalization
activation functions
gradient descent
```

But when these pieces are scaled up and trained on massive text corpora, the behavior becomes surprisingly powerful.

That is probably the biggest lesson from these notes for me. LLMs feel magical from the outside, but internally they are made of very concrete operations. The hard part is not that the components are individually impossible to understand. The hard part is that there are many of them, stacked at enormous scale.
