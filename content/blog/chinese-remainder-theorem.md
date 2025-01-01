---
title: "Chinese Remainder Theorem"
date: 2017-04-26T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---


In this post I would like to talk about the Chinese Remainder Theorem. You might have heard this problem as a kid: **There are x number of things. When taken in groups of 5, they leave a remainder 1. When taken in groups of 7, they leave a remainder 2. When taken in groups of 9, they leave a remainder 3. And when taken in groups of 11, they leave a remainder 4. Find the value of x.** We will see how such problems can be solved using the Chinese Remainder Theorem(CRT).

### LINEAR CONGRUENCES

Lets talk about linear congruences. You might have already encountered them informally in my previous post on the RSA encryption system. Here I would like to introduce it a bit more formally.

**ax ≡ b (mod n)**

Abusing the use of notation, we can express this equation into a form which might look more familiar, i.e **ax%n = b**. In other words, the integer ax when divided by n leaves a remainder equal to b.

Lets say that we find a solution to the above equation, say x = x0.
=> ax0 ≡ b (mod n)
=> n | (ax0 - b) (where | stands for divide)
=> ax0 - b = ny0
=> **ax0 - ny0 = b** ..... (1)

Hence the linear congruence equation reduces to the well known **diophantine equation**. If you are familiar with the diophantine equation, feel free to skip the next part.

### DIOPHANTINE EQUATION

The most general form of the diophantine equation is: **ax + by = c**

Lets try to analyse this equation for integer solutions. 
It is easy to see that this equation will have infinite integer solutions as it is the equation of a line. Hence all the integer (x, y) points on the line, will satisfy this equation.

But it might be the case that this equation does not possess any integer solution. This can happen when the line does not pass through any integer (x, y) coordinate. Let us try to find that condition mathematically.

Let, **d = gcd(a, b)** hence a = rd and b = sd where gcd(r, s) = 1
Replacing the value of a and b in the original diophantine equation, we get, 

=> rdx + sdy = c 
=> d(rx + sy) = c
=> **d | c** (As c/d is an integer from the above equation)

Hence the condition for the diophantine equation ax + by = c to have integer solution is **d | c, where d = gcd(a, b)**.

Now lets find the family of solution for the diophantine equation. Lets say that we have found a solution **(x0, y0)** for the equation. Now we want to find another solution say (x', y')

