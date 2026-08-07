---
title: "AI tools for Forward Deployed Engineering — Vasuman Moza, Varick Agents"
source: "https://www.youtube.com/watch?v=l0FLhNqBOic"
author:
  - "[[AI Engineer]]"
published: 2026-07-28
created: 2026-08-07
description: "A customer spent five million dollars and five years migrating to SAP, and has zero appetite to rip anything out again. That constraint is the whole design at Varick Agents: instead of asking an enter"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=l0FLhNqBOic)

A customer spent five million dollars and five years migrating to SAP, and has zero appetite to rip anything out again. That constraint is the whole design at Varick Agents: instead of asking an enterprise to migrate, you drop forward deployed agents on top of the systems they already run. Vasuman Moza's version of the role maps how a department actually works today, the reconciliations between a purchase order and an invoice, the handoffs nobody documented, and then automates those processes end to end. It answers the stat everyone cites, that most AI projects never reach production, by starting from the customer's real workflow instead of a generic tool.  
  
Making one forward deployed engineer that productive takes tooling of its own. Varick builds a spec from the raw material of an engagement, the granola notes and Slack threads, then lets the engineer shape the workflow with Claude or Codex against a single source of truth that can just live in Postgres. The harder problem is context: frontier models are surprisingly bad at traversing a messy enterprise and knowing that person A and person B are the same entity, so Varick post trains its own models to extract the right context and strip the redundancy, and only then does the agent run autonomously. Every engagement starts by finding the bottleneck and grows out from there.  
  
Speaker info:  
\- https://x.com/vasuman  
\- https://www.linkedin.com/in/vasumanmoza/  
  
Timestamps:  
0:00 - Introduction: forward deployed agents  
1:55 - The question: what can an agent actually do?  
3:27 - What a forward deployed agent is  
4:44 - Automating a department end to end  
6:14 - Why enterprises need deployed engineers, no migrations  
8:30 - Hiring the top 1 percent  
10:51 - The platform and department wide ROI  
11:53 - Demo: tools for forward deployed engineers  
13:07 - Turning notes into a workflow spec  
14:22 - Engineering workflows with a source of truth  
16:53 - Post training models to extract context  
18:37 - Where this leaves us

## Transcript

### Einführung: Vorwärtsbereitgestellte Agenten

**0:01** · \[music\] All right, first and foremost, thanks so much for being here. Um it's uh been a great experience, you know, obviously chatting amongst uh other industry giants like Cursor and Factory and Anthropic. I'm sure you guys are mostly here for them, but thanks for sticking around for this talk. Uh my name is Varick. I'm the CEO of Varick Agents. We work with some of the largest companies on the planet transforming them from the inside out with uh AI and agents.

**0:34** · Um and because of the nature of our work, which is highly bespoke, we go very deep into our clients. It requires a lot of forward-deployed engineering.

**0:42** · And this conversation is around why that's so important, how we approach it at Varick, uh and some of the internal tooling that we've created internally to allow us to scale that forward-deployed motion without, you know, increasing head count exponentially.

**0:55** · And it's titled the next bottleneck because I fundamentally believe the next bottleneck is how deep can you go into a customer without scaling head count uh exponentially? How can AI do that job for you?

**1:07** · So, as stated previously, AI is solving the execution of work. Um if you were to look back a couple of years ago before uh you know, thinking agents and reasoning agents were a widespread phenomenon, uh and I had asked you, "How many of you have used AI to solve an end-to-end task?" The answer would be slim to none.

**1:26** · But if I ask that same question to everyone today saying, "Has AI solved an end-to-end task for you today?" I'm sure every single one of you would raise your hands. So, clearly execution is no longer the core bottleneck. The models are improving to the point where intelligence is no longer the constraint, and harnesses are being built in a way that allow us to use, whether it's browser use tooling or API tooling, uh with very robust MCPs that allow us to execute work uh with near perfection.

**1:52** · The difference and the bottleneck that is still here is how much can you understand the business? Because every business, every consumer is different.

### Die Frage: Was kann ein Agent tatsächlich leisten?

