---
title: "Zookeeper Internals"
date: 2021-07-21T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---

I had been wanting to understand the internals of zookeeper for quite some time now. In fact, I had already read the basics a couple of times and even worked with the zkcli in my previous organization. However, as it is said that anything written down is more firmly impressed on the mind, hence I am writing this post. (This also has a reference to one of my favorite magician - [Michael Vincent](https://www.youtube.com/watch?v=F8KFMUdrikM&t=830s))

I recently presented this topic in my current organization and I thought now would be a good time to write this blog. I can accompany it with the slides I had used there which would hopefully make things more clear. Although, I would like to start off with a disclaimer that I am just a beginner in the study of zookeeper and there are multiple things I don't know/understand about it yet. Still I hope at least some of you would find this blog interesting and maybe learn something new from it. Enough with the chit-chat, lets begin!



### What is Zookeeper?

Zookeeper as the name suggests is literally kind of a keeper at a zoo. Just not a zoo of animals but that of distributed systems (a zoo nonetheless). Now zookeeper is defined as a  fast, highly available, fault tolerant distributed coordination service.
That seems like a simple enough definition. Although we can extract a couple of interesting things from it. First, it claims to be fast. We will see later why exactly is that and what compromise zk makes in order to be fast. Next, it is highly available and fault tolerant. If you are aware of the CAP theorem, you will realize that zk has compromised on consistency. It is not a strongly consistent system but it is highly available. That in turn means, that there is going to be replication.
Now understanding how Zk achieves whatever it claims to do without strong consistency is a tough topic and we need to go really deep to actually understand it. We would probably be only scratching the surface in this blog. But again, that still has a lot of value to it.

### Why Zookeeper?

There are multiple reasons you would want to use a service like zookeeper. The most obvious answer is that distributed system always need some form of coordination. If you want to make a bunch of computers work in tandem, there has to be a reliable way of coordination between them and zookeeper provides that. Here are some of the use cases of zookeeper:
1. Storing Config information
2. Group Membership
3. Distributed lock
4. Leader Election

We will discuss each of them in detail later in the post.

### Objectives of Zookeeper service

Here are some of the objectives that the creators of zookeeper had in mind while coming up with its design:
1. Simple, robust with a high performance.
2. High availability, high throughput and low latency
3. Tuned for read dominant workloads
4. Familiar models and interfaces
5. Wait free - No usage of locks in the APIs.

We will see how each of these come into play when discussing the data models and the APIs.

### Zookeeper Data Model

Zookeeper has a hierarchical namespace like a file system. Here is how it looks like:

{{< figure src="/images/zk1.png"  >}}

So it is like a tree and each node in the tree is called a zonde. 

The znodes can be of three types:
1. Persistent (persist even if the client that created them disconnects from the server)
2. Ephemeral (deleted if the client that created them disconnects from the server)
3. Sequential (the znodes created as sequential will be assigned monotonically increasing numbers)

The difference between persistent and ephemeral will become more clear in the next section.

Now it is important to note that zookeeper keeps this entire tree in-memory and that is where the requests are served from. (This is the first indication of how it achieves low latency). It does back them up on disk at regular intervals but that is just for persistence.

Since the data is in memory that automatically implies that we cannot store big chunks of data in zk nodes. The good news is that we don't have to because that is not the zk use case. So the types of data stored in znodes are like: configuration, counters, location information etc. So mainly metadata.

### Zookeeper server setup

{{< figure src="/images/zk2.png"  >}}

As the figure shows, the zk ensemble should have multiple servers for fault tolerance. There can be multiple clients and they can be connected to any of the servers. Now there would be a leader among the multiple servers. Writes would be processed only by the leader. However the reads can be served by any of the servers.

If a server is connected to a follower and does a write, the write would be first sent to the leader by the follower and then processed by the leader.

### Zookeeper API

1. bool create(path, data, ACL, flags)
2. void delete(path, expectedVersion)
3. Stat setData(path, data, expectedVersion)
4. (data, Stat) getData(path, watch)
5. Stat exists(path, watch)
6. String[] getChildren(path, watch)

The APIs as you will notice are very similar to a filesystem API. Here are a few interesting concepts:
Flags - The last parameter in the create API allows you to set what kind of znode you want to create (persistent, ephemeral or sequential - can be a combination of persistent/ephemeral and sequential as well)
Watch - In the getData and exists APIs there is a watch parameter which basically sets a callback on the znode. So whenever the value of the znode is modified (or deleted) the client who set the watch will get notified of the change.

Now lets take a look at how using these simple APIs, zk solves very generic problems in distributed systems which makes it so popular.

### Example Use Cases Of Zookeeper

{{< figure src="/images/zk3.png"  >}}

#### Group Membership

In distributed system, you very often need to group your servers in specific groups. Say you have a microservice architecture and you want to associate a new machine that comes up with a specific microservice. This is basically the problem of service registry. This can be achieved very simply with zk. All you need to do is the following:
1. Create a persistent group znode.
2. Add ephemeral sequential znodes within it, one for each server.

The benefit of making them ephemeral is that if the client connection breaks (say the machine goes down), the entry for that client will automatically be deleted from within the group znode.

{{< figure src="/images/zk4.png"  >}}

#### Locking

Another common requirement in distributed systems is to acquire locks across machines (distributed lock). Zk also provides a simple way to achieve this. Consider this code snippet:

{{< figure src="/images/zk5.png"  >}}

In this, we have a persistent znode - lock. Within it we are dealing with just one ephemeral znode - ready-file (can be named anything). Now each client is executing the above 4 lines of code.

They all try to create the ready-file. This operation will succeed only if the file does not already exist. If the operation succeeds, the client can rest assured that it now has the lock and that no one can acquire it till it release the lock. (they will all be stuck on step 1)

Otherwise if the file already exists it implies someone else has the lock and we need to wait. Now there are two ways to wait, either we can periodically check the existence of the file or we can use the watch feature provided by zk. So that is what we use in line 2, where we call exist with watch flag set to true.
Now as soon as the file gets deleted (the client which had the lock, released it), we will get a notification and we can jump to the first step again and try to create the file.

But there is an issue with this approach. Since we are dealing with just one file and there can be multiple machines which might be trying to acquire a lock, we may have something which is called the herd effect. Now all the machines would have set a watch on the file and as soon as the file is deleted, they will all get notified and they will all try to create the file again. Only one will win (it is a race). 
It is obvious that this method puts unnecessary load on zk servers which can be avoided with a more careful algorithm design. This is what we will discuss in the next section.

#### Locking (advanced)

In order to circumvent the herd effect, we modify the above basic locking approach with the following:

{{< figure src="/images/zk6.png"  >}}

Now, this is a little bit more complex so I will try to explain it as clearly as I can. The understanding built here would be used in the next section (leader election) completely so please bear with me.

So here instead of having a single ready-file for all the machines that want to acquire the lock, we create one file for each. So in the first step, each client creates a new ephemeral-sequential znode. This step will definitely pass as we are creating a new node and we will have the znode number with us.
Now the client will do a getChildren call on the lock znode and fetch all the currently attached ephemeral znodes. In this list, it will check which is the smallest number. If its number is the smallest that means that the client now has the lock. So a simple smallest wins strategy is used to find a winner among the znodes.
Now if this client does not have the smallest znode then it implies that someone else (who has the smallest znode currently) has the lock. So this client needs to wait. Again either it can keep checking using polling or set up notifications using the watch feature.
This is where we do things differently and only set the watch on the znode with the number just less than the number of the current client. So each client has set up a notification on the one before them.
In an ideal case, when the smallest number znode client is done, it will delete its znode. The next in line client will get a notification because it already has a watch set on this guy. It will go to step 2 and again fetch the children to ensure it is still the smallest and then proceed with the lock.
In the case where a client dies unexpectedly, it is not hard to see that since the znode is ephemeral, it will notify the next in line client and then following the above steps that client would reset its watch correctly and things would work out.

#### Leader Election

If you understood the above section then this is a piece of cake. The strategy used for leader election via zk is exactly the same as above. Just consider a election znode instead of the lock znode. We will have the same setup as before and now the smallest number client will be called the leader instead of saying that it holds the lock. Rest everything remains the same.

### Conclusion

If you have made it this far, I really hoped you found something of interest and learned something new about zookeeper. I know I have not talked about some of the more finer details of how zk works with eventual consistency. What other guarantees it provides (for eg. Client request FIFO ordering) which makes all the above work despite being eventually consistent. Maybe I don't understand these well enough right now to explain it clearly. But anyway, that is all for this post. Do checkout the references mentioned below to understand this better!

### References

[Zookeeper paper](https://www.usenix.org/legacy/event/atc10/tech/full_papers/Hunt.pdf)  
[Lecture 8: Zookeeper - YouTube](https://www.youtube.com/watch?v=pbmyrNjzdDk)  
[Blog on Zookeeper](http://www.sleberknight.com/blog/sleberkn/entry/distributed_coordination_with_zookeeper_part)
