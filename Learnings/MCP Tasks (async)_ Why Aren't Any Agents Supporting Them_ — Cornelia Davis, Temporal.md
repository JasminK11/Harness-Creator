---
title: "MCP Tasks (async): Why Aren't Any Agents Supporting Them? — Cornelia Davis, Temporal"
source: "https://www.youtube.com/watch?v=s4r6nk5WsZw"
author:
  - "[[AI Engineer]]"
published: 2026-08-02
created: 2026-08-07
description: "You invoke a tool and expect an answer, but real work takes time, and over that time connections drop, networks blip, and processes crash. Cornelia Davis, a distributed systems veteran who wrote the b"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=s4r6nk5WsZw)

You invoke a tool and expect an answer, but real work takes time, and over that time connections drop, networks blip, and processes crash. Cornelia Davis, a distributed systems veteran who wrote the book on cloud native patterns, argues that this is exactly the gap the MCP tasks specification exists to close, and walks through why almost no agents support it yet. A task lets a tool run long, report progress, and pause for human input without losing its place, which means the interaction has to be durable: it survives the client disconnecting and picks up right where it left off.  
  
She demonstrates it with an invoice processing flow, a dashboard tracking task state, and a step that waits for a human to submit input before the backend continues, then traces how the spec evolved from V1 to V2. The design she keeps returning to is a stateless core with the harder long running behavior layered on as an extension, RPC requests replaced by the server pushing updates, and life cycle state carefully mapped so clients know what to resume. Her honest takeaway is that just because you can open a long lived stateful connection does not mean you should, and that getting durable long running tasks right is what will finally let agents handle work that does not finish in a single call.  
  
Speaker info:  
\- https://x.com/cdavisafc  
\- https://www.linkedin.com/in/corneliadavis/  
  
Timestamps:  
0:00 - What MCP tasks are, and why they're hard  
1:29 - A distributed systems point of view  
2:34 - A first look at a task running  
4:03 - What a task actually allows  
4:43 - Why long running work breaks  
6:02 - Durability across disconnections  
7:04 - Demo: invoice processing dashboard  
9:10 - Waiting for human input  
11:18 - What changed in tasks V1  
12:35 - The stateless core  
16:37 - Extensions and server pushed updates  
20:09 - V2 and what you need to implement

## Transcript

### What MCP tasks are, and why they're hard

**0:01** · \[music\] I know it's 1 minute ahead, but these 20-minute sessions are really short, so I'm going to get started.

**0:18** · So, title of my talk you all have seen cuz you're all here, which is why the heck aren't any agents supporting MCP tasks. If you don't know what tasks are, don't worry, you will know in just a moment.

**0:30** · But, the first answer to that question is, well, cuz they're smart. The people who are building those clients are smart. What I mean by that is that the MCP tasks specification that came out in November was marked as experimental.

**0:44** · And so, well, you might shrug and say, well, gosh, those clients and servers, they're all supporting a whole bunch of experimental things. Why not MCP tasks?

**0:54** · Well, again, you'll see the answer to that as we move forward.

**0:58** · Um the next answer to that question is, well, they're pretty involved. Um there's a lot of complexity in here, and that's what I want to do over the next 20 minutes is teach you some of that complexity.

**1:11** · Quick intro, my name is Cornelia Davis.

**1:14** · I'm a technologist at uh Temporal. Uh we're distributed systems stuff. I have a long history in distributed systems, did a whole bunch of stuff in the microservices era, um including Cloud Foundry, Kubernetes, GitOps, Weave Works, all of that stuff, and I even wrote a book about that. That's who I am.

### A distributed systems point of view

**1:32** · Today's agenda in the next 19 minutes is that rather than just talking about things in the abstract, I'm going to ground us in a very concrete example.

**1:42** · So, I'm going to give you the lay of the land of that concrete example. Then, I'm going to give you an overview of MCP tasks. Quick question, who here is wants to do things with tasks?

**1:53** · Async MCP tools. Okay. So, I'm going to give you a little bit of an overview.

