---
title: "Emulated: The Data for Fully Autonomous Software Engineers and Companies — Joseph Wang"
source: "https://www.youtube.com/watch?v=zkX03APVj0M"
author:
  - "[[AI Engineer]]"
published: 2026-07-31
created: 2026-08-07
description: "To train an agent that can run production software, you need training data that looks like production, and that is what Joseph Wang's team at Emulated builds. Coming from network infrastructure backgr"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=zkX03APVj0M)

To train an agent that can run production software, you need training data that looks like production, and that is what Joseph Wang's team at Emulated builds. Coming from network infrastructure backgrounds, they know what happens when something like a database goes down at scale, and they argue that current post training environments do not capture it. A real task is not a tidy code diff; it is fifty to a hundred turns of solving live traffic while distributed nodes fail, configs conflict, and unforeseen problems appear mid incident.  
  
So Emulated simulates whole companies. Imagine acting as an engineer inside a cloud provider or an infrastructure service, provisioning resources across VPCs, subnets, and security groups, meeting real bars around cost and deployment, and keeping a service alive as it grows, all inside a high fidelity environment rather than a stub. Wang's bet is that domain expertise plus faithful simulation is what lets agents learn the messy, end to end reality of infrastructure work, and he closes looking for people who have trained models or run real infrastructure to help push that fidelity further across more domains.  
  
Speaker info:  
\- https://emulated.so/  
  
Timestamps:  
0:00 - Useful work over longer horizons  
1:20 - Backgrounds in network infrastructure  
2:26 - How environments shape capability  
3:16 - Fifty to a hundred turn tasks  
4:59 - Why real incidents are messy  
7:11 - Real infrastructure isn't a code diff  
7:40 - Acting as an engineer inside the cloud  
9:37 - Deployment, cost, and scaling bars  
13:29 - Why it's called Emulated  
15:01 - Simulating full companies

## Transcript

### Useful work over longer horizons

**0:14** · So, I appreciate the intro. Uh my name is Joseph and this is my co-founder Sid.

**0:19** · Emulated is a data lab focused on increasing the reliability and autonomy of AI agents.

**0:26** · And if you've been a AI engineer and you've watched the talks, seen the tracks, then there's probably one takeaway that all the talks have in common. And it's that we're headed towards a future where agents are able to perform useful work over longer and longer horizons with little to no supervision.

**0:45** · So, today we're going to answer some of the questions of what this means for the data and model layers. Uh we're going to touch on some pretty cool things. Uh so, look out for them. Um like how to simulate a company within a sandbox or sandboxes for multi-node systems and distributed clusters.

**1:04** · Um and if we have a little bit of time, we'll also go into some of the work that we're doing with post-training pipelines and how these new types of sandboxes are affecting post-training infra as well.

**1:17** · So, where Sid and I come from, um our backgrounds are in network infra, distributed databases, and sandbox infra. And these are all areas where the workloads are mission critical.

### Backgrounds in network infrastructure

**1:30** · We all saw a couple months ago that uh when something like DynamoDB goes down, so does US East 1 and half the internet.

**1:38** · Um and working on these systems, we saw model capability gap when it came to operating and building these systems at scale at scale and thinking about uh the consequences of architecture and system system design over the course of years.

**1:55** · Yeah, so it led to a pretty uh natural question, right? For such mission-critical services, why is it that my model or my agent is so proficient at handling the application layer, but is struggles when it comes to reasoning through infrastructure complexities? For example, things like MVCC on a database engine, which can lead to corruption issues, which is one of which was one of the roots of the DynamoDB failure a few months ago.

### How environments shape capability

**2:26** · So, like with everything in NML, uh the gap in models is usually a gap in data. Models typically are only as good at as data is. Um and to really highlight this point, right? Model capability has never uh regressed whenever you introduce more high-quality data.

**2:45** · Um so, with that being said, what is the data gap then? What does data look like right now? And how is this influencing the model capability gap here?

**2:55** · So, if you look at any of the frontier or recent benchmarks, like SweBench Pro, Terminal Bench, or something like Frontier Code and Deep Sweep, um the tasks only operate within the code base. Uh the agent is given a pretty large uh task uh and over the course of 50 to 100 turns produces a couple thousand-line PR.

### Fifty to a hundred turn tasks

**3:21** · Um but it doesn't do all of the work that a human does. It doesn't do uh what a PM does with talking to customers, understanding their problems, what an engineer does with trying out different approaches, performing performance testing them, um and owning the underlying infra for the code base over the course of not just months, but years.

**3:44** · And this is really the gap that we're closing. We've taken software engineering companies and we've put them into containerized environments. so this includes uh include like organizational contexts like projects, incidents, customer conversations. Uh the agent also has to deal with issues that only appear at scale like network failures between distributed nodes, data corruption, and clock skew.

