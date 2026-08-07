---
title: "Let's integrate AI Agents in Event-Sourced Systems — Divakar Kumar, FlyersSoft"
source: "https://www.youtube.com/watch?v=o6U_2vd967Y"
author:
  - "[[AI Engineer]]"
published: 2026-07-30
created: 2026-08-07
description: "A card gets declined and no one, including the customer, can say exactly why. That gray zone is where Divakar Kumar points his agents. In a payments and fraud system, a rule based engine and an ML mod"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=o6U_2vd967Y)

A card gets declined and no one, including the customer, can say exactly why. That gray zone is where Divakar Kumar points his agents. In a payments and fraud system, a rule based engine and an ML model already score most transactions cleanly; the hard cases are the ambiguous ones that neither can resolve. His approach adds an agentic layer on top of an existing event sourced architecture rather than replacing it, so the bounded contexts already in the system, transaction, device, and account, become the context the agents reason over.  
  
Events flow through change feeds into projections and a semantic layer that the agents read, communicating asynchronously through a message broker in a saga style loop. A risk analyzer agent, a second agent that reaches a verdict, and a third work the case while guarding against infinite loops and keeping memory short, all runnable serverless. The takeaway is architectural: event sourcing already carries the state and history an agent needs, so the cleanest way to add judgment to a production system is to layer agents onto the events you are already emitting.  
  
Speaker info:  
\- https://www.linkedin.com/in/divakar-kumar/  
\- https://iamdivakarkumar.com  
  
Timestamps:  
0:00 - Introduction: adding agents to an existing system  
1:20 - A declined transaction you can't explain  
3:04 - Where rule based and ML systems fall short  
5:40 - Handling the gray zone with agents  
5:53 - Bounded contexts: transaction, device, account  
8:24 - Event sourcing and change feeds  
10:57 - Building the semantic layer  
13:16 - Avoiding infinite loops  
14:07 - The risk analyzer and verdict agents  
15:24 - The saga orchestration loop  
19:00 - Putting the architecture together

## Transcript

### Introduction: adding agents to an existing system

**0:01** · \[music\] Hello everyone.

**0:15** · Thanks for joining.

**0:16** · So, I think like finally we are at the last day of the conference.

**0:21** · Personally, I had a great experience, learned a lot of new things.

**0:25** · So, I believe by the end of the session you would have at least few tea takeaways that you could apply in your work projects.

**0:33** · So, what is it we are going to learn?

**0:35** · So, we are going to learn how to integrate AI agents in your existing system. So, this system it could be an even so system or it could be an even driven system or it could be any architecture that your business has invested over last few years, right?

**0:51** · Because I always believe that these AI agents are more not just for the chatbots or the coding assistance, right? So, the real value that you could bring out of these AI agents is like when you start to apply these into your business workflows.

**1:07** · And that is what we are going to learn.

**1:09** · And the problem space that we are going to work on today is the real-time fraud detection.

**1:14** · So, let me start with an example. So, this is my personal experience. So, a exactly a month ago, I purchased uh like I decided to purchase this laptop that I'm using for the presentation. So, it's it costed me around like $3,500.

### A declined transaction you can't explain

**1:30** · So, I waited for a right moment. So, I was seeing like whether I have a nice offers and there was one moment. So, I decided to buy. I provided my card details and then I clicked on buy button. Then my transaction got declined. So, I thought like it was a network issue and some information has been misplaced. So, I tried the second attempt and it was failed again.

**1:54** · Before I I the third attempt, so I got a call from the customer service asking to verify like if I am doing that particular transaction. And I was like, yes, I was trying to do this for the past few minutes. And I asked them like, why did you block my transaction? Do you know what the response was?

**2:12** · They didn't know because I wouldn't blame blame them because they didn't know like why it was blocked. It was somewhere in the system, either the rule-based engine or the ML-based engine would have taken that decision. So, it would have looked through my transaction history or it would have have an average threshold beyond which like if it goes like just block the transaction, that would be the static rule that it would have had.

**2:36** · Because of which my transaction got declined.

**2:39** · So, the those are the key areas, like those are the uncertain areas where we are trying to integrate the AI agents.

