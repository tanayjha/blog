---
title: "Linear Algebra - The Column Picture"
date: 2026-07-12T17:07:19+05:30
summary: "Part 1 of my Linear Algebra notes from Gilbert Strang's lectures: matrix multiplication, elimination, pivots, inverses, and LU."
tags: ["linear-algebra", "math", "matrices"]
categories: ["Math"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

A few months back I went through Prof. Gilbert Strang's famous MIT Linear Algebra lectures. The lecture series is available here: [Gilbert Strang's MIT Linear Algebra playlist](https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D).

I had taken handwritten notes while watching them, and recently I found those notes again.

This blog post is the first of a small three-part series where I am converting those notes into something readable. This is not meant to be a replacement for the course. It is more like a revision note for myself, written in a way where I can come back later and quickly recover the main ideas.

The first big idea in the course is surprisingly simple:

**A matrix is not just a table of numbers. It is a machine for combining vectors.**

## Ax = b

Let us start with a very small example.

```text
A = [2 5]    x = [1]
    [1 3]        [2]
```

If we multiply `A` and `x`, we can do it in the usual row-wise way:

```text
[2 5] [1] = [2*1 + 5*2] = [12]
[1 3] [2]   [1*1 + 3*2]   [ 7]
```

This is the dot-product picture. Each row of `A` is dotted with `x`.

But the way Strang introduces it, there is another picture which is much more important:

```text
[2 5] [1] = 1[2] + 2[5] = [12]
[1 3] [2]     [1]     [3]   [ 7]
```

This is the column picture.

The vector `x = [1, 2]` is telling us how much of each column to take. So `Ax` is a linear combination of the columns of `A`.

That one sentence is probably the most useful mental model from the opening lectures:

```text
Ax = b means b is a linear combination of the columns of A.
```

So solving `Ax = b` is the same as asking:

> Can I combine the columns of A in some way to reach b?

This is a much more geometric way of thinking about systems of equations.

## Solving equations by elimination

Now let us look at a system of equations:

```text
x + 2y + z = 2
3x + 8y + z = 12
    4y + z = 2
```

The corresponding augmented matrix is:

```text
[1 2 1 |  2]
[3 8 1 | 12]
[0 4 1 |  2]
```

The goal of elimination is to make the matrix triangular. We want to get zeros below the pivots, because once that happens the system becomes easy to solve from the bottom up.

First pivot is the `1` in the top-left. We use it to eliminate the `3` below it:

```text
[1 2  1 |  2]
[0 2 -2 |  6]
[0 4  1 |  2]
```

Second pivot is the `2` in the second row. We use it to eliminate the `4` below it:

```text
[1 2  1 |   2]
[0 2 -2 |   6]
[0 0  5 | -10]
```

Now the system is triangular:

```text
x + 2y +  z =   2
    2y - 2z =   6
          5z = -10
```

Back substitution gives:

```text
z = -2
y = 1
x = 2
```

This is the computational heart of solving linear equations: **eliminate forward, substitute backward.**

## Pivots

The numbers we use to eliminate entries below them are called pivots.

In the previous example, the pivots were:

```text
1, 2, 5
```

If an `n x n` matrix has `n` pivots, after any row swaps that may be needed, then elimination succeeds cleanly and the system has one solution for every right-hand side `b`.

If a pivot is zero, we may need to exchange rows. If even after exchanging rows there is no pivot, then something has gone wrong from the point of view of invertibility. The columns are not independent, and the matrix is singular.

This is one of those places where computation and geometry meet:

- computationally, a missing pivot blocks elimination,
- geometrically, the columns are not enough to cover the whole space.

## Elimination matrices

One thing I liked in Strang's lectures is that even row operations are represented as matrices.

For example, suppose we want to do:

```text
row2 <- row2 - 3 row1
```

The matrix that performs this operation is:

```text
E21 = [ 1 0 0]
      [-3 1 0]
      [ 0 0 1]
```

Then:

```text
E21 A
```

is the matrix obtained after subtracting `3 row1` from `row2`.

Similarly, every elimination step can be written as multiplication by some elimination matrix. If multiple steps are needed, we multiply by multiple elimination matrices:

```text
E32 E21 A = U
```

Here `U` is the final upper triangular matrix.

This is a nice idea because it turns elimination from a sequence of instructions into one clean matrix equation.

## Matrix multiplication is ordered

While working with elimination matrices, one thing becomes very clear: matrix multiplication is not commutative.

In general:

```text
AB != BA
```

This is not just a technical detail. The order matters because matrices often represent operations.

If I first rotate and then project, that is not the same as first projecting and then rotating. So we should not expect the matrix products to be the same either.

However, matrix multiplication is associative:

```text
(AB)C = A(BC)
```

So we can regroup products, but we cannot reorder them.

## Inverses

For a number, inverse is easy:

```text
5 * (1/5) = 1
```

For a matrix, the equivalent statement is:

```text
A A^-1 = I
A^-1 A = I
```

The identity matrix `I` plays the role of `1`.

If a matrix has an inverse, then solving `Ax = b` is conceptually easy:

```text
Ax = b
A^-1 Ax = A^-1 b
x = A^-1 b
```

Of course, computationally we usually do not solve systems by literally computing `A^-1`. Elimination is better. But the inverse is still an important concept because it tells us whether the matrix can be undone.

If `A` is singular, then `A^-1` does not exist.

Geometrically, this means the matrix collapses some direction. For example, if two columns are multiples of each other in `R^2`, then all combinations of those columns lie on a line. There is no way to reach every vector in the plane. Such a matrix cannot be inverted.

## Gauss-Jordan idea

There is a neat way to compute the inverse using elimination.

Start with:

```text
[A | I]
```

Then do row operations until the left side becomes identity:

```text
[A | I] -> [I | A^-1]
```

Why does this work?

Because the same row operations that convert `A` into `I` are being applied to `I`. If those operations together are represented by a matrix `E`, then:

```text
E A = I
```

So:

```text
E = A^-1
```

And applying `E` to the right side gives exactly the inverse.

## LU factorization

Elimination gives us:

```text
E A = U
```

where `U` is upper triangular.

If we reverse the elimination operations, we get:

```text
A = L U
```

Here:

- `L` is lower triangular,
- `U` is upper triangular.

The lower triangular matrix stores the multipliers used during elimination.

This is useful because once we factor `A = LU`, solving `Ax = b` becomes:

```text
LUx = b
```

Let:

```text
Ux = y
```

Then:

```text
Ly = b
```

So we solve two triangular systems instead of starting elimination from scratch each time.

If row exchanges are needed, the more accurate factorization is:

```text
PA = LU
```

where `P` is a permutation matrix that represents the row swaps.

## The main takeaway

The most important idea from this first block is not the mechanics of elimination. The mechanics are important, but the deeper idea is:

```text
Ax = b asks whether b can be built from the columns of A.
```

Elimination is the algorithmic way to answer that question.

Pivots tell us whether the columns are independent enough.

The inverse exists only when the matrix does not collapse information.

And `LU` is a way of packaging elimination so that we can reuse it.

In the next post, this column-picture idea becomes much more powerful. We move from solving one system to understanding the spaces created by a matrix: column space, nullspace, rank, basis, dimension, and projections.