**1:58** · Um then we're going to talk about it MCP tasks V1. That's the spec that came out in November and spoiler alert, there's a new one coming out in July. So, that comment that I made about them being smart about not implementing it yet.

**2:11** · Well, there's some pretty radical changes. So, I'm going to show you um what's happening with V2 and I actually have some live demos to show all this working and then we'll have some takeaways at the end.

**2:23** · So, the use case that we're going to talk about here is a simple purchase order use case. So, the use case is you're going to get in a purchase order and then it's going to go through a number of steps. It's going to record the fact that the goods were received and then it's going to do in parallel, it's going to do some back office stuff updating inventory, sending out notifications and then in parallel to that it's going to pay some invoices.

### A first look at a task running

**2:51** · Now, the invoicing is going to happen via an MCP tool.

**2:55** · Now, that MCP tool is has itself a number of steps. So, it's going to validate against an ERP, then it's going to have a little human in the loop to request approval, maybe.

**3:08** · Um then it's going to reconcile against the ERP again, do a little bit more human in the loop and so on. So, you can see that on the right hand side that MCP server that's going to be it's a tool that's going to be doing the invoice processing for us. It is long running.

**3:25** · It's not going to work in a request response style and that's what MCP tasks are all about.

**3:31** · And what we're going to do and I'm today's talk is not about temporal, but really what I did here was just showed you a couple of snippets of the code and yes, I will be sharing all the code for what I'm showing today.

**3:44** · Couple of snippets here and the real point that I want you to look at is that reject or approve. That is showing you that there is a mechanism for signaling into a long-running process. And that's really the point. And that's what we need is that this is all about asynchronous. So, you understand what MCP tasks are now? MCP tasks are allowing you to have an MCP tool that you can invoke and then it is long-running in the background, and then eventually you can get back some response.

### What a task actually allows

**4:17** · So, let's talk about that MCP tasks overview. This is a very simple sequence diagram. It's exactly what you all would expect when I tell you that MCP tasks are long-running tasks.

**4:30** · You're going to invoke a tool, and instead of getting back a response, you're going to get a handle. And you can interact with that handle, right?

**4:39** · Obvious, right? This is This isn't rocket science. Looks easy enough, right? Well, it turns out that if you actually want this to work over long horizons, it gets a little bit more complicated than that.

### Why long running work breaks

**4:53** · So, what are some of those complications? Well, you can have all sorts of the longer something runs, the more likely there's going to be some kind of infrastructure blip that's going to cause a problem in that long-running task. So, you could have network blips, you could have network challenges, you could have humans that you're waiting for their in-a-loop part, and they go away on vacation like I'm about to, yay, um day after tomorrow.

**5:22** · Um or processes can crash. So, your agent can go down. The agent that's processing the purchase order can go down, or your MCP server can go down as well. So, all of those problems you need to deal with, and those are the things that makes it a little bit more difficult.

**5:39** · Now, in addition to what I've told you about MCP tasks so far that you're going to get back a handle that you can interact with by the specification those MCP tasks can't disappear.

**5:55** · This is verbage from the spec itself that says once you've locked launched a task it has to be durable. What that means is all of these things that I just showed you on the previous screen clients humans going away on vacation servers going down clients going down connections disconnecting the task needs to survive that and you need to be able to interact with that task when the infrastructure comes back.

### Durability across disconnections

**6:25** · And I'm going to show you how all of that is done.

**6:28** · Now on there's elements there's server side elements that talk about how you make the server side durable and I did a talk at the MCP Dev Summit in March and this is the QR code that it will take you to that YouTube video and that's where I go into a lot of detail about the server side and what you need to do with the server side. Today as you saw is an extension of that work where I'm talking about the client side.

**6:57** · So without further ado let me go into a demo. I for those of you who know me I'm always doing demos.

**7:03** · So what we have here is we have a dashboard. Um I am not doing this through a chat interface because it frankly it's more efficient for me to click a couple of buttons here to show you this rather than trying to type things in. So I have a user interface here that's showing you the number of purchase orders that have been submitted.

