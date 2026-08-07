---
title: "Wearing the Agent: From Group Chats to Glasses — Sai Krishna Rallabandi"
source: "https://www.youtube.com/watch?v=s67bE2Ur3bY"
author:
  - "[[AI Engineer]]"
published: 2026-07-30
created: 2026-08-07
description: "Almost every agent today is built for one user, and Sai Krishna Rallabandi has spent about eight months on what breaks when you drop one into a group chat instead. Running a personal agent across a re"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=s67bE2Ur3bY)

Almost every agent today is built for one user, and Sai Krishna Rallabandi has spent about eight months on what breaks when you drop one into a group chat instead. Running a personal agent across a real group, and eventually onto glasses, forces two hard problems. The first is memory: conversations that last for days across several people, where the agent has to track who said what and surface only what is relevant without bloating its context.  
  
The second is security, and it is where the talk digs in. He points to a finding that two skills, each safe on its own, can collide once they share infrastructure, so a reporting agent leaks information at low frequency. His defense is to have an agent read everything and design a guard, then fine tune a small model with a per user adapter that only releases information appropriate to the context and catches prompt injection that regex would miss. The through line is that group and wearable settings break the single user assumptions most agent harnesses are built on, so memory and security have to be redesigned around the group.  
  
Speaker info:  
\- https://x.com/Saikallis9012  
\- https://www.linkedin.com/in/sai-krishna-rallabandi-8595418b/  
\- https://saikrishnarallabandi.github.io/  
  
Timestamps:  
0:00 - Introduction: agents for groups, not one user  
1:28 - Why single user agents fall short  
2:45 - Eight months in a real group chat  
3:47 - What changes when the agent joins a group  
5:17 - Two problems: guarding and memory  
5:55 - Securing an agentic system  
7:44 - When two safe skills collide  
9:27 - Designing a guard agent  
10:21 - A small model with per user adapters  
11:49 - Catching prompt injection  
12:29 - Designing memory for groups  
15:29 - Context growth and token cost

## Transcript

### Introduction: agents for groups, not one user

**0:01** · \[music\] Okay. Good afternoon everyone. Uh I'm Sai Krishna and firstly I would like to thank all of you for attending the talk.

**0:20** · This is the final session of the final day. So I realize um thanks you thanks a lot for attending the talk. So let's get started. This conference has really been about agentic systems, right? Every workshop that we attend, the keynotes, the speaker sessions, the conversations that we have been having in the hallways, all of us, all of us have been discussing agents in one form or the other. And I would like to declare that you know we have won like we have built the agentic systems. We can build them.

**0:51** · For you know a very basic reference what is an agent? An agent is nothing but a combination of systems model which is the brain of the agent. We have harnessed some form of orchestration around it and a set of tools that lets the agent do something. Now this is pretty simplistic. We can build an agent in an afternoon. It'll start doing useful things by the evening. And yes, there are a lot of issues today in terms of you know the traces etc. But we can build systems today.

**1:21** · And I would like to project forward trying to see what comes after this. And let me start by a basic observation which is that almost every agent we build today has the customer of size one clims of them all of them cater to one person.

### Why single user agents fall short

**1:42** · Even the programming assistants that we build even when they are deployed in an enterprise setting, they are typically geared towards one customer.

**1:51** · So this is great. We know the problems and challenges with this setup. We know the shape of the things that we want to build. But probably the next agent we are going to build is not going to have one single customer. It's probably going to be serving a group. On top of that, it's probably going to be invariable such as glasses and it's going to be on all day.

**2:12** · So, one of my advisers used to say, you know, you work hard as an engineer to solve a problem and then the moment you solve it, you realize that the question itself has slightly changed. Maybe we are heading towards a setting like that where all of our engineering we have built it for a agentic systems targeting one customer whereas we might be entering an era where we are deploying these agents in group settings and group settings pose uniquely different challenges compared to settings where we have single users.

### Eight months in a real group chat

**2:45** · So I have been working uh inspired by this um with an agent called Judith which is deployed in a group setting among friends and family for a period of 8 months. Let me illustrate what I mean in the talk by taking a few examples uh taken from the production system itself.

**3:06** · On the left we see one example from this week where it's deployed in a group of attendees of this conference and I was asking it okay how do we go to the conference venue and the agent didn't chose to not answer in the group but DM' me because of the privacy issue.

**3:23** · Similarly, this is a conversation from a couple of weeks ago where my wife and I we were trying to organize an event and it's trying to sync up all the calendars and you know make sure we get a slot which is available for everyone.

**3:37** · Then there is a proactive aspect as well. All of us I think after the uh release of coding agents we are operating on pretty light sleep and the fact that the agent understands uh we are under less sleep and you know we have um you know trouble decision-m that's not impressive the impressive part uh when a glasses agent spoke to me

### What changes when the agent joins a group