**4:10** · And through all this, we also want the agents to reason about orchestrating through distributed clusters and also thinking about things like operational blast radius while solving live traffic. And the result is that the task that these agents have to complete or we want the agents to learn is that environments are far more complex and long horizon than a simple code diff.

**4:35** · So, let's just let's bring a picture into the mix because it tends to make things more interesting. Uh here's an example we've built of an SCD consensus cluster that a typical production service might rely on. So, an old environment uh might tended to operate and work primarily on that little blue square entitled SCD source code in the bottom right there.

### Why real incidents are messy

**5:00** · But, a lot of the fun and the model capability gap that results from it is really in everything that surrounds it. So, you you start with the tickets, projects, postmortems. What are the train wrecks? Why did they happen? How did customers feel about them? And often times those aren't necessarily up to date.

**5:21** · Um the agent has to incorporate all that when it's reasoning through the actual change that current environments have it make. After it makes that change, uh you need a kick kick off rolling deployments. Those deployment systems can often times be complicated, have conflicts, may not work.

**5:41** · Um and all through that, when you're finally migrating off of from old hard onto new hardware, um you run into unforeseen problems which you did not sort of the the the the the the agent has to reason through in real time, just like a human would, right?

**5:58** · You have um failing nodes. You have stale deprecated nodes. And while all of this is happening, the service can't go down because there is a blast radius to serving live traffic. You have to observe and monitor your service. All of these components in in in the system is really uh what sort of exemplifies like a full end-to-end infrastructure task.

**6:24** · So, what Sid is describing here is an environment in a single node sandbox where we're simulating uh distributed cluster with multiple nodes, flapping nodes, lagging learners um in a single sandbox. And you can get pretty far with this, right? Like you can see that there's live traffic, there's a lot of operational issues that a real engineer would have to deal with. And you can make this pretty long horizon by just say doing multiple deployments instead of just one.

**6:54** · But really what we're seeing is that this is not enough. Uh this fits into standard post-training pipelines in the sense that a standard post-training pipeline is kind of boring. Uh it's kind of homogeneous. You know, everything just runs harbor, everything is a single sandbox, containerized. But real infrastructure uh doesn't work like this. Uh this isn't how real companies run.

### Real infrastructure isn't a code diff

**7:16** · And uh even though you can use something like deterministic simulation to simulate network failures, it doesn't represent what you might run into if you're building an AWS-scale service. So, I did see I think a couple people at AWS. Somebody had Viceroy open on their laptop. Um fun times. Um but let's imagine here that we are all AWS engineers or GCP engineers. Azure, too.

### Acting as an engineer inside the cloud

**7:46** · No shade, right? Um, and we are building a cloud service. Um, it can also be some infrastructure service like DataDog, Vercel, Superbase.

**7:57** · Uh, all of these services run into the same problems. You start off with a shiny piece of software. And this piece of software can service a single customer pretty well. Um, maybe it's running on your machine. If you're working for NLB, it should be a load balancer, right? If you're working for AWS Lambda, it'd be some sort of serverless runtime. But, uh, it needs to actually run somewhere. So, if you're infrastructure engineer, next step is you get into resource provisioning.

**8:25** · Um, and this is already where the single node sandbox starts breaking down. How do you provision resources within a single sandbox? You can't exactly simulate something like EC2 or Cloud Run, right?

**8:37** · Um, so you get into this host provisioning. Uh, it also includes provisioning of other resources like VPCs, subnets, security groups. Um, and you need to expose this through some sort of API because your customers are going to want to do things like, "Oh, give me this shiny piece of software." Or, "I don't want it anymore. It cost too much. I'm going bankrupt. Delete it, please."

**9:00** · Um, and so you're going to need some sort of front-end API. And if you have enterprise grade customers who really care about quality, then you're going to have to meet certain bars like throttling, authentication, authorization. You can't really like go without these things, right? Uh, if you're AWS, then that's CloudTrail, too.

**9:20** · Um, and then beyond this, uh, software is living. People forget this all the time, especially like investors, right?

**9:29** · Like they'll be like, "Oh, you wrote it. You're done." Um, but software is living and you probably need some sort of software deployment component as well. Uh something whenever you have an update to roll out roll it out. Um and God forbid something goes wrong, roll it back. Uh you need to manage all the different versions and make sure your deployments are gradual to limit your blast radius.

### Deployment, cost, and scaling bars

**9:54** · And we're just kind of getting started with this. There's all sorts of things that you need to think about like health monitoring with awareness for network partitions. Uh and then how do you communicate with your host so you can change configs on the fly.