### Demo: invoice processing dashboard

**7:20** · I'm going to submit a simple purchase order so that's just a button that is kicking things off and in a moment if the dam demo gods are with me it says submitted we should see the purchase order pop up here and it should show some Ah here's why it's not working because I haven't started my servers. So remember I said it has to work even when the servers aren't running. I forgot to show you here that what I'm doing in this these two windows is in the upper window, I'm starting the back end. This is the MCP server.

**7:54** · And in the um lower window, I am starting the MCP client. And you'll see what that client is in a moment. You can see in the splash screen there that I am using fast MCP on the client side.

**8:06** · So, let's go back here and notice that even though I submitted that, even though my servers weren't running, that submission did go through. So, it's captured that. So, what you can see here, and you didn't see it cycle through, but on the far right-hand side, the invoice task is it initially showed you that it was work submitted, then it showed you that it was working, and now it's asking for input required.

**8:33** · I can come over here. Let me show you what's going on at the back end and at the front end. What I have here are some dashboards that are showing those running processes. On the right-hand side, you have the back end. That's where the invoice processing is, and you can see the name here. Let me increase the font size there a little bit. So, you can see that this is running the invoice, and on the left-hand side, you can see that it's running the PO. I'll explain that task tracker thing in just a moment.

**9:03** · So, if we go into the invoice, we can see that it has the process that we talked about earlier. It validated against the ERP, and now it's waiting for human input. It's waiting for that approval.

### Waiting for human input

**9:14** · Over on the PO side, we can also see the process that I showed you earlier, which is to say, let's go back here. It is So, ah, yes.

**9:25** · So, it did that record recorded that the goods were received. Then, in parallel, it's invoking the invoice processor MCP task. And notice that there's this line item here that says task tracker workflow. Yes, indeed. That is my MCP client implementation. Remember I said nobody's implemented this on the client side? Well, I created my own implementation here. But in parallel with doing the invoice processing, we also had this back office stuff that was happening.

**9:56** · So if I come back over here and I click on input required, I can approve this.

**10:02** · And I'll hit submit. And we come over here and you'll see in just a moment that the signal is going to come into the back end. Uh need to refresh. Oh, there it goes. So the approval came into the back end and now the back end is going ahead with its additional process paying the invoice. And you'll see a number of line items there. There's some um some uh re- uh retries that are have been programmed in here, but you can see here that it took a few tries before the the ERP went through. We paid the line item and now you can see that the task completed. So everything's completed.

**10:35** · If I go back to the dashboard that you saw at the top, you can see that all of those processes completed. Okay? So that's the basic stuff. And I can run that again, but in the in I already gave you inadvertently gave you the example of the infrastructure was down. I could have killed that server halfway through and it would have continued exactly exactly as you saw here. Okay?

**11:05** · So you saw it at the very beginning.

**11:09** · All right, let's go back to slides. So that's the first demo. So let's talk about um tasks version one.

### What changed in tasks V1

**11:18** · So in tasks version one, there were a number of tool semantics. And again, I go over these tool semantics in a lot more detail in that MCP Dev Summit talk.

**11:28** · But there's one really interesting thing that I want to draw your attention to, which is that tasks come with it One of the things that the specification defines is a life cycle for tasks. And that's what you see here on the screen.

**11:43** · It has working.

**11:44** · It can go into an input required. From input required, it can go back to working, and then eventually it'll complete or be canceled or fail. So, that's one of the things that's super interesting about the task specification is that it's about the life cycle of the task. There's a whole bunch of other semantics there as well around obtaining inputs and delivering results. And I'm going to go through this fairly quickly because I already mentioned some of this is going away.

**12:15** · So, this is what the tool semantics were before the task semantics. Notice that tools/call is exactly the same.

**12:24** · There's some metadata that you pass in when you want it to be async.

**12:28** · And then there's task get cancel list, as well as task result.

### The stateless core

**12:35** · And so, the top four are request-response in style. The bottom one keeps a connection open. It keeps a connection alive. And the sequence diagram that you can see here is kind of the basic stuff. Now, there's two hiccups with this um uh two major challenges with this particular version of the protocol. The first one is right here.

