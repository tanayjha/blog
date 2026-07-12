---
title: "Turning Notes Into Blogs"
date: 2026-07-12T17:06:19+05:30
summary: "A short note on why I am converting my study notes into blog posts with help from AI agents."
tags: ["writing", "ai-agents", "learning"]
categories: ["Reflection"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

I have been experimenting with a slightly different way of writing blogs recently.

Usually, when I study something seriously, I end up taking handwritten notes. This is good while learning, because writing things down forces me to slow down and think. But handwritten notes are also hard to keep around for revision. They sit in notebooks or PDFs, and after a while it becomes difficult to quickly go back and refresh my memory.

So I am trying to convert some of those notes into blog posts.

## Why blogs?

The main motivation is personal. A blog feels like a more digital and durable version of my study notes. If I want to come back after a few months and remind myself what I understood about a topic, it is much easier to open a blog post than to search through scanned pages of handwritten notes.

I tried this recently with my [Ramsey Numbers](/blog/ramsey-numbers/) post, and I liked the output. The idea now is to do the same for Linear Algebra, LLM internals, and hopefully other concepts that I read about seriously.

AI agents make this workflow much easier. I can provide the rough notes, ask the agent to help organize them, split them into reasonable sections, and convert them into a first draft. Then I can read through the result, correct it, and make sure it still sounds like me.

## The workflow

To make this a little more repeatable, I have a small `Skill.md`-style instruction file for the AI agent. It is not doing anything magical. It is mostly a checklist for turning messy input into a readable blog post.

The public-safe version of that flow looks something like this:

```text
1. Understand the source material.
   - Read the notes, PDFs, images, or drafts.
   - If the notes are handwritten/scanned, convert them locally into a digital working copy.

2. Study the existing writing style.
   - Read older posts.
   - Keep the tone first-person, conversational, and concise.

3. Structure before writing.
   - Split the material into reasonable sections/posts.
   - Avoid trying to include every single detail.

4. Draft the post.
   - Write in Markdown.
   - Keep equations and examples readable.

5. Review for correctness.
   - Fact-check claims.
   - For math-heavy posts, do a separate math review pass.

6. Preview before publishing.
   - Render the post locally.
   - Read it like a normal reader would.
   - Edit until it feels like something I would actually write.
```

This is roughly what I used for the Ramsey Numbers post, and what I am using now for the Linear Algebra series.

## The writing style

These posts are not meant to be complete textbooks or lecture notes. I am mostly writing them in a way that I can understand later.

Because of that, I may not explain every single detail from first principles. There is always a tradeoff between completeness and actually getting the post written. For now, I am optimizing for preserving my own understanding in a clean digital form.

If someone else comes across these posts and benefits from them, then all the better. Maybe there are people who think about these topics in a similar way, and my explanation ends up matching how they understand things too.

That would be a nice bonus.

But the primary goal is simple: convert what I study into something I can come back to later.
