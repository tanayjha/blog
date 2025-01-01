---
title: "Exploring TCP and Quic"
date: 2024-05-26T00:24:13+05:30
draft: false
showToc: true
ShowReadingTime: true
---

## Context

I recently delved into the TCP protocol for network communication, finding it a fascinating exploration of its origins in the 1970s and its enduring role as the backbone of the internet. While TCP continues to be widely utilized, a newcomer named QUIC has emerged in recent years, touted for its enhanced efficiency compared to TCP. Many browsers and websites have already embraced QUIC, signaling a potential shift in the landscape of network protocols. But what sets QUIC apart from TCP?

In this blog, I aim to document my insights into these two protocols, offering references to aid others in their quest to understand them. Let's embark on this journey of exploration!

## Introduction

Before delving into the intricacies of TCP, it's essential to grasp why understanding TCP is relevant and the role it plays in our daily lives.

The internet has become an integral part of our existence, with many of us spending nearly 90% of our waking hours connected in some form, be it through laptops or mobile devices. Amidst this pervasive connectivity, a fundamental question arises: How does the internet function? What transpires when we navigate to a website like google.com? How does our request traverse to Google's servers, possibly situated in a different country?

The answers lie within the realm of computer networks. The internet comprises a vast network of interconnected devices, yet specific mechanisms and protocols are necessary to ensure the accurate and reliable transfer of data between these devices.

To facilitate this process effectively, computer scientists devised the OSI model, which delineates various layers of network communication. Here are the different layers of the model:

{{< figure src="/images/tcp/osimodel.jpg"  >}}

While each layer is crucial, our focus in this blog will primarily rest on the network layer, which traditionally encompassed TCP and UDP. However, recent advancements have introduced a newcomer to this layer known as QUIC. In subsequent sections, we'll delve into each of these protocols in detail.

## TCP

