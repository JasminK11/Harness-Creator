---
title: "How I automate my own job at Hugging Face using agents — Niels Rogge, Hugging Face"
source: "https://www.youtube.com/watch?v=FLUoowDJg4I"
author:
  - "[[AI Engineer]]"
published: 2026-08-20
created: 2026-08-23
description: "Thousands of GitHub issues, opened automatically, have produced exactly two negative replies. Niels Rogge works on what he calls the Google Drive to the hub team at Hugging Face, whose job is noticing"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=FLUoowDJg4I)

Thousands of GitHub issues, opened automatically, have produced exactly two negative replies. Niels Rogge works on what he calls the Google Drive to the hub team at Hugging Face, whose job is noticing that a paper's weights are sitting on Dropbox or Zenodo where nobody will find them, then asking the authors to publish on the hub instead. Hundreds of papers land on arXiv every day, so he automated himself.  
  
The useful part is that he built it twice, in opposite shapes, and explains why each time. The outreach half is a deterministic workflow: a model call at each step of the path he used to walk by hand, no agent framework at all, running nightly as a cron job on free GitHub Actions minutes, with tracing so he can inspect prompts, cost, and latency. He chose that because the prevailing advice when he built it was to avoid agents unless you genuinely need one. The follow up half, built recently, is the reverse. It is a fully autonomous loop whose main tool is bash, carrying one CLI, one skill, and a sandbox, fanned out so that every issue gets its own container. He is also candid that recipients are not told an agent wrote to them, on the grounds that it sends what he used to send himself and a disclosed bot tends to get closed unread.  
  
Speaker info:  
\- https://x.com/NielsRogge  
\- https://www.linkedin.com/in/niels-rogge-a3b7a3127/  
\- https://nielsrogge.github.io/  
  
Timestamps:  
0:00 - The Google Drive to the hub problem  
1:59 - Paper pages, metadata, and discoverability  
3:41 - Why manual outreach does not scale  
4:29 - The workflow he was running by hand  
5:19 - Workflow or agent, and why it is not binary  
7:03 - Nightly cron jobs, and tracing cost and latency  
8:46 - The flood of replies, and automating follow up  
9:36 - Switching to a fully autonomous loop  
10:25 - Bash, one CLI, one skill, one sandbox  
12:06 - A container per issue, fanned out  
13:49 - What researchers actually reply  
15:32 - Migrated models, and a 400 gigabyte dataset  
18:06 - Open models, agents over workflows, and evaluation

## Transcript

### The Google Drive to the hub problem

**0:01** · \[music\] Okay.

**0:17** · All right.

**0:19** · Hello everyone.

**0:20** · Thanks for coming by.

**0:21** · Today I'll talk about how I automate my own job at Hugging Face using agents.

**0:28** · Um short introduction. I'm just uh Niels from Belgium, the land of beer, fries, and chocolate. I studied at KU Leuven, and I'm a machine learning engineer at Hugging Face for 5 years now.

**0:42** · Uh today I'll talk about the community science team at Hugging Face, which is the team I'm part of.

**0:47** · Uh then I'll talk about how I automate large parts of the community science team. And finally, I'll also discuss some other efforts uh that we do at Hugging Face.

**0:58** · So, let's start with the community science team at Hugging Face.

**1:02** · So, basically, this started when I was sent I was seeing like trending research uh passing by on GitHub. And a lot of times when I saw new interesting work, um the weights were not available on Hugging Face, sadly. Like, researchers use either Google Drive or they use GitHub releases.

**1:20** · They use Dropbox, they use Zenodo, or other servers to put their um artifacts on. And this hurts uh discoverability of their work. It's like not easily uh visible or discoverable.

**1:33** · And when I then open a GitHub issue to say like, "Actually, you could put your weights on Hugging Face for free." Most of the time, people replied to me like, "Yeah, migrating the weights uh from Google Drive to Hugging Face actually makes perfect sense."

**1:46** · So, yeah, the community science team can also uh be described as the Google Drive to the hub team.

**1:52** · Um why? Because on Hugging Face, we have these paper pages, uh and every single paper is from archive. And then on the right side, you can basically list the linked artifacts, like the the linked models or data sets.