**2:03** · Uh one sales department for a healthcare company, for example, operates completely differently than the sales department for a SaaS company. And this is something that we see with our work today at Verkada agents. And if there are any business operators in the room, you know exactly how hard it is to wrangle uh the latest models to solve for your specific use cases. It's very difficult to extract that context from your you know, employees and from your team. And it's very difficult to feed that into an API call or a simple model call uh that doesn't break down very quickly.

**2:32** · So, the bottleneck is how much can you process re-engineer, how much can you process understand? And that's the job that we do here at Verkada. So, right now operations are fundamentally centered around the human.

**2:44** · Uh right now, the work that you do today is done by humans, whether it's on top of software or completely agnostic to software.

**2:50** · Uh but in the future, operations will be centered around AI. And this means not only, you know, providing companies with AI tooling like a cursor, Claude Code, Codex, like a factory, like any of the other brilliant AI tools that you for your experiencing here today, but also changing the operations and the processes themselves.

**3:10** · And fundamentally, that is the role of a forward deployed engineer. It's going into the company, understanding how things run today, and re-envisioning what it could look like tomorrow. And we believe that is our job at Verkada and why forward deployed engineering is such a core part of what we do.

### Was ein vorab bereitgestellter Agent ist

**3:27** · So, a forward deployed agent, what does that really mean?

**3:31** · So, why do we need FDEs? As I stated previously, I'm not going to, you know, go into this too much. I'm sure you've been hearing a lot of this today.

**3:36** · Uh FDEs are responsible for a few different things. One is they map the way that humans are doing their work today. So, how we do that at Verkada is several forward deployed engineers will be embedded directly with the customer.

**3:45** · You can imagine it's a enterprise company with thousands of employees, but we'll scope it down to a single department. In a finance department, for example, we'll have them sit down with the process leads for AP, AR, card reconciliation, banking, billing, FP&amp;A, etc. So, interviewing every single one of these process leads to understand not only how are things running today, but more importantly, when things go wrong, what happens?

**4:10** · You know, a lot of the documentation that you have at companies about the golden path and maybe an edge case or two, but this is still fundamentally not the reality.

**4:18** · Where when we talk to customers, it's it's a lot of, you know, Sarah in AP handles the workflow today in this way, but when things go wrong, she actually sends it over to Chris, who then takes four days of cycle time to handle reconciliations between a purchase order and an invoice.

**4:34** · Those are the realities that are one unique to every single company, the way that they handle things is different from one company to the next, and two, the real bottleneck for why AI can't just run amok and handle end-to-end processes without the hand-holding that you see today in the enterprise.

### Automatisierung einer Abteilung von Anfang bis Ende

**4:49** · Um so, this is the first section, which is mapping how humans do the work.

**4:53** · The second is really re-engineering the process around AI. So, what does this mean?

**4:58** · You know, there's a lot of talk being given today in terms of slapping AI onto broken processes, and that's fundamentally why you don't see the ROI across the industry today.

**5:07** · There's a lot of, you know, semi-outdated, but still very relevant statistics like the MIT review saying that 95% of generative AI pilots fail to reach production. Or the other statistic, which is 87%, very similar thing, that most AI pilots don't produce measurable ROI or they don't ship to production, period.

**5:27** · And the reason for that is a lot of the time, AI is being slapped on top of broken processes in a way that the AI doesn't actually understand how to do things.

**5:37** · Um you see that this at the simplest level with coding, where as an engineer, it's very difficult, even with gold loops and the the latest technology there, uh to just say, "Go and solve this for me and have it run off and refactor entire code bases without some degree of human input.

**5:54** · Now, if you extrapolate that to a business context, these are very non-technical operators in finance, sales, marketing, procurement, logistics, uh etc.

**6:05** · So, giving them this AI tooling will not allow them to receive the same ROI that a software engineer might be able to to uh produce or create.

**6:12** · Um so, what this means is you need forward-deployed engineers to help them re-engineer their current process around AI.

### Warum Unternehmen vorab bereitgestellte Ingenieure benötigen – keine Migrationen

**6:19** · It needs to be not too different to where they don't understand, you know, how to operate the system. For example, if they're used to an 11-step workflow and you come in and change that with a one-step, they might be taken aback, the adoption rates might suffer, etc. As was alluded to in previous presentations.

