---
title: "Ramsey Numbers"
date: 2026-07-11T00:24:46+05:30
draft: false
showToc: true
ShowReadingTime: true
---

I was browsing LinkedIn when I came across a post mentioning the probabilistic method of proof. As always, that sent me down a rabbit hole of learning what it is about.

I read that it was Erdos who first introduced this proof technique and the post described it kind of like magic (well to be honest it was a comment under a post. I don't even remember what the post was about).
Then started a week long journey about exploring this probabilistic method of proof. I had heard about Paul Erdos specifically because of the concept of Erdos number. Also knew about the many open problems he had posed to mathematicians.
I realised that the probabilistic method was first introduced around 1947 in a proof of lower bound for diagonal Ramsey numbers by Erdos. Now this was a completely new field for me. I had never even heard about Ramsey numbers. So I set out to explore it with the intention of being able to enjoy the probabilistic proof and feel the magic the comment mentioned.
This blog is an attempt to capture my understanding with the hope that I am able to relive this feeling later or someone else who stumbles on this blog is able to enjoy the same feeling.

One thing which makes this problem even more fascinating is how quickly brute force becomes useless. A red/blue coloring of K<sub>n</sub> means choosing one of two colors for each of the n(n - 1)/2 edges. So there are 2<sup>n(n-1)/2</sup> possible colorings. For K<sub>24</sub>, this is 2<sup>276</sup>, which is about 1.2 × 10<sup>83</sup>. That is already more than the usual estimate for the number of atoms in the observable universe. So even though the statement of the problem is simple, searching through all possibilities is not a serious strategy for very long.

### Reference Material

Since Ramsey theory was a completely new thing for me, I first set out to find any lectures/books that can help me understand it.
I first wanted to look at the [paper](https://projecteuclid.org/journalArticle/Download?urlId=bams%2F1183510596) Erdos had published but that turned out to be quite short without much details. Then I checked some books on the subject and they were too dense.
It was surprising that Frank Ramsey, who died pretty young (at the age of 27) was able to come up with such an interesting theory that there are books written on it and still leaving open problems almost 100 years after its inception.
Finally I got this [lecture series](https://www.youtube.com/watch?v=rK484PiJ9t8&list=PLpcU2wNhmPYcAcsvebUBh28XeEt0Y4WyH&index=1) from the professor Shahriar Shahriari on youtube. This was perfect for me since it started with the introduction to Ramsey numbers and went till the probabilistic method proof by Erdos so I decided to stick with it. It has been very well made and clear.

Whatever I present is a distillation from the above lecture series.

### Some Notations

Ramsey theory is mainly concerned with graphs. Hence there are certain graph theory concepts we need to know in order to be able to deal with Ramsey Theory. I will briefly mention the concepts (which are not obvious) used for understanding the material.

#### Simple Graphs

A simple graph G is a pair of sets (V, E), where V is the set of vertices and E is the set of edges.

{{< figure src="/images/ramseyNumbers/simpleGraph.png" alt="A simple graph" >}}

#### Degree of a vertex

deg(v) is the number of edges incident with the vertex v.

#### Complete Graph

A complete graph of order n (having n vertices) is represented as K<sub>n</sub>.
K<sub>n</sub> is a simple graph which has n vertices and all possible edges.
Each vertex has degree n - 1.

Total edges = (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2.

#### Subgraph

Let G = (V, E) and H = (V', E') be two graphs.
Then H is a subgraph of G if V' ⊆ V and E' ⊆ E.

### Motivating Problem

Let us start with a problem that does not look like graph theory at all.

Suppose we are on a social media platform and we pick any 6 users. For every pair of users, either they are friends with each other or they are not friends with each other. The claim is that among these 6 users, we can always find either:

1. 3 users who are all friends with each other, or
2. 3 users none of whom are friends with each other.

This is already a pretty interesting statement. It does not say that for some carefully chosen set of 6 users this will happen. It says that no matter which 6 users we pick, this pattern is unavoidable.

Now let us reformulate this using graphs.

Create one vertex for each user. Between every pair of vertices draw an edge, because every pair of users has some relation: either friends or not friends. So we get K<sub>6</sub>, the complete graph on 6 vertices.

Now color each edge:

1. blue if the two users are friends,
2. red if the two users are not friends.

So the original problem becomes: if we color every edge of K<sub>6</sub> either blue or red, are we guaranteed to find a triangle whose three edges all have the same color?

Such a triangle is called a monochromatic triangle. In graph notation, it is a monochromatic K<sub>3</sub>.

#### Arrow notation

This kind of statement is so common in Ramsey theory that we introduce a notation for it.

K<sub>s</sub> → K<sub>n</sub>, K<sub>m</sub>

means that if the edges of K<sub>s</sub> are colored using two colors, say blue and red, then we are guaranteed to find either a blue K<sub>n</sub> or a red K<sub>m</sub>.

So the friends problem is exactly the statement:

K<sub>6</sub> → K<sub>3</sub>, K<sub>3</sub>

In words: every red/blue coloring of the edges of K<sub>6</sub> contains a monochromatic triangle.

#### Why K<sub>6</sub> works

Pick any vertex v in K<sub>6</sub>. Since v is connected to the other 5 vertices, there are 5 edges coming out of it.

Each of these 5 edges is either blue or red. No matter how we color them, at least 3 of these edges must have the same color. This is just the pigeonhole principle: if we split 5 objects into 2 buckets, one bucket must contain at least 3 objects.

Let us say that at least 3 of the edges from v are blue. Call the other ends of these edges a, b and c.

{{< figure src="/images/ramseyNumbers/k6-proof-cases.svg" alt="Two cases in the proof that K6 forces a monochromatic triangle" >}}

Now look at the edges among a, b and c.

If any one of the edges among a, b and c is blue, then that edge together with the two blue edges going back to v gives us a blue triangle.

If none of the edges among a, b and c is blue, then all three of them are red. But then a, b and c themselves form a red triangle.

So in either case, we get a monochromatic triangle.

The exact same argument works if the 3 edges coming out of v were red instead of blue. Hence:

K<sub>6</sub> → K<sub>3</sub>, K<sub>3</sub>

#### Why K<sub>5</sub> does not work

Now the natural question is whether 6 is really necessary. Maybe 5 users are enough?

It turns out that 5 is not enough. We can prove this by giving one coloring of K<sub>5</sub> which has no monochromatic triangle.

Place 5 vertices in a pentagon. Color the 5 edges of the pentagon blue. Now color the remaining 5 diagonal edges red.

{{< figure src="/images/ramseyNumbers/k5-counterexample.svg" alt="A red-blue coloring of K5 with no monochromatic triangle" >}}

The blue edges form a cycle of length 5, so there is no blue triangle. The red edges also form a cycle of length 5 (just another pentagon drawn using the diagonals), so there is no red triangle either.

Hence:

K<sub>5</sub> ↛ K<sub>3</sub>, K<sub>3</sub>

So 6 is the threshold. For 5 vertices we can avoid a monochromatic triangle, but for 6 vertices it becomes impossible to avoid one.

### Ramsey Theorem and Ramsey Numbers

The motivating problem gives us the first real taste of Ramsey theory. In a large enough and complicated enough system, some ordered pattern becomes unavoidable. This is the line that stuck with me from the lecture: there is order in chaos.

The theorem says that the above phenomenon is not special to triangles.

For any positive integers n and m, there exists a positive integer s such that:

K<sub>s</sub> → K<sub>n</sub>, K<sub>m</sub>

In words, if the complete graph is large enough, then every red/blue coloring of its edges will contain either a blue K<sub>n</sub> or a red K<sub>m</sub>.

The smallest such s is called the Ramsey number and is denoted by r(n, m).

So:

r(n, m) = the smallest s such that K<sub>s</sub> → K<sub>n</sub>, K<sub>m</sub>.

From the motivating problem, we have:

r(3, 3) = 6

There are a few immediate observations:

1. r(n, m) = r(m, n), because swapping the names of the two colors does not change the problem.
2. r(1, m) = 1, because a single vertex is already a K<sub>1</sub>.
3. r(2, m) = m. If we have m vertices, then either there is a blue edge (a blue K<sub>2</sub>) or all edges are red, which gives a red K<sub>m</sub>.

### Ramsey Theorem Proof

The proof of Ramsey theorem is not only going to show that Ramsey numbers exist. It also gives us an upper bound.

We will prove the following:

r(n, m) ≤ r(n - 1, m) + r(n, m - 1)

This is assuming n, m > 1 and that the two Ramsey numbers on the right hand side already exist. This is what lets us prove the theorem by induction.

Let:

s = r(n - 1, m) + r(n, m - 1)

We want to show that:

K<sub>s</sub> → K<sub>n</sub>, K<sub>m</sub>

Take any red/blue coloring of the edges of K<sub>s</sub>. Now focus on one vertex v.

The degree of v is s - 1, because it is connected to every other vertex.

Among these s - 1 edges, either:

1. at least r(n - 1, m) of them are blue, or
2. at least r(n, m - 1) of them are red.

Why? Because if both of these were false, then the number of edges incident with v would be at most:

(r(n - 1, m) - 1) + (r(n, m - 1) - 1) = s - 2

But v has s - 1 incident edges. So at least one of the two cases must happen.

#### Case 1: at least r(n - 1, m) blue edges

Look at the vertices at the other end of these blue edges. There are at least r(n - 1, m) such vertices.

By definition of r(n - 1, m), the graph on these vertices contains either:

1. a blue K<sub>n-1</sub>, or
2. a red K<sub>m</sub>.

If it contains a red K<sub>m</sub>, we are done.

If it contains a blue K<sub>n-1</sub>, then we can add v to it. Since all the edges from v to these vertices are blue, this gives a blue K<sub>n</sub>.

So again we are done.

#### Case 2: at least r(n, m - 1) red edges

This is exactly the same argument with the colors swapped.

Look at the vertices at the other end of these red edges. By definition of r(n, m - 1), among those vertices we either get:

1. a blue K<sub>n</sub>, in which case we are done, or
2. a red K<sub>m-1</sub>, which together with v gives a red K<sub>m</sub>.

So K<sub>s</sub> always contains either a blue K<sub>n</sub> or a red K<sub>m</sub>. Hence:

r(n, m) ≤ r(n - 1, m) + r(n, m - 1)

Since the base cases r(1, m) and r(n, 1) are both 1, induction proves that r(n, m) is always finite.

That is Ramsey theorem.

### Lower and Upper Bounds for Ramsey Numbers

Now that we know Ramsey numbers exist, the next question is obvious: how large are they?

This is where things get hard very quickly. Even for fairly small values, exact Ramsey numbers are not known. So instead of trying to find the exact value, we usually try to find lower and upper bounds.

#### A weak lower bound

For n, m > 1:

r(n, m) ≥ (n - 1)(m - 1) + 1

To prove this, let:

s = (n - 1)(m - 1)

We will construct a coloring of K<sub>s</sub> which has no blue K<sub>n</sub> and no red K<sub>m</sub>. That will show that s vertices are not enough, so r(n, m) must be at least s + 1.

Arrange the s vertices in m - 1 rows, with n - 1 vertices in each row.

Now color the edges as follows:

1. If two vertices are in the same row, color the edge blue.
2. If two vertices are in different rows, color the edge red.

{{< figure src="/images/ramseyNumbers/weak-lower-bound-construction.svg" alt="The weak lower bound construction for Ramsey numbers" >}}

There is no blue K<sub>n</sub>, because a blue clique has to lie completely inside one row, and each row has only n - 1 vertices.

There is no red K<sub>m</sub>, because a red clique can have at most one vertex from each row, and there are only m - 1 rows.

So:

K<sub>(n-1)(m-1)</sub> ↛ K<sub>n</sub>, K<sub>m</sub>

Hence:

r(n, m) ≥ (n - 1)(m - 1) + 1

For example, this gives r(5, 5) ≥ 17. This is not a great bound, but it is a good warm-up because the proof is constructive. We explicitly built a coloring which avoids the pattern.

#### A probabilistic lower bound for diagonal Ramsey numbers

Now comes the proof which started this whole rabbit hole for me.

We will focus on diagonal Ramsey numbers, i.e. r(n, n).

The weak bound says r(n, n) ≥ (n - 1)<sup>2</sup> + 1, which is roughly quadratic in n. The probabilistic method gives something much stronger: an exponential lower bound.

First, I will write C(s, n) for the number of ways to choose n objects from s objects.

The claim is:

If C(s, n) < 2<sup>C(n, 2) - 1</sup>, then r(n, n) > s.

In other words, under this condition, there exists at least one red/blue coloring of K<sub>s</sub> which has no monochromatic K<sub>n</sub>.

The key phrase here is "there exists". We are not going to construct the coloring. We are just going to prove that at least one such coloring must exist.

Let A be the total number of ways to color the edges of K<sub>s</sub> using red and blue.

Since K<sub>s</sub> has C(s, 2) edges, and each edge has 2 choices of color:

A = 2<sup>C(s, 2)</sup>

Now let us count the number of "bad" colorings, i.e. colorings which contain a monochromatic K<sub>n</sub>.

To create such a bad coloring, we can overcount as follows:

1. Choose the n vertices which will form the monochromatic K<sub>n</sub>. This can be done in C(s, n) ways.
2. Choose the color of this K<sub>n</sub>. This can be done in 2 ways.
3. Force all C(n, 2) edges inside this K<sub>n</sub> to have that color.
4. Color all the remaining edges however we want.

So the number of bad colorings B is at most:

B ≤ C(s, n) · 2 · 2<sup>C(s, 2) - C(n, 2)</sup>

This is an overcount because the same coloring might contain many monochromatic K<sub>n</sub>'s and get counted multiple times. But that is fine. An upper bound on the bad colorings is enough.

If B < A, then not all colorings are bad. So at least one coloring must be good. And a good coloring is exactly a coloring with no monochromatic K<sub>n</sub>.

Now:

C(s, n) · 2 · 2<sup>C(s, 2) - C(n, 2)</sup> < 2<sup>C(s, 2)</sup>

Cancelling 2<sup>C(s, 2)</sup> from both sides, this becomes:

C(s, n) < 2<sup>C(n, 2) - 1</sup>

Which is the condition we started with. Hence if this condition holds, then:

r(n, n) > s

Let us try this for n = 5.

Here C(n, 2) = C(5, 2) = 10, so 2<sup>C(n, 2) - 1</sup> = 2<sup>9</sup> = 512.

If we take s = 11, then C(11, 5) = 462, which is less than 512. So the probabilistic proof tells us:

r(5, 5) > 11

This is actually worse than the weak lower bound for n = 5, because the weak bound gave r(5, 5) ≥ 17. But the probabilistic method gets better as n becomes large. That is where the magic is.

With a little more care, the same argument gives the famous lower bound:

r(n, n) > 2<sup>n/2</sup>

Here is the rough idea.

We already know that if C(s, n) < 2<sup>C(n, 2) - 1</sup>, then r(n, n) > s.

Also:

C(s, n) = s(s - 1)(s - 2)...(s - n + 1)/n! < s<sup>n</sup>/n!

Take s = floor(2<sup>n/2</sup>). Then:

C(s, n) < 2<sup>n^2/2</sup>/n!

For n ≥ 3, n! is bigger than 2<sup>n/2 + 1</sup>. So:

C(s, n) < 2<sup>n^2/2 - n/2 - 1</sup>

But:

C(n, 2) - 1 = n(n - 1)/2 - 1 = n^2/2 - n/2 - 1

Therefore C(s, n) < 2<sup>C(n, 2) - 1</sup>, and hence:

r(n, n) > 2<sup>n/2</sup>

Strictly speaking, the floor only proves r(n, n) > floor(2<sup>n/2</sup>). But r(n, n) is an integer, so this is enough to conclude r(n, n) > 2<sup>n/2</sup>.

This is a very different kind of proof from the weak lower bound. We do not know what the coloring looks like. We only know that the number of bad colorings is smaller than the total number of colorings, so a good coloring must exist.

That is the part which felt like magic to me.

#### The upper side

For comparison, the recursive proof of Ramsey theorem gives an upper bound too.

Using:

r(n, m) ≤ r(n - 1, m) + r(n, m - 1)

and induction with the binomial identity, we get:

r(n, m) ≤ C(n + m - 2, n - 1)

So for diagonal Ramsey numbers:

r(n, n) ≤ C(2n - 2, n - 1)

This is much larger than the probabilistic lower bound. So even after all this, there is still a huge gap between what we can prove must exist and what we can prove must always happen.

And that is also why Ramsey numbers are so fascinating. The statement is easy enough to explain using friends at a party, but the actual numbers become mysterious almost immediately.

### Conclusion

The lower bound we proved above comes from Erdos's 1947 probabilistic argument. There have been refinements to the constant factor since then, but the main exponential base for the best known two-color diagonal lower bound is still √2. In other words, more than 75 years later, this side of the problem still has the same basic shape as Erdos's original insight.

There has been very recent progress, but it is important to state it correctly. The breakthrough by [Campos, Griffiths, Morris and Sahasrabudhe](https://arxiv.org/abs/2303.09521) in 2023 was an improvement to the upper bound, not the lower bound we proved here. They showed that for some ε > 0:

r(n, n) ≤ (4 - ε)<sup>n</sup>

This was the first exponential improvement over the classical Erdos-Szekeres upper bound. So the broad picture is now that r(n, n) grows at least roughly like (√2)<sup>n</sup> and at most like (4 - ε)<sup>n</sup>. That is still a massive gap.

So this remains very much an unsolved problem. We know that order must eventually appear in chaos, but we still do not know exactly how large the chaos has to be!