**2:46** · Now, you might be thinking like what a great idiot, right? Because it is already an uncertain case like why do you want to introduce an AI agent because it is also a non-deterministic by nature, right?

**2:58** · But the key point here that we are all trying to miss is that earlier in the rule-based engine or the ML-based engine like we don't have enough context. We don't have enough real-time data that gets passed on to the system.

### Where rule based and ML systems fall short

**3:13** · And those are the real data like that we are trying to capture from different domain context that we have in our domain. And we are going to see like how we could build that architecture so that the AI agent can make use of it and come up with a verdict.

**3:30** · So, the domain that we are going to talk about is the real-time fraud detection as I mentioned before. So, we had this rule-based engine like uh 5 years before. And this rule-based engine was perfectly fine like it was working perfectly fine for few of the cases. And but but the problem with this rule-based engine is like the maintainability because the fraudsters are trying to get intruded into a system like by a lot of different ways and you just need to keep on updating these static rules day by day and it it it's

**4:01** · going to be really difficult for you to manage. And that's when like we started to tie up with a third-party provider like who helped us to develop this ML model. So we we have this ML base approach like where we shared with them transaction history or different features with them like based on that they trained the ML model and we were able to get a risk code based on that which with which like we were able to block or approve the transaction.

**4:30** · But the problem with either of these approaches like either like we we were able to handle most of the transaction because it would fall below a certain threshold then we would approve the transaction and if it goes beyond a certain threshold we would be blocking those transaction.

**4:48** · But majority of the transaction like few of the transaction like goes under the gray zone area and this is the area where it is really uncertain for those systems to really come to a conclusion whether it is an fraudulent transaction or a legitimate transaction.

**5:07** · So what we are trying to do is like we we had built a system where we had both these tier one system which has this rule based or the traditional ML model and then we also had a tier two system which is agentic AI approach like most of the cases would be handled really well by these existing system we already had because our thought process is not to exclude the systems that we already had.

**5:34** · We we are just trying to handle few of the areas like that is the gray zone areas with the help of agentic AI processing.

### Handling the gray zone with agents

**5:43** · So this is the approach like that we decided okay let's move on with this approach." But then our architecture, our domain is really complicated. So, this is our different bounded contexts that we have internally in our domain. So, the transaction context holds all the details about your transactions. Like, it knows about the merchants.

### Bounded contexts: transaction, device, account

**6:04** · It knows about the amounts that that you transact. And everything related to a transaction would be residing on this particular context. And it doesn't have any information about the customer it is handling, or it doesn't have any information about the payments or the device details.

**6:20** · That is what the bounded context means, right? Because if you are from the DDD background or software engineering, like you would know that these are different bounded contexts like with like you wouldn't share the data among themselves. Like, you need to do an asynchronous way of communication. And like all sort of things like that you would do in a microservice communication would necessarily be done here as well.

**6:45** · So, then we do have accounts context.

**6:49** · All the details about the accounts like the KYC complaining, whether the user is KYC compliant, or anything about the customer. Like, if you want to know about the customer, this would be the right context that we need to reach out to. And there is a device context. Like, we had stored all the device fingerprints, browser fingerprints, the OS that they are using over these device contexts. Like, that would be really helpful like for detecting these kinds of real-time frauds.

**7:16** · And finally, like we had payment context. So, any sort of chargebacks or anything related to the payments will be residing on this particular context.

**7:26** · So, now the problem that we have with this kind of an architecture is like we we really we really don't have a way or means to share these data across different bounded contexts, right? So, that's where like we started to introduce an orchestrator layer. So, earlier like we had this orchestrator layer, but now we also have an agentic AI inside this orchestrator. So, what this orchestrator does is like similar to a saga orchestration.

**7:54** · So, all the communication would go through this layer and then it would be communicated to other services like who are interested in those events. And that is how like we define this orchestration layer.

**8:09** · And we also have an asynchronous way of communicating with within other different contexts like through a message broker.

**8:17** · If I zoom in a little bit on the transaction context, you could see what what are the details that these transactions are holding. So, essentially like what happens is like when you have particular domain, you will be having different events that are emitted from that system. So, those are really called as domain events. And within our transaction context like we do have transaction created domain event, which is the start of entire transaction. And we do have lot of integration events.

### Event sourcing and change feeds