**6:34** · Um but at the same time, it needs to be different enough to where you're actually capturing the ROI.

**6:39** · Meaning, you do say, all right, four out of these eight steps will be handled completely autonomously.

**6:45** · The other three will be handled with some human-in-the-loop intervention.

**6:49** · And one step of that process will be handled by a human, period. Either because the risk is too high or because, you know, it's it's not unique enough for an agent to produce measurable value in that specific step of the process.

**7:02** · So, that's the second major step of a forward-deployed engineer. That's why we need them.

**7:06** · And third and finally, and this is what I want to uh bring one of my heads of engineering to discuss in just a moment, is actually deploying these agents on top of existing systems. So, fundamentally at Verity, we believe that the AI wave left a lot of enterprise behind.

**7:21** · A lot of enterprises are married to their systems of record. Not everybody, but most of them are.

**7:26** · Uh they've migrated to NetSuite, they've migrated to Dynamics, uh they migrated to SAP and Salesforce.

**7:32** · And when you pitch them AI solutions that live completely disparate from these systems, uh you're ignoring the reality of enterprise.

**7:39** · One of the quotes from our clients said that they spent $5,000,000 and 5 years migrating to uh NetSuite.

**7:47** · That's a real quote. So, if you're telling them, "Hey, I have this fancy AI tooling, but by the way, you have to migrate off of NetSuite," they're going to tell you to get out. They don't have any appetite for that.

**7:56** · So, what we believe in Varick believe in at Varick is we'll build the agents on top of your systems of record.

**8:03** · And the way that we do that is quite uh unique. We have our own Varick OS platform that allows us to spin up agents, monitor them, uh etc. with the full governance and eval suite baked in.

**8:12** · But at the same time, it lives on top of your systems of record. So, if you are on a Salesforce or a NetSuite or a Dynamics or an SAP, we will not ask you to migrate off of that. And that is where enterprise needs AI the most.

**8:23** · Uh because they're too large to move up.

**8:28** · So, why build the FDE agent in the first place? As mentioned previously, I think everyone is saying that 2026 and onwards is the year of the forward deployed engineer. And to some extent, we believe that's completely correct. There's never been more of a need to go deep into customers and understand their business use cases and help them adopt the latest in AI tooling.

### Die besten 1 % der Mitarbeiter gewinnen

**8:48** · But at the same time, we realize that it's actually very difficult to find forward deployed engineers who are both the technical like top 1% who are really able to understand and speak AI uh 10,000 times better than the average, you know, enterprise customer, but also have the communication and human skills needed to be, you know, as alluded to previously, very high IQ, high EQ, extracting the information from the customer and meeting them where they are in real time.

**9:14** · You know, typically, you'll have consultants that you then train on the technical side or engineers that you then kind of train on the soft skill side, but it's very hard to find people who are, you know, the best of both.

**9:25** · Um so, the FDE agent is our effort to bolster the existing forward deployed engineers that we do have.

**9:32** · So, for example, allowing one forward deployed engineer or forward deployed strategist to manage and maintain several client communications.

**9:41** · I know that most of the folks in the room are technical, but it's very easy to misunderstand how deeply involved you have to be with the client. They're emailing you 24/7.

**9:51** · They're sending you hundreds of pages of documentation.

**9:54** · And every single process they will pull you in a different direction.

**9:57** · AP relies on AR relies on reconciliation, relies on FP&amp;A, and they each have their own version of what they think is the most important. So, being able to manage that context and being able to serve them all equally while also not hiring 50 people to do so is fundamentally very important and it's how we at Verek avoid being, you know, a traditional consultancy while also offering that handheld hand-holding and like very human experience human-centered approach of consulting that we think we do think is very valuable.

**10:25** · Um so, in the past in 2024 and around that time, execution work was still the bottleneck.

**10:32** · This was before the models gained the intelligence and the harnesses gained the integration abilities that allowed them to move past the execution bottleneck.

**10:39** · Um now the AI models are trained to solve the execution of knowledge work. I will go as so far as to say that knowledge work is almost entirely solved.

