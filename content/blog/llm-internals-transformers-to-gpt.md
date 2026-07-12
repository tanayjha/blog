---
title: "LLM Internals - From Transformers to GPT"
date: 2026-07-12T19:00:00+05:30
summary: "Part 1 of my LLM Internals notes from Vizuara: transformers, encoder-decoder models, BERT, GPT, and why next-token prediction became so powerful."
tags: ["llm", "transformers", "deep-learning"]
categories: ["AI"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

A few months back I went through Vizuara's LLM Internals course. The playlist is available here: [LLM Internals by Vizuara](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSgsLAr8YCgCwhPIJNNtexWu).

A small note before starting: some videos in the playlist are members-only now. When I did the course, the videos were available for free. Even then, I think the membership is worth purchasing if you are serious about understanding LLMs, because the videos were really good.

I had taken handwritten notes while watching the course, and this is my attempt to convert those notes into something readable.

The original handwritten PDF is also available here: [LLM Internals notes PDF](/files/llm-internals/llm-notes.pdf).

This is the first post in a four-part series:

1. Transformers and GPT at a high level.
2. Tokenization, embeddings, and position.
3. Self-attention and multi-head attention.
4. GPT architecture, training, and generation.

This is not meant to replace the course. It is more like a revision note for myself.

The main idea for this first post is:

```text
GPT is a transformer-style model trained to predict the next token.
```

That sounds almost too simple. The surprising part is how much behavior comes out of this one training objective.

## The transformer picture

The transformer architecture was introduced in the paper [Attention Is All You Need](https://arxiv.org/abs/1706.03762). The original architecture was built for sequence-to-sequence tasks like translation.

At a high level, it had two main parts:

- an encoder,
- a decoder.

{{< figure src="/images/llm-internals/transformer-architecture.png" alt="Transformer encoder-decoder architecture" >}}

For translation, the flow is roughly:

```text
input text -> tokens -> embeddings -> encoder -> decoder -> output text
```

The encoder reads the input sequence and produces vector representations. The decoder uses those representations, along with the output generated so far, to produce the next output token.

For example:

```text
Input:  "Das ist ein ..."
Output: "This is an ..."
```

The decoder does not produce the full translated sentence in one shot. It generates one token at a time. Each new output becomes part of the input for the next decoding step.

This is already very close to how modern text generation feels:

```text
given previous words -> predict the next word/token
```

## The key idea: self-attention

The central trick in transformers is attention.

More specifically, the key idea is self-attention:

```text
Each token can look at other tokens in the same sequence
and decide how much each one matters.
```

This is important because meaning is contextual.

In a sentence like:

```text
The cat that was sitting on the mat near the dog jumped.
```

the word `jumped` is much more related to `cat` than to `mat` or `dog`, even though `cat` is farther away.

Older sequence models like RNNs processed text step by step. They had a hidden state that was passed forward through the sequence. This worked well for short sentences, but long-range dependencies were hard. Important information had to survive many steps of hidden-state updates.

Self-attention changed the shape of the problem. Instead of forcing information to pass through a long chain, every token could directly attend to every other relevant token.

This is why the transformer became such a big deal.

## BERT and GPT

After transformers, many variants appeared.

Two famous ones are BERT and GPT.

{{< figure src="/images/llm-internals/bert-vs-gpt.png" alt="BERT as encoder-only and GPT as decoder-only transformer variants" >}}

BERT is encoder-only.

It is bidirectional, which means it can look at words on both sides of a token. That makes it very useful for tasks where the whole input is available, such as classification, sentiment analysis, and understanding a sentence.

GPT is decoder-only.

It is autoregressive, which means it predicts the next token using only the tokens before it. It cannot look into the future while predicting the next token.

So the core difference is:

```text
BERT: uses context from both sides
GPT: uses previous context only
```

That one design choice is why GPT is naturally suited for generation.

If the text is:

```text
This is an
```

GPT tries to predict what comes next.

Maybe:

```text
example
```

Then the new input becomes:

```text
This is an example
```

and the model predicts again.

This repeated next-token prediction is the basic generation loop.

## Transformer vs LLM

One thing I wanted to keep clear in my notes:

```text
Transformer and LLM are not exactly the same thing.
```

A transformer is an architecture.

An LLM is a large language model. Many modern LLMs are transformer-based, but not every transformer is an LLM, and historically language models could also be built using RNNs or LSTMs.

A rough history looks like this:

```text
RNNs          -> 1980s
LSTMs         -> 1997
Transformers  -> 2017
GPT-style LLMs -> after that
```

Transformers also show up outside text. Vision Transformers, for example, apply transformer ideas to images.

So the better statement is:

```text
Most modern LLMs are based on transformer-style architectures.
```

## A short GPT history

The notes then zoom into GPT.

The important papers are roughly:

```text
2017: Attention Is All You Need
2018: Improving Language Understanding by Generative Pre-Training
2019: Language Models are Unsupervised Multitask Learners
2020: Language Models are Few-Shot Learners
```

The 2018 GPT paper took the transformer idea and used a decoder-only architecture for language modeling.

GPT-2 scaled this up and showed very strong results.

GPT-3 scaled it much more, to 175 billion parameters, and this is where the "magic" started becoming obvious to the outside world. It was not just completing text. It could do translation, question answering, summarization, and many other tasks from prompts.

Then ChatGPT became viral in 2022, mostly because the interface made this capability easy for normal people to try.

## Zero-shot, one-shot, and few-shot

One of the most interesting ideas from GPT-3 was few-shot learning.

The model is not fine-tuned separately for every task. Instead, the user can provide a task description and a few examples in the prompt.

For example:

```text
English: cat
French: chat

English: dog
French:
```

The model sees the pattern and continues with:

```text
chien
```

The terminology is:

```text
zero-shot: no examples, just instruction
one-shot: one example
few-shot: a few examples
```

This is not the same as traditional supervised learning where we collect a labeled dataset and train a new classifier. Here, the already-trained model is adapting through context.

That is why GPT-3 felt so different. It was trained on next-token prediction, but it could generalize to tasks that were never explicitly programmed into it.

## The training objective is simple

GPT models are trained using next-token prediction.

Suppose the sentence is:

```text
This is an example
```

The training examples can be created automatically:

```text
Input:  This
Target: is

Input:  This is
Target: an

Input:  This is an
Target: example
```

No human label is needed. The sentence itself creates the label.

This is why the training is usually called self-supervised learning. It is not supervised in the manual-labeling sense, but the model still has a correct answer for each step.

The model sees a huge amount of text and repeatedly solves this task:

```text
Given the previous tokens, predict the next token.
```

That is it.

## Emergent behavior

The surprising part is that next-token prediction does not stay limited to "fill in the next word."

If the model sees enough text, it starts learning many patterns hidden inside language:

- grammar,
- facts,
- style,
- translation patterns,
- reasoning patterns,
- code patterns,
- task formats.

So even though the training task is next-token prediction, the model can appear to do many other things.

For example, it may translate because it has seen lots of translated text.

It may answer questions because it has seen question-answer patterns.

It may do sentiment analysis because it has seen reviews, summaries, labels, and explanations.

This is the part that felt unintuitive to me at first:

```text
The model is not explicitly trained as a translator,
but translation can emerge as a useful next-token prediction behavior.
```

That does not mean the model "understands" in the human sense. But it does mean the next-token objective is powerful enough to learn a lot of structure from text.

## The three stages of building an LLM

My notes split the LLM-building process into three broad stages.

First, data preparation.

Raw text has to be cleaned, tokenized, converted into token IDs, and turned into input-target pairs. This is where tokenization and sampling come in.

Second, pretraining.

The model is trained on a large unlabeled corpus using next-token prediction. This is the expensive stage where most of the base model's general ability is learned.

Third, fine-tuning.

The base model can be adapted into something more useful, such as a classifier or a personal assistant. This may involve instruction tuning, preference tuning, or task-specific fine-tuning.

In this series, I am mostly focusing on the internals of the base GPT-style model:

```text
tokens -> embeddings -> attention -> transformer blocks -> logits -> next token
```

## The main takeaway

The transformer gave us a way for tokens to interact through attention.

BERT used the encoder side for understanding-style tasks.

GPT used the decoder side for autoregressive generation.

The training objective is simple: predict the next token.

But at enough scale, that simple task teaches the model many patterns inside language.

In the next post, I will go one level lower and look at the first step in the pipeline: how raw text becomes tokens, token IDs, embeddings, and position-aware vectors.
