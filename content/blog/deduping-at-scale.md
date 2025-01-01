---
title: "Deduping at Scale"
date: 2020-11-29T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---

Today I am going to talk about a project which I worked on in my organisation [Sumo Logic](https://www.sumologic.com/).

We have this microservice which is used for collecting data from the cloud. One of the most prominent [use case](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/Amazon-Web-Services/AWS-S3-Source) of that microservice is to collect data from customers S3 bucket. 

I have written another blog on how we worked on making data discovery faster so that we can reduce ingestion lag. You can check it out [here](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/Amazon-Web-Services/AWS-S3-Source). 

After we solved the data discovery issue, we realised that there was another issue we were facing. This was limiting our scalability. The stakes this time were even higher.

I can't describe the complete architecture of the microservice as I would probably be violating some NDA. I will only talk about a small section of it which was the main bottleneck for us.

### Context

We use the [AWS List API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html) to list the objects of the S3 bucket. Of course we take the necessary permissions from the customer to be able to do that. So we have a scanner thread running per source which lists the bucket.

In the blog I mentioned above, I discussed how we introduced another mechanism - SNS - to bring in the objects as well. So now every source can possibly have two methods of bringing in the data from S3 bucket:

1. Scanner

2. SNS

In order to not duplicate the data coming in, we need some kind of dedupe mechanism in our microservice. (This was needed even before SNS was in picture, but lets not go into that application specific complexity right now)

### Existing Design

We started off using a [RDS](https://aws.amazon.com/rds/) (SQL DB) for deduping these S3 objects. So whenever an object came through Scanner or SNS, we first checked if it was present in the DB. If it was, that means we are fetching the object for the second time and we reject it. 

If it is not present in the DB, we simply inserted it there. 

Now the DB table also maintained states of the object. So the object was initially inserted with a pending state. After that there was a poller running per node which fetched recent pending objects from the table and sent them downstream for further processing and updated their state to Completed.

This was the high level working of the initial part of the architecture.

Here were the major issues with the existing design:

Needed a db.r5.4xlarge RDS instance (on our bigger deployments). There was a time when we had to run a db.r3.8xlarge machine since we had maxed out CPUs on the smaller ones. We didn’t have more room to scale vertically on a single DB.

There is a connection limit associated with the RDS instances which limited our horizontal scalability. 
With the db.r5.4xlarge instance that limit is 4000 connections. We give 40 connections to every node. So there is an upper limit of 100 nodes that we can add.

Although we have bigger RDS instance size with us and we can scale vertically but there are two issues with that:

Moving to a higher instance type effectively doubles the cost. The current one costs us about $40k/year

Although moving to a higher instance size doubles the cost but it does not effectively double the 
number of connections. For eg. moving from 4xlarge -> 8xlarge changes the connection from 4000 -> 5000, 
so only 25 extra CC nodes capacity. 


Hence we could not go too far with just vertical scalability. We need some way to create more headroom to allow horizontal scalability. 

### Acceptance Criteria

Acceptance criteria and goals of the new design:

The microservice on a big deployment handled 400 MB/sec with 20 nodes, keeping the cluster CPU at 50%. Every node gets 40 connections with the database. When one of our big customers were at their peak, the service was (barely) handling 1.2 GB/sec. The goal is to be able to handle 10x the current load. That is after the redesign, the service should be able to handle about 4GB/sec load.

Try to solve the connection problem allowing more horizontal scalability. This is actually needed to achieve the above goal. The more nodes we are able to add, the more will be our processing power.

Try to reduce the cost we currently incur for CC datastore. Maybe try and reduce the RDS instance size as some load will be shifted from it and moved to a key value store (which will have additional cost)


### Approaches Considered

There were three major ways to revamp the design of this system:

Move the design completely to use a NoSql store instead of RDS which would ensure better scalability and performance.

Move some part of the system to a NoSql store and keep the remaining part on RDS.

Keep all the data on RDS but shard the database for scalability.


Let’s discuss each of these in detail listing down the pros and cons.

#### Completely move from RDS to a NoSql store

So initially we thought of moving the SQL store to NoSQL completely. We knew that if a NoSql store fits our use case correctly, we can have a very scalable system built on top of it.

We decided to use DynamoDB and did a POC with it. For the most part it was looking impressive except that when we did a scale test, we hit something known as hot partitions.
The reason for this was that one of our read queries (of fetching the most recent pending items) needed a GSI to be created on the dynamoDB table for it to be fast. 
The problem was that this GSI caused write throttling due to a hot key.

{{< figure src="/images/dedupe1.png"  >}}

Now there are ways to get around this problem. The most common one is write sharding. But it has it's own set of challenges. We did complete the POC with this approach and it worked. However due to the involved complexity of write sharding, we decided to investigate further and see if we can find a better solution. Hence we kept this approach on hold.

#### Completely remain on the SQL store

Now we knew that a single RDS instance was becoming a bottleneck for us. So what are the ways of scaling a SQL system?

Well to support read heavy workloads, you use read replicas. 
And to support write heavy workloads, you shard your writer instance.

Now we don't use the reader instance of our DB. The reason is that we want strongly consistent reads. Since in a dedupe use case, if your reads are not strongly consistent, there is a possibility of data duplication. If you use a reader instance, you give up read after write consistency guarantees (due to the asynchronous replication). Hence we use the reader instance only as a failover.

So the next thought was to shard the database. Here is a nice blog on sharding. 
The more you read about it, the more you will realise that sharding is a bitter medicine which you should take only if there are no better options available. This article from Percona really puts that in perspective.

Apart from all the issues mentioned with sharding in the article above, another challenge specific to our organisation was that we did not have much experience with it. No other team had to do this before and there was no existing framework that we could leverage. 
Since we were running on a time crunch, hence we decided that it would probably be better to keep searching for an easier and more simple solution. That is what we did at least.

#### MySql-NoSql Hybrid Approach

The basic idea behind this approach was to separate the deduplication concerns with the rest of the input processing. The deduplication use case can be easily (and more cleanly) solved by a NoSql store.

First let’s analyse what are the benefits we might get if we separate out deduplication from the rest:
The existing architecture had a table which is used for Deduplication and persistence. What this table did was retain the input (read S3 object keys) for all the blades in the last 10 days. About 3 months back, there were about a billion entries in this table. This was causing a lot of issues for us (the main root cause was our purger not able to delete the entries at the correct pace). We eventually fixed the issue but even then there were about 400 million entries in the table.
We run the getMostRecentObjects (mentioned above) query on this table. Even though it uses an index (and this was actually one of the issues above, the query was not using the correct index as the table size was so huge and the stats of the table were all skewed), this is probably not the best way to query for duplicates. If we move this to a NoSql store instead, we have the clear benefit of high performance.
Also if we are able to move deduplication logic from RDS -> NoSql, we would save on the database connections which are made to insert the objects in this Inputs table. We will have a separate table (which is present in the current design as well) which will handle the bookkeeping of thousands of concurrent inputs.


Hence it is easy to see that using a NoSql store for deduplication has its benefits.


### Rollout

Finally we decided to go with the MySql-NoSql hybrid approach. Another difficult aspect of this project was the rollout phase. There were three main phases in rollout:
1. Dual write on both old and new store. The new store had asynchronous retries to handle failures. We had metrics set up so that we have clear indication of the progress of this stage.
2. After 10 days (our purging period), we could switch reads to the new store.
3. After some time we can switch the writes as well to only the new store.
4. Finally after 10 more days the old store would be empty and we can simply delete the SQL table.

{{< figure src="/images/dedupe2.png"  >}}

This was the connections graph in one of the production deployments after the rollout. We saw similar trends on all deployments i.e the connection usage became 1/3rd of the original value. This directly implied ~ 3X more horizontal scalability. (Obviously there is another factor of the DB CPU, but that was not too high to begin with) 

### Conclusion

Overall this was a nice challenging project to work on and gave me a chance to work closely with some Sql/NoSql DBs. Database migration is a challenging task but if done right, it can really improve your scalability and save you the time and complexity of revamping your complete microservice!