=> ax0 + by0 = ax' + by' = c
=> a(x' - x0) = b(y0 - y')
=> rd(x' - x0) = sd(y0 - y')   (d = gcd(a, b))
=> r(x' - x0) = s(y0 - y')
=> r | s(y0 - y')
=> r | (y0 - y')   (as gcd(r, s) = 1) .... (2)

Similarly
=> s | (x' - x0)    .... (3)

From (3), we have

=> x' - x0 = st
=> x' = x0 + st (where b = ds, so s = b/d)
=> **x' = x0 + (b/d).t** .... (4)

And from (2) we get,
**y' = y0 - (a/d).t** .... (5)

Hence from (4) and (5), we get the complete solution for the diophantine equation.

### BACK TO LINEAR CONGRUENCE

Having studied the diophantine equation, we can start our analysis of equation (1) now, which was **ax0 - ny0 = b**

Through a direct comparison with the diophantine equation, we have the following condition for the existence of integer solution to this equation
d | b, where d = gcd(a, n)
Moreover the family of solution for x can be given as, 
**x0, x0 + n/d, x0 + 2.n/d, ....., x0 + t.n/d** ........ (6)

It is worth noting that we are now solving a congruence modulo n. Hence there will be finite number of unique solutions. We claim that there will be only d number of unique solutions. In other words, equation (6) should have a constraint 0 <= t < d, for all solutions to be unique.
First we will prove uniqueness of any two solution in this range. Let, x0 + (n/d).t1 and x0 + (n/d).t2 be the two solution such that 0 <= t1 < t2 <= d-1.
We have to prove that these two solutions cannot be congruent modulo n.

We will prove this by contradiction. Let us assume that the two solutions are congruent modulo n. Hence,
=> x0 + (n/d).t1 ≡ x0 + (n/d).t2 (mod n)
=> (n/d).t1 ≡ (n/d).t2 (mod n)
=> (n/d).(t1 - t2) = ny
=> (t1 - t2) = nd
=> **t1 ≡ t2 (mod d)** ... (7)

From (7), we have that d | (t1 - t2) or d | (t2 - t1)
But since 0 <= t1 < t2 <= d-1, hence **0 < t2 - t1 < d**. So there is no way in which d divides (t2 - t1). So d ∤ (t2 - t1), which is a contradiction. Hence all the d solutions are unique.
Now it remains to be proved that ∀ t >= d, the solutions are not unique.
Let t = q.d + r where r = {0, 1, ..... d-1}
So, x0 + (n/d).t = x0 + (n/d).(q.d + r)
=> x0 + nq + (nr/d)
=> x0 + (n/d).r (mod n)
And as 0 <= r < d, hence this is one of the d unique solutions we already found.

Hence the linear congruence ax ≡ b (mod n) has integer solutions only when d | b, where d = gcd(a, b) and it has exactly d unique solutions given as:

**x0, x0 + (n/d), x0 + (2n/d), ...., x0 + ((d-1).n/d)**

### SYSTEM OF SIMULTANEOUS LINEAR CONGRUENCE

Having studied about a linear congruence in depth, lets move our focus to a system of such equations. 

a1x ≡ b1 (mod n1)
a2x ≡ b2 (mod n2)
a3x ≡ b3 (mod n3)
.
.
arx ≡ br (mod nr)

Now for the above system of congruences to have a soution, each of the linear congruences should have a solution individually.
So if we consider dk = gcd(ak, nk) ∀ k∈{0, 1... r}, dk | bk. Moreover, we assume that gcd(ni, nj) = 1 i.e the n's are relatively prime to each other.
Now lets go back to the question we asked during the beginning of the post. If we try to formulate that question in terms of congruences, we will have the following system of linear equations.

x ≡ 1 (mod 5)
x ≡ 2 (mod 7)
x ≡ 3 (mod 9)
x ≡ 4 (mod 11)

We have to solve for x.

### CHINESE REMAINDER THEOREM

CRT aims at solving the type of linear congruence systems as described by the above problem. CRT states that:
For a system of linear congruences of the form
x ≡ b1 (mod n1)
x ≡ b2 (mod n2)
x ≡ b3 (mod n3)
.
.
x ≡ br (mod nr)
where gcd(ni, nj) = 1, it will always have a unique solution modulo n = n1.n2.n3...nr.

Lets try to prove the CRT and find that unique solution.

**Proof**: I will give more of an informal proof for the CRT as the formal one is pretty unintuitive. Let us begin by thinking of an integer which can satisfy all the above linear congruences. (We can be sure that each linear congruence will have a solution as ai = 1 for each equation and gcd(1, ni) = 1 and 1 | bi)
Now the value x should be such that it produces the remainder bi's when divided by the corresponding ni's. Hence, it becomes clear that the solution must contain r terms most probably added together. Now when divided by a particular ni only one term should produce the remainder. Rest all the terms should evaluate to zero.
Hence we introduce another variable
Nk = n1.n2....nk-1.nk+1....nr
So it is the product of all the numbers except nk.
Moreover the term which remains should produce the remainder ak. So if we consider the solution to be of the form a1N1 + a2N2 + .... + arNr.
We have the number remaining when take modulo nk as akNk (mod nk). However we wanted the modulo to be just ak. So we need to somehow get rid of the Nk.
Well, we can define another linear congruence equation:
Nk.x ≡ 1 (mod nk) .... (8)
The above equation provides a method of finding the modular multiplicative inverse of an integer. (Nk in this case)
Let us say that the above equation has a solution x = xk (Again we can check that it has just one unique solution using the argument proved before). Hence we have that Nk.xk ≡ 1 (mod nk) and so Nk.xk.ak ≡ ak (mod nk), which is what we wanted.
So now we can construct the final solution as:
x' = a1N1x1 + a2N2x2 + .... + arNrxr
It is easy to verify that the above solution satisfies all the linear congruences individually.
As for the argument of this solution being unique, let us assume that there exists another solution x'' such that x' ≢ x'' (mod n) (where n = n1.n2.n3...nr)
Now as both x' and x'' are solutions to the system, hence we can say that:
x' ≡ ak ≡ x'' (mod nk)
=> nk | x' - x''
So we have n1 | x' - x'', n2 | x' - x''.... nr | x' - x''
We can combine all these to give n | x' - x'' (as gcd(ni, nj) = 1)
=> x' - x'' ≡ 0 (mod n)
=> x' ≡ x'' (mod n)
Which is a contradiction and hence the two solutions are congruent. So there is just one unique solution of the CRT, which is
x' = a1N1x1 + a2N2x2 + .... + arNrxr

Now lets finally go back to the problem posed at the start.
x ≡ 1 (mod 5)
x ≡ 2 (mod 7)
x ≡ 3 (mod 9)
x ≡ 4 (mod 11)

We have to solve the above set of linear congruences. Using CRT, we have
N1 = 7.9.11 = 693
N2 = 5.9.11 = 495
N3 = 5.7.11 = 385
N4 = 5.7.9 = 315
and a1 = 1, a2 = 2, a3 = 3 and a4 = 4
Also we have to solve
693.x1 ≡ 1 (mod 5)
495.x2 ≡ 1 (mod 7)
385.x3 ≡ 1 (mod 9)
315.x4 ≡ 1 (mod 11)
Using brute-force we can obtain x1 = 2, x2 = 3, x3 = 4, x4 = 8.
Hence the final solution is:
x' = 1.693.2 + 2.495.3 + 3.385.4 + 4.315.8
    = 19056

Taking the final solution modulo n (where n = 5.7.9.11 = 3465), we have

19056 ≡ 1731 (mod 3465) 
Hence 1731 is the required unique solution which is the smallest too.