**12:58** · Task list. This is a stateful protocol.

**13:02** · So, what that means is that the Remember I said that the server was responsible for durability?

**13:09** · Well, this particular endpoint allows me to go to the server and say, "Hey, what tasks do you have?"

**13:17** · So, if I have had if the client has gone away, if the user took too long to respond, if my network dropped out and I had to reconnect, I can use this task list to go back to the server and say, "What have you got?"

**13:32** · And then you can continue on with that.

**13:35** · That works fine if you have one task or two tasks, or maybe it it even works if you have 10 tasks, but what happens if you've got a whole slew of agents out there and you've got a million tasks at the back end.

**13:52** · Spoiler alert, there is no filter on that endpoint. So, you would have to go through a million tasks to find the one that you're looking for that you want to interact with. This is going away.

**14:03** · You'll see in just a moment, but that's one of the challenges. Just because you can doesn't mean you should. The other one is the task result because that is where we were tunneling the input required. So, in the case of task result, this sequence diagram is really simple. It doesn't have the the interactivity.

**14:21** · What we have as soon as you do task as soon as you have input required is the top and bottom are just fine, but this middle section has this weird protocol where you open a long-running connection and then the server elicits a response from the client. That gets super tricky. And I'm running short on time, so I'm not actually going to show you this demo.

**14:47** · Happy to show it to you. I'll be around all day tomorrow, too. So, I can happy to show it to you, but I want to show you instead Here's basically the architecture of what you need to build on the server side. This is Notice that this is using fast MCP. So, fast MCP already has support for server side and some client side stuff as well.

**15:08** · But, the interesting thing is notice that little box in the on the left-hand side that on the on the lower part where it says MCP client protocol handler?

**15:18** · That protocol handler with the ugliness that I just showed you or results actually looks like this.

**15:25** · And I can show this to you running and it has all sorts of complexity in it. I got to have the long-running connection.

**15:32** · Well, what happens if my connection dies in the middle of that? How do I pick up where I left off when I come back?

**15:38** · You'll see that a big part of what the task specification does is it talks about durability.

**15:44** · So, back to the question of why the heck aren't there any clients that are supporting this protocol?

**15:51** · Yeah.

**15:52** · That's why. Super involved. It's still involved with V2, but it gets better.

**15:58** · So, let me tell you about that. So, in May, Angie Jones, who's responsible for developer experience at the Agoric AI Foundation, which is where MCP now lives, posted this blog.

**16:12** · And one of the things that made me jump up and celebrate a little bit is that the protocol is going stateless.

**16:21** · So, as somebody who's been working in the microservices world for a long time, stateful protocols are the absolute worst thing in large-scale distributed systems. So, the protocol is going stateless. It's also doing a number of other things. So, the first bullet is a stateless core. The second bullet is interesting cuz it's they also have structured MCP so that there's a core and there's extensions. If some of you were in the room for the previous two talks, they talked about MCPUI two talks ago, they mentioned extension.

### Extensions and server pushed updates

**16:54** · Well, that's what's happening here in the V2 MCP protocol is that they have extensions and tasks have become an extension.

**17:04** · So, let me tell you a little bit about how tasks changed from V1 to V2 and I do want to give you one more demo. So, on the left-hand side, you can see what the protocol was before. These are the RPC requests that you were doing over the wire. On the right-hand side, you can see a couple of things.

**17:23** · Task list has gone away.

**17:27** · Good.

**17:28** · Wasn't particularly useful anyway, especially at large scale.

**17:32** · And instead of having this input required going over a long-running session, you now have an endpoint that allows you from the client side to say, "Here's an update."

**17:45** · So, if you remember a while ago, I showed you that screenshot that said Temporal has this notion of a signal.

**17:52** · That's effectively what this is. It's a way of signaling into this long-running task. The task result stays, but it changes because it no longer has this long session-based protocol.