**8:47** · So, these are the events that comes from other contexts like payment contexts, device contexts, or account contexts.

**8:54** · So, events like transaction rejected, payment approved, payment rejected would come from other systems to our transaction contexts.

**9:03** · And these entire informations are stored in our NoSQL database.

**9:07** · We are currently using Cosmos DB as our event store.

**9:11** · And we are following event sourcing as our methodology to store the events. So, what happens is like whenever user initiate a command, so that goes into our event store as an event as a business fact. So, we are not mutating the state, but instead like we are appending all the events as when it arrives.

**9:29** · And what it really helped us to do is like once it arrives into the event store, so we have a kind of a mechanism called CDC or in no sequel word this is called as a change feed with which like whenever there is a change or update happens over a table, so you will be getting notified and those changes could be propagated into different read models.

**9:52** · So, because in in in a real scenario like you won't be able to rely entirely upon the event store for the query operation for the read operation. What you would do is like internal like you will be having different read models which are optimized for the read operations. So, what we really had is like we had multiple read models. So, one for timelines, one for customer information, and one for the fraud in the indicators, the risk view.

**10:20** · So, these are the different read model later layers that we had within our transaction context.

**10:25** · And essentially like you can't you can't you can't say other teams to follow the same patterns because even sourcing is not the one that other teams are also following. So, what we did is like we also had this asynchronous way of communication by emitting those events into the message broker and those those events in turn will be processed by a worker process and then it will be reaching out to our projection layer.

**10:51** · So, the idea is like we need to gather all the data from all these different contexts and to have or build a semantic layer or you could call it as a materialized view which you could further use within your agent careful.

### Building the semantic layer

**11:10** · So, this is how the high-level flow looks like like we have all these different contexts and you could either use a CDC mechanism or a message broker to propagate those events into your projection layer. And essentially like you will be having this intermediate layer like which is a worker process.

**11:28** · You need to massage your message events and then process it and then store them in the materials view. So, this this is the entire high-level picture of how you could gather those data and form a materials view.

**11:41** · Now, coming to the agents. So, so, we all know like agents are comprised of these three main components, the language models, the tools, and the memories, right? So, this language model it it is not necessary to be a large language model. It could be a SLM. It could be an open-source model.

**11:58** · And the tools are by which like you could interact with the external APIs or the meta methods that you define in inside your application layer. And you also need to have a memory layer. For this particular use case like we are using an inch um short memory because uh you you can't really um rely on the long-term memory because you need to um adhere to the uh SLA that you uh provided to the customers because for for the transaction uh to be processed like it should be sub 500 milliseconds.

**12:29** · And you we are currently using in-memory for this. And essentially like what happens is like whenever there is an query comes into our language model, so it has this reasoning capability, the thinking capability with which like it tries to decompose the task into multiple chunks.

**12:46** · And each of these tasks in turn will uh go into the language model, do certain certain processing with the help of the tools, and it will see like if the end goal is reached. And if it is not reached like it will try to go on in this loop. So, this is what essentially happens inside the uh agentic framework.

**13:06** · But you should really know like when to stop this loop uh because uh this this depends uh this this is this might be varying. This might be differing for different use cases. For for our use case like we do have a metrics with beyond which like if we go like we we could break out of this loop. And this could be varying for different use cases. So, you should be really careful on avoiding this infinite loop.

### Avoiding infinite loops

**13:30** · And now coming back to our uh existing architecture. So, what we did is like earlier like we learned about the transaction aggregate. So, now we are emitting some events that gets translated into an integration event, which gets passed on to the message broker, and then it it is handled under the orchestration layer.

**13:52** · So, under this orchestration layer like we have different sub orchestrator. So, we segregated the tier one. Earlier like we just had the tier one. Now, we had the tier one layer, which is handling the um rule-based engine or the ML-based engine. And we also had now the tier two layer, which is going to be agent AK processing. So, for this agent AK processing like we used fan out pattern.

### The risk analyzer and verdict agents

**14:16** · So, we kind of use multiple agents within this layer, and we are trying to use a fan out pattern like um once the uh event has been reached out to the uh tier two layer, we will be fanning out this um event to two different agents. One is the risk analyzer agent, the other one is the behavior analyzer agent. And once these agents like come to a conclusion based on the different tools that it has, it will finally send the response to the verdict.

