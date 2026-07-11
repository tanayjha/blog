---
title: "Euclid's GCD Algorithm"
date: 2021-03-08T12:09:25+05:30
summary: "A proof-oriented explanation of Euclid's algorithm and why the classic GCD method works."
tags: ["algorithms", "math", "number-theory"]
categories: ["Algorithms"]
cover:
  image: "images/gcd.png"
  alt: "Euclid GCD example"
draft: false
showToc: true
ShowReadingTime: true
---

This post is going to focus on a very simple concept: finding the [GCD](https://en.wikipedia.org/wiki/Greatest_common_divisor#:~:text=In%20mathematics%2C%20the%20greatest%20common,divides%20each%20of%20the%20integers) of two numbers. If you think this is too easy and we don't need a post on it, well, you are probably right :D. You might even know of efficient ways of finding the GCD (mostly used in competitive programming). But many of you may not be aware of the mathematics and proof behind how that method works. If that is the case, you are not alone. I was in the same boat for many years. I have used that [3 line GCD](https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations) method many times in solving programming questions, never thinking deeply about why it works. There is no issue in this. After all, there is a good reason why abstraction is so popular. But I do believe that when you get a chance, there is no harm in diving deep. You may get to learn a few things and, as always, be fascinated by what math has to offer even in the simplest of concepts. So let's begin...

### Context

Now we all know at least one way of finding the GCD of two numbers. Find all the factors of both the numbers and find the one which is common between the two and which is the largest. Agreed, this is just a repeat of the definition of GCD, but if you do exactly this you will find the GCD, which makes sense. The problem is that this method is not very efficient. It's probably fine to do this when the numbers you are calculating the GCD for are small, but things start to get ugly as the numbers become big.

So we need a more systematic and efficient method of calculating the GCD, which is exactly the purpose of this blog.
But before we understand that method, let's start with some basic definitions and we will build up our theory from there.

### The Division Algorithm

When solving things from first principles, we have to get down to the basic level. Once you go down there, you realize how many things we take for granted without having the proper proof. Again, I am not advocating that you should prove everything you use, but at least trying that can be a fun and educational activity. So I am going to do that. I feel it gives more confidence in the final result.

So let's start with the statement of the division algorithm.

Given integers a and b with b > 0, there exist unique integers q and r satisfying a = bq + r, 0 &le; r < b.

**Proof**: First we need to prove the existence of numbers q and r. Then we will focus on uniqueness.

Let's begin by proving that the set S = { a - xb | x is an integer, a - xb &ge; 0 } is non-empty.
So we need to find an integer x such that a - xb &ge; 0. We know that b &ge; 1 and a is an integer.
Let's take x = -|a|. Substituting that in, we get a - (-|a| &middot; b) = a + |a|b &ge; a + |a| (as b &ge; 1) &ge; 0. Hence this lies in S and S is non-empty. By the [Well Ordering Principle](https://en.wikipedia.org/wiki/Well-ordering_principle), the set contains a least element; let's call it r. So there exists some integer q for which r = a - qb where r &ge; 0.

We argue that r < b. We can prove this by contradiction. Assume r &ge; b. Consider the number
a - (q + 1)b = (a - qb) - b = r - b &ge; 0; also r - b < r, contradicting r as the smallest element in the set S. Hence r < b. This proves the existence of q and r in the division algorithm. Let's now prove the uniqueness.

Again we start with a contradiction, that there are two values, q<sub>1</sub>, q<sub>2</sub> and r<sub>1</sub>, r<sub>2</sub>, satisfying this equation.
So a = bq<sub>1</sub> + r<sub>1</sub> and a = bq<sub>2</sub> + r<sub>2</sub> where 0 &le; r<sub>1</sub> < b and 0 &le; r<sub>2</sub> < b.
&rArr; bq<sub>1</sub> + r<sub>1</sub> = bq<sub>2</sub> + r<sub>2</sub> &rArr; r<sub>1</sub> - r<sub>2</sub> = b(q<sub>2</sub> - q<sub>1</sub>).
Now since r<sub>1</sub> and r<sub>2</sub> are both in [0, b), &rArr; -b < r<sub>1</sub> - r<sub>2</sub> < b &rArr; -1 < (q<sub>2</sub> - q<sub>1</sub>) < 1, and since q<sub>2</sub> - q<sub>1</sub> is an integer it must be 0. &rArr; q<sub>1</sub> = q<sub>2</sub> and r<sub>1</sub> = r<sub>2</sub>, thereby completing the proof.

### The Euclidean Algorithm

Now, let's start interacting with the GCD and take the first step towards Euclid's algorithm. We first introduce a lemma which will more or less pave the way to the actual algorithm.

**Lemma**: If a = bq + r, then gcd(a, b) = gcd(b, r).

**Proof**: This statement did not look obvious to me, at least in any way. So the only way to convince ourselves that this is true is by proving it.

Let's say gcd(a, b) = d &rArr; d | a and d | b; also, for all e such that e | a and e | b, e | d. (Note that this is actually the definition of GCD expressed in mathematical terms.)

Now if d | a and d | b &rArr; d | a - bq &rArr; d | r. So d is definitely a candidate to be the gcd(b, r) since it divides both b and r.
But we don't know if it is the highest such divisor. Let's assume it's not, and assume that there is an integer e which is the gcd(b, r) &rArr; e | b and e | r. So e | bq + r &rArr; e | a.
Now gcd(a, b) = d. And since e | a and e | b, e &le; d. Since if e > d, then e should have been the GCD of a and b. This proves that d is also the gcd(b, r), thereby proving the lemma.

Now that we have proved this seemingly unintuitive result, here comes the masterstroke step of Euclid's algorithm. We apply the division algorithm repeatedly, giving us the following set of equations:

```
a     = bq       + r,        0 < r      < b
b     = rq_1     + r_1,      0 < r_1    < r
r     = r_1 q_2  + r_2,      0 < r_2    < r_1
r_1   = r_2 q_3  + r_3,      0 < r_3    < r_2
.
.
.
r_{n-1} = r_n q_{n+1} + r_{n+1},  where r_{n+1} = 0
```

Basically, we claim that since the remainders r<sub>1</sub>, r<sub>2</sub>, etc. are strictly decreasing, they will become 0 after n steps (at most b steps, to be precise).

Now if we apply the above GCD lemma to these equations sequentially, we will get the following:

gcd(a, b) = gcd(b, r) = gcd(r, r<sub>1</sub>) = ... = gcd(r<sub>n-1</sub>, r<sub>n</sub>) = gcd(r<sub>n</sub>, 0) = r<sub>n</sub>

The above statement basically gives us a new method of finding the GCD of two numbers. Simply put, it says to apply the division algorithm repeatedly to the numbers, and once the remainder becomes 0 (which it eventually will), the divisor at that stage is the GCD.

Here is the 3 line method of GCD calculation now.

{{< figure src="/images/gcd.png"  >}}

If you understand recursion well, it shouldn't be hard to see how this is exactly the code conversion of the process illustrated above and why this should give the GCD.

### Complexity Analysis

The time complexity of this method is O(log(max(a, b))), so basically logarithmic. I tried reading the proof of this, but it is a bit complicated. Turns out the worst case happens with consecutive Fibonacci numbers and is related to the golden ratio. It definitely seems like a good thing to explore.
However, I'm not going to do that in this post. Anyway, I will have to read about it first myself to get a proper understanding. Maybe in a future post..

**Update**: Read around a bit and found a few sources. This is the concrete analysis of the runtime as given by Knuth in his TAOCP book. I found it to be very involved and difficult to understand. Feel free to give it a shot if you want.
This, on the other hand, is a little less rigorous but still a good proof of the logarithmic runtime. It uses very simple arguments and shouldn't be hard to understand. Feel free to go through it.


Hopefully, this post gives you more confidence in using the Euclidean method of finding the GCD from now on. And even if you never use it, who cares? What would matter is how the proof made you feel and not if it was useful :)
