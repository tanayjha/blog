---
title: "Maximum Flow"
date: 2017-04-19T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---


### PROBLEM DESCRIPTION

The problem of finding the maximum flow in a network, has a history which dates back to the second world war.

Practically the maximum flow problem can be stated as: 
“A list of pipes is given, with different flow-capacities. These pipes are connected at their endpoints. What is the maximum amount of water that you can route from a given starting point to a given ending point?” or equivalently “A company owns a factory located in city X where products are manufactured that need to be transported to the distribution center in city Y. You are given the one-way roads that connect pairs of cities in the country, and the maximum number of trucks that can drive along each road. What is the maximum number of trucks that the company can send to the distribution center?”

Formally stated the problem is:
We are given a network - a directed graph, in which every edge has a certain capacity c associated with it, a starting vertex (called the source), and an ending vertex (called the sink). We are asked to associate another value f(called the flow) for each edge such that for every vertex other than the source and the sink, the sum of the values associated to the edges that enter it must equal the sum of the values associated to the edges that leave it. Furthermore, we are asked to maximize the sum of the values associated to the arcs leaving the source, which is the total flow in the network (which is the same as the sum of the arcs flowing into the sink).

### CONSTRAINTS

A flow in the network will have the following constraints:
1) Fi <= Ci  for all i ∈ Edges of the network
2) Flow in = Flow out ∀ Vertices ≠ s (source), t (sink)

The first constraint states that the flow on an edge should not exceed it's capacity.
The second constraint states that the flow into any vertex should equal the flow outside the vertex for all vertex except the source and the sink.

### REPRESENTATION

So the network looks something like this:

<add network image>

The representation a/b on every edge represents the flow/capacity for that particular edge. The flow in the network can be calculated as the total flow leaving the source i.e 3+2 = 5 in the above example. Obviously, the above two constraints must be followed for the flow to be a valid flow.

### RESIDUAL GRAPH

Now we define the concept of residual graph.

The residual graph of graph G is denoted by Gf and is constructed by using the following two rules for every edge in G:
1) For every edge with flow fi in G draw a forward edge with capacity ci - fi in Gf. This is also called the residual flow.
2) For every edge with flow fi in G draw a backward edge with capacity fi in Gf. This is also called the backward flow. The main purpose of this edge is to undo the flow already sent into the network.

{{< figure src="http://www.cs.yale.edu/homes/aspnes/pinewiki/attachments/MaxFlow/residualGraph2.png"  >}}
                                
In the diagram above, we see a flow network G and it's corresponding residual graph Gf.

### MAXIMUM FLOW CONDITION

Now that we have defined a residual graph, we make a statement for the maximum flow in the network.
A flow in the network can be called the maximum flow if and only if, the residual graph corresponding to that flow does not have any s-t path
An s-t path in the graph is a path from the source to the sink which consists only of forward edges with positive residual capacity.
To see why the above statement is true we can try and prove the contrapositive of this statement that: if there is an s-t path in the residual graph then it implies that the current flow is not maximum. This is quite evident as if there exists an s-t path then we can simply push the maximum possible flow along that path thereby increasing the flow.

### FORD-FULKERSON ALGORITHM

 The Ford-Fulkerson algorithm consists of the following steps:

Step 1: Find a s-t path in Gf (residual graph) using DFS/BFS.
Step 2: Find the edge having the minimum value in the s-t path chosen in step 1.
Step 3: Push the minimum flow calculated in step 2 along the s-t path.
Step 4: Reconstruct the residual graph from the graph with the updated flow in step 3.
Step 5: If there are no more s-t path in the residual graph then terminate the algorithm.

### IMPLEMENTATION

 The implementation of this algorithm is pretty straight forward. Here I provide one using C++ with STL.

{{< gist tanayjha 80f62b58e730b79d3236cbf0d28920f4 >}}
