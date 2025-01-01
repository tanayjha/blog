---
title: "Birthday Paradox"
date: 2024-07-28T00:24:13+05:30
draft: false
showToc: true
ShowReadingTime: true
---

## Context

This is going to be a quick blogpost on the [birthday paradox](https://en.wikipedia.org/wiki/Birthday_problem). This is a famous probability theory problem, which asks for the probability that, in a set of n randomly chosen people, at least two will share a birthday. 
This is called a paradox and for a good reason. The solution to this problem is very counter-intuitive. This blog post is going to be an attempt to use some computer science and maths to analyze this problem and figure out why this is called a paradox.

## Some Maths

The first time I had seen this problem, it was framed like this: "If there are more than 23 people in a room there is a more than 50 percent chance that at least two people have the same birthday". My mind was blown when I read this and obviously the initial reaction was that this is not possible.
However, after using some basic probablity theory I was able to convince myself that this is indeed the case. 

Let's look at some math to derive this:

Let p be the probability that no two people in a room have the same birthday. Also let us assume there are 365 days in a year (lets leave out leap years to make calculations simpler).
Now the probablity that at least two people will have the same birthday will be (1 - p).

Now lets try to see if the statement above i.e if there are 23 people in a room, then the probability of same birthday is > 50% is true or not.

Lets try to calculate p first, i.e all the 23 people have different birthday.
Once we have p, we can calculate same birthday case with (1 - p) where the statement claims that it is > 0.5. Hence, p has to be < 0.5.

In order to calculate p, lets try to assign birthday to these 23 people one by one ensuring there is no collision.
So the first person can have a birthday on any of the 365 days. But the second person only has 364 choices (cannot pick the day the first person has their birthday on). The third person will have 363 choices and so on. Finally the 23rd person will have (365 - 23 + 1) = 343 choices.

Hence probability that none of them have birthdays on the same day is a product of all these choices, i.e:

365/365 * 364/365 * 363/365 * ... * 343/365

I don't know if there is an easy way to do this calculation by hand but if you use a computer/calculator to do this you will see that this indeed comes out to be 49.27 which means (1 - p) i.e probability of at least two same birthdays is 50.72 hence proving the statement.

## Some CS

With the above mathematics we did, we were able to kind of define a pattern to calculate the probability of two people having same birthday given a number of people. Once we are able to define a function like this, we can convert it into a computer program and allow the computer to do all this hard work and we can sit back and enjoy the result. I did exactly this.

### Monte Carlo Simulation

Apart from implementing the above probability calculation in a python program, I also implemented a random simulation for this. This is also called [Monte Carlo Simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method). You probably already know this. Let me explain by an example of a coin toss. 
If you toss a coin, we know that the probability is 50% for a heads and 50% for a tails. You also would have heard that you can actually run this experiment multiple times to convince yourself that this is indeed the case. So for eg., if you toss a coin 10 times, it is possible you get 4 tails and 6 heads. However, as you keep on increasing the number of coin tosses, this probability will keep on shifting towards 50%.
We can implement this idea in code by using the random library to simulate a coin toss. This is what I did for the birthday problem. Lets see how the code looks like for these two approaches.

## Code

{{< gist tanayjha 2fb33ba128bb1c2282246f7186403ff5 >}}

## Results

The code runs in two modes, first is the math aspect of getting the probability of same birthday as the number of people in the room increases from 1 to 100. It plots a graph of the number of people in the room on the x-axis and the probability of same birthday on the y-axis. Here is the graph:

{{< figure src="/images/birthdayParadox/peopleVsProb.png"  >}}

I have also marked two points of interest on the graph. The first is the point where the probability crosses 50% and second is the point where it crosses 99%.
As expected, the first point is at 23 (as seen in the maths section) and the second point is at 57. This means that as soon as the number of people in a room increases to 57, there is a **99%** chance that two people have the same birthday. This is literally insane!!

And now for the simulation, I tried simulating the probability of same birthday when 30 people are in a room. And here are the results of the simulation:

{{< two-images first="/images/birthdayParadox/50Simul.png" second="/images/birthdayParadox/100Simul.png" >}}
{{< two-images first="/images/birthdayParadox/1000Simul.png" second="/images/birthdayParadox/10kSimul.png" >}}

It can be seen that as we increase the number of experiments the probability very clearly converges to 70% which is as per expectation. Hence the Monte Carlo simulation can be used as a tool to solve this problem.

## Conclusion

Hopefully through this blogpost you got a taste of how counter-intuitive probability can be and how well computer science can aid us in solving some of these probablistic problems with random library and graphs.