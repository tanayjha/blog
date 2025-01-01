---
title: "Fermats Little Theorem"
date: 2017-06-08T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---

In my post on RSA encryption system I mentioned the use of Fermat's little theorem. In this post I am going to give a formal proof (and explain in simple terms) the theorem itself. This will also give you a chance to boast among your friends (possibly nerdy) that you know the proof to one of Fermat’s theorem ;)

### THE STATEMENT

Fermat's little theorem states that:
For any integer a not divisible by p and any prime p, the following always holds: a(p-1) ≡ 1 (mod p)
The reason why the theorem states that a should not be divisible by p is very clear. Let us assume that a was divisible by p, then obviously p will divide a(p-1).
So this means that a<sup>(p-1)</sup> ≡ 0 (mod p) when p | a. So this is an exception and is separately mentioned in the theorem.

### PROOF

Now coming to the actual proof of the theorem. If we see the left hand side of the equation in the statement, we have the term a(p-1). So it is clear that this was obtained by multiplying a, p-1 times.

Now let us take a look at the first p-1 multiples of a. These are:
**a, 2a, 3a, ..., (p-1)a**
In general two different multiples of a can be expressed as ra, sa (where r≠ s, and r, s <= p-1)
Now we will try to find the properties of the remainders obtained when these multiples are divided by p-1. We claim that all the remainders obtained will be distinct and will cover the range 1, 2, ... , p-1.
Now to prove the above claim we assume that it is false and then obtain a contradiction. So we assume that there exists some r and s such that ra ≡ sa (mod p).(where r≠ s, and r, s <= p-1)
Solving the above equation, we can cancel out a from both sides and be left with r ≡ s (mod p). But this is not possible. As both r is less than p, hence when divided by p it will give a remainder r itself and hence r = s. However we started out with the assumption that ra and sa were two distinct multiples of a, but we came to the conclusion that the remainders of the two with p, can be same iff they are the same multiples.
Hence, all the first (p-1) multiples of a have unique remainders modulo p. And since the remainder of a number modulo x ranges from 0 to x-1, so the remainder modulo p, will also range from 0 to p-1. Moreover we claim that none of them will have a remainder 0 as it is already stated that p ∤ a.

So now we know that the remainder of the numbers a, 2a, ..., (p-1)a are in the range 1, 2, ..., p-1. Now let us multiply all these numbers together and take them modulo p (remembering the fact that we need a(p-1) on the LHS)
So we get,  
a.2a.3a...(p-1)a ≡ 1.2.3...(p-1) (mod p)  
(p-1)!. a<sup>(p-1)</sup> ≡ (p-1)! (mod p)  
Cancelling (p-1)! from both sides we get,  
a<sup>(p-1)</sup> ≡ 1 (mod p)  
Which was the original statement that we had to prove!

### THE USE OF LITTLE THEOREM
 
Although asking about the use of a theorem is an insult to a pure mathematician, but Fermat’s little theorem shows us that how a pure number theory related theorem can be used in something so modern.
The Little theorem dates back to 1640s and as we already saw in the RSA blog post, RSA was conceptualized in 1970s and is still in active use.
The basis of RSA is formed using Fermat's little theorem. Finally I would like to end with a quote from G.H Hardy, one of the best contemporary number theorist     
*Pure mathematics, may it never be of any use to anyone.*  
This clearly sums up the fact that mathematician don't actually care if their theorem can be applied to some practical use or not, but when it does it creates something as beautiful as the RSA!
 