So what exactly is TCP? TCP stands for Tranmission control Protocol. Although the first versions were created before but the RFC which introduced TCP to the world was [RFC 793](https://www.ietf.org/rfc/rfc793.txt) which was published in Sept 1981. This RFC described the workings of this protocol.

Here are some of the features of TCP:

### TCP Handshake

{{< figure src="/images/tcp/tcphandshake.png"  >}}

TCP protocol begins with a three way handshake between the client and the server. Here are the main purposes this handshake fullfils:
1. **Connection Establishment**: Establishes a connection between the client and the server and after this further data transfer can happen.
2. **Synchronization**: TCP uses sequence numbers to order the messages. This initial handshake synchronizes the sequence numbers between the client and the server as they exchange their sequence numbers in this process.
3. **Security**: During the handshake, the client and server can optionally exchange security info like encryption algorithm and keys thereby providing a method to encrypt further communication and making it secure (TLS - this can be another blogpost).

Initially, one might question the necessity of the third ACK from the client to complete the handshake. Why not stop at the second SYN-ACK and declare the connection established? However, it becomes evident that the third ACK serves a crucial role. It informs the server that the client has received its message and is prepared to proceed with the connection. Additionally, it ensures bidirectional synchronization of sequence numbers, enhancing the reliability of the connection establishment process.

### Data Transfer

Once the TCP handshake is complete, we say that the TCP connection between the client and the server has been successfully established. Now the data can flow between the client and the server. 
Now the actual data transfer will depend on the type of application using this TCP connection. Here are some of the more famous application protocols (The topmost layer of the OSI model):
1. **HTTP (Hypertext Transfer Protocol)**: A protocol used for transmitting hypertext requests and responses over the internet, commonly used for fetching web pages and resources in browsers. If you add a S at the end i.e HTTPS, then it becomes the secured version of HTTP as it includes the TLS encryption mentioned above.
2. **FTP (File Transfer Protocol)**: A protocol used for transferring files between a client and a server on a network, commonly used for uploading and downloading files from servers.
3. **DNS (Domain Name System)**: A protocol used for translating domain names into IP addresses and vice versa, enabling the resolution of domain names to their corresponding IP addresses on the internet.
4. **SSH (Secure Shell)**: A protocol used for secure remote access to systems and devices over a network, providing encrypted communication and authentication for remote login, file transfer, and command execution.

Continuing with the example of navigating to google.com, which employs HTTP(s), the TCP layer, after completing the handshake, initiates a GET request to the Google server to fetch its homepage. Subsequently, the server responds by sending data to the client.

An important consideration in this data exchange is determining the amount of data the server can transmit to the client. This is governed by various TCP parameters exchanged during communication. The window size parameter, in particular, specifies the amount of data the client can handle. Additionally, window scaling allows for a finer adjustment of the window size by incorporating a multiplication factor, enabling dynamic adaptation to changing conditions.

In addition to managing data flow with the window size parameter, TCP also implements congestion control, dynamically adjusting the transmission rate based on network conditions. Furthermore, TCP ensures reliability by retransmitting any packets for which acknowledgment (ACK) is not received, thereby ensuring successful packet delivery.

## QUIC

The preceding discussion outlines the traditional data transfer mechanism utilized by HTTP, predominantly facilitated by TCP. However, recent advancements have ushered in a transformative protocol developed by Google researchers known as QUIC, an acronym for Quick UDP Internet Connections. This innovative protocol represents a paradigm shift in web communication, aiming to bolster both performance and security by amalgamating the strengths of TCP and TLS with the efficiency of UDP.

In contrast to TCP's reliance on a singular, connection-oriented stream, QUIC introduces a multiplexing feature that enables concurrent transmission of multiple streams over a single connection. This multiplexing capability not only accelerates communication but also enhances efficiency. Furthermore, QUIC incorporates native encryption mechanisms, alleviating the latency typically associated with establishing secure connections.

Moreover, QUIC integrates sophisticated congestion control and error recovery mechanisms, fortifying its resilience against packet loss and network congestion. This robust framework ensures a reliable and uninterrupted communication experience for users.

Essentially, QUIC capitalizes on UDP's speed while augmenting it with TCP-like reliability, further refining congestion control and retry mechanisms. As a result, many websites have already transitioned to QUIC, also denoted as HTTP/3. To verify whether a website utilizes QUIC, one can inspect the protocol section of the developer tools network tab, affirming its widespread adoption within the realm of modern web applications.

You can look at the protocol section of developer tools network tab to confirm if a website uses QUIC. Here is the same for google.com which does indeed use QUIC (h3 is short for HTTP/3):

{{< figure src="/images/tcp/h3protocol.png"  >}}

## Conclusion

In summary, TCP has long been the trusted backbone of internet communication, ensuring reliability but sometimes at the cost of speed. Enter QUIC, a game-changer developed by Google. It blends the best of TCP's reliability with the speed of UDP and the security of TLS. With QUIC, multiple streams can flow over a single connection, making communication faster and more efficient. Plus, it comes with built-in encryption and smart ways to handle network congestion.

QUIC, also known as HTTP/3, is already making waves on the web, promising a future where browsing is faster, more secure, and more reliable. Understanding TCP and QUIC helps us navigate the evolving landscape of internet protocols and embrace the exciting possibilities they bring to modern web communication.

## References & Credits

1. [Chris Greer on TCP](https://www.youtube.com/playlist?list=PLW8bTPfXNGdAZIKv-y9v_XLXtEqrPtntm) - He goes into the packet details by showing stuff on wireshark. Very good for a deep understanding.
2. ChatGPT - Found a new way of learning topics - ask GPT questions as you begin to learn and dive deep into any area and then recurse. Great way to learn new stuff according to me.
3. Special Acknowledgment to ChatGPT: For skillfully formatting the blog. Utilized ChatGPT to enhance and refine sections, resulting in a comprehensive and polished output.