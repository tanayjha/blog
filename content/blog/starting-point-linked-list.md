---
title: "Detecting starting point of loop in a linked list"
date: 2019-06-06T12:01:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---

Detecting the starting point of a loop in a linked list is a very popular problem. In fact most you reading this might already be knowing the algorithm to solve this. However understanding why that algorithm works is a separate challenge altogether.

I was in the same state and decided to find an explanation of why it works. I could not find convincing explanations by simple google searches and hence decided to right this blog.
Hopefully, this will satisfy the curiosity of people trying to understand the reasoning behind this algorithm.

I believe coming up with this algorithm in the first place is an even bigger challenge. You will have to stay with this problem a lot longer if you want to do that. For now let's assume we have the algorithm and let's try to prove why it should work.

### The Algorithm

The key insight of the algorithm is that we need to maintain two pointers: Slow and Fast,

Slow pointer: Moves one node at a time.
Fast pointer: Moves two nodes at a time.

The first thing to realise is that these pointers are definitely going to meet at some position in the loop. To convince yourself, consider this:
* Both the pointers are going to enter the loop at some point.
* The fast pointer will catch up with the slow pointer one step at a time (since it moves at double the speed)

{{< figure src="/images/linkedList.png"  >}}

Above diagram shows an example of a loop.

Now we know that the pointers are going to meet at some point in the loop.

The second step of the algorithm says that bring one of the pointers to the start of the list. 
Now move both the pointers (one at the start and one at the meeting point in the loop) one step at a time.  **The next time they meet will be the starting point of the list.**

Let's try to prove this algorithm.

### Proof

We need to consider certain variables to mathematically formulate the problem.

m - number of links a pointer has to travel to reach the starting point of the loop
l - the number of links a pointer has to travel to complete one cycle of the loop
k - the number of links a pointer has to travel from the starting point of the loop to reach the meeting point of the nodes in the first step of the algorithm.

Now that we have defined these variables, let us consider the following:

**Distance travelled by the slow pointer to reach the meeting point = m + p * l + k**

m is the distance travelled to reach the starting of the loop. Let's say it makes p rounds of the loop (notice that p can be zero) and finally it travels k distance from the loop start to reach the meeting point.


**Distance travelled by the slow pointer to reach the meeting point = m + q * l + k**

This is similar to the slow pointer except that the fast pointer makes q rounds of the loop. Since it travels at twice the speed hence q > p.

Now we know that, distance travelled by fast pointer = 2 * distance travelled by slow pointer

So, **m + q * l + k = 2 * (m + p * l + k) => (m + k) = (q - 2 * p) * l**

What this means is that (m + k) is an integral multiple of the length of the loop or in other words, (m+k) % l = 0. So if you travel a distance of (m+k) in the loop, you will reach the start of the loop.

Now we can consider the second part of the algorithm. We bring one pointer to the start of the list. 
Now when this pointer takes m steps, it reaches the start of the loop.
How much distance would the second pointer have covered by this time? It would be m+k. 
Why? Since it was already at an offset k after the first step of the algorithm and then it travels m more steps.

Now we know that (m+k) is a multiple of l. That means the second pointer has reached the start of the loop and so has the first pointer. This implies that both the pointer will meet at the beginning of the loop after the second step of the algorithm. Hence the algorithm works.

[Credit](https://www.youtube.com/watch?v=apIw0Opq5nk)