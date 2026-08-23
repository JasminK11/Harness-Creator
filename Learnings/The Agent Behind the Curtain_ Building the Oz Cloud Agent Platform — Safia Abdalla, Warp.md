---
title: "The Agent Behind the Curtain: Building the Oz Cloud Agent Platform — Safia Abdalla, Warp"
source: "https://www.youtube.com/watch?v=L173Z8DpaJg"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "Warp open sourced about three months ago and went from roughly 20,000 GitHub stars to over 60,000, with thousands of pull requests and hundreds of contributors arriving at once. Rather than let agents"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=L173Z8DpaJg)

Warp open sourced about three months ago and went from roughly 20,000 GitHub stars to over 60,000, with thousands of pull requests and hundreds of contributors arriving at once. Rather than let agents fire off code, Safia Abdalla's team put them inside the repository's process. File an issue and an agent triages it, researches the codebase, and asks you questions when the request is too abstract to act on. Every pull request then goes through an agent managed review, and nobody on the team gets pinged until an agent has approved it. The humans only ever see the high signal ones.  
  
That is one payoff of a principle she applies all the way down the cloud agent platform, that a platform should absorb complexity before it reaches the user. Agents need somewhere to run, so sandboxes come both managed and self hosted, because teams doing serious work already run their own infrastructure. Developers are attached to their harness, so the platform accepts any of them while keeping conversation state and artifacts consistent across all of them. Real engineering rarely fits in one prompt, so agents orchestrate sub agents, either by prompt or through an API that exposes every primitive in the stack. People outside engineering at Warp used that API to build their own Slack tooling for triaging social mentions. Abdalla closes by pushing back on the phrase software factory, which she thinks loses the people in it, and offers a potter's workshop instead: stations, sourcing, verification, and an owner who keeps refining the system around the work.  
  
Speaker info:  
\- https://github.com/captainsafia  
\- https://x.com/captainsafia  
\- https://captainsafia.com  
  
Timestamps:  
0:00 - Eight years of building developer tooling  
2:43 - Why the work moved to the cloud  
3:35 - Absorb complexity before it reaches the user  
5:18 - Multi harness support without fragmentation  
6:59 - One agent is rarely enough  
7:53 - Orchestration by prompt, and by API  
9:33 - What non engineers built on the SDK  
11:16 - Agents inside the open source repo  
14:44 - Why the term software factory falls short  
17:14 - The workshop as a serious system

## Transcript

### Eight years of building developer tooling

**0:01** · \[music\] Uh hi, welcome to this session. Uh it is mysteriously titled The Agent Behind the Curtain.

**0:18** · Um it's about how the team at Warp built our cloud agent platform. Um before I talk about the how though, I want to talk about the why um and share a little bit about my own background.

**0:32** · Um so, I've spent the past 8 years building developer tooling.

**0:36** · Um I started off in open source in the Python and data science space um on the Jupiter Notebook core team. I was a maintainer on the Interact project. That work continued in my time at Microsoft helping build APIs and SDKs for web developers. Um and now I'm working on bringing AI AI agents to the cloud at Warp.

**0:59** · And one of the lessons that I've learned in my time building developer tooling is that really good dev tools meet devs where they are and grow with them.

**1:10** · Um a tool that you're going to be using every day should accommodate your workflows, but also be really adaptable as the like complexity and the nature of the work changes.

**1:20** · And it's important for us to build really great dev tools because dev tools have a compounding effect on the world.

**1:27** · If you make a piece of software that helps a developer or a builder do great work, your ability to magnify how much great software exists in the world increases. So, I think it is super important that these dev tools accommodate people's workflows. And people's workflows are important because they love their preferences. You might have a preference for a shell, a language, a harness, a review process.

**1:50** · And something that adapts to your workflows and preferences is going to be more enjoyable to use and more enjoyable to build software with. And it also becomes like a part of how you think and build. Um so, it's super important to be attuned to that.

**2:05** · And this notion of tools meeting developers where they are and growing with them comes to light really clearly in the progression of AI tooling in this space.

**2:17** · So, this is the story for Warp specifically, but it's also the story for a lot of developer tools. Pre-AI era, we had the Warp terminal, which kind of met people in their command-line workflows that they were used to.

**2:30** · And then this fantastic thing happened where AI got introduced to developers, and now you had a whole new set of tools that was available to you locally on your machine. And a lot of people started to interact with agentic coding patterns in their terminal, in their IDE, in their editor.

### Why the work moved to the cloud

