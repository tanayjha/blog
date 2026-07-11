---
title: "Some Mysteries of Multi-Threading"
date: 2021-04-02T12:09:25+05:30
summary: "Notes on Java concurrency, thread safety, and the pitfalls that make multithreaded code subtle."
tags: ["concurrency", "java", "systems"]
categories: ["Software Engineering"]
draft: false
showToc: true
ShowReadingTime: true
---

If you have been programming professionally for some time, you probably would have used threads. When used correctly, threads can provide significant speedup in a program.

I had also written multithreaded programs many times at Sumo Logic. However, recently I felt that since threading is such an important topic, I should probably dive a little deeper into how things work there.

I started off by reading [Java Concurrency in Practice](https://www.amazon.in/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601), and although I have gone through only a couple of chapters so far, I have already discovered some interesting things which I was not aware of before.

The thing which makes multi-threading hard is that you may write a multi-threaded program which works correctly almost all the time but it may still be wrong. It may have some race condition which happens very rarely. The problem is that it might happen in production and cause an outage, and you will be clueless about the issue since you have never seen it before. The only way to write correct multi-threaded code is to be aware of the issues which can arise theoretically and try to avoid them. If it sounds hard, that is because it is.

In this post I am going to describe two issues which are very basic, but I am sure many of you who are new to multi-threading might not know about them. At least I didn't. These are just scratching the surface. Hopefully, as I discover new things, I will write other blogs explaining them. But till then, let's begin with these...

### The Visibility Issue

Consider the code snippet below:

```java
public class Visibility {

    static boolean stop = false;

    static class MyJob implements Runnable {
        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " starting..");
            while (!stop);
            System.out.println(Thread.currentThread().getName() + " stopping..");
        }
    }

    public static void main(String[] args) throws Throwable {
        MyJob mj = new MyJob();
        new Thread(mj).start();
        System.out.println("My Job launched");
        Thread.sleep(1000);
        stop = true;
        System.out.println("stop set to true, main exiting");
    }
}
```

Let's try to reason about what the code should do ideally. So, in the main method, we first create an instance of the runnable `MyJob` and then start a new thread passing in that runnable. Next, we print "My Job launched" on the main thread and sleep for a second. Then we set a static variable `stop` to true from main. Finally, we print out that `stop` has been set to true and we are exiting main.

In the `run` method of the `MyJob` class, there is an infinite while loop checking the value of `stop`. As soon as `stop` is set to true, the method should exit, printing the stopping line.

Now, I don't know about you guys, but the first time I saw this program, my expectation was for a bunch of launching lines to be printed and then, after a second or two, the program should exit printing the stopping line. I was surprised when I actually ran the code. It prints the following:

**My Job launched
Thread-0 starting..
stop set to true, main exiting**

and then just hangs. It does not terminate.

This is kind of unexpected. When I tried finding the reason for this behavior, here is what I found.

The boolean variable `stop` is being set by the main thread. The change made by the main thread is not visible to Thread-0 (the thread running `MyJob`) instantly. The reason for this has to do with the Java Memory Model, which permits each thread to keep its own cached view of shared variables (for example, in CPU registers or per-core caches) and does not require writes from one thread to become visible to another without proper synchronization.

In the while loop which is present in the runnable, we are reading the value of the `stop` variable. Without synchronization, the JIT compiler and the CPU are allowed to hoist that read out of the loop or read it from a cached location, so the thread never observes the update made by the main thread. If we change the value of the variable in another thread, the current thread is not guaranteed to see the updated value unless we do something different.

The simplest solution to this problem is to just add one keyword to the `stop` variable. Make it `volatile`.

The Java `volatile` keyword is intended to address variable visibility problems. By declaring the `stop` variable `volatile`, all writes to the `stop` variable will be made visible to other threads, and all reads will see the latest write. So, changing the first line to `static volatile boolean stop = false;` will fix the issue.

There are other ways to fix this as well, like using `synchronized` getters/setters for this variable. But the reasoning of why it works probably needs another post. The `volatile` keyword is probably the simplest way of solving this.

### This Escape during Construction

Escape of the `this` reference from a class. This is a little complex to understand. The main issue here is that the reference to an object can escape to another thread even before its constructor finishes, causing the object to be observed in an inconsistent state. To demonstrate this issue, consider the following code:

```java
import java.util.Date;
import java.util.concurrent.atomic.AtomicReference;

public class ThisEscape {

    private final int num;

    public ThisEscape(EventSource source) {
        source.registerListener(new EventListener() {
            public void onEvent(Event e) {
                doSomething(e);
            }
        });
        num = 42;
    }

    private void doSomething(Event e) {
        if (num != 42) System.out.println("Race condition detected at " + new Date());
    }
}


class EventSource extends Thread {
    private final AtomicReference<EventListener> listeners =
            new AtomicReference<EventListener>();

    public void run() {
        while (true) {
            EventListener listener = listeners.getAndSet(null);
            if (listener != null) listener.onEvent(null);
        }
    }

    public void registerListener(EventListener eventListener) {
        listeners.set(eventListener);
    }
}

class EventListener {
    public void onEvent(Event e) {

    }
}

class Event {}

class EventTest {
    public static void main(String[] args) throws Throwable {
        EventSource es = new EventSource();
        es.start();
        while(true) {
            Thread.sleep(10);
            new ThisEscape(es);
        }
    }
}
```

This might seem a bit overwhelming at first glance. Let's try to break it down. The main class here is the `ThisEscape` class. If you look at the constructor, we are doing two things in there. First, we are registering a listener, and second, we are setting the variable `num` to 42.

Now, if you look at the `onEvent` method of the listener, we call the method `doSomething` in there, which is a private method of this class. So, if some other thread gets hold of the listener, it now has access to private members of the class. However, the bigger issue is that the `this` reference is escaping even before the object's construction is complete.

When you run the code, you will see the log line `Race condition detected at ..` multiple times. We are basically creating this class in a while loop in the main method. This is because the issue does not reproduce every time. However, it is pretty frequent and can definitely happen in production.

Note that even though `num` is declared `final`, this does not save us here. The guarantees that `final` fields provide to other threads only apply after construction of the object has finished; since the `this` reference has already leaked mid-construction, another thread can observe `num` with its default value of `0` before the constructor assigns it `42`.

So, the overall flow is that the inner listener (which captures an implicit reference to the enclosing `ThisEscape` instance) is published to another thread, and that thread can invoke `doSomething` before the `num` variable has been set in the constructor, thereby demonstrating the escape of a reference to an object which has not yet been fully initialized.

How do you prevent this issue? Well, it is quite simple actually. We have to take extra care to ensure we don't allow the `this` reference to escape in the constructor. A common mistake that can let the `this` reference escape during construction is to start a thread from a constructor. When an object creates a thread from its constructor, it almost always shares its `this` reference with the new thread, either explicitly (by passing it to the constructor) or implicitly (because the `Thread` or `Runnable` is an inner class of the owning object). The new thread might then be able to see the owning object before it is fully constructed. There's nothing wrong with creating a thread in a constructor, but it is best not to start the thread immediately. Instead, expose a `start` or `initialize` method that starts the owned thread.

### Conclusion

So, hopefully, this post makes you more aware of things that can go wrong if you are not careful with threads. I am also fairly new to multithreaded programming, and hopefully, as I read more, I will be able to share more interesting facts about threads with everyone.