**10:48** · The difference is and what we're realizing now is that designing how work gets completed around AI is the next bottleneck.

### Die Plattform und der abteilungsweite ROI

**10:56** · It's the ability to go deep with the customer, redesign the workflows, deciding what should be automated versus shouldn't, and building this in a robust and scalable way on a platform that moves the needle for our clients.

**11:08** · You know, as opposed to doing a point solution, which promises to transform just one part of your sales process for example, uh maybe it's prospecting.

**11:16** · Uh that ROI might deliver 5 to 10% ROI for you as a sales function. Same thing on finance. If you're just doing AP and no other part of your department, you might have a 5 10% ROI.

**11:27** · But, at Verek we deliver department-wide transformations, holistically transforming the entire department at a time. And that's how we get the ROI that we see for our clients which is 25% 50% 75% truly giving them back you know the three things which is revenue uplift cost savings and risk mitigation as was so eloquently stated previously.

**11:48** · And an AI FDE is trained to re-engineer these necessary tasks around AI.

### Demo: Tools für vorab bereitgestellte Ingenieure

**11:53** · So I want to invite my head of engineering JD Pruitt to come up and and share some more of the deep technical stuff on our FD agent because I haven't written a line of production code in a while. So here's JD.

**12:06** · Okay. Thanks Voss.

**12:09** · And maybe we can get his mic going.

**12:15** · All right, thank you.

**12:16** · Thanks Voss. So this project to give tools to our FDEs basically started with me. I lead the platform team and we're over on one side of the office. We're hanging out, we're chilling, having a great time. Codex, Claude, we're all hanging out.

**12:29** · And then I look over at the FDE side of the room. They look stressed. They are sleep deprived. They're extremely miserable. They've got clients emailing them 24/7. I'm like, "Oh my god, you guys haven't slept at all." So I go and I start talking to them and I'm like, "Okay, what is your guys' process like right now? How are you actually engaging with these clients?" They're like, "Well, we you know upload about 150 pages of documentation to Claude and then we prompt Claude and then we wait like 2 minutes and then we get analysis and then it's verbose and incorrect and it kind of sucks." And I was like, "All right, we got to fix this."

**12:56** · So we have been working on an FD agent which is the Codex for our FDEs basically.

**13:02** · And there is three stages of it. The last of which is certainly still in in development. The first is what we call the engagement. The first function is the is the engagement agent. And essentially this is a better version of Claude built just for our FDEs. It's their assistant. They have it pulls in their granola notes. It synthesizes documentation. It reads PowerPoint slides. It allows them to query and say, "Who is responsible for this process?

### Notizen in eine Workflow-Spezifikation umwandeln

**13:27** · I got an email that mentioned Sarah spelled, you know, this way and I have a, you know, a Slack message with a different way. Are these the same people? Cuz these are the questions that our FDEs are asking all day, every day, and they waste a ton of time just waiting on on Claude to respond.

**13:41** · So, the engagement agent is their way of It's their It's their assistant to build um to build the workflow. Then there's the workflow agent. And what we did is we took our engagement agent and we embedded it inside of our platform so that when our FDEs go and they actually build the workflow, the FDE agent is right there saying, "Oh, you forgot about this edge case.

**14:02** · Um you should probably ask me uh you know, who owns this process so I make sure the email goes to the right place." And it lives It's basically a I can talk a little more of the details on the next slide, but Whoops.

**14:18** · It lives uh it lives on side of our inside of our platform. It works next to Claude or Codex, whatever model you're using, um and make sure that the workflow that the FDE is constructing is actually uh it correctly shadows the process that we want to engineer. And then there's the final stage, which we're not at yet, which is a um an autonomous assistant for FDEs where it's receiving emails from clients who say, "Actually, I want to change, you know, where my QC report goes to.

### Workflows mit einer zentralen Datenquelle entwickeln

**14:48** · I want to, you know, change it to a different email, etc." And our agent is able to process that information, query the understanding of the company that we currently have, ship an autonomous change to the workflow on top of our platform, and then our FDE never has to get involved, saving their time for the much more high-value work of sitting down, interviewing with the clients, really understanding what their process is, um and not dealing with all of the small little minutia that anyone who has been an FDE can tell you uh takes up a lot of their time.