**18:04** · But, I put the picture on the right-hand side here to emphasize the fact that the life cycle management of these tasks is unchanged. That's actually sound. Now, I go into this a lot into more detail in the talk that I keep referring to. Um on the server side, in invoice processing, I have my own state machine that the invoice is going through.

**18:28** · And so, part of what you're doing when you implement these server-side these tasks is you're mapping from the life cycle states of the task over to the domain state machine that's running the the application that the the MCP server in the back end or the tool.

**18:48** · So, list again goes away. Now, remember I said that the MCP tasks specification has durability all over it? With this change, given that lists are gone, you now are required on the client side, well, kind of required. There's a little an a little uh parenthetical remark here.

**19:08** · The The spec right now says that clients should persist task IDs, but it also points out that if you don't persist task IDs, there is no way to get it back. So, I'm not quite sure why this doesn't have a an all caps must.

**19:28** · The other thing that I want to point out is that I already mentioned it is that you're going to have potentially a lot of agents that are processing POs or a lot of agents that are doing a lot of things. And so, having multiple things running, I think is really um crucial as well.

**19:46** · So, with that um I'm going to go to the the second demo.

**19:53** · And I'm going to go back to my purchase order here. So, what I'm going to do now is I'm going to submit a number of things.

**20:02** · And I'm actually still demoing here because I have 13 seconds left. I'm not going to switch over to my V2. You'll see that from the high level, it actually looks exactly the same. I am going to show you what the client proto- client server protocol looks like in the V1 case. It's really quite ugly. But, you'll notice here that we have um I've submitted a bunch of different ones.

### V2 and what you need to implement

**20:26** · I can tell you with the V1 protocol, the reference implementation, if you had input required on multiple even though you can see that there's many of them in flight, on the client side they were FIFO.

**20:40** · So, you could only respond to the first one. And part of the protocol that I implemented was to get around that gap.

**20:47** · So, let's come over here. We can refresh both of these and you can see that there's going to be a bunch of POs in flight.

**20:55** · And now I want to show you the task tracker. So, if we go into the task tracker, that's the MCP client. And now let me just expand this so we can see it in a little bit more detail.

**21:07** · What you can see here is that remember that that protocol, I showed you that big long sequence diagram?

**21:14** · There's a lot of steps involved in that.

**21:16** · And what I've done here is I've implemented it as a workflow. And you can see here that there's some elicitation handling that's going from the server side back to the client.

**21:27** · So, I won't go into any more details cuz I'm literally out of time now, but I want to share two more things.

**21:33** · And that is Um so, going from V1, remember this ugly picture, to V2 in the client server protocol, much much cleaner. Much easier to implement.

**21:47** · So, speaking of implementing, here's a summary of all the things that you need to do if you want to implement tasks.

**21:53** · Still relatively involved. Here's a picture. I'm going to make these slides available in the Git repo that I'm about to show you.

**22:01** · And here's the Git repo that I'm going about to show you. And while you're getting that screenshot, I'm going to tell you about two pieces of work that I'm continuing with. Number one, even though this is better, it still doesn't scale to the millions.

**22:18** · Why? Because if I've got a million tasks running, I've got a million clients that are doing gets against each and every one of those tasks. That does not scale.

**22:29** · There is a part of the MCPC task specification that is a notifications protocol, which I haven't gotten far enough yet, but it's showing promise, which is going to allow you to, instead of having a million clients uh uh to uh pulling their tasks, it's going to have a single endpoint where they can say, "Has something changed?" And if it has, tell me which one, and now I'll go pull that task. So, it's definitely from a scale perspective.

**22:59** · The other thing that we're doing is in the very near future in the next month or so or two, we're going to have a an implementation of all of this where it's going to be much simpler for you. My goal is to actually implement it in in fast MCP so \[snorts\] that you can use the same protocol the same framework that you're using probably for your MCP servers today.

**23:24** · So without further ado, that is it.

**23:26** · Thank you to the next speaker for letting me go a few minutes long and I'll be around. I'll step out if you have any questions find me in the hallway.

**23:34** · \[applause\]