**4:00** · this was I was driving it didn't it chose to not announce this from the media of the car but it chose to speak it directly to me in the glasses preserving ing the privacy again and then um a group setting has conversations that are lasting over a period of time.

**4:16** · So this is an example where a bunch of friends have been discussing a particular topic that is constantly evolving and the agent was uh intelligent enough to curate the content and the memory which is relevant and filter out the things that are not needed. \[snorts\] And finally a simple application from an agent that my daughter uses who is three-year-old who is using the agent to you know learn lot of things like capitals of the countries different uh numbers etc.

**4:40** · Keeping us posted as well as to the progress of the kid and making sure that she doesn't forget the things that she learned and we also are aware of the things that he's learning. So all of these are examples where agents in a group setting have slightly different dimensions when they are deployed and there are the the aspect of group deployment is also not unique.

**5:04** · There have been attempts in the last 6 to 8 months of trying to deploy agents in a group setting under controlled scenarios try to try and see you know how they fare etc.

### Two problems: guarding and memory

**5:17** · So leading to the recognition of uh the growth of agents in a group setting. My talk today is going to be focused mainly on three aspects in group chats agents.

**5:30** · One the guard of the agent which is what what lets in the memory of the agent.

**5:36** · Today in agentic systems we know that the harness involves a lot of orchestration in terms of the memory but group charts take it to the next level.

**5:45** · And then the routing the routing here is not the model routing to save tokens but routing of the information the end information to the final user.

### Securing an agentic system

**5:55** · So let's get started with uh the memory the the security layer which I'm calling jetou. It's a mythological character from Indian mythology. The tagline from here is that we can't secure an agentic system like we secure a large language model. What I mean by that is a large language model when it hallucinates we can inspect the output and design stuff on top of it.

**6:18** · But an agentic system by nature operates on things as well in addition to the large language model which means the surface area that the agentic system touches is much more richer and more vast compared to a large language model and it is amplified in a group setting.

**6:34** · So imagine this right when we have an agentic system deployed in a even in a personal setting it's going through every web page that uh is available and the attackers who can do prompt injection and various other types of attacks which I'm going to talk about they have access to it all day every group message even though the people in the group we have added them but imagine a scenario where somebody takes a screenshot of something and uploads it uh every GitHub issue

**7:07** · that we post and track updates on there have been lot of cases of late where you know tokens have been exploited that way every email that we get the promotional emails etc the agent reads them and all of these are surface areas where the agent can be exposed to uh vulnerabilities and therefore we can't guard everything and remove everything from entering there has to be a balance between how we design the security layer and which is why I'm saying it's different from the security layer when it comes to typical ical large language models.

**7:38** · So to illustrate this, one of the recent papers which came out is uh highlights a very interesting uh phenomena where the punch line is that we can't read our way or we can't model uh check our way to safety and what we see here are two separate skills in the context of a typical large language model. One of them is an OCR module. The other is a reporting module. Both of the skills static scans are pretty good. They're pristine. They pass them.

### When two safe skills collide

**8:11** · But the paper runtime skill audit found out that a static scan surviving code can break at runtime. And the the paper when safe skills collide also identified that two skills which are benign at the surface when they run together they can be malignant.

**8:31** · For example, uh imagine the skills are sitting in our infrastructure but the the the attacker is attacking the the content that the agent is reading \[snorts\] which implies that the OCR extracts the information but the reporting agent when it sends the information along with the information it also sends our PII to a third party to put the numbers to the story as well.

**8:58** · This is not something which happens um at uh at low statistical frequency.

**9:06** · The the papers have observed that around 90% of the attacks have this.

**9:12** · So if you want to think about safeguarding our multi- aent multi-group setting architectures from this probably the first level of defense has to come at the boundary. Instead of guarding whatever the agent reads, we let the agent read everything and then design a guard which is deterministic. So it's fast. We don't have issues with respect to latency. But design when it is taking the action.

### Designing a guard agent

**9:36** · So for example, when it is reading bash variables or when it is exporting something or when it is reading secret variables with respect to configs etc. And then since we can design a deterministic system using traditional NLP or regax based approaches we can flag these out saying hey some of them are benign so let's allow them but some of them need approval etc. So this is the three class categorization that we can come up with as a naive approach.

**10:02** · Now uh we all know that this approach is good but we can probably do slightly better which would be to say can we train a model on top of it as well. So within Judith there is a component which tries to look at this data and tries to build a supervised finetuning model an SLM which is Lora fine-tuned to try and predict if there

### A small model with per user adapters

**10:27** · is something malignant in the data channel separate the data channel firstly from the instruction channel and only give out that information which is purely benign. So the ideal response here would be if the instruction is summarize this page for me and the website that we have crawled contains some prompt injection attack or any other form of attack to obscure that information and the model just performs the task as required.

**10:59** · So uh we have also benchmarked this on inspect agent. That's one of the benchmark uh data sets available here and it's it's the naive approach here is basically at 50% which is a coin flip and it improves on top of that. A very interesting caveat here is that a particular uh attack was spotted where instead of writing the text normally if you write it interspersed with dots like I do. LIi. K.

