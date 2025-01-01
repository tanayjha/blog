---
title: "RSA Encryption System"
date: 2017-04-22T12:09:25+05:30
draft: false
showToc: true
ShowReadingTime: true
---


### THE NEED OF ENCRYPTION

In today's world where a lot of secured information like our credit card number, passwords etc., travel around the web, the presence of a secure encryption system is almost inevitable.

**We want a method to encrypt a message, send it over the insecure internet connection and allow only the receiver to be able to decrypt and read the original message.** This exact problem was solved by Rivest, Shamir and Adleman(RSA) in the year 1978, in their paper A Method for Obtaining Digital Signatures and Public-Key Cryptosystems.
In this post, I will try to explain the method they adopted to create a secure encryption system.

### PUBLIC KEY CRYPTOSYSTEM
A public key cryptosystem has the following properties:

1) D(E(M)) = M, if we decrypt an encrypted message, we should get back the message.

2) Both E and D should be easy to compute, if it takes days to encrypt or decrypt the message, then the cryptosystem is not very useful.

3) By publicly revealing E the user does not reveal an easy way to compute D. The encryption key of the users is revealed publicly so that any person can send an encrypted message to the user. However if by using E, someone can obtain D, then the encryption system will fail. So this should not happen.

4) E(D(M) = M, i.e it is a **trap-door one-way permutation**. Trap-door, as there is a method to decrypt the message. One-way as by revealing E, we do not reveal D. Permutation as we get back the message by decrypting an encrypted message or encrypting a decrypted message. This property is useful in digital signatures.

{{< figure src="/images/rsa.png"  >}}

In the above image, we can observe how data is transferred between the sender and the receiver. The sender uses the recipients encryption key to encrypt the message. This transforms the plaintext message to ciphertext. This ciphertext is then sent over the insecure connection to the recipient, who can decrypt the message using his own decryption key, which is exclusive to him.

### DIGITAL SIGNATURES

Digital signatures have become commonplace nowadays. They present a very efficient method of saving resources as well as time. However, we require a secure system in place as the signed documents have to be sent over an insecure connection and digital forgery is fairly easy.
Rivest, Shamir and Adleman presented a very elegant method to solve the problem of digital signature in their paper. Here we describe the method.

Bob has to send a signed document(M) to Alice

1)  S = DB(M), Bob uses his decryption key on the message(i,e the document) to create a unique signature.

2) He sends EA(S) to Alice. He encrypts the message using Alice's encryption key to ensure secure communication.

3) Alice decrypts the received ciphertext with DA to obtain S.

4) Now Alice uses Bob's encryption key on S, i.e EB(S), and if the original document is obtained then it ensures that Bob was the one who signed the document as DB is present only with Bob.

Hence the above method provides a way to legally ensure that a signature can be linked to a particular person.
However, we still have to talk about digital forgery. What if someone copy pastes Bob's signature to another document, say M'.
We have nothing to worry about because Bob's signature created in the first step, not only links it to Bob, but also to the document (M) itself. So if the document changes from M to M', Bob's signature will also change from S to S'. Hence a single signature cannot be used on multiple documents and hence forgery of the signatures is not possible.

### THE IDEA
The main idea behind the RSA Encryption System is that factorization is a hard problem.
Specifically, if we are given the product of two prime numbers and are asked to find the individual primes which consist of the product, then the best known algorithm to do this is Number Field Sieve (NFS). 
The running time of NFS is O(n1/3) for an integer n.
It is easy to create a product of primes as long as 10^2048. However we can contemplate, how long it will take to obtain the two primes whose product is given.

There was a challenge held till 2007, in which the participants were provided with the number n = p * q, p and q are prime and the participants had to find p and q. The number n was called the RSA number.
**RSA-220(220 digits long) was solved last year!**


### EULER TOTIENT FUNCTION

To understand the math that will follow we have to understand what is the euler totient function. 
**φ(n) is the euler totient function, it gives the number of positive integers less than n which are relatively prime to n, i.e gcd(number, n) = 1.**
So for example φ(4) = 2 ({1, 3}, gcd(1, 4) = 1 and gcd(3, 4) = 1 but gcd(2, 4) ≠ 1.)
Similarly φ(5) = ({1, 2, 3, 4}, gcd(i, 5) = 1 ∀ i ∈ {1, 2, 3, 4})

We can observe that for every prime p, φ(p) = p-1 (as gcd(i, p) = 1 ∀ i ∈ {1, 2, 3...p-1})

Lets try to calculate the totient function for product of primes, say pq