**10:08** · Um maybe your customer actually wants to call your endpoint, so you need DNS and cert management. And then, you know, your our service grows a bunch, you need to keep track of all your resources, what's going on, fraud and stuff, then you need admin consoles, uh telemetry, billing if you're making money, um all sorts of things. And with all of this, I think there's like one more slide for is it scheduling? Yeah. Um I think the point is fairly clear at this point.

**10:39** · Beyond beyond a certain threshold, there is a critical mass at which sandboxing on a single node uh can only get you so far. And that's why we envision the the future being going towards a world where environments do provision real infrastructure.

**10:58** · Yeah, so what this is is um a multi-node sandbox with access to real infra, real cloud resources. Uh we kind of put a cloud in box, so cloud box could be another name for this. Um and as you can imagine, changing the sandbox type so drastically here affects post-training pipelines as well, which um I think we might be running a little bit low on time, so we won't get like too much into it.

**11:23** · Um but yeah, like uh one really cool thing, too, is like you can put a post-training pipeline in the sandbox, um and there's some cool stuff with model training and RSI that you can get into there. Um so, you know, then this begs a question, uh this is all cool stuff, Joseph. Uh thank you, Sid, for speaking.

**11:46** · Why are you leaking all of this alpha, right? Why are you like telling all your organizational secrets and telling everybody like, "Oh, okay, you know, how do you build a system like this?" Um it's because uh we're really interested in these challenges here. We think they're very fun.

**12:03** · Uh you know, we think they're really cool. We think that you guys are cool people, uh or maybe I'm just lying, who knows. Uh and we want to share these challenges with you uh in case you're interested in working on them as well. As you can imagine, there's a lot of different problems that we haven't touched on here. Like, for example, spinning up the entire stack for something like AWS Lambda takes hours.

**12:26** · Um how do you fit that into a post training rollout? Uh and then there's cost as well. How do you efficiently manage this? How do you make sure the sim-to-real gap, even with real resources, it still exists, right? You still have to have live customer traffic. You still have to have uh problems that only appear at a certain scale.

**12:45** · So, you know, if you're a distributed systems engineer, um you know, if you know, this stuff if you train models before, um if you think that this stuff is cool, uh then you know, we'd love to talk. Uh we'd love to talk, uh kind of like see where your opinions are, uh hear what you've worked on, maybe that's like, "Oh, Kubernetes." And you have like opinions. Well, everybody has like opinions on like auto scaling and rolling deployments and whatever, but like really niche opinions, right? Like, at CDO.

**13:15** · Um yeah, we'd love to talk to you and hear what you have.

**13:21** · Thank you.

**13:21** · Yep.

**13:22** · Um what's your like primary goal with emulator?

**13:26** · Yeah, um that touches into why it's called emulate in the first place, right? Uh, the real world is very, very complex, um, and how we as a industry emulate the real world is incredibly contrived and low fidelity. So, emulated goal is really how do you make these agents own systems like this, uh, maybe beyond systems, entire companies, by emulating the real world with full fidelity.

### Why it's called Emulated

**13:56** · Yeah, go ahead.

**13:57** · Next question is, are you predominantly focused on like infra and you have a lot of containers, actually hardware kind of related stuff, or are you also like full RL environments like a digital twin?

**14:19** · Yeah, of course. Like, the question is like, you know, infra is really cool. Um, in 2026, all of us are on an infra's comeback, and it's very sexy. Everybody wants to work on it, right? But, there's other types of RL environments as well.

**14:31** · Um, there is, uh, other workflows that you really want to capture that aren't necessarily infra related. Uh, so the reason why we're starting with infra is, um, there's a couple. Well, the first most important one is it speaks to our background the most. Um, we think that domain expertise is something that informs how high quality your data can be. Uh, especially with boutique nature of data nowadays.

**14:56** · Um, and the second is that when we're simulating full companies, infra is the easiest to approach. Uh, if you think about like any infra company out there, whether it be Superbase or Modal, uh, or any dev tools company, the problem statement is pretty clear.

### Simulating full companies

**15:14** · Uh, engineers kind of know what they want. If you are working for Modal, you know that your users want GPU sandbox, very low latency, very low cost. You don't want to fail halfway through your training run. Um that's what you care about. So, the problem statement becomes much easier.

**15:33** · Whereas, if you are, you know, a a company in the YC summer 2026 batch, you're probably still trying to find product market fit, right?

**15:41** · Yeah.

**15:41** · At the same time, there's also lessons learned that going really vertical on a single domain like infrastructure do translate into other horizontal domains. So, we're also um exploring going deep into one and scaling out that way.

**15:59** · All right. Uh really appreciate it. Uh appreciate the questions. Um we'll probably step out and we can like take a couple more uh outside just to make sure the next speaker has room. Um yeah. Uh I thank you guys for listening.

**16:13** · Appreciate it.

**16:30** · \[music\]