**2:46** · And then eventually, we realized that we had kind of reached the limits of what we could do on our laptops, and we wanted agents to do work that was more long-running, that was adapted to different constraints, and that work needed to happen in the cloud.

**3:01** · Um and whenever you send anything to the cloud, you adopt a lot of complexity um because running things in the cloud requires us to navigate a much messier stack of infrastructure concerns. And when I say we here, I mean the people building developer tools cuz that is the person that I am.

**3:18** · And it gets at one of the things that are like a core principle in how we think about unlocking capabilities here and building good developer tools is that platforms should take on complexity before it reaches the user. A really good experience should not expose anything of if the leaky complexity that it handles to you.

### Absorb complexity before it reaches the user

**3:38** · Um when we think about building our cloud agent platform, we try and structure it so that every primitive models this philosophy of hiding complexity from the user so they can focus on the work that matters to them.

**3:51** · Um the first place that this shows up when you're building a cloud agent platform is where does the agent run if it's not running on a developer's machine?

**4:01** · Um, it needs a place to do its work like any developer would and that place is typically a sandbox. It's an isolated environment in the cloud where agents do this task.

**4:11** · When we started out building these out for our cloud agent platform, our first intuition was to provide self-hosted sandboxes so that developers had a really easy on-ramp for getting into our cloud agent platform. You didn't have to think about where your compute lived, it was just there for you.

**4:27** · But the reality is that for teams doing serious work, they're probably managing their own infrastructure. They probably have dev boxes that they need to interact with and so something that is hosted or managed is usually not sufficient. You really need to be able to run agent workloads on infrastructure that people bring so it adapts to their like security concerns, their deployment practices, their workflows and preferences on their team.

**4:51** · And so we add support for not only manage hosting but also self-hosting to the platform and that is complexity that you abstract away from the user and how the behavior is modeled.

**5:03** · Um, the next kind of component is a little bit more personal to people and it's the harness that they want to use.

**5:09** · As we talked about earlier, people are really passionate about the tools that shape their workflows. Um, one of those tools is the harness. Um, who here has a preference for cloud code as a harness locally?

### Multi harness support without fragmentation

**5:22** · Code X?

**5:24** · Something else entirely?

**5:26** · Right, so much diversity in the room and we want to meet people where they work.

**5:31** · So you want to integrate multi-harness support that not only accommodates preferences but also gives people the ability to do the use the right tool for the job. And flexibility isn't something that you just be like crammed into a platform because the real risk you run if you cram it in is that it becomes fragmented. Your experience with working with Claude is different from working with Codex versus a custom harness that you might have. And so, one of the key properties is making sure that the platform provides structure and guardrails around the harness so that the experience is consistent.

**6:02** · Um for us, this means that harnesses can interact with all of the platform native experiences. So, just being able to store conversation state and rehydrate it, being able to interact with the artifacts and outputs that are produced by agents, whether they're PRs, issues, new files that are generated. All of that should kind of be structured the same way.

**6:26** · Okay, cool. So, we gave you a place for your agent to run, and we gave you a choice for what harness you use, including Warp Zone harness and any other harnesses that you want to bring.

**6:37** · Um what if one agent isn't enough to do work? That's the reality of most software engineering.

**6:44** · I wish that I could just send off one prompt and solve all of the problems that exist in my software, but the reality is that real engineering work rarely fits inside one prompt. In a typical workflow, you might need one agent to go research a problem and plan a solution. You might need another agent to implement it, and you might need to bring in a third to validate it. And you might want each of these agents to use different harnesses and different models in order to have a real adversar- adversarial and robust approach.

### One agent is rarely enough

**7:15** · So, we have built-in support for that.

**7:17** · You can orchestrate agents across the stack. Um with a lot of agent-based experiences, this orchestration happens via a prompt.

**7:26** · So, I say {slash} orchestrate, or I queue the agent via prompting that I want it to delegate work across multiple sub agents for a task that I have here.

**7:35** · And this orchestrator agent will do all of the messy complexity of interacting with sub agents, mediating messages between them, and tracking the work that's happening for me behind the scenes with a single prompt. We abstract complexity away from the user by giving them this experience.

### Orchestration by prompt, and by API

**7:53** · This sort of like prompt-based model for interacting with agents and subagents is really powerful.

**8:01** · An even more interesting one is the notion of interacting with agents and subagents via the API.

**8:09** · So, everything in our surface area is exposed via an API, and I can fire off a request to say that I want to run a subagent that is attached to a parent agent um via configuration that I provide. And this API is super magical because this is the key component of a platform.

