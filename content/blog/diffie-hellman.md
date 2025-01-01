---
title: "Diffie Hellman Key Exchange"
date: 2023-02-03T00:24:13+05:30
draft: false
showToc: true
ShowReadingTime: true
---

Recently I had the opportunity to read about the Diffie Hellman key exchange and found it to be fascinating. The beauty of it lies in its simplicity. Of course there is some complicated number theory involved, but overall it is pretty easy to grasp the concept intuitively as well. So let's start with it...

## What?

Diffie-Hellman key exchange is a method of digital encryption that securely exchanges cryptographic keys between two parties over a public channel without their conversation being transmitted over the internet. The two parties use symmetric cryptography to encrypt and decrypt their messages. Published in 1976 by Whitfield Diffie and Martin Hellman, it was one of the first practical examples of public key cryptography.

## Why?

Diffie-Hellman key exchange's goal is to securely establish a channel to create and share a key for symmetric key algorithms. Generally, it's used for encryption, password-authenticated key agreement and forward security. Password-authenticated key agreements are used to prevent man-in-the-middle (MitM) attacks. Forward secrecy-based protocols protect against the compromising of keys by generating new key pairs for each session.

Diffie-Hellman key exchange is commonly found in security protocols, such as Transport Layer Security (TLS), Secure Shell (SSH) and IP Security (IPsec). For example, in IPsec, the encryption method is used for key generation and key rotation.

Even though Diffie-Hellman key exchange can be used for establishing both public and private keys, the Rivest-Shamir-Adleman algorithm, or RSA algorithm, can also be used, since it's able to sign public key certificates.

## How?

This is the interesting part. How exactly can two people, Alice and Bob (our favorite), exchange a secret key which only they will know and agree upon by transmitting data over an insecure channel. To understand the diffie-hellman key-exchange, we will first need to learn a little bit about discrete logarithms and primite roots.

### Discrete logarithm

Consider the equation, y = g<sup>x</sup> mod p. If you are given g, x and p, it is pretty straightforward to calculate y. However, given y, g and p, it is, in general, very difficult to calculate x. This problem of calculating the value of x, is called taking the discrete logarithm of the number y for the base g (mod p) and denoted as dlog<sub>g,p</sub>(b).
The difficulty of calculating this seems to be on the same order of magnitude as that of factoring primes required for RSA. At the time of this writing, the asymptotically fastest known algorithm for taking discrete logarithms modulo a prime number is on the order of: e<sup>((ln p)1/3(ln(ln p))2/3))</sup> which is infeasible for large primes.

### Primitve roots

The figure below shows all the powers of a, modulo 19 for all positive a < 19. The length of the sequence for each base value is indicated by shading.

{{< figure src="/images/diffieHellman/primitveRoot.png"  >}}

The number of possible values when you take the mod of a number with 19, is 19 i.e [0-18]. So in the above table, all the numbers for which the shaded length = 19, are referred to as a primitive root of n. The importance of this notion is that if a is a primitive root of a prime p, then its powers a, a<sup>2</sup>, ..., a<sup>p-1</sup> are distinct (mod p).
In particular, for a prime number p, if a is a primitive root of p, then
For the prime number 19, its primitive roots are 2, 3, 10, 13, 14, and 15 as we can see from the figure above. There is more complicated math around primitve roots but lets not go into that in this blog post.

## The Diffie-Hellman Algorithm

The below figure shows the steps of diffie-hellman algorithm:

{{< figure src="/images/diffieHellman/diffieHellman.png"  >}}

The idea behind the algorithm is pretty simple.
1. First Alice and Bob agree upon a prime number q and a primitve root of q, say α such that α < q. 
2. They both generate a private key X<sub>a</sub> and X<sub>b</sub> respectively such that both the keys are smaller than q.
3. They both calculate their public keys Y = α<sup>X</sup> mod q and exchange that over the insecure channel.
4. The key exchange is now done. They both calculate the shared secret key K = Y<sup>X</sup> mod q.

In order to convince ourselves that this actually works, there are a few questions we have to answer:

1. In the first step why does α < q have to be a primitive root of q.
2. After the calculations of public key are done and they are exchanged, how does step 4 generate the common secret key for both.
3. How do we ensure that the transmission of public key over the insecure channel, does not compromise the secret key in any way.

If we are able to answer the above questions, we can feel confident that we understand the diffie-hellman key exchange method well enough.

So lets start with the first question. Why do we need α to be a primitve root of q and why should it be strictly smaller than q. If you look at step 3, where they both calculate their public keys, they raise α to some power (of their selected private key which can be assumed to be different) and then take a (mod q). If α is a primitive root of q (less than q), we can be sure that the generated public keys will also be distinct (from the properties of primitive root we saw above). Hence selecting α < q and a primitive root of q ensures uniqueness of the generated public keys. This also makes it harder to guess the shared secret key since the keys are in a random distribution and each key has equal probablity of occuring.

For the second question, how does step 4, i.e K = Y<sup>X</sup> mod , guarantee that both Alice and Bob got the same key. The proof for that is pretty elementary and involves basic arithmatic.

{{< figure src="/images/diffieHellman/dhProof.png"  >}}

Now, for the final question. What happens if someone intercepts the public keys Y<sub>A</sub> and Y<sub>B</sub> shared by Alice and Bob? Can they figure out the shared secret key?
In order to calculate the secret key X<sub>A</sub>/X<sub>B</sub>, the hacker will have to solve the discrete logarithm problem as they need to calculate X from the equation: Y = α<sup>X</sup> mod q. We have already seen above that calculating discrete log is a very hard problem and has similar complexity as factoring product of primes which is the basis of security for RSA. So we can confidently say that Diffie-Hellman is at least as secured as the RSA which is good enough for all practical purposes.

## Conclusion

So we now have a nice method of exchanging shared secret key securely which can be used in a lot of symmetric key encryption algorithms. Diffie-Hellman is also used in SSL/TLS, the protocols that secure web communication. So the usage is very widespread. 
Combining it with RSA is also one of the common use case of Diffie-Hellman. It is used to securely exchange the shared secret key, which is then used with RSA for encryption. This provides the security of key exchange from Diffie-Hellman and the encryption strength of RSA, making it a more secure solution than either method alone.

Hopefully this blog gives you the confidence you needed to say that you understand the Diffie-Hellman Key exchange. 

### References

1. Cryptography and Network Security by William Stallings.
2. Introduction to Cryptography by Christof Paar (Youtube lecture)