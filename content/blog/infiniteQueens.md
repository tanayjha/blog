---
title: "Infinite Queens"
date: 2022-11-30T00:24:13+05:30
draft: false
showToc: true
ShowReadingTime: true
---

There is a very interesting set of events that led me to this topic. And boy am I glad that I stumbled on this. I had a lot of fun working on this and it definitely warrants a blog post. So here it goes...

## Backstory

I am reading the book **Algorithms to Live By** (a great book so far btw). In that book, there is a mention of how to manage time like a CPU Scheduler and not do too many context switches as it can affect your productivity adversely. The author mentions [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) who is a very famous computer scientist probably most famous for his book series - **The Art Of Computer Programming**. It was mentioned how he maintains his project [TEX](https://en.wikipedia.org/wiki/TeX) and since the software is relatively stable, he does a bug fix for it every 6 years and no sooner. The author mentions how he is an embodiment of minimal context switching lifestyle and focussing on just one thing at once. This is another topic of debate but not of interest in this blog post. I already knew about Knuth but just out of curiosity I searched around a bit and found [these](https://www.youtube.com/playlist?list=PLoROMvodv4rOAvKVR_dyCigSBMcYjevYB): **Donald Knuth Christmas Lectures at Stanford**. I started watching the 2017 lecture, [A Conjecture That Had To Be True](https://www.youtube.com/watch?v=BxQw4CdxLr8&list=PLoROMvodv4rOAvKVR_dyCigSBMcYjevYB&index=3) and even though the primary focus of the lecture was on a different problem (which was also pretty interesting), what caught my eye was something he mentioned at around the end of the lecture. The infinite queens problem. As much as I would like to continue this story, I think it would be better to just get into the technical details and see what this is all about.

## Infinite Queens Problem

The infinite queens problem (or this version of it) has to do with the placements of queens on it. Assume you place a queen at the first square. Now for each successive row, as you go up the board, find the lexicographically smallest (basically leftmost) position where you can place a queen such that no other existing queens threaten that queen. And this procedure is repeated for all the rows. We are interested in plotting the positions of all these queens and want to see if any interesting pattern emerges out of them.

## Solution Attempt 1

Now many of you might have heard about the [n-queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle) which deals with a fixed number of queen and is easily solved using backtracking. This one is similar but also different mainly due to the constraints. The value of N here will be large. To see some interesting patterns, I thought maybe a value of 10^5 would be good. Also we don't want just any orientation of the queens. We want the lexicographically smallest one (which I believe kind of simplifies things for us).

So the problem seemed pretty straightforward and I quickly came up with the following code for it using backtracking:

```
#include <bits\stdc++.h>
using namespace std;
const int BOARD_SIZE = 4000;
long long hitCounter = 0;

vector<int> position;

bool slopeHitsQueen(int x1, int y1, int x2, int y2) {
	if (x1 == x2 || y1 == y2 || (abs(y2 - y1) == abs(x2 - x1))) {
		return true;
	}
	return false;
}

bool isValidArrangement(int x2, int y2, int &curHitCounter) {
	for (int x1 = x2 - 1; x1 >= 0; x1--) {
		curHitCounter++;
		int y1 = position[x1];
		if (slopeHitsQueen(x1, y1, x2, y2)) {
			return false;
		}
	}
	return true;
}

void nQueens(int row, int curHitCounter) {
	if (row == BOARD_SIZE) {
		return;
	}
	for (int i = 0; ; i++) {
		if (isValidArrangement(row, i, curHitCounter)) {
			position.push_back(i);
			hitCounter += (curHitCounter / (i + 1));
			break;
		}
	}
	nQueens(row + 1, 0);
}

int main() {
	position.push_back(0);
	nQueens(1, 0);
	long long avgPos = 0;
	for (int i = 0; i < BOARD_SIZE; i++) {
		avgPos += position[i];
	}
	long long avgSlotCheck = avgPos / BOARD_SIZE;
	long long avgHitCheck = hitCounter / BOARD_SIZE;
	long long noOfOperations = BOARD_SIZE * avgSlotCheck * avgHitCheck;
	cout << "BOARD_SIZE: " << BOARD_SIZE << endl;
	cout << "Average slot (horizontal) check: " << avgSlotCheck << endl;
	cout << "Average hit (vertical) check: " << avgHitCheck << endl;

	cout << "Time Complexity = BOARD_SIZE * slot check * hit check: " << noOfOperations << endl;
	cerr << "Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s.\n";
}
```

So the time complexity, as I print towards the end, is the product of three factors. The size of the board. The number of positions I have to traverse to find a slot for the queen. And the complexity of checking if the queen can be placed in a slot without being threatened by the other queens. Now the first number is a constant but the second and third will change depending upon which queen I am trying to place. Sometimes you may get a position quickly but other times it may take long. So I print out the average values for both of them to get a sense of which one is a bottleneck in case I need to make things faster. Here is the output of the above program for different board_sizes:

```
BOARD_SIZE: 100
Average slot (horizontal) check: 61
Average hit (vertical) check: 21
Time Complexity = BOARD_SIZE * slot check * hit check: 128100
Time elapsed: 0.005 s.

BOARD_SIZE: 1000
Average slot (horizontal) check: 617
Average hit (vertical) check: 213
Time Complexity = BOARD_SIZE * slot check * hit check: 131421000
Time elapsed: 0.933 s.

BOARD_SIZE: 5000
Average slot (horizontal) check: 3089
Average hit (vertical) check: 1066
Time Complexity = BOARD_SIZE * slot check * hit check: 16464370000
Time elapsed: 123.786 s.

BOARD_SIZE: 10000
Average slot (horizontal) check: 6179
Average hit (vertical) check: 2133
Time Complexity = BOARD_SIZE * slot check * hit check: 131798070000
Time elapsed: 1864.65 s.
```

I was initially surprised to see that this was able to handle a board size upto 5000 in about 2 mins on my machine. I was under the impression that 10^7 operations is what you can do in a sec. But turns out it is 10^8 since the operations we are doing are pretty simple (something like a mod operator is costly but simple addition subtraction work much faster). So it immediately saved a factor of 10. The runtime for 10^4 is about 30 mins which I believe starts getting a little less practical. So looks like that is kind of the limit for this. Then I decided to try and optimize this a bit since my goal was to go upto 10^5 points at least...

## Solution Atempt 2

I knew that one thing I could optimize was the isValidArrangement() method to check if the queen could be safely placed in a square. 
To do that we will have to store some extra info every time we get a new queen placement. I think of it as projecting a laser from that queen and then finding the source of that laser on the horizontal axis. So there are four directions in which a queen looks whenever placed on a board. Three of them hit the x-axis and it is pretty easy to find the co-ordinates of the points where it intercepts the x-axis. These are the three points I stored for each of the queen placement and thought of them as lasers emerging from the x-axis along with their direction. 

{{< figure src="/images/infiniteQueens/lasers.png"  >}}

Now with this info handy, whenever I am trying to put a new queen on the board and I want to check if it will threaten any existing queen, I repeat the same process and find the three intercepts for this queen with the x-axis. If any of these matches an existing laser, well that means there already exists a queen which will be in the line of sight of this one, so the arrangement is not safe. This reduces the check time for each square from ~n to constant time. 

Here is the code for this new approach:

```
#include <bits\stdc++.h>
using namespace std;
set<pair<int, int>> lasers;
const int BOARD_SIZE = 10000;
long long hitCounter = 0;

vector<int> position;

vector<pair<int, int>> calculateLasers(int row, int pos) {
	vector<pair<int, int>> ans;
	ans.push_back(make_pair(pos - row, -1));
	ans.push_back(make_pair(pos, 0));
	ans.push_back(make_pair(pos + row, 1));
	return ans;
}

bool isValidArrangement(int x2, int y2) {
	vector<pair<int, int>> allLasers = calculateLasers(x2, y2);
	for (int i = 0; i < allLasers.size(); i++) {
		if (lasers.find(allLasers[i]) != lasers.end()) {
			return false;
		}
	}
	return true;
}

void nQueens(int row, int curHitCounter) {
	if (row == BOARD_SIZE) {
		return;
	}
	for (int i = 0; ; i++) {
		if (isValidArrangement(row, i)) {
			position.push_back(i);
			vector<pair<int, int>> allLasers = calculateLasers(row, i);
			for (int j = 0; j < allLasers.size(); j++) {
				lasers.insert(allLasers[j]);
			}
			hitCounter += (curHitCounter / (i + 1));
			break;
		}
	}
	nQueens(row + 1, 0);
}

int main() {
	freopen("queenPositions", "w", stdout);
	position.push_back(0);

	lasers.insert(make_pair(0, -1));
	lasers.insert(make_pair(0, 0));
	lasers.insert(make_pair(0, 1));

	nQueens(1, 0);
	long long avgPos = 0;
	for (int i = 0; i < BOARD_SIZE; i++) {
		avgPos += position[i];
	}
	long long avgSlotCheck = avgPos / BOARD_SIZE;

	long long noOfOperations = BOARD_SIZE * avgSlotCheck;

	for (int i = 0; i < BOARD_SIZE; i++) {
		cout << i << ", " << position[i] << endl;
	}

	cerr << "BOARD_SIZE: " << BOARD_SIZE << endl;
	cerr << "Average slot (horizontal) check: " << avgSlotCheck << endl;
	cerr << "Time Complexity = BOARD_SIZE * slot check * hit check (O(1)): " << noOfOperations << endl;
	cerr << "Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s.\n";
}
```

Here are the runtimes for this:

```
BOARD_SIZE: 10000
Average slot (horizontal) check: 6179
Time Complexity = BOARD_SIZE * slot check * hit check (O(1)): 61790000
Time elapsed: 82.148 s.

BOARD_SIZE: 30000
Average slot (horizontal) check: 18540
Time Complexity = BOARD_SIZE * slot check * hit check (O(1)): 556200000
Time elapsed: 834.669 s.
```

It is immediately evident how better this is over the original (kind of brute-force) approach. We get 10^4 points in under 2 mins. However this still doesn't scale very well over 50k points.
I also wanted to figure out a way to improve the effeciency of slot check. Basically there can be some optimizations done by ignoring the initial slots which we know will not work. It reduces to the problem of finding the minimum missing positive integer in a list which is getting appended. I could not find a good solution for this. But for our purpose of plotting the pattern of the queen positions, 30k points would do. 

## The Grand Finale

Now the reason why I started this whole effort was mentioned by Donald Knuth in the video. He had suggested that the arrangements of the queen which satisfy the problem constraint is very interesting. So I decided to plot them out. I had already collected 10^5 positions of the queens. I decided to use my good friend, the matplotlib library, in python to just plot them out and see what I get. Here is a graph of all these points scattered over the x-y plane. Here is a code for the same:

```
from matplotlib import pyplot as plt
import numpy as np

f = open("queenPositions", "r")
plt.style.use('seaborn')
XLine1 = []
YLine1 = []
XLine2 = []
YLine2 = []
for point in f:
	x, y = point.split(',')
	x = int(x.strip())
	y = int(y.strip())
	if x < y:
		XLine1.append(x)
		YLine1.append(y)
	else:
		XLine2.append(x)
		YLine2.append(y)

slopeLine1, interceptLine1 = np.polyfit(XLine1, YLine1, 1)
slopeLine2, interceptLine1 = np.polyfit(XLine2, YLine2, 1)
print("Line 1 Slope: ", slopeLine1)
print("Line 2 Slope: ", slopeLine2)
plt.scatter(XLine1, YLine1)
plt.scatter(XLine2, YLine2)
plt.show()
```

This is the output:

{{< figure src="/images/infiniteQueens/graph.png"  >}}

This graph in itself is extremely surprising. It looks like the queen positions all lie on just two straight lines. Obviously they will not be exact straight lines since the queens will just attack each other then. But they are very close along these lines. These two lines can be differentiated by the property of having x < y and x > y. 

If you have read so far, I have saved the best for the last. As if these points being distributed in this way was not good enough, the slopes of these lines is what tops all of this.
To calculate the slope, I used the numpy library and the [polyfit function](https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html) it provides. This function is basically used in linear regression. It finds a line which minimises the squared distance of each point from this line. Here is the slope of this line for different number of points plotted:

```
No. of Points: 1000
Line 1 Slope:  1.6180139038861618
Line 2 Slope:  0.6180242386312907

No. of Points: 10000
Line 1 Slope:  1.6180336231728532
Line 2 Slope:  0.6180336002998769

No. of Points: 30000
Line 1 Slope:  1.618033966178691
Line 2 Slope:  0.6180339608635457
```

Are you shocked yet? Read the slope of line 1 carefully. Does it ring a bell? 
How about now?

{{< figure src="/images/infiniteQueens/goldenRatio.png"  >}}

Yes, the slope of line 1 is the **golden ratio**!! The slope of line 2 is **1 / golden ratio**. And you can also see how plotting more points allows the polyfit method to work better and the slope gets closer to the golden ratio matching more decimal places. 

This result is eery to be honest. What is the golden ratio doing here? Well I don't know. I am probably content in not knowing. I already got my share of joy by just seeing this result in action after putting in some hardwork.

Remember the title of Donald Knuths lecture, The Conjecture Which Had To Be True. He ended the lecture saying this is another conjecture which he feels has to be true (the conjecture being that the queen positions for the above stated infinite queens problem, lie along two lines with the slopes being golden ratio and its inverse) but he is also pretty sure that there will be no proof of this anytime soon. If it does get proved in my lifetime anyway, I will be on the lookout!

### Sidenote

On his website, Knuth has posted [his solution](https://www-cs-faculty.stanford.edu/~knuth/programs/infty-queens.w) for this as well. He was able to bring in 10^9 points! But he kind of reverse engineered it and started with the assumption that the points will lie close to the line with the golden ratio slopes. Even then, his version of the program is too complicated for me to understand easily and I did not spend too much time on it. However I am sure it is filled with a lot of clever bit hacks which makes it so effecient. Do check it out if you are interested. 