**8:29** · Um it's exposing the primitives in a way that users can build on top of.

**8:35** · Um the thing about great APIs and SDKs is people can build on top of them, which means that they're not restricted to your UI or your opinion of how a particular experience should look. This is where like composability becomes really powerful.

**8:50** · And so, we're trying to be intentional about exposing an API for every key component of the stack. So, this is APIs for spinning up agents and subagents, for managing the environments and compute that these agents are running in, for working with the artifacts that they produce. All of that is exposed in an API that you can build on top of.

**9:11** · Um and this ability to build on top of these primitives that are exposed via an API becomes really useful because anyone can build tools that overlap on top of these agentic experiences.

**9:25** · \[snorts\] Um like interesting phenomena that's happened for us internally is we have a bunch of non-engineering teammates at Warp who have been able to use our SDK and API to build custom Slack bots to do a bunch of things. Um so we have folks in our developer relations team who have actually built out tooling to help us manage all of our social mentions.

### What non engineers built on the SDK

**9:45** · Um so as tweets and Reddit posts and things are coming in, we have agents that will pick them up, do some sentiment analysis on them, try and understand what the user wants, and then propose a response that um folks on our social media team should use and um respond to the original tweet or Reddit post or what have you. And all of this is enabled by our SDK. And you see like a plethora of these types of experiences um internally at Warp.

**10:12** · Um we have people who have used them to help answer queries about how our product is working, do competitive research, all sorts of interesting things. Um and these primitives became a really big deal for us specifically when we decided to go open source. Um as I mentioned earlier, Warp started off as a terminal um but it grew into an agentic development environment. And about 3 months ago, we decided to go open source.

**10:43** · Um this was like much anticipated, long-awaited. It was a huge success for us. Um the number of like GitHub stars that we had, I think catapulted from around 20,000 to over 60,000. We had thousands of PRs. I'll talk a little bit more about how we've been managing that. And hundreds of contributors who had been long-time users of the platform and were finally getting a chance to build on top of it.

**11:11** · And when we went open source, we wanted to be really thoughtful about how we could use agents to help us manage the repository.

### Agents inside the open source repo

**11:19** · We didn't want this to be the kind of thing where agents are just writing code and firing off PRs. We want them them to participate kind of meaningfully in the structure that we use to triage issues that came into the repo, provide context around them, do implementation, do reviews, but still have the space for humans to participate in this loop.

**11:42** · And we did that. So, if you go to the Warp open-source repo right now, you'll notice that if you file a new issue with a bug report or a feature request, an agent will kick in and start to triage the issue automatically. It'll do research across the code base and context in the repo to understand what you're trying to propose. It might ask you questions if it feels like your original query was a little abstract to get more information, and it will kind of do the work that's historically been very hard for open source, which is somebody has a problem or a bug that they want fixed.

**12:12** · They don't give you enough details, and it's hard to get to the clarity that you need to get to to like drive the work forward. So, we can use agents to help us meaningfully in that way. They can also help draft initial specifications and work for tasks, do implementation, and provide a review gate. So, all PRs that get contributed to Warp go through an agent-managed review process.

**12:33** · And it goes through multiple iterations, and we don't actually ping any of the human reviewers on our team until an agent has approved our PRs, um which helps manage the workload a lot for the team. So, all of those thousands of PRs, the things that humans actually have to manage are only the high-signal, high-quality ones.

**12:53** · And one of the key principles is that we improve the agent as um we get more PRs in the repo and we see more examples of code. One of the things that we believe is that self-improvement loops are a really important way for you to enhance the overall SDLC life cycle that you're seeing. So, we did this.

**13:14** · And we had a lightbulb moment cuz it unlocked something huge. We had this like structured process that could accommodate a big influx of issues and PRs on the repo. Um and the agents were there to support anyone in bringing their idea or their bug request bug feature request or bug report to us or to work and then getting it through to the actual product.

**13:38** · That key insight of agents providing like structure and context was a really big thing for us cuz it meant that it could anyone could kind of participate in translating their intent into implementation.

**13:52** · And often times the people who have really interesting intents and goals are the ones who are using software in interesting ways. And it's not always the person that's building it. It's the person who's kind of got domain knowledge in the space. And work we're lucky because we're developers building a developer tool and that's a really unique niche to fill in. But most software is developers building tools for non-developers or people in situations where they don't have domain expertise.

**14:19** · If we provide these structures and guardrails though, people who are non-developers can have the necessary tools to like ship serious software because the infrastructure to support them exists. Oh, this is where like things get buzzy. You might have heard this term of the software factory. People talk about it a lot as far as like automating how software gets built, providing these systems for doing work, all of these fun things.

