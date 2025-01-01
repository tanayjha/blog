---
title: "Max Flow Min Cut"
date: 2017-04-21T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---
PS: The images in this blogpost were hosted on a site which was taken down so they are lost and I don't remember where I took them originally from so this is hard to read right now. Have to fix this in future.

### MIN CUT

We have already talked about the maximum flow problem. Now is a good time to talk about a seemingly different but actually quite similar to the maximum flow problem, i.e the min-cut problem.

A cut is defined on two vertices A and B such that we can partition all the vertices of the graph into two sets such that A and B do not belong to the same set.
Going by this definition an **s-t cut** can be defined as a partition of the vertices of a graph such that the source and the sink are not in the same partition.

Now we associate with a cut, what is called the **capacity of the cut**. It is defined as the sum of the flow of edges that go out of the cut. We do not consider the edges coming back into the cut as we want an upper bound on the amount of flow that can go out of the cut.

Formally the capacity of a s-t cut is defined as:

sum
 where δ+(A) is used to denote the set of edges sticking out of A. (Similarly we will use δ-(A) to denote the set of edges sticking into A)
 
<Figure 1>

In the above figure, the capacity of the cut X is 4+3=7, as it is the flow going out of the cut.

**The problem of finding the min-cut, is to find a cut which has the smallest capacity.**

### THE LEAP OF FAITH....

The problem of finding the min-cut is very closely related to that of finding the max-flow. They are so intimately related that we claim,

The value of max-flow = The capacity of the min-cut

### MAX-FLOW MIN-CUT THEOREM

To show that the value of the maximum flow is equal to the capacity of the minimum cut, we will show that these three statements are equivalent for a flow f in the graph:

1) f is a maximum flow.
2) ∃ cut (A, B) such that value of f = capacity of (A, B)
3) Gf has no s-t path.

We will prove a cyclic implication. First we prove 1 => 3, then 2 => 1 and finally 3 => 2, hence showing that the three statements are equivalent.

Moreover, we will prove that the value of a flow f <= capacity of a cut (A, B), and this is true for every flow and every cut. So if we plot all possible flow values and the capacity of all possible cuts, we will have this situation:

<Figure 2>

### PROOF

Step 1
Let's start the proof by showing 1 => 3.
To prove this, we will try to prove the contrapositive of this statement, i.e ~3 => ~1

~3 states that there is at least one s-t path in Gf.
~1 states that f is not the maximum flow.

So we need to prove that if there is a s-t path in Gf, then f is not the maximum flow.
The above statement is very intuitive if we think of it in terms of the ford fulkerson algorithm. In that algorithm, we found a s-t path and pushed the maximum flow we could along that path. Hence if we have a remaining s-t path, then we can push some flow along it, thereby increasing the value of maximum flow for the network.
Hence if there is a remaining s-t path, the present flow is not maximum.

Step 2
Now, we will try to prove that 2 => 1
Here we have to show that if there is a cut (A, B) such that the capacity of the cut = the value of the flow f in the network, then that flow f is the max-flow.

To prove this, it is sufficient to show that,

∀ f, ∀ (A, B),   value of f <= capacity of (A, B)

This is exactly what we depicted in figure 2. Let's prove this mathematically now.

Fix f and (A, B)

value of f =  Amount of flow going out of the source

<Figure 3>  Equation 1



Now we can add the above equation for all the vertices in A except s, as they will all amount to zero due to the conservation principle (flow out = flow in)


<Figure 4>  Equation 2



Now lets think about the flow value in an edge centric way, rather than a vertex centric way. So we need to think that how much does an edge e contribute to the flow. The edges with both end points inside A will not contribute to the flow. Similarly those with both end points in B will also not contribute to the flow.
However, the edges sticking out of A or coming into A, will contribute to the flow.

                             


<Figure 5>  Equation 3

Now the edges going out of A can have the maximum value equal to the capacity of the edge (ue) and the edges coming back into A can have the minimum value 0.
Hence we can say that 
                         




<Figure 6>  Equation 4
This completes the proof for 2 => 1


Step 3
Finally, we will prove that 3 => 2
So we have to prove that if Gf has no s-t path, then there exists a cut (A, B) and a flow f, such that, the value of f = capacity of (A, B)

Let us construct a set A such that,
<Figure 7>

i.e A consists of all the vertices that are reachable from the source.
Now (A, V-A) is a s-t cut (assuming that the sink is not reachable from the source, i.e there is no more augmenting path present, hence the flow is max-flow)

Now we claim two things:
1) No arc can leave A, as if it could, A would be bigger (as A consists of all the vertex reachable from s). Hence we have fe = ue ∀e ∊ δ+(A). Hence Gf has no forward edge of positive value coming out of A.

2) All the edges coming into A, will have zero flow. Because if they contained a positive flow, the reverse edge in Gf will be sticking out of A, and A would be bigger. Hence we have fe = 0 ∀e ∊ δ-(A). Hence Gf has no backward edge of positive value going into A.

Now, observing equation 4 we get that the assumptions we took for maximizing the flow value, hold exactly in this arrangement of the cut i.e all edges sticking out of A are at their maximum capacity and all edges coming back into A are present at zero capacity.

Hence the value of flow f in this situation is maximum and by observing figure 2, we get that it is equal to the capacity of a cut which is actually minimum.

### CONCLUSION

We have shown that we can construct a cut, such that the capacity of the cut is minimum and it equals a corresponding flow in the network, which is at its maximum possible value.

Hence, the maximum flow problem and the minimum cut problem, even though formulated completely differently, have the same solution.