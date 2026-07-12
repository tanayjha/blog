---
title: "Linear Algebra - Column Space, Nullspace, and Projections"
date: 2026-07-12T17:08:19+05:30
summary: "Part 2 of my Linear Algebra notes from Gilbert Strang's lectures: spaces, rank, basis, orthogonality, projections, and least squares."
tags: ["linear-algebra", "math", "matrices"]
categories: ["Math"]
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is the second post in my Linear Algebra notes series based on Prof. Gilbert Strang's [MIT Linear Algebra lectures](https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D).

In the [first post](/blog/linear-algebra-column-picture/), the main point was:

```text
Ax = b means b is a linear combination of the columns of A.
```

This post is about taking that idea seriously.

Once we start thinking in terms of columns and combinations, we naturally run into spaces: column space, nullspace, row space, and left nullspace. This is where linear algebra starts becoming less about solving one system and more about understanding what the matrix is capable of doing.

## Vector spaces and subspaces

A vector space is a collection of vectors where we can add vectors and multiply them by numbers without leaving the collection.

For example, `R^2` is the set of all 2-dimensional vectors:

```text
[x]
[y]
```

A subspace is a smaller vector space inside a larger one.

The important test is closure under linear combinations. If `v` and `w` are in the subspace, then:

```text
cv + dw
```

should also be in the subspace for all numbers `c` and `d`.

This immediately tells us that every subspace must contain the zero vector, because we can choose `c = 0` and `d = 0`.

Some examples:

- a line through the origin is a subspace of `R^2`,
- a plane through the origin is a subspace of `R^3`,
- a line not passing through the origin is not a subspace.

That last point is easy to miss. A shifted line may look like a line, but it is not a vector subspace because it does not contain the zero vector and is not closed under scaling.

## Column space

For a matrix `A`, the column space is:

```text
C(A) = all linear combinations of the columns of A
```

So if:

```text
A = [a1 a2 a3]
```

then:

```text
C(A) = all vectors c1 a1 + c2 a2 + c3 a3
```

This connects directly to solving equations:

```text
Ax = b
```

is solvable exactly when `b` is in the column space of `A`.

So the question:

> Does Ax = b have a solution?

is the same as:

> Is b in C(A)?

This is one of those statements that sounds obvious once written down, but it changes the way we think about systems of equations.

## Nullspace

The nullspace is:

```text
N(A) = {x | Ax = 0}
```

In words, it is the set of inputs that the matrix sends to zero.

The nullspace is always a subspace. If `Av = 0` and `Aw = 0`, then:

```text
A(cv + dw) = cAv + dAw = 0
```

So any linear combination of nullspace vectors is still in the nullspace.

There is always at least one solution to `Ax = 0`, namely:

```text
x = 0
```

The interesting question is whether there are nonzero solutions. If there are, the matrix is collapsing some nonzero direction to zero. That is a sign of dependence among the columns.

## Pivots, free variables, and rank

After elimination, columns split into two types:

- pivot columns,
- free columns.

The number of pivots is the rank:

```text
rank(A) = number of pivots
```

If `A` has `n` columns and rank `r`, then:

```text
number of free variables = n - r
```

Each free variable gives one special solution vector, and those special solution vectors generate the nullspace.

For `Ax = 0`, the usual method is:

1. Reduce the matrix.
2. Identify pivot variables and free variables.
3. Set one free variable to `1` and the others to `0`.
4. Solve for the pivot variables.
5. Repeat for each free variable.

The resulting vectors are called special solutions. Their combinations give the entire nullspace.

So:

```text
dim N(A) = n - rank(A)
```

This is one of the places where rank starts to feel like the central number in the whole subject.

## Complete solution to Ax = b

When `Ax = b` is solvable, the full solution has a very clean form:

```text
x = xp + xn
```

Here:

```text
A xp = b
A xn = 0
```

So:

```text
A(xp + xn) = A xp + A xn = b + 0 = b
```

`xp` is one particular solution. `xn` is anything in the nullspace.

This also explains why the solution set to `Ax = b` is usually not a subspace. If `b` is not zero, the solution set generally does not pass through the origin. It is a shifted version of the nullspace.

The homogeneous equation `Ax = 0` gives a subspace.

The non-homogeneous equation `Ax = b` gives:

```text
particular solution + nullspace
```

## Independence, span, basis, dimension

Some definitions that keep showing up:

Vectors are independent if the only way to combine them to get zero is the trivial way:

```text
c1 v1 + c2 v2 + ... + cn vn = 0
```

only when:

```text
c1 = c2 = ... = cn = 0
```

If there is a nonzero combination that gives zero, the vectors are dependent.

The span of vectors is the set of all their linear combinations:

```text
span(v1, ..., vk)
```

A basis for a space is a set of vectors that:

1. spans the space,
2. is independent.

The dimension of the space is the number of vectors in any basis.

For the column space, a basis comes from the pivot columns of the original matrix.

For the nullspace, a basis comes from the special solutions.

This is another important connection: elimination is not just solving equations. It is also finding bases.

## Four fundamental subspaces

For an `m x n` matrix `A`, there are four fundamental subspaces:

```text
C(A)      column space      subspace of R^m
N(A)      nullspace         subspace of R^n
C(A^T)    row space         subspace of R^n
N(A^T)    left nullspace    subspace of R^m
```

If `rank(A) = r`, their dimensions are:

```text
dim C(A)   = r
dim C(A^T) = r
dim N(A)   = n - r
dim N(A^T) = m - r
```

This table is one of the cleanest summaries of linear algebra.

The same rank controls both column space and row space. The missing dimensions become the nullspaces.

## Orthogonality

Two vectors are orthogonal if their dot product is zero:

```text
x^T y = 0
```

The four fundamental subspaces come in orthogonal pairs:

```text
row space is orthogonal to nullspace
C(A^T) perpendicular to N(A)
```

and:

```text
column space is orthogonal to left nullspace
C(A) perpendicular to N(A^T)
```

The first statement is easy to see.

If `x` is in `N(A)`, then:

```text
Ax = 0
```

That means every row of `A` has dot product zero with `x`. Therefore every combination of rows is also perpendicular to `x`. But every combination of rows is in the row space.

So:

```text
row space ⟂ nullspace
```

This is a beautiful result because it connects solving equations with geometry.

## When Ax = b cannot be solved

Sometimes `Ax = b` has no solution. This happens when `b` is not in the column space of `A`.

But in applications, we often still want the best possible answer.

For example, suppose we are fitting a line to data points. Usually the points do not lie exactly on a line. So the exact equation:

```text
Ax = b
```

may have no solution.

The natural thing to do is find the closest vector in the column space of `A`.

Call that closest vector `p`:

```text
p = A x_hat
```

The error is:

```text
e = b - p
```

At the closest point, the error must be perpendicular to the column space. Otherwise we could move inside the column space and get closer.

So:

```text
A^T e = 0
```

Substituting `e = b - A x_hat`:

```text
A^T(b - A x_hat) = 0
```

which gives:

```text
A^T A x_hat = A^T b
```

These are the normal equations.

## Projection matrix

If the columns of `A` are independent, then `A^T A` is invertible. So:

```text
x_hat = (A^T A)^-1 A^T b
```

The projection is:

```text
p = A x_hat
```

So:

```text
p = A(A^T A)^-1 A^T b
```

The projection matrix is:

```text
P = A(A^T A)^-1 A^T
```

and:

```text
p = Pb
```

This formula looks intimidating, but the idea is simple: `P` takes a vector and drops it onto the column space of `A`.

## Least squares and linear regression

For line fitting, we usually write:

```text
b = C + Dt
```

For several observed points, this becomes:

```text
A x ≈ b
```

where:

```text
x = [C]
    [D]
```

The least-squares solution is the `x` that minimizes the squared error. Linear algebra gives it through:

```text
A^T A x_hat = A^T b
```

This was one of my favorite connections in the lectures. Linear regression, which shows up everywhere in data science and machine learning, is basically a projection problem.

We are projecting the observed vector `b` onto the column space of the design matrix `A`.

## Orthonormal columns and Gram-Schmidt

Things become much simpler when columns are orthonormal.

If `Q` has orthonormal columns, then:

```text
Q^T Q = I
```

So the least-squares equation becomes:

```text
Q^T Q x_hat = Q^T b
```

which reduces to:

```text
x_hat = Q^T b
```

This is why orthonormal bases are so convenient.

Gram-Schmidt is the process of taking independent vectors and turning them into orthonormal vectors without changing the space they span.

For two vectors, the idea is:

```text
take a
remove from b the part pointing in the direction of a
normalize both
```

If `a` is already unit length, the part of `b` in the direction of `a` is:

```text
(a^T b) a
```

So the perpendicular part is:

```text
b - (a^T b) a
```

Doing this repeatedly gives an orthonormal basis.

This leads to the QR factorization:

```text
A = QR
```

where `Q` has orthonormal columns and `R` is upper triangular.

## The main takeaway

This block of linear algebra is the conceptual core for me.

Rank tells us how much information the matrix really has.

Column space tells us which `b` vectors are reachable.

Nullspace tells us what gets collapsed to zero.

Basis and dimension tell us the size of a space without listing every vector.

Orthogonality explains why projections and least squares work.

And least squares gives a direct bridge from pure linear algebra to fitting data.

In the next post, the focus shifts again. We look at determinants and eigenvectors: two ways of summarizing what a matrix does globally and what it does repeatedly.