**15:21** · So, how do we how do we build this? Um the first thing is we need some single source of truth, some representation of a company's uh functioning. There's a lot of different ways to do this. If you were at the booths downstairs this morning, there was, you know, five companies trying to sell you a graph DB, and you can just use Postgres, whatever it is.

**15:40** · Yes, I'm looking at you. Um \[clears throat\] doesn't really matter what you use, but the point is we use a dependency graph.

**15:46** · Um most of these workflows inside of enterprise are remarkably linear. They just have a lot of cycles in them, but at the at the end of the day, the process owners want things to be as dependency-driven as possible. They don't want person C in the process to have to deal with something before A and B have approved it. So, a dependency graph is a very nice representation of this.

**16:06** · Um then we do our own model training. Um and there's really two parts to this problem that we're trying to solve. The first is, given extracted context for the FTE, do we get a good high-quality output? And the answer is, with Claude, honestly, no, which is kind of surprising.

**16:23** · But the really um and sure you guys have experienced this, when you are trying to do a long analysis, frontier models are extremely verbose, and they lack the um you know, I would say the um I only started believing in consultants once we started hiring them at Verek.

**16:42** · And the reason is they're so good at figuring out what is the part of the detail the client actually cares about, and what is the part that can get glossed over. And frontier models have absolutely no concept of this. So, we started post-training our own models on top of on top of open-source models.

### Modelle nach dem Training nutzen, um Kontext zu extrahieren

**16:57** · We're a fan of Kimiko 26, but a lot of these would do a lot of these would do fine to really get that nice balance between detailed and uh clarity that the frontier models often often lack.

**17:10** · So, that's a that's a bit about writing a good normalized process flow from extracted context. But there's the second half of the challenge, which is getting good at traversing at extracting the right context. So, we might have this huge knowledge graph, but it's remarkably difficult to traverse this knowledge graph in a reliable way that finds us the right context. So, once we have our post-trained model, we create an RL environment where we have exposed our own custom tools specifically designed to traverse our knowledge graph.

**17:41** · These tools are things like make sure person A and person B are actually the same person because a lot of you know, there's a lot of Mikes in every company we work with and Claude gets very confused by this. Um a second thing might be something like um uh identifying identifying redundancy cycles or uh like violations of your DAG inside of your knowledge graph. And so, in our RL environment, we train really good tools to do a good job of traversing this graph to extract the right context. So, that's how we solve the two problems.

**18:12** · Writing good analysis from the context and extracting the correct context in the first place. And then the third part, which we are um still building towards is an agent that operates autonomously to do the kind of uh workflow management on the small things that the FDA doesn't have to waste their time on. I think that's all I've got. I'll hand it back over to Vass.

**18:35** · Thanks, Petey.

### Wohin führt uns das?

**18:37** · So, where does that leave us? And I want to share a little bit more about Verica uh because obviously we're not the cursor and throttle of the open eye of the world. Um when we started this company, we fundamentally believed that the way the puck was moving, you had to get ahead of it and you had to start learning how a business runs and building with that in mind.

**18:57** · I think a lot of Silicon Valley starts to go product product product, but what we're building for cannot be solved for with just a product. We start off every single engagement with an audit where we actually send our forward deployed engineers, strategists into a company to learn how it works from the inside out. That is what I believe is the biggest bottleneck. And after that, we go into implementation. We build agents on top of our platform.

**19:20** · And yes, you do still need all the bells and whistles and the fancy technology that allows us to, you know, really automate work in the future. But, again, the bottleneck is the forward deployed motion, which is why we are so bullish here at Verica on our AIFDE.

**19:36** · And if you're interested in learning more about it, or if you're interested in joining one of the fastest-growing startups in Silicon Valley working with some of the largest clients on the planet, come find us after and we'll have a chat because we are aggressively hiring. And if you are a company looking to understand how AI can really move the needle for you internally instead of just slapping a frontier model on top of everything and watching it break in production, come find me after as well.

**20:00** · Thank you all so much for the time. I really appreciate it. And cheers.

**20:03** · \[applause\] \[music\]