### Why the term software factory falls short

**14:48** · I kind of want to push back on this term a little bit. I kind of actually hate it cuz I don't think it gets the point across and it feels a little Where's the people in this?

**15:00** · So I want to tell a story before I share what I think is actually the better word. So this is a mug that I have. I bought this mug about two summers ago from a farmer's market.

**15:12** · And I stopped by this booth at the farmer's market and you could just tell the person who had crafted this the potter was just someone who's like really passionate about their work and what they do. And so, he was telling me about all of these interesting details in the mug, the specific like curve of the handle, and the way he had structured it to accommodate different people's hands. He had this like specific dimple at the top of the handle where you could rest your thumb cuz he felt like that was like a key ergonomic detail of this mug.

**15:39** · He had this glazing at the top, so if like your cup overflowed, it wouldn't dribble down the sides, the glazing would kind of catch it. So, he just spent so much time thinking about the details of the mug and crafting it. And then I was kind of talking to him about his workshop, like how many potters do you have? How many of these mugs are you making? Yada yada.

**15:58** · And he got more even more animated and he started talking about his workshop setup and how he had set up different stations for different components of the mug. He had talked about how he had a specific process for sourcing clay and preparing ahead of time. He talked about how he actually incorporated verification for different components of the mug. If the dimple wasn't the right size, what would you do? What part of the process would you restart?

**16:23** · All of this thought that he had put not into the mug itself, but how the workshop existed to support the creation of the mug, and how he was able to scale this to dozens of apprentices in his shop and like hundreds of mugs handcrafted per day, which is pretty impressive.

**16:43** · And this got me thinking, I love what he did with his workshop. Um he had this really great idea and he developed a serious and repeatable system that allowed anyone to take the idea of a perfect mug and turn it into the like actual existence of a perfect mug.

**17:01** · You know, some people might think like workshops are this quaint thing where it's like a workspace for a single individual, but I think the story really shows that they're actually heavy-duty systems for doing work and that they're malleable and that they react to signals in how people are interacting with the thing they're building in the space they're building it.

### The workshop as a serious system

**17:21** · Um and it also underscores the like really close interaction loop that humans have with the spaces they work in and the outputs that are produced. And I'm synthesizing all of these ideas and I think this is what really we're driving at when we talk about building software factories.

**17:37** · We want to give more builders and the definition of who a builder is is expanding to non-developers serious systems for turning their ideas into code. Um and we as individuals who've been building dev tooling or have been in software engineering for a long time have an understanding of what that serious system looks like and what kind of support it needs to give into individuals.

**18:00** · Um we break this down into the same techniques that my potter friend had and the same methodologies that I talked about earlier about exposing primitives. Um we expose things like the ability for these agents to implement automations that react to events in the real world the same way that a human in a workspace might need need to react to a real event of you know a kiln um being astray or a handle being broken.

**18:28** · We need to make these systems observable. My potter friend talked about how he actually watched the way people worked in his space and refined the process over time. That doesn't come for free. Your system has to actually be something that you can inspect and look into.

**18:43** · And it has to improve over time. The workspace is not the static component that doesn't change ever. It needs to react to what's going on and modify itself to amend to like the goals of the people that are working in it and the product that it's producing.

**18:59** · And it needs to be cost-effective. Uh you want to reduce the number of broken mugs that come out the other end. You want to reduce the amount of buggy software that comes out of the other end of your of your factory. Um and you want to do this without compromising on cost without spending too many tokens.

**19:16** · All of these principles work to achieve a shared goal and that shared goal is building systems that remove toil and drudgery from our software process so that more people have the ability to build. We've seen the way like toil and drudgery have manifested. It could be all of the difficulty you might have reproducing a bug, the challenges of monitoring a production system. Those are things that are really hard to do.

**19:44** · And we can finally start to think about the structure of how we do them and building systems that allow us to do them repeatedly and transferably to people who are in non-technical roles. If these ideas excite you about how we can build these robust and reliable systems for anyone to ship software, you could stop by the Warp booth to come talk to me and the crew. We're at UG 20.

**20:08** · You can also mention me on Twitter. I'm Captain Sophia on all social media, GitHub, Twitter, all of that fun stuff. Or just drop me an email. You can find my email on my personal site. Thanks for coming to this presentation. I hope you learned something interesting about some of the engineering philosophies that are driving the next set of work we do as far as agents, developers, and AI.

**20:32** · \[applause\]