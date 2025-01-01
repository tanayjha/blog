---
title: "Some Mysteries of Multi-Threading"
date: 2021-04-02T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---

 If you have been programming professionally for some time, you probably would have used threads. When used correctly, threads can provide significant speed up in the program.

I had also written multithreaded programs many times at Sumo Logic. However, recently I felt that since threading is such an important topic, I should probably dive a little deeper into how things work there.

I started off by reading [Java Concurrency in Practice](https://www.amazon.in/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601) and although I have gone through only a couple of chapters right now, but still I have discovered some interesting things which I was not aware of before.

The thing which makes multi-threading hard is that you may write a multi-threaded program which works correctly almost all the time but it may still be wrong. It may have some race condition which happens very rarely. The problem is that it might happen in production and cause an outage and you will be clueless about the issue since you have never seen it before. The only way to write correct multi-threaded code is to be aware of the issues which can arise in them theoretically and try to avoid them. If it sounds hard, that is because it is.

In this post I am going to describe two issues which are very basic but I am sure many of you who are new to multi-threading might not know about them. At least I didn't. These are just scratching the surface. Hopefully as I discover new things I will write other blogs explaining them. But till then, lets begin with these...

### The Visibility Issue

Consider the code snippet below:

```
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

Lets try to reason what the code should do ideally. So in the main method we first create an instance of the runnable MyJob and then start a new thread passing in that runnable. Next we print "My Job launched" on the main thread and sleep for a second. Then we set a static variable stop to true from main. Finally we print out that stop has been set to true and we are exiting main.
In the run method of the MyJob class, there is an infinite while loop checking the value of stop. As soon as stop is set to true, the method should exit printing the stopping line.

Now don't know about you guys but the first time I saw this program, my expectation was a bunch of launching lines to be printed and then after a second or two, the program should exit printing the stopping line. I was surprised when I actually ran the code. It prints the following:

**My Job launched
Thread-0 starting..
stop set to true, main exiting**

and then just hangs. It does not terminate. 

This is kind of unexpected. When I tried finding the reason for this behavior here is what I found.
The boolean variable stop is being set by the main thread. The change made by the main thread is not visible to Thread-0 (the thread running MyJob) instantly. The reason for this is caching.
In the while loop which is present in the runnable, we are reading the value of the stop variable. Now the compiler ensures that we don't have to go to the main memory each time to read that value. The variable is read from the cache. And both threads will have different copies of the variable in their cache. If we change the value of the variable in another thread, the current thread will not see the updated value unless we do something different.
The simplest solution to this problem is to just add one keyword to the stop variable. Make it volatile.

The Java volatile keyword is intended to address variable visibility problems. By declaring the stop variable volatile all writes to the stop variable will be written back to main memory immediately. Also, all reads of the stop variable will be read directly from main memory. So changing the first line to: static volatile boolean stop = false; will fix the issue.
There are other ways to fix this as well like using synchronized getters/setters for this variable. But the reasoning of why it works probably needs another post. Volatile keyword is probably the simplest way of solving this.

### This Escape during Construction

Escape of this reference from a class. This is a little complex to understand. The main issue here is that the reference to a class can escape to another class even before it's constructor finishes causing the object to be in an inconsistent state. To demonstrate this issue consider the following code:

```
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

This might seem a bit overwhelming at the first look. Lets try to break it down. So the main class here is the ThisEscape class. If you see the constructor, we are doing two things in there. First we are registering a listener and second we are setting the variable num to 42.
Now if you look at the onEvent method of the listener, we call the method doSomething in there which is a private method of this class. So if some other thread gets hold of the listener, it now has access to private members of the class. However, the bigger issue is that this reference is escaping even before the object creation is complete. 
When you run the code, you will see the log line Race condition detected at .. multiple times.
We are basically creating this class in a while loop in the main method. This is because the issue does not replicate every time. However it is pretty frequent and can definitely happen in production.

So the overall logic of the code is that the doSomething method is escaped to another thread and it calls this method even before the num variable can be set in the constructor thereby showing the escape of the reference of a class which has not yet been initialized. 

How do you prevent this issue? Well it is quite simple actually. We have to take extra care to ensure we don't allow the this reference to escape in the constructor. A common mistake that can let the this reference escape during construction is to start a thread from a constructor. When an object creates a thread from its constructor, it almost always shares its this reference with the new thread, either explicitly (by passing it to the constructor) or implicitly (because the Thread or Runnable is an inner class of the owning object). The new thread might then be able to see the owning object before it is fully constructed. There's nothing wrong with creating a thread in a constructor, but it is best not to start the thread immediately. Instead, expose a start or initialize method that starts the owned thread.

### Conclusion

So hopefully this post makes you more aware of things that can go wrong if you are not careful with threads. I am also fairly new to multithreaded programming and hopefully as I read more things I would be able to share more interesting facts about threads with everyone.