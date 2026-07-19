---
title: "Understanding Nash Equilibrium"
date: 2026-07-19T10:29:10+05:30
summary: "A practical explanation of Nash equilibrium through best responses, coordination games, mixed strategies, penalty kicks, and Cournot competition."
tags: ["game-theory", "nash-equilibrium", "math", "economics"]
categories: ["Math"]
cover:
  image: "images/game-theory/nash-equilibrium-notes.jpg"
  alt: "Handwritten definition and example of Nash equilibrium"
draft: false
showToc: true
ShowReadingTime: true
---

## Context

In the [first post](/blog/introduction-to-game-theory/), I introduced the basic language of game theory: players, strategies, payoffs, and dominated strategies.

That was all preparation for the concept I originally wanted to understand: **Nash equilibrium**.

John Nash developed this equilibrium idea during his doctoral work at Princeton when he was only 21. Decades later, he shared the [1994 Economic Sciences Prize](https://www.nobelprize.org/prizes/economic-sciences/1994/press-release/) "for their pioneering analysis of equilibria in the theory of non-cooperative games."

The formal definition can look intimidating, but the central idea is surprisingly simple:

> A Nash equilibrium is an outcome where every player is already playing a best response to the other players.

Nobody can improve their payoff by changing their strategy alone.

That last word is important: **alone**.

## Best response

Before defining equilibrium, we need to understand a best response.

A player's best response is the strategy that gives them the highest payoff for a particular choice made by the other player.

Consider this game:

| Player 1 \ Player 2 | L | C | R |
|---|---:|---:|---:|
| **U** | (0, 4) | (4, 0) | (5, 3) |
| **M** | (4, 0) | (0, 4) | (5, 3) |
| **D** | (3, 5) | (3, 5) | (6, 6) |

Let us find Player 1's best responses.

If Player 2 chooses `L`, Player 1's payoffs are:

```text
U -> 0
M -> 4
D -> 3
```

So the best response to `L` is `M`.

If Player 2 chooses `C`, the payoffs are:

```text
U -> 4
M -> 0
D -> 3
```

So the best response to `C` is `U`.

If Player 2 chooses `R`, the payoffs are:

```text
U -> 5
M -> 5
D -> 6
```

So the best response to `R` is `D`.

We can write:

```text
BR1(L) = M
BR1(C) = U
BR1(R) = D
```

Doing the same thing for Player 2:

```text
BR2(U) = L
BR2(M) = C
BR2(D) = R
```

{{< figure src="/images/game-theory/nash-equilibrium-notes.jpg" alt="Handwritten Nash equilibrium definition and best-response example" >}}

## Finding the Nash equilibrium

A Nash equilibrium occurs where the two best responses coincide.

In the matrix above:

```text
BR1(R) = D
BR2(D) = R
```

So `(D, R)` is a Nash equilibrium.

At `(D, R)`, both players get a payoff of `6`.

If Player 1 changes alone:

```text
D -> U gives 5 instead of 6
D -> M gives 5 instead of 6
```

If Player 2 changes alone:

```text
R -> L gives 5 instead of 6
R -> C gives 5 instead of 6
```

Neither player wants to move away unilaterally.

This gives another useful definition:

> A strategy profile is a Nash equilibrium if no player has a profitable unilateral deviation.

## Nash equilibrium versus dominant strategy

A dominant strategy is best regardless of what the other players do.

A Nash-equilibrium strategy only needs to be best against the strategies the other players are actually using at that equilibrium.

So:

```text
dominant strategy -> best against everything
Nash strategy     -> best against the equilibrium choices
```

Every dominant-strategy equilibrium is a Nash equilibrium.

But many Nash equilibria do not involve dominant strategies.

This is why Nash equilibrium is much more widely useful. It can analyze games where the right choice depends on what everyone else is doing.

## Multiple equilibria

Nash equilibrium does not have to be unique.

Suppose two people want to spend an evening together. One prefers a movie, while the other prefers a concert.

| Person 1 \ Person 2 | Movie | Concert |
|---|---:|---:|
| **Movie** | (2, 1) | (0, 0) |
| **Concert** | (0, 0) | (1, 2) |

There are two pure-strategy Nash equilibria:

```text
(Movie, Movie)
(Concert, Concert)
```

At either outcome, neither person wants to change alone. Moving alone would mean ending up at different places and receiving `0`.

But the game does not tell us which equilibrium they will choose.

This is a coordination problem, often called the **Battle of the Sexes** in game-theory textbooks.

It shows that an equilibrium can be stable without being predictable.

There is also a mixed-strategy equilibrium, which we will get to shortly.

## Equilibrium does not mean the best outcome

The Prisoner's Dilemma from the first post has a unique Nash equilibrium, but that equilibrium is worse for both players than another available outcome.

So Nash equilibrium does not necessarily mean:

- the outcome is fair,
- the total payoff is maximized,
- every player is happy,
- the equilibrium is unique,
- the players will automatically discover it.

It only means that once the players are there, no one benefits by moving alone.

This is a stability concept, not a happiness concept.

## Self-enforcing agreements

This also explains why Nash equilibrium is useful in non-cooperative games.

Suppose a group reaches an agreement. If following the agreement is in every player's own interest given that everyone else follows it, then no external enforcer may be needed.

The agreement is self-enforcing.

But if one player can gain by secretly deviating, the agreement is fragile. It may look good collectively, but it is not a Nash equilibrium.

This is the difference between:

```text
"We would all be better off if we did this"
```

and:

```text
"Given what everyone else is doing, I personally want to keep doing this"
```

Nash equilibrium requires the second statement for every player.

## What if there is no pure equilibrium?

So far, every player has selected one definite action. These are called **pure strategies**.

But some games have no Nash equilibrium in pure strategies.

Consider a simplified penalty-kick game.

The shooter can aim left, middle, or right. The goalkeeper dives left or right. We will keep the payoff scale from my notes:

```text
4 -> 40% chance of scoring
6 -> 60% chance of scoring
9 -> 90% chance of scoring
```

| Shooter \ Goalkeeper | Left | Right |
|---|---:|---:|
| **Left** | (4, -4) | (9, -9) |
| **Middle** | (6, -6) | (6, -6) |
| **Right** | (9, -9) | (4, -4) |

The game is zero-sum in this simplified model. Whatever helps the shooter hurts the goalkeeper by the same amount.

If the shooter always aims left, the goalkeeper should dive left.

If the goalkeeper always dives left, the shooter should aim right.

If the shooter always aims right, the goalkeeper should dive right.

If the goalkeeper always dives right, the shooter should aim left.

There is no stable pure-strategy outcome.

The best responses keep chasing each other.

## A strategy can be a probability

The way out is to randomize.

A **mixed strategy** assigns probabilities to pure strategies.

For example:

```text
shoot left  with probability 1/2
shoot right with probability 1/2
```

There is also a nice dominance lesson hidden here.

If the shooter mixes left and right equally, then against a goalkeeper who dives left:

```text
expected payoff = (1/2)*4 + (1/2)*9 = 6.5
```

Against a goalkeeper who dives right:

```text
expected payoff = (1/2)*9 + (1/2)*4 = 6.5
```

The middle strategy always gives `6`.

So shooting in the middle is worse than the mixed strategy, regardless of which side the goalkeeper chooses. The pure middle strategy is dominated by a mixture of left and right.

Dominance does not have to come from another pure strategy.

## Making the other player indifferent

Let `p` be the probability that the goalkeeper dives left.

If the shooter aims left, the expected payoff is:

```text
4p + 9(1 - p) = 9 - 5p
```

If the shooter aims right, the expected payoff is:

```text
9p + 4(1 - p) = 4 + 5p
```

The goalkeeper wants to choose a probability that leaves the shooter indifferent between left and right:

```text
9 - 5p = 4 + 5p
10p = 5
p = 1/2
```

By symmetry, the shooter also mixes left and right with probability `1/2`.

So the mixed-strategy Nash equilibrium is:

```text
Shooter:    Left 1/2, Right 1/2
Goalkeeper: Left 1/2, Right 1/2
```

{{< figure src="/images/game-theory/mixed-strategy-payoffs-notes.jpg" alt="Handwritten penalty-kick payoff matrix and mixed-strategy graph" >}}

The randomization is not indecision.

It is the strategy.

If either player becomes predictable, the other player can exploit them.

In a real penalty-kick model, the scoring probabilities would not be perfectly symmetric, so the equilibrium probabilities would not necessarily be `1/2`. But the method remains the same: each player mixes in a way that makes the other player indifferent between the actions used with positive probability.

## Why mixed strategies matter

This is where Nash's result becomes especially powerful.

A finite game may have no equilibrium in pure strategies, but:

> Every finite game has at least one Nash equilibrium when mixed strategies are allowed.

I am not going to attempt the proof here. The point I wanted to understand was what the theorem is actually saying.

It does not say every game has one obvious stable action for every player.

It says that if probability distributions over actions are also treated as strategies, an equilibrium always exists in a finite game.

That is a much stronger and more surprising statement.

## A continuous game: Cournot competition

The examples so far had a small list of strategies.

But strategies can also be numbers.

In the Cournot duopoly model, two firms produce the same product. Each firm chooses how much to produce:

```text
Firm 1 chooses q1
Firm 2 chooses q2
```

Assume market price is:

```text
p = a - b(q1 + q2)
```

As total production increases, the price falls.

Assume each firm has constant marginal cost `c`. Firm 1's profit is:

```text
profit1 = revenue - cost

profit1 = p*q1 - c*q1

profit1 = [a - b(q1 + q2)]q1 - cq1
```

Expanding:

```text
profit1 = (a - c)q1 - bq1^2 - bq1q2
```

Firm 1 chooses `q1` to maximize this expression while treating `q2` as fixed.

The first-order condition is:

```text
a - c - 2bq1 - bq2 = 0
```

So Firm 1's best response is:

```text
q1 = (a - c - b*q2) / (2*b)
```

Similarly:

```text
q2 = (a - c - b*q1) / (2*b)
```

At a symmetric Nash equilibrium:

```text
q1 = q2 = q*
```

Substituting:

```text
q* = (a - c) / (3*b)
```

Each firm is producing its best quantity given the other firm's quantity.

{{< figure src="/images/game-theory/cournot-duopoly-notes.jpg" alt="Handwritten Cournot duopoly setup and demand graph" >}}

This is the same Nash-equilibrium idea as before. The only difference is that the strategy space is now continuous.

## Strategic complements and substitutes

The notes end with another useful way to classify games.

In the Cournot game, if Firm 2 produces more, Firm 1's best response is to produce less:

```text
q2 goes up -> best-response q1 goes down
```

The quantities are **strategic substitutes**.

In other games, one player's higher action may encourage the other player to choose a higher action too.

For example, if two people work on a project where their efforts reinforce each other, seeing the other person contribute more may make my own effort more valuable. My best response may be to contribute more as well.

Those actions are **strategic complements**.

The best-response curves tell us which kind of interaction we have:

```text
best responses move together  -> strategic complements
best responses move oppositely -> strategic substitutes
```

## The main takeaway

The definition I had wanted to understand for years can be reduced to one sentence:

> In a Nash equilibrium, every player is playing a best response to everyone else.

It does not guarantee the best social outcome.

It does not guarantee fairness or uniqueness.

It does not even require a deterministic action.

It only requires that no player can improve by changing alone.

That idea works for tiny payoff matrices, penalty kicks, coordination problems, and firms choosing quantities in a market.

And Nash's deeper result says that for every finite game, if we allow mixed strategies, at least one such equilibrium exists.

That is the part I wanted to appreciate when I started learning game theory, and after going through these examples, I finally feel like I do.