### Paper pages, metadata, and discoverability

**2:05** · So, people can easily reproduce your paper or find the models or data sets.

**2:11** · So, yeah, you can see them on the right side.

**2:14** · Um this improves the discoverability of your work because we have these metadata tags or filters on the app, so you can easily find, for example, depth estimation model, an LLM if you're interested. You can find them by language. You can tag them with the library they are compatible with and so on. So, this improves the discoverability of your work. So, these are, yeah, the metadata tags that you can add to every single model on Hugging Face or every single data set.

**2:39** · So, yeah, this is like the main problem that we saw, like, lots of people, lots of researchers are like using third-party services to publish their work. We have the Hugging Face platform, which is like a centralized place where people can find machine learning artifacts.

**2:53** · It also improves with documentation because you can add a model card or a data set card. We have tooling, so you can easily upload or download stuff from Hugging Face.

**3:02** · And it might also help reach researchers in promoting their work. So, it's basically a win-win both for researchers and then other people using the research.

**3:12** · So, yeah, these are the typical GitHub issues that I was opening. I always had like the same template. I just asked, "Could you please release this checkpoint on Hugging Face? Could you please release this data set on Hugging Face?"

**3:23** · And \[snorts\] then I also opened PRs, pull requests on Hugging Face to add data set cards or model cards to improve the documentation of those artifacts.

**3:33** · But, there's a problem.

**3:35** · It's not really scalable for me to open all these GitHub issues or pull requests because every single day there are like hundreds of research papers coming out on archive, especially now with AI boom.

### Why manual outreach does not scale

**3:45** · Um yeah, also NeurIPS, for example, a major AI conference, they are seeing a massive amount of papers.

**3:51** · So, can we automate this? Can we scale the community science team with agents?

**3:56** · So, that's the second part of my talk.

**3:59** · How can we, yeah, scale this uh to a massive amount of research papers?

**4:05** · So, the idea is pretty simple. Uh we should have an AI agent which can help me do this outreach to all these researchers which publish uh models or data sets uh as part of their research work. And then, yeah, do the outreach in an automated way. So, this is the typical workflow that I was following.

**4:23** · So, basically, whenever I saw a research paper, I first tried to find the GitHub URL uh of that paper, if it's available.

### The workflow he was running by hand

**4:31** · Then, I I read the readme of that GitHub file. And then, I basically check if there's anything new interesting to be shared on Hugging Face.

**4:40** · Uh it could be that it's on Hugging Face already. In that case, I check whether the model cards or data set cards already properly uh present, whether the metadata tags, for example, are there.

**4:50** · If uh not, then I will might open a pull request. Otherwise, if the artifacts are not yet on Hugging Face, I open a GitHub issue. And then, finally, I also follow up with the author. So, that's kind of the workflow that I had to automate uh with agents.

**5:05** · And there are several ways to solve this. Uh you could uh go with a workflow.

**5:10** · Uh these pictures are, by the way, taken from the blog post building effective agents by Anthropic, which is a really great read. Uh read. Um so, on the left side, you see, yeah, a workflow which is more deterministic. You basically use LLM APIs within steps of a predefined path or pipeline, uh which is more predictable. It's more deterministic. You have more control over it. Of course, it's less flex- flexible.

### Workflow or agent, and why it is not binary

**5:32** · And then, on the other hand, you could have a fully fledged auto- autonomous agent, which is an LLM in a loop that calls tools until it's done, which is more flexible, but also less uh predictable.

**5:44** · Uh Uh, at the time, yeah, of course, it doesn't have to be a binary story. You can have a workflow on one hand, you can have a fully autonomous agent on the other hand, but you you could of course also mix and match these type of things uh, for your use case.

**5:57** · In my case, I went for um, a pretty deterministic workflow. Uh, why? Because at the time that I was building this, this was in 2024, was at the time that Anthropic uh, wrote their blog post building effective agents. And there they actually said, "Try to avoid building agents if you really don't have to. Start simple, start with a single LLM API.

**6:19** · Uh, avoid frameworks." Uh, and actually I think those were great tips. So, at the time I started building a workflow which basically replicated the workflow that I was doing when I was doing this outreach.