φ(pq) = (pq − 1) − (p − 1) − (q − 1) .... (1)
pq-1 is the number of numbers less than pq. However there are (p-1) multiples of q among those which will not have a gcd of 1 with pq, similarly there are (q-1) multiples of p which will not have a gcd of 1 with pq. So by subtracting these two quantities from all possible numbers, we get the numbers which have a gcd 1 with pq, which is exactly the value of Euler Totient Function
Simplifying the above equation we get
**φ(pq) = pq − p − q + 1 ....... (2)
φ(pq) = (p − 1)(q − 1) ....... (3)**

### THE METHOD


* Bob chooses two primes p,q and compute n=pq


* Bob chooses d with gcd(d , (p-1)(q-1)) = gcd(d , φ(n))=1


* Bob solves de ≡ 1 (mod φ(n)) and gets e


* Bob makes (e,n) public and keeps (p,q,d) private


* Alice encrypts M as C ≡ Me(mod n)


* Bob decrypts by computing M ≡ Cd(mod n) 

### THE UNDERLYING MATHEMATICS

We have to show that the above mentioned method of encrypting and decrypting the message will provide us a way to get D(E(M)) = M and E(D(M) = M
Now,
**D(E(M)) ≡ (E(M))<sup>d</sup> ≡ (M<sup>e</sup>)<sup>d</sup>(mod n) = M<sup>e·d</sup>(mod n) ..... (4)**


**E(D(M)) ≡ (D(M))<sup>e</sup> ≡ (M<sup>d</sup>)<sup>e</sup>(mod n) = M<sup>e·d</sup>(mod n) ..... (5)**


So we observe that both the quantities reduce to the same expression.
If we somehow prove that  Me·d(mod n) ≡ M(mod n), we will be done.

**M<sup>e·d</sup> ≡ M<sup>k·φ(n)+1</sup>(mod n)  (for some integer k) ........ (6)**
This follows from the fact that de ≡ 1 (mod φ(n))

Now [Fermat's little theorem](https://primes.utm.edu/notes/proofs/FermatsLittleTheorem.html) states that Mφ(p) ≡ 1 (mod p) ...... (7)

From (6) and (7), we get,


**M<sup>k·φ(n)+1</sup> ≡ (Mφ(n))<sup>k</sup> .M ≡ 1<sup>k</sup>.M (mod p) ≡ M (mod p) ..... (8)**

**M<sup>k·φ(n)+1</sup> ≡ (Mφ(n))<sup>k</sup> .M ≡ 1<sup>k</sup>.M (mod q) ≡ M (mod q) ..... (9)**

Now we have to somehow combine (8) and (9) to obtain the result (mod n).

Simplifying (8) and (9), we have something of the form

a ≡ b (mod p)   => p | (a-b)  (p divides a-b)  
a ≡ b (mod q)   => q | (a-b)  (q divides a-b)

We claim that we can combine the above two equations to give:

a ≡ b (mod n)   => n | (a-b)  (n divides a-b) (where n = p * q)

This follows easily because p and q are prime and they divide (a-b).
Hence if we express the prime factorization of (a-b), it will contain at least two primes which are p and q respectively.
i,e (a-b) = (p*q)*p1*p2....
It is clear from the above argument that p*q= n occurs in the prime factorization of (a-b) => n (= p*q) | (a-b) thereby proving the combination property.

Using the above proved fact we can combine (8) and (9) to give:

**M<sup>e·d</sup> ≡ M<sup>k·φ(n)+1</sup> ≡ M (mod n) ........ (10)**

Hence we have proved that the RSA system of encryption works and due to the permutation property((4) and (5)), the problem of digital signatures is also resolved.

### A SMALL EXAMPLE

Consider the case:

**p = 47, q = 59, n = p · q = 47 · 59 = 2773, φ(2773) = 46 · 58 = 2668 and d = 157 e = 17, as 17.157 ≡ 1(mod 2668)**

Let the message be:
  
**ITS ALL GREEK TO ME**

We convert this by substituting a two digit number for each letter, blank = 00, A = 01, B = 02, . . . , Z = 26

The converted string is:
**0920 1900 0112 1200 0718 0505 1100 2015 0013 0500**

The first block(M=920) can be enciphered as:

M17 = ((((M)2)2)2)2 ·M = 948 (mod 2773)

The whole message is enciphered as:
**0948 2342 1084 1444 2663 2390 0778 0774 0219 1655**

Deciphering the first block gives:

948157 ≡ 920 (mod 2773)

In the same way we can decipher all the blocks and apply reverse substitution to get back the original message.

### THE LEGEND OF RSA

The RSA algorithm has remained a secure scheme for sending encrypted messages for almost 40 years, earning Rivest, Shamir, and Adleman the Association for Computing Machinery’s 2002 Alan Turing Award, among one of the highest honors in computer science!

 



