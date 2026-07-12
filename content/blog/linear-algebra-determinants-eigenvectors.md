---
title: "Linear Algebra - Determinants, Eigenvectors, and Long-Term Behavior"
date: 2026-07-12T17:09:19+05:30
summary: "Part 3 of my Linear Algebra notes from Gilbert Strang's lectures: determinants, eigenvalues, diagonalization, Fibonacci, differential equations, and Markov matrices."
tags: ["linear-algebra", "math", "matrices"]
categories: ["Math"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is the third post in my Linear Algebra notes series based on Prof. Gilbert Strang's [MIT Linear Algebra lectures](https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D).

The [first post](/blog/linear-algebra-column-picture/) was about `Ax = b`, elimination, inverses, and LU.

The [second post](/blog/linear-algebra-subspaces-projections/) was about column space, nullspace, rank, basis, projections, and least squares.

This post is about two more big ideas:

- determinants,
- eigenvalues and eigenvectors.

The way I think about it now:

**The determinant tells us the total scaling effect of a matrix. Eigenvectors tell us the special directions where the matrix acts in the simplest possible way.**

## Determinant for 2 x 2

For a `2 x 2` matrix:

```text
A = [a b]
    [c d]
```

the determinant is:

```text
det(A) = ad - bc
```

At first this looks like a random formula. But geometrically it has a very clean meaning.

If the columns of `A` are two vectors in the plane, then `|det(A)|` is the area of the parallelogram formed by those two vectors.

So determinant is measuring area scaling.

If:

```text
det(A) = 0
```

then the area has collapsed to zero. The two column vectors lie on the same line. The matrix is singular.

This matches what we saw earlier:

- dependent columns,
- no inverse,
- zero determinant,
- collapsed geometry.

All of these are the same story told in different languages.

## Determinant properties

Some core properties:

```text
det(I) = 1
```

Exchanging two rows changes the sign of the determinant.

If two rows are equal, the determinant is zero.

If a row is multiplied by a number `c`, the determinant is multiplied by `c`.

If a multiple of one row is added to another row, the determinant does not change.

For triangular matrices:

```text
det(A) = product of diagonal entries
```

This is very useful because elimination often converts a matrix into triangular form. We just have to remember what row operations were used along the way:

- row replacement does not change determinant,
- row exchange flips the sign,
- row scaling scales the determinant.

There are also two very important product/transpose rules:

```text
det(AB) = det(A) det(B)
det(A^T) = det(A)
```

The transpose rule is why determinant properties for rows also work for columns.

## Cofactors and Cramer's rule

For larger matrices, determinant can be written as a sum over permutations, but that is not the most pleasant way to compute it by hand.

The cofactor expansion is more understandable.

For entry `aij`, delete row `i` and column `j`. Take the determinant of the remaining matrix, with a sign:

```text
Cij = (-1)^(i+j) det(Mij)
```

Then expanding along a row gives:

```text
det(A) = a11 C11 + a12 C12 + ... + a1n C1n
```

When `det(A) != 0`, this also gives the inverse formula:

```text
A^-1 = (1 / det(A)) C^T
```

where `C` is the cofactor matrix.

Cramer's rule solves:

```text
Ax = b
```

by replacing one column of `A` with `b`.

If `Bj` is the matrix formed by replacing column `j` of `A` with `b`, then:

```text
xj = det(Bj) / det(A)
```

This is theoretically beautiful, but computationally not the way we normally solve systems. Elimination is much better. Still, Cramer's rule is useful because it shows how deeply determinants are connected to solving linear equations.

## Eigenvectors

Now let us move to eigenvectors.

Most vectors change direction when multiplied by a matrix. But some special vectors do not.

For an eigenvector `x`:

```text
Ax = lambda x
```

The matrix only scales `x` by `lambda`. It does not rotate it away from its original direction.

`lambda` is the eigenvalue.

So an eigenvector is a direction where the matrix behaves like a simple number.

That is a big deal because matrices are usually complicated, but numbers are easy.

## Finding eigenvalues

Starting from:

```text
Ax = lambda x
```

we move everything to one side:

```text
(A - lambda I)x = 0
```

We want a nonzero `x`, so the matrix `A - lambda I` must have a nontrivial nullspace. That means it must be singular.

So:

```text
det(A - lambda I) = 0
```

This is the characteristic equation.

Once we solve this equation and get eigenvalues, we plug each one back into:

```text
(A - lambda I)x = 0
```

and find the corresponding eigenvectors from the nullspace.

There is also a useful check:

```text
sum of eigenvalues = trace(A)
```

where trace means the sum of diagonal entries.

For a `2 x 2` matrix:

```text
A = [a b]
    [c d]
```

the trace is:

```text
a + d
```

and the determinant is:

```text
ad - bc
```

The eigenvalues encode both of these:

```text
lambda1 + lambda2 = trace(A)
lambda1 * lambda2 = det(A)
```

## Projection and rotation examples

Projection matrices are a great example.

If `P` projects vectors onto a line or plane, then any vector already inside that line or plane does not change:

```text
Px = x
```

So:

```text
lambda = 1
```

for directions inside the projected subspace.

Any vector perpendicular to that subspace gets collapsed to zero:

```text
Px = 0
```

So:

```text
lambda = 0
```

in the perpendicular direction.

Rotations are also interesting. A 90-degree rotation in the real plane has no real eigenvectors, because no nonzero real vector keeps its direction after being rotated by 90 degrees.

If we allow complex numbers, eigenvalues appear. This is one of those moments where complex numbers are not just a trick; they complete the picture.

## Diagonalization

Suppose a matrix has enough independent eigenvectors.

Put those eigenvectors into the columns of a matrix `S`:

```text
S = [x1 x2 ... xn]
```

Then multiplying by `A` gives:

```text
AS = [Ax1 Ax2 ... Axn]
```

Since each `xi` is an eigenvector:

```text
AS = [lambda1 x1 lambda2 x2 ... lambdan xn]
```

This can be written as:

```text
AS = S Lambda
```

where `Lambda` is a diagonal matrix containing the eigenvalues.

If `S` is invertible:

```text
A = S Lambda S^-1
```

This is diagonalization.

The point is that diagonal matrices are easy. So if we can rewrite a matrix in terms of a diagonal matrix, many problems become simpler.

## Powers of a matrix

One immediate use of diagonalization is computing powers.

If:

```text
A = S Lambda S^-1
```

then:

```text
A^k = S Lambda^k S^-1
```

The middle part is easy because `Lambda` is diagonal:

```text
Lambda^k = diagonal matrix with lambda1^k, lambda2^k, ...
```

This is extremely useful when we want to understand repeated application of a matrix.

For example:

```text
u(k+1) = A u(k)
```

Then:

```text
u(k) = A^k u(0)
```

Diagonalization turns this from repeated multiplication into understanding powers of eigenvalues.

## Fibonacci numbers

The Fibonacci recurrence is:

```text
F(k+2) = F(k+1) + F(k)
```

We can write it as a matrix system:

```text
[F(k+2)] = [1 1] [F(k+1)]
[F(k+1)]   [1 0] [F(k)]
```

So:

```text
u(k+1) = A u(k)
```

where:

```text
A = [1 1]
    [1 0]
```

The eigenvalues of this matrix are:

```text
lambda1 = (1 + sqrt(5)) / 2
lambda2 = (1 - sqrt(5)) / 2
```

The first number is the golden ratio.

The reason Fibonacci numbers grow roughly like powers of the golden ratio is that:

```text
|lambda1| > |lambda2|
```

As powers grow, the larger eigenvalue dominates the long-term behavior.

This is a really nice example because it shows that eigenvalues are not just abstract definitions. They describe growth.

## Differential equations

Eigenvalues also solve systems of differential equations.

Consider:

```text
du/dt = A u
```

Try a solution of the form:

```text
u(t) = e^(lambda t) x
```

Then:

```text
du/dt = lambda e^(lambda t) x
```

and:

```text
A u = e^(lambda t) A x
```

For these to match, we need:

```text
Ax = lambda x
```

So once again, eigenvectors are the directions where the system separates cleanly.

If `A` has enough independent eigenvectors, the general solution looks like:

```text
u(t) = c1 e^(lambda1 t) x1 + c2 e^(lambda2 t) x2 + ...
```

If an eigenvalue is negative, its term decays as `t` grows. If an eigenvalue is positive, its term grows. If the matrix is not diagonalizable, the complete solution needs generalized eigenvectors too, but the eigenvalue intuition about growth and decay is still the main point here.

So eigenvalues tell us long-term behavior.

## Markov matrices and steady state

The final topic in my handwritten notes was Markov matrices.

The example in the notes was:

```text
A = [0.1  0.01 0.5]
    [0.2  0.99 0.3]
    [0.7  0    0.4]
```

This is a column-stochastic matrix:

1. all entries are nonnegative,
2. every column adds to `1`.

For such a matrix, `lambda = 1` is an eigenvalue.

If we repeatedly multiply:

```text
u(k) = A^k u(0)
```

then under the usual steady-state conditions, for example when the Markov matrix is regular, the components from all other eigenvalues fade away because their absolute values are less than `1`.

What remains is the eigenvector for:

```text
lambda = 1
```

That vector is the steady state.

This is a very satisfying point to end the notes because it connects linear algebra to probability, random walks, PageRank-like ideas, and eventually machine learning.

In fact, the last line in my handwritten notes says:

```text
Ending Linear Algebra Study
Starting with ML
```

## The main takeaway

Determinants and eigenvectors summarize matrices in different ways.

The determinant tells us whether the matrix preserves volume, flips orientation, scales space, or collapses dimensions.

Eigenvectors tell us the directions where the matrix is easiest to understand.

Diagonalization turns repeated matrix multiplication into powers of numbers.

That is why the same idea shows up in Fibonacci numbers, differential equations, Markov chains, and many other places.

This is also one of the reasons I wanted to study linear algebra in the first place. In the world of LLMs, so much of what is happening is vectors, matrices, projections, high-dimensional spaces, and repeated transformations stacked on top of each other. Of course, knowing linear algebra does not magically explain all of deep learning, but it gives the right language to even start thinking about embeddings, attention, and why these models operate in vector spaces.

For me, this is probably the biggest lesson from Strang's lectures: linear algebra is not just a collection of techniques. It is a language for understanding transformations, spaces, and long-term behavior.