**11:28** · The regax based approaches and most of the static approaches fail at that. Whereas a learned model uh would probably catch it which is where the attempt to build a learn model comes in. But to summarize when we are

**11:44** · building a uh security layer for agentic system be it personal or be it group based setting we want to be able to build a system not at the input because that is going to gate everything but at the action surface where the agent actually is performing some task and maybe a better approach than a naive approach like regex or traditional NLP is to try to build a model against which we can do some hill climbing

### Catching prompt injection

**12:13** · Once the input comes into the model, the next important interesting thing when it comes to group especially when it comes to group settings would be how do we organize the memory because in a traditional setting in a traditional model uh the memory implementations can be very naive. A memory implementation can be done just using embeddings or files. But the interesting uh thing to note is that the model is just the engine especially when it comes to a group chat when we deploy it in either friends group or in a work setting.

### Designing memory for groups

**12:43** · The memory is what the agent becomes and it's becoming in real time it's evolving in real time. So we have to be very careful when it comes to how we store things, how we curate the the thing and how we forget some of the things that are stored in memory. It's it has applications with respect to latency because the less we store the better token usage and everything else.

**13:13** · So I would like to talk about uh five aspects here uh briefly mentioning uh each of them. The first one is what do we store? Let's take a typical conversation um like that happens in a group chat setting where people are discussing one particular occasion where the first person says you know hey um let's go to this place and this is the day at which we are going now there's a follow-up conversation somebody else adds some more information to it which keeps happening now one approach which

**13:45** · commonly uh naively what we do is to store everything and then keep compacting the conversation as the conversation becomes overhead. A probably smarter way would be to ex extract some form of atomic information, atomic bits from this conversation. In this case, the atomic bits would be uh anything that is relevant to the conversation which might come into future.

**14:07** · So once we build a model like that, the important thing here becomes how do we uh design auto rators for this and the auto rators have to be designed on extract did we extract high value atomic facts or not given a conversation are these the relevant information or not and then are these hierarchically related to each other or not? The temporal aspect as well because some things become more important as the time goes along and some things we might have to drop.

**14:36** · And then are we retrieving the right set of information given the current query and then is there some form of a intelligent retrieval as opposed to crawling everything by organizing information in form of a graph etc.

**14:54** · So uh the other interesting aspect when it comes to memory would be what uh what we store and what we forget. As the memory becomes bloated and bloated, we might want to train a very simple machine learning model or an SLM to try and figure out what are the important concept context uh information that we need to store. And a typical approach, a a very simple approach discussed in the paper learning what not to forget is where they learn a relevance scorer which keeps scoring continually.

**15:23** · The important word here being continually because in a group chat setting or in a group work setting the context keeps evolving and different things become important at different points and we can once we have a relevant scorer which is continuously adapting we can save much more on the tokens because now we are doing knowledge based compaction.

### Context growth and token cost

**15:48** · One other thing when it comes to serving these stored memories is uh whether whether we use cloud cloud-based serving or if we use local based serving we need to be aware of the fact that we all of us use KV caches and KV caches break when we try to do something cute with respect to the model. Therefore building an injection engine which is a aware of KV caching also helps there.

**16:16** · So all of these uh are the components which are important while designing a memory. Again um the memory component here is slightly different from the memory for my personal engine and all of these become extremely relevant uh in a group setting.

**16:34** · So I'll talk about the final part of the talk which is the privacy aspect. uh a shared assistant is not just a large model which is shared between different people but it's almost a new social contract because the information that is uh passed to a shared agent it's either

**16:52** · public or private depending upon the context in which it is presented in the same information for example grocery list is benign for everybody but information about salary or information about somebody's health becomes extremely private as well as public information depending upon the context the data has not changed the room in which it is deployed has changed.

**17:15** · So a very neat trick for this would be instead of storing all of the data all the time take inspiration from uh the way human brain works and try to have a common shared memory layer but train different uh Laura adapters on top of of each adapter for each of the users.

**17:35** · Therefore the permissions are baked in.

**17:37** · Now this is baking the permissions not by using code but by using machine learning itself.

**17:43** · The user as an engram paper is is a great reference uh of how to do it at scale and also knowing when to speak and when not to speak. A typical observation from where agents are deployed in group setting is they tend to o be over proact be over uh articulative when they are not asked questions.

**18:02** · And a tip and a simple approach here which is currently still in progress would be to train a model to determine uh it could be as simple as a robata classifier but to determine the role and when an agent is allowed to speak and not speak.

**18:20** · So uh I would like to end the presentation uh saying hey when we are developing harnesses when it comes to group agents we need to keep in mind three additional things at least. One of them being the security layer, the gate which keeps information out or filters out the information depending upon the context. How we design the memory, the harness and how we route the information to the responsible parties. Thank you.

**19:06** · \[music\]