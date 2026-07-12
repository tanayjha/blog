---
title: "LLM Internals - Tokenization, Embeddings, and Position"
date: 2026-07-12T19:01:00+05:30
summary: "Part 2 of my LLM Internals notes from Vizuara: tokenization, token IDs, byte pair encoding, input-target pairs, token embeddings, and positional embeddings."
tags: ["llm", "tokenization", "embeddings"]
categories: ["AI"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is the second post in my LLM Internals notes series based on Vizuara's [LLM Internals playlist](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSgsLAr8YCgCwhPIJNNtexWu).

The [first post](/blog/llm-internals-transformers-to-gpt/) was about transformers, BERT, GPT, and the next-token prediction objective.

This post is about the first thing that has to happen before a model can process text:

```text
Text has to be converted into numbers.
```

Neural networks do not directly understand characters, words, or sentences. They operate on tensors. So before text reaches the transformer, we need a pipeline like this:

```text
raw text -> tokens -> token IDs -> embeddings
```

{{< figure src="/images/llm-internals/tokenization-pipeline.png" alt="Pipeline from input text to tokenized text, token IDs, and embeddings" >}}

## Tokenization

Suppose the input is:

```text
This is an example.
```

A very simple tokenizer may split this as:

```text
This | is | an | example | .
```

These pieces are called tokens.

A token can be a word, a subword, a character, or sometimes even punctuation. The exact split depends on the tokenizer.

Once we have tokens, we map each token to an integer ID using a vocabulary:

```text
This    -> 40134
is      -> 2052
an      -> 133
example -> 389
.       -> 12
```

This gives us:

```text
[40134, 2052, 133, 389, 12]
```

The model does not see the string `This is an example.` directly. It sees these token IDs.

We also need the reverse mapping:

```text
40134 -> This
2052  -> is
133   -> an
389   -> example
12    -> .
```

This is needed at the end, when generated token IDs have to be decoded back into text.

## Special tokens

Tokenizers often include special tokens.

Some examples:

```text
<unk>   unknown token
<bos>   beginning of sequence
<eos>   end of sequence
<pad>   padding token
```

These are not normal words. They are control tokens used to represent special situations.

For example, `<eos>` can tell the model that a document or sequence has ended.

Padding is useful when multiple sequences of different lengths are processed in the same batch. Shorter sequences can be padded so that all examples have the same tensor shape.

GPT-style tokenizers do not necessarily use all of these in the same way as older NLP pipelines. GPT-2, for example, uses a byte-level BPE tokenizer and has a special end-of-text token.

But the broader idea is the same:

```text
Some tokens represent text.
Some tokens represent structure.
```

## Why not just split by words?

The simplest tokenizer is word-based:

```text
My hobby is playing cricket
```

becomes:

```text
My | hobby | is | playing | cricket
```

This is easy to understand, but it has a serious problem.

What if the model sees a word that is not in the vocabulary?

For example:

```text
tokenization
modernization
hyperparameterization
```

A word-based tokenizer needs a huge vocabulary to cover all possible words. Even then, rare words and new words are always a problem.

Another option is character-level tokenization:

```text
cricket -> c | r | i | c | k | e | t
```

This avoids out-of-vocabulary words because the vocabulary can be small. But the token sequence becomes much longer, and the model has to recover word meaning from tiny pieces.

So we want something in between.

## Subword tokenization

Subword tokenization is the middle path.

It tries to keep common words as single tokens, while splitting rare words into smaller meaningful pieces.

For example:

```text
boy  -> boy
boys -> boy | s
```

The root `boy` is preserved, and the suffix `s` is also represented.

Similarly:

```text
tokenization  -> token | ization
modernization -> modern | ization
```

This is useful because common suffixes and roots can be shared across many words.

The model gets a vocabulary that is not too large, while still avoiding the worst out-of-vocabulary problem.

This is the intuition behind byte pair encoding.

## Byte Pair Encoding

Byte Pair Encoding, or BPE, originally comes from data compression.

The basic compression idea is:

```text
Find the most common adjacent pair.
Replace it with a new symbol.
Repeat.
```

Suppose the data is:

```text
aaabdaaabac
```

If `aa` occurs frequently, replace it with a new symbol, say `Z`:

```text
ZabdZabac
```

Then find the next most common pair and repeat.

For LLM tokenization, the same spirit is used to build a vocabulary of common subword pieces.

Start from characters. Count frequent adjacent pairs. Merge the most frequent pair. Repeat until the vocabulary size or number of merges reaches the desired limit.

For example, if the corpus contains many words like:

```text
newest
widest
finest
lowest
```

we may eventually learn merges like:

```text
e + s -> es
es + t -> est
```

Now `est` can be reused in words like:

```text
finest
lowest
```

This is the nice part:

```text
BPE discovers useful pieces from frequency.
```

It is not manually told what the root or suffix is. It finds repeated patterns from the corpus.

## Input-target pairs

After tokenization, we still need training examples.

For GPT-style models, the training task is next-token prediction.

If the token IDs are:

```text
[1, 2, 3, 4, 5]
```

then with a context size of 4, we can create:

```text
Input:  [1]
Target: [2]

Input:  [1, 2]
Target: [3]

Input:  [1, 2, 3]
Target: [4]

Input:  [1, 2, 3, 4]
Target: [5]
```

In actual training, this is usually batched more efficiently, but the idea is the same.

The model sees previous tokens and predicts the next one.

This is autoregressive:

```text
previous output becomes part of the next input
```

During generation, if the model predicts token `5`, that token is appended to the input and the model runs again.

## Context size

The context size controls how many previous tokens the model can look at.

If the context size is 4, then the model can use at most 4 previous tokens to make a prediction.

That means the model is not looking at "all text ever written." It is looking at a fixed context window.

Modern models have much larger context windows, but the principle is the same:

```text
The model predicts using the tokens currently inside its context window.
```

This is why context length matters so much in LLM applications.

If relevant information is outside the context window, the model cannot directly attend to it.

## Token embeddings

Token IDs are integers, but the model needs vectors.

So the next step is an embedding layer.

An embedding layer is basically a lookup table:

```text
vocabulary size x embedding dimension
```

For GPT-2 small, the vocabulary size is 50,257 and the embedding dimension is 768.

So the token embedding matrix has shape:

```text
50257 x 768
```

If a token has ID `389`, the model looks up row `389` of this matrix and gets a 768-dimensional vector.

At the beginning of training, these embedding vectors are usually initialized randomly. During training, they are updated along with the rest of the model.

Over time, the vectors become useful.

The important point is:

```text
The meaning of a token is represented by a learned vector.
```

This is where the linear algebra from the previous blog series starts becoming relevant. Words and subwords become points or directions in a high-dimensional vector space.

## Why position matters

Token embeddings capture something about token identity, but they do not by themselves capture position.

Consider:

```text
The cat sat on the mat.
On the mat sat the cat.
```

The token `cat` is still `cat`, so its token embedding is the same in both sentences.

But the role of the word may change depending on where it appears.

Transformers process tokens in parallel, so they need some way to know token order. Without position information, the model would have a bag of token embeddings but no sequence structure.

So we add positional information.

{{< figure src="/images/llm-internals/positional-encoding.png" alt="Token embedding combined with positional encoding" >}}

At a high level:

```text
input vector = token embedding + positional embedding
```

Now the model receives a vector that carries both:

- what the token is,
- where the token is.

## Absolute and relative position

There are many ways to encode position.

Two broad categories are:

```text
absolute positional embeddings
relative positional embeddings
```

Absolute position means each position has its own learned or fixed vector.

For example:

```text
position 0 -> vector p0
position 1 -> vector p1
position 2 -> vector p2
```

This is useful when exact position matters and when the model has a fixed maximum context length.

Relative position focuses more on distance between tokens.

For example:

```text
How far is this token from that token?
```

This can be useful for handling longer or varying sequences, because many language relationships depend more on relative distance than on absolute index.

The exact positional method differs across architectures, but the reason is always the same:

```text
Language is ordered, so token vectors need order information.
```

## The main takeaway

Before attention or transformers do anything, text has to become vectors.

Tokenization breaks text into manageable pieces.

BPE gives a practical middle ground between word-level and character-level tokenization.

Input-target pairs turn plain text into a self-supervised training task.

Token embeddings turn token IDs into learned vectors.

Positional embeddings tell the model where those tokens appear.

So the real input to the transformer is not raw text. It is a sequence of vectors:

```text
token meaning + token position
```

In the next post, we will look at what happens once these vectors enter the transformer: self-attention.