**14:47** · And this verdict could be a metric. It could be just an if condition inside your application layer, or it could be an another region. Because what we seen is like if we are using just the metrics, it is again going back to the same criteria like where we had this rule-based um mechanism.

**15:06** · Uh so, there are many false positive cases that we are that we faced. So, so we we in turn like we are trying to use a third agent in this verdict layer, which analyzes both the agents' responses and come to a conclusion, which is then going to be emitted as an event back to this message broker. So, this is how our saga flow continues and it gets into the payment context and then the payments are approved and then it is going back to the transaction context. This entire loop is being done within our orchestration layer.

### The saga orchestration loop

**15:41** · And this This is what I was talking about two agents that we had in this tier two. So, one is the risk analysis agent, like what are the tools that we have in this an agent is that like we do have this kind of uh storing the fraud histories inside the semantic layer that we earlier see and we are currently having a tool for that. Like um it will just get those details from these projections layer.

**16:06** · And we also have a device trust layer, like all the device information will get stored into this semantic layer and it will just get those chunks alone.

**16:16** · And we also had um a business rules trying to migrate some of the rules that we had in the rule base engine over this tools and these are really specific to our business use case, so we are trying to move those into this tools. And we also have a be- behavior analysis tool. So So, there like we are analyzing the transaction patterns with two different plugins that we have.

**16:39** · So, based on these two different agents, the responses like we get to a final consensus and then that will be published as an event, which will be captured by the message broker. And this will be listened or uh this will be subscribed by all the different contexts, which are interested in those events.

**16:58** · Now, as as as we seen earlier, like how does these um agents gather contexts?

**17:04** · So, from the projection layer. So, these orchestration is going to consume these uh datas from the projection layers and how it is going to do is by the help of tools that it already has.

**17:18** · So, the transaction context, it is going to denormalize some of the counts, averages, average amounts that we had, the recent transactions, all gets into this semantic layer, and the device context is going to send all the details about the device trust score, location histories, and all other related information about the locations, IP addresses to this semantic layer.

**17:41** · And the account context is going to send the statuses of the accounts, the KYC status, account age, whether the customer has been with us for the past few years. So, based on that, like it will try to validate the um uh the the customer based on those informations. And there is also the payment context. From this, like we get to know about the recent payments that we gathered over these contexts into the semantic layer.

**18:14** · And and as I as I said earlier, so these tools get uh access to these projection layer, and which in turn will be used by these agents to come to a conclusion. And this is the high-level um architecture that we had. So, it could be any even source that you could use. And basically, like you could have a relational database or no SQL database.

**18:38** · In turn, like you you need to just create the semantic layer for you to provide enough context to these AI agents. And we do have this agentic layer in the orchestration. So, we have this verdict tool, and then the short-term memory, and based on that, like whatever the result that we get gets on passed to the saga orchestration layer.

**18:59** · So, we I I I have prepared a POC. So, based on the synthetic data, so I will just show you like how this works in in in Let me run this one. So, these are the different contexts that we have seen earlier. So, the transaction context, accounts, and device context.

### Putting the architecture together

**19:24** · So, from these, like we will get into the projections layer, and we will be having a CDC mechanism with which, like you will be able to progress propagate those events back to your semantic layer, which will get in turn used by these AI agents. So, here you could see So, there are multiple simulation events that we are simulating into the our systems.

**19:52** · And you could see bunch of events are currently populating. So, these um events are propagating through different layers, the transaction layer, accounts, and then payments context. And finally, like we also have this uh AI agent layer, like which which is going to try with the tier one processing, uh the ML processing.

**20:24** · Let me see.

**20:34** · I think it is just a database which is in the serverless mode. Um I think it is coming up slowly. So, but but yeah, the idea is like you will be able to see like two different agents coming up with two different uh conclusions, and you will be having a third agent which will take the final decision.

**20:51** · Uh that will be in turn emitted as an event back to your message broker. And this saga flow will be continuing as for uh like how you designed your business architecture. And going back to my presentation. Yeah, that's it. If you have any questions, like you can reach out to me offline or you can reach out to me on LinkedIn. Thank you.

**21:18** · \[applause\] \[music\]