---
title: "Evaluating million digits of Pi"
date: 2022-08-16T00:24:13+05:30
draft: false
showToc: true
ShowReadingTime: true
---

I recently got inspired from a book I am reading, Fermat's Last Theorem by Simon Singh, and decided to see what it takes to evaulate Pi to a large number of decimal places. I though that a million would be a good starting point, so a day later, here we are.

Now obviously, there is a lot of material out there on this as this seems to be a topic of great interest for a lot of people. I definitely find this fascinating but I also believe that there is no significance or meaning attached to the digits of pi. It is just a random string of numbers. However, I think this is true in mathematics as well as life that the things you have the most fun in doing eventually turns out to be those which you didn't do for some material gain.

So, the first challenge was to figure out a formula for Pi which can help with this calculation. Now there are many obscure formulas for approximating Pi out there. [This](https://en.wikipedia.org/wiki/Approximations_of_%CF%80) wikipedia page gives a good summary. Now, I had heard about the Ramanujan's formula for approximating Pi and also heard about how it converges very quickly and hence is being used in the recent development in this area to calculate more and more digits, so I wanted to try that one. However, I had to also keep in mind that I needed to code it (selected C# as the language, since I am already working on C# for one of my work related projects) and googling around a bit revealed that I would be better off using a formula that used a simple infinite series which can be coded relatively easily. 

I found [this](https://www.cygnus-software.com/misc/pidigits.htm) blog which points to Machin's formula which uses arctans to define Pi. This is the formula:

**PI/4 = atan(1) = 4 * atan(1/5) - atan(1/239)**

where atan(x) is tan<sup>-1</sup>x which has the following taylor's expansion: atan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9..

Now I have no clue how Machin found this formula for Pi. If you have a look at Ramanujan's formula you will be even more flabbergasted as that one makes no sense at all. At least the above formula has a easy way to verify that it [actually works](https://en.wikipedia.org/wiki/Approximations_of_%CF%80#Machin-like_formula).

Based on the above blog post, I decided to use Machin's formula and write down an implementation of it. Now the blog mentions an InfPrec class which will do very precise decimal calculations (precise to 10^6 decimal places if we want to calculate a million digits) but doesn't mention how to code it. So this was the main challenge. For refernce, the double class in C++ has 15 digits of precision and long double has 21 digits. So they don't even come close in fitting the bill.

Since I planned to use C#, one thing I could leverage was the [BigInteger class](https://docs.microsoft.com/en-us/dotnet/api/system.numerics.biginteger?view=net-6.0). This significantly reduces the amount of code needed as well as removes the low level complexity of doing the long multiplcation and divisions by hand. Obviously this can also be done with careful coding and most of you probably would have done it in your undergrad courses. It is a highly recommended excercise if you want to practice some implementation problem. 
One thing to note is that we have the BigInteger class but no BigDecimal class, so we have to deal with integers only. They could be very big integers (in our case containing a million digits) but they have to be integers nonetheless. 

So the first question that we have to answer is that how do we represent a rational number, say p/q as an integer. For example if you have a decimal number 0.25. Can we represent it using only integers? Yes we can. We can represent it as 25/100. Similarly all rational numbers p/q can be represented as a/10^k where a is a natural number. Now since we know in our calculations of pi to a million decimal places, we need a million decimal digits at max, so we can keep k to be a million. Once we standardise the base, we can just forget about it and only deal in terms of the natural number a. Whenever required, we can divide by 10^k to get back the original decimal number. This is the crux of the InfPrec class.

Once I had Machin's formula figured out, I thought why not take it up a notch and also code Ramanujan's formula. Now there were different set of challenges with it. The most prominent one was that the formula contains a sqrt(2) which itself is irrational. Now to calculate pi to a million digits accurately using this formula, I also need sqrt(2) to a million digits. Which means I need to use my InfPrec class for this. Luckily, there is an [infinite expansion](https://stackoverflow.com/questions/15362117/find-as-many-digits-of-the-square-root-of-2-as-possible) of sqrt(2). I used that one and coded up the Ramanujan formula correctly (although not efficiently)

Here is the code using the above approach implementing both Machin's formula as well as Ramanujan's formula:

{{< gist tanayjha 98b93d7922378e855aeac6d916cbfb3c >}}

For reference this is Ramanujan's formula for PI:

{{< figure src="/images/photos/ramanujan_pi.png"  >}}

This is what I have encoded in the above method. 

Now on running the program for different number of digits of pi starting from 10 and going upto a million, one thing is immediately obvious: Machin's formula requires almost 10 times the number of iteration Ramanujan's formula needs to reach the same level of accuracy. That is a very big gap. Ramanujan's formula is so effecient that it is infact even used today to calculate pi to a large number of digits efficiently. 

If we compare the runtimes, Machin formula is faster in the state I have implemented. I believe the reason is that each term in Ramanujan's formula is very computationally extensive. However, each term in Ramanujan's formula is also very parallelizable. All the terms are independent. I added a cache for the factorials and that also helps the runtime. 

Finally, here are the results for calculating a million digits of Pi:

* Using Machin's formula:
Iterations: 715346
Time: 29 mins

* Using Ramanujan's formula:
Iterations: 73428
Time: 109 mins

{{< figure src="/images/photos/machin_pi.png"  >}}

So, as expected, Ramanujan's formula converges much quicker but takes a much longer time due to my naive implementation. (I plan to make it faster in the future by adding parallelism)

Apart from the story of number [1729](https://en.wikipedia.org/wiki/1729_(number)), I had never got a chance to actually connect with any of Ramanujan's work. It is probably because everything he worked on was so obscure and at such a high level that even after 100 years of his death mathematicians are stil decoding his notebooks. Now obviously, even through this excercise, I have just at a surface level, scratched the formula not even attempting to go into the mathematics inside it. This was the class of Ramanujan. I feel grateful to have been born in the same country as this genius. It reminds me of a quote said for Feynman but I think it fits equally well for Ramanujan if not more:

> <cite>There are two types of genius. Ordinary geniuses do great things, but they leave you room to believe that you could do the same if only you worked hard enough. Then there are magicians, and you can have no idea how they do it. Ramanujan was a magician. </cite>
