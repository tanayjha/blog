---
title: "Introduction to Game Theory"
date: 2026-07-19T10:28:10+05:30
summary: "A first introduction to players, strategies, payoffs, dominated choices, and why rational decisions can still produce bad outcomes."
tags: ["game-theory", "math", "economics", "decision-making"]
categories: ["Math"]
cover:
  image: "images/game-theory/grade-game-notes.jpg"
  alt: "Handwritten notes for the Grade Game"
draft: false
showToc: true
ShowReadingTime: true
---

## Context

I watched *A Beautiful Mind* a long time back. Like most people, I came away knowing that John Nash was a genius and that something called the Nash equilibrium was very important.

But I did not actually know what a Nash equilibrium was.

For some reason, understanding it had been on my bucket list for a long time. I had made one attempt at learning game theory earlier, but stopped somewhere in the middle. This time I started with a much more focused goal: learn enough game theory to properly understand the idea Nash came up with when he was only 21.

I followed Prof. Ben Polak's [Game Theory course at Yale](https://www.youtube.com/playlist?list=PL6EF60E1027E1A10B). The course was highly recommended, and I was not disappointed. He is an amazing instructor, and I would strongly recommend the lectures to anyone who wants to learn this subject.

As usual, I took handwritten notes while going through the course. A cleaned-up and correctly oriented copy is available here:

**[My handwritten Game Theory notes](/files/game-theory-notes.pdf)**

This is the first of two posts based on those notes. This post is about the basic language of game theory: players, strategies, payoffs, and dominated choices. The [second post](/blog/understanding-nash-equilibrium/) will focus entirely on Nash equilibrium.

## What does game theory study?

Game theory studies strategic interaction.

The word *strategic* is the important part. In a normal optimization problem, I choose an action and get some result. In a game, my result also depends on what other people choose.

For example:

- a company deciding its price has to think about competitors,
- a footballer taking a penalty has to think about the goalkeeper,
- a political candidate choosing a position has to think about the other candidate,
- two people working on a joint project have to think about how much effort the other person will put in.

My best decision may change when the other person's decision changes.

That is the basic problem game theory is trying to formalize.

## The ingredients of a game

A game needs three things:

1. **Players**: the people or agents making decisions.
2. **Strategies**: the actions available to each player.
3. **Payoffs**: how much each player likes every possible outcome.

Let us start with the Grade Game from the notes.

## The Grade Game

Suppose two students are asked to secretly choose either `alpha` or `beta`. Their grades depend on both choices.

| Me \ Other student | alpha | beta |
|---|---:|---:|
| **alpha** | (B-, B-) | (A, C) |
| **beta** | (C, A) | (B+, B+) |

The first value in each cell is my grade. The second value is the other student's grade.

So if I choose `alpha` and the other student chooses `beta`, the outcome is `(A, C)`: I get an A and the other student gets a C.

{{< figure src="/images/game-theory/grade-game-notes.jpg" alt="Handwritten Grade Game payoff tables" >}}

This table is called an **outcome matrix** or a **payoff matrix**.

The row player chooses a row. The column player chooses a column. Together, their choices identify one cell.

The important thing is that neither player controls the outcome alone.

## Turning outcomes into payoffs

Grades are understandable, but mathematical analysis becomes easier if we convert them into numbers.

Suppose the students only care about their own grades, and we use:

```text
A  ->  3
B+ ->  1
B- ->  0
C  -> -1
```

The game becomes:

| Me \ Other student | alpha | beta |
|---|---:|---:|
| **alpha** | (0, 0) | (3, -1) |
| **beta** | (-1, 3) | (1, 1) |

These numbers are called **utilities** or **payoffs**.

They do not have to represent money. They only have to represent the player's preferences. A payoff of `3` means I prefer that outcome to one with payoff `1`. The actual units do not matter as much as the ordering.

This also means that payoffs depend on what a person cares about.

If I feel guilty about giving the other student a C, then `(A, C)` may not be worth `3` to me anymore. The physical outcome has not changed, but my utility from it has. That can change the game itself.

## A dominant choice

Now let us look at the row player's decision.

If the other student chooses `alpha`:

```text
my payoff from alpha = 0
my payoff from beta  = -1
```

So I prefer `alpha`.

If the other student chooses `beta`:

```text
my payoff from alpha = 3
my payoff from beta  = 1
```

Again, I prefer `alpha`.

So `alpha` is better for me regardless of what the other student does.

We say that `alpha` **strictly dominates** `beta`.

The game is symmetric, so the exact same reasoning applies to the other student. Both students choose `alpha`, giving the outcome:

```text
(alpha, alpha) -> (0, 0)
```

But look at the bottom-right outcome:

```text
(beta, beta) -> (1, 1)
```

Both students would have been better off choosing `beta`.

Each person made the individually rational choice, but the final outcome was worse for everyone.

This is the structure of the famous **Prisoner's Dilemma**.

{{< figure src="/images/game-theory/prisoners-dilemma-notes.jpg" alt="Handwritten Prisoner's Dilemma payoff matrix and lessons" >}}

This was one of the first things I found interesting about game theory:

> Rational individual decisions do not always produce the best collective result.

## Strictly and weakly dominated strategies

We can now define dominance more carefully.

A strategy is **strictly dominated** if another strategy gives a strictly higher payoff for every possible choice made by the other players.

In the Grade Game:

```text
alpha strictly dominates beta
```

The first basic lesson is:

> Do not play a strictly dominated strategy.

There is also a weaker version.

A strategy is **weakly dominated** if another strategy:

1. is at least as good against every possible choice by the other players, and
2. is strictly better against at least one choice.

The difference sounds small, but it matters.

With strict dominance, the strategy is always worse. With weak dominance, there may be situations where the player is indifferent. Deleting weakly dominated strategies can therefore remove outcomes that might still matter, and the order of deletion can affect what remains.

So weak dominance needs more care.

## Iterative deletion

Sometimes a game is too large to solve in one step.

We may find that:

1. one player has a dominated strategy,
2. we remove it,
3. another player's strategy becomes dominated in the smaller game,
4. we remove that too,
5. the process continues until only a few choices remain.

This is called **iterative deletion of dominated strategies**.

There is a subtle assumption hidden inside every round.

In the first round, I remove my dominated strategy because I am rational.

In the second round, I may remove another strategy because I believe the other player is rational and will not play their dominated strategy.

In later rounds, I need to believe that the other player knows that I am rational, that I know they are rational, and so on.

This idea is usually described as **common knowledge of rationality**.

The phrase sounds complicated, but the intuition is simple: deeper rounds of reasoning require increasingly strong assumptions about what everyone knows about everyone else.

## A political example

One application from the notes is the median-voter idea.

Imagine voters arranged on a line from left to right. There are two candidates, and every voter supports whichever candidate is closer to them.

Assume:

- voters only care about ideological distance,
- there are only two candidates,
- both candidates only want to maximize votes,
- voters choose the closest candidate,
- ties are split evenly.

If a candidate chooses an extreme position, they can usually gain votes by moving toward the center. The other candidate faces the same pressure.

Repeated strategic reasoning pulls both candidates inward, toward the median voter.

With voters placed at positions `1` through `10`, this means the important positions are around `5` and `6`, the middle of the distribution.

This is not a universal law of real elections. Real voters care about many dimensions, candidates have histories and identities, and there are often more than two serious choices. But under the simplified assumptions, game theory explains why two competing candidates may converge toward the center.

The assumptions define the game, and the game produces the result.

## The limitation of dominance

Dominance is a powerful idea, but it does not solve every game.

In many games:

- no player has a dominant strategy,
- no strategy is dominated,
- the best choice depends on what the other player does.

Suppose two people want to meet, but one prefers a movie and the other prefers a concert. Going to either place together is better than going to different places.

There is no action that is always best.

If the other person chooses the movie, I may want the movie. If they choose the concert, I may want the concert.

So the question changes from:

> Which strategy is best regardless of what others do?

to:

> Which strategy is my best response to what others are doing?

That question leads directly to Nash equilibrium.

## The main takeaway

The basic objects in game theory are simple:

```text
players + strategies + payoffs
```

But even very small games can produce surprising conclusions.

A dominant strategy can lead everyone to a worse outcome.

Changing preferences can change the game.

Deleting dominated strategies can reveal what rational players should avoid.

And when dominance is not enough, we need to study how the players' best responses fit together.

That is exactly what Nash equilibrium does, and it is the focus of the [next post](/blog/understanding-nash-equilibrium/).