**6:30** · So, yeah, this is the whole uh, pipeline. This is created using the Excalidraw MCP server in Cursor. It's pretty nice to create a visualization of your code.

**6:38** · Uh, I'm not going to go into the details, but basically it just replicates um, the workflow that I was doing when doing the outreach. And I use LLM APIs in then each of the steps without any framework, without any agent framework. So, it made it quite uh, deterministic and I had a lot of control over uh, how this goes.

**6:58** · Um, in terms of deployment of this uh, workflow, it's a simple cron job. So, cron is just something that runs regularly. In my case, I run it once every night. So, when I'm sleeping, there is this agent, but technically it's just a cron job, a Python script with an LLM API, which is going to read all these hundreds of archive papers, uh, and then it might open GitHub issues or it might open pull requests on Hugging Face.

### Nightly cron jobs, and tracing cost and latency

**7:23** · I'm using GitHub Actions for this. Uh, I saw this very nice blog post free cron jobs with GitHub Actions, and actually it's probably the best entry point if you want to set up cron jobs, um, because GitHub has a pretty generous tier if you want to get started with like putting simple cron jobs uh, up there. And yeah, it makes it really easy for me in the UI to manage all these cron jobs.

**7:45** · So yeah, every night I have hundreds of uh GitHub issues being created.

**7:52** · For the tracing part, um I'm using LangFuse. Uh yeah, LangFuse also has a a booth here.

**7:58** · Um LangFuse is pretty great.

**8:01** · Um I use it mostly for the tracing part, the observability part, just to see what is the LLM doing, what are the inputs, what are the outputs, what are the prompts, how much does it cost, latency, and so on.

**8:14** · Um so yeah, uh I definitely recommend it.

**8:18** · Um but yeah, as my agents are opening so many GitHub issues every night, I then end up with a massive amount of unread GitHub notifications because people reply to those GitHub issues.

**8:30** · And that's a lot of work to then reply to all of those issues. It's kind of like going through your mailbox.

**8:37** · So you could wonder, could we also um automate the follow-up to those GitHub uh issues? Because initially I was still the GitHub issue creation was done uh by an agent, but I was still the one involved in then doing the follow-up.

### The flood of replies, and automating follow up

**8:51** · Uh now a few months ago I also automated the the follow-up to those GitHub issues.

**8:57** · Again, you could think, how should you solve this? Should you go for a more deterministic workflow or can you go for a fully autonomous agents, uh an LLM in a loop which runs with some tools and skills?

**9:08** · Um well, here I went for kind of a fully autonomous agents, uh so it's kind of flexible. It's a bit less predictable, but it works quite well. Um I went for this because uh in November of last year at AI Engineer in New York, there was a pretty nice workshop by Anthropic on the Claude agent SDK.

**9:28** · And there they were actually saying that agents might be better than workflows.

**9:32** · So they So they were kind of contradicting themselves, but they he said that models have become so good that you might actually now start to work with fully autonomous agents rather than a workflow.

### Switching to a fully autonomous loop

**9:42** · So this is why I went with this approach and I actually am using the Claude agents SDK for this use case.

**9:49** · Uh there was another pretty nice talk by Cursor also at AI Engineer. This was in the European version in London a few months ago.

**9:58** · There they talked about how they replaced 12,000 lines of custom code, pretty sophisticated workflow, with a very simple 200 lines of code skill.

**10:07** · Uh actually it's pretty similar for me like I can replace a lot of custom codes, thousands of lines of code, with nowadays just a simple agent with maybe a CLI as a tool and a skill and that's it cuz the models have become so good.

### Bash, one CLI, one skill, one sandbox

**10:25** · So yeah, in terms of the architecture, this is a bit what it looks like.

**10:30** · Um so it's actually just the Claude agents SDK which is, I would say, a pretty good Python SDK for building an agent.

**10:37** · Initially I was using the Claude models, but then I since actually this week I'm using the GLM 5.2 model via Hugging Face inference providers. So Hugging Face does offer a service which basically wraps a lot of inference providers like Together AI, Fireworks, Cerebras and so on. So you can use a lot of open models in a unified way. It's OpenAI compatible or Anthropic compatible and then I deploy this on Modal. Modal is also present here today.

**11:08** · And it's mainly using Bash as a tool so the terminal to basically do Hugging Face commands because it's using the Hugging Face CLI quite a bit.

**11:18** · So I combine it with the Hugging Face CLI skill which is actually all it needs. And then it might comment something on GitHub as a follow-up. And it also actually does the posting on Slack because eventually I also want to see the final results on our Slack channel uh from Hugging Face. So yeah, given that there's also a lot of hype on GLM 5.2 recently, for example, Cursor uh saw great performance on their Cursor bench.

**11:44** · Post-training bench is another one uh where it actually beats Opus 4.8 and it's cheaper. So, yeah, there's no reason not to use GLM 5.2 uh especially given that I work at Hugging Face.

**11:55** · Um for the deployment, as I said before, I use Modal.

**11:59** · It's pretty great if you want to deploy agents. Uh in my case, I'm using the batch processing feature. So, they allow you to spin up a massive amount of containers all in parallel. Every single container is basically one agent loop that is processing one GitHub issue.

### A container per issue, fanned out

**12:15** · Uh it's super easy to use, I have to say.

**12:17** · Um and the startups are also pretty fast.

**12:21** · So, I definitely recommend it if you're building uh agents that are like, for example, running in the background, running overnight, for example.

**12:29** · Um and then the way I invoke it, yeah, technically I could also just uh deploy this as a cron job. Modal, for example, has support for this. But typically, the follow-up on the GitHub issues, I still do that actually manually by invoking it as a skill. So, I created a skill for this in Cursor.

**12:47** · Uh I call it process under it Modal. And then what it's going to do is it's actually going to invoke an agent, in this case, Composer 2.5, which is like the agent that I'm mostly using in Cursor, which is again going to invoke all the other agents. So, that's this is kind of the loop that people are talking about. And then finally, it's going to post uh all the results on our Slack channel.

**13:09** · Uh so yeah, and this is actually what it just posts. So, what it does is it basically just posts a huge amount of Hugging Face papers, uh which are these research papers which people can uh make available on Hugging Face because every time someone mentions it in a model card or dataset card, we index it on the hub. And then it just posts all the artifacts that people have been uploading based on the outreach that we do via GitHub.

**13:32** · Um so yeah, I do this still in a manual form. So I just invoke the skill and then after a few minutes, these messages appear on our Slack channel.

**13:44** · Um yeah, I just included some fun results because to be honest, it's quite fun to see people interacting with the agents.

### What researchers actually reply

**13:52** · Um to be honest, I don't disclose that it's an agent. Why? Because I think if people know it's a bot, then they might quickly like close the issue. And to be honest, they post exactly the same stuff as I was doing before manually. So I don't actually see any reason to to do that.

**14:09** · Um so and then you see replies like this. Hi Niels, thanks a lot for your suggestion and the clear guidance.

**14:16** · I actually also often times see people using an agent to reply to my agents. So it's kind of the that internet nowadays.

**14:23** · Um but people yeah, make all their artifacts available on Hugging Face. And out of the thousands of issues that are being created on Hugging Face, actually so far I've only had two negative comments. One guy saying yeah, please close this slop. So he closed the issue.

**14:38** · And then another one. But most of the people they just say, yeah, actually it makes perfect sense to make my weights or my data sets available on Hugging Face. Like why didn't I think of this?

**14:47** · Um so it's kind of a win-win I would say.

**14:51** · Uh I often times also post fun results on our Slack channel. Like for example, one time someone a researcher from Apple sent me a DM like, I saw you reached out to me. Yeah, technically it's my agent just posting a GitHub issue regarding publishing a new Apple uh the artifacts of an Apple paper on Hugging Face. Or for example, it reaches out to Google DeepMind to publish um mathematics data sets.

**15:17** · Um so a lot of times like I receive emails, the one on the the side, where yeah, they want to publish a 400 GB data set on Hugging Face, but this was also my agent just opening GitHub issues.

**15:29** · Um Yeah, this is another fun result. So, Paddle OCR, it's like a Chinese company.

### Migrated models, and a 400 gigabyte dataset

**15:35** · They migrated all their OCR models to Hugging Face based on outreach by the agents that create issues for me. So, yeah, it's pretty nice.

**15:47** · Another fun result is like when it when it completes the default template of model cards on Hugging Face. So, Mac Mitchell, who also works at Hugging Face, she has a famous paper called model cards for model reporting, making sure that anyone documents their models in a proper way. And so, we do provide this template, which you can see on the left side in the Git diff. And then, the agent is just completing that template based on the content that it finds based on the paper, like the GitHub readme, the PDF itself, and so on.

**16:21** · Um yeah, it's also quite funny to see, for example, in this case that it included me in the model card. It said, "Model card authors, Niels part of the Hugging Face community science team." I never prompted it this way, but it's pretty fun to see.

**16:35** · Or people are replying, "Thank you for helping me fix my mistakes." So, those are all done by the agents.

**16:44** · Uh I think the most popular GitHub issue that was created was this paper Tiny Recursive Models, which you might have seen, was quite trending both on Hugging Face, but also on Twitter.

**16:56** · So, yeah, more than 60 people actually upvoted that issue so that the model was released on Hugging Face. So, this is again, I think, the win-win. So, it's both a win for the researcher, making their research more discoverable on Hugging Face, but it's also, yeah, better for the people then who want to build on top of that research and want to use them.

**17:16** · Uh so, yeah, I I hundreds of GitHub issues where I think I can show uh nice results um where people interact with the agents.

**17:25** · You might also wonder, yeah, how to avoid slop because you might think, okay, you have an agent uh spamming the whole internet with your GitHub issues.

**17:32** · Like, should you even do this? Again, I already talked about the win-win. Um, but a blog post that I highly recommend, if you want to avoid that your agent is just posting slop, is um the LLM Evils FAQ uh by Hamel Husain. Uh, I would say he's like the main expert when it comes to LLM evaluation.

**17:53** · He also has like a a paid course, but he also publishes a lot of stuff for free online including this blog post. So, I highly recommend to go through it if you want to learn more about how to evaluate your agents.

### Open models, agents over workflows, and evaluation

**18:06** · So, my conclusion would be um that open models are actually getting great, especially now with GLM 5.2. You have Deep Seek V4 and so on. So, um yeah, we we are able to now replace closed-source models by open ones.

**18:19** · Uh, for my use case, I would say agents are actually better than uh workflows.

**18:24** · Uh, they only need a single CLI, which is the Hugging Face CLI. They need a single skill, the Hugging Face CLI skill, and a sandbox, and that's all they need to do their work.

**18:32** · And finally, yeah, don't forget about evaluation.

**18:36** · Um Finally, uh I can also discuss some other efforts that we do as part of the community science uh team.

**18:44** · Um, very shortly. Um, so, I have a Twitter account that I created. It's called Daily Papers.

**18:51** · And it actually uses the exact same workflow as my agents behind the scenes to post interesting research papers on X.

**18:57** · It uh recently crossed 90,000 followers without any involvement of me. I just deployed this uh and it posts interesting research papers and artifacts from Hugging Face every 4 hours or every time someone uh releases something cool on the Hugging Face.

**19:14** · Um so, yeah.

**19:15** · And I have like Gemini determining the best visual to tweet or to include in the tweet. Like for example, this recent tweet where it tweeted out that Nvidia released an optimized version of GLM 5.2 got more than 2,000 likes. So, that's pretty cool to see.

**19:32** · And a final effort that I'm working on right now is a revival of Papers With Code, which is a website that once existed and then was acquired by Meta and then sadly it died. So, I'm I'm trying to re- revive it and making a research and state-of-the-art easier accessible. Um for now it lives at paperswithcode.co.

**19:54** · Uh so, yeah. You can find benchmarks over there. For example, for OCR models, all OCR benches like popular benchmark.

**20:01** · But I'm also making it an educational resource so that people can learn about technical terms like mixed training uh on policy distillation and so on.

**20:12** · So, yeah. That was it for my talk. I hope you learned something. Thanks all of you for your attention.

**20:18** · \[applause\]