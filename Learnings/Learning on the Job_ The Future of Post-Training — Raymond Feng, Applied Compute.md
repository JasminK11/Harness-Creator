---
title: "Learning on the Job: The Future of Post-Training — Raymond Feng, Applied Compute"
source: "https://www.youtube.com/watch?v=k35LeKZEhiE"
author:
  - "[[AI Engineer]]"
published: 2026-08-01
created: 2026-08-07
description: "The next step after a model ships is teaching it to keep learning on the job, and Raymond Feng lays out how Applied Compute trains custom models with reinforcement learning that plug into whatever har"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=k35LeKZEhiE)

The next step after a model ships is teaching it to keep learning on the job, and Raymond Feng lays out how Applied Compute trains custom models with reinforcement learning that plug into whatever harness an enterprise already runs. The setup is an orchestrator that fans interactions out to inference engines, collects the graded rollouts, and feeds a training engine that updates the weights, the same GRPO style loop used for RL today, but pointed at real multi turn, long horizon work rather than toy question and answer pairs. The promise is a model you deploy once that adapts to a specific company's tasks.  
  
The hard parts are all about the environment. Feng is candid about reward hacking, where a model learns to time out a tool or exploit a scoring gap instead of doing the task, and about the trouble of faithfully replicating a production environment so training reflects reality. He walks through why replaying real customer interactions is tempting but breaks on non replayability and off policy data, and where automated data pipelines and self evaluation might take this. The vision at the end is a model that learns from every interaction it has, treating each nook and cranny of the job as new training signal.  
  
Speaker info:  
\- https://x.com/raymondmfeng  
  
Timestamps:  
0:00 - Learning on the job  
0:39 - Custom models inside your harness  
2:37 - Deploy once and adapt  
2:49 - The RL training loop  
4:40 - Toward longer horizon tasks  
6:48 - Reward hacking in practice  
9:06 - Replicating production environments  
9:45 - Why replaying real traffic is hard  
11:57 - Non-replayability and off-policy data  
13:41 - Automated data pipelines  
15:24 - A model that learns every interaction

## Transcript

### Lernen im Arbeitsalltag

**0:12** · Yeah, thank you, Jack. Um, really grateful for the opportunity to speak here.

**0:16** · Today, I'm going to be sharing some of our frontier work on post training and how we envision a future where agents can learn new skills on the job.

**0:27** · So, over the last year or so, we've seen agents develop really strong reasoning skills.

**0:33** · And they've learned to use, uh, agentic harnesses to solve longer and longer horizon tasks, which involve many turns and tool calls on complicated environment states.

### Benutzerdefinierte Modelle im Rahmen Ihres Einsatzsystems

**0:46** · We're seeing an increasing, uh, demand for agents that can just be deployed in a plug-and-play way into how enterprises use the agents, um, so, for instance, if they already have some method of calling the agent to do a task, to do a task, they would want to be able to train a custom model to do that task instead.

**1:11** · And that requires new ways of looking at post training that allow you to, um, adapt to any harness, including ones that you don't necessarily have access to the source code of.

**1:25** · So, I wanted to talk about a few different levels of post training, where each one builds on top of the last.

**1:34** · One way that we kind of think of this, uh, is a framework comparing it to how humans do learning, where you learn simple tasks first, and you can sort of compound your understanding to more and more complicated tasks.

**1:48** · So, over the last year, we've sort of, I would say, mastered or gotten a lot of reps with these simple single-turn Q&amp;A tasks and um some longer horizon synthetic environment tasks.

**2:02** · But, what we're increasingly seeing is we want to be able to adapt to custom harnesses and be able to train directly on those instead. And we kind of think of those kind of like internships where you want to the model to do a specific task, but you don't necessarily know how exactly the task will play out because you don't own the harness.

**2:26** · And then finally, I would want to share some visions we have for the future of the custom model training space, where we think that there will be these kind of agentic citizens, which you can just deploy once, and they'll be able to adapt to many different types of out of distribution tasks and learn from their interactions.

### Einmal bereitstellen und anpassen

**2:47** · So first, I just want to talk about the training setup for these simple Q&amp;A tasks.

### Der RL-Trainingszyklus

**2:54** · We have something that looks like this, where you have an orchestrator, and the orchestrator is in charge of driving the rollouts.

**3:02** · The orchestrator holds a task back, which you can think of for now is just a simple prompt and answer. So, something like a math question and a corresponding numerical answer.

**3:13** · Um the orchestrator will send this prompt to a model and then get an answer back.

**3:17** · Then it will send the answer to a grader and have it be graded. So, once all of this is done, we want to improve our model based on that interaction or maybe like a batch of interactions. And the way we do that is through a training engine, which takes in the graded chats and produces a weight update.

**3:35** · That weight update is then synced to some inference engines. And once those inference engines are updated, then we can start this entire process over again, where the orchestrator will have like new problems to um send to the model completion endpoint, and then you'll be able to get more chats, grade them, and train again.

**3:56** · The key thing to note here is that the only thing you need for improving your model is the graded chats in some format, and once you have those, the training engine can compute weight updates to improve your model.

**4:11** · Uh what's important here is that the chats are in a very specific format because we're sort of constraining everything to be inside of our training stack. So, in this simple setup for Q&amp;A, you don't have anything living outside of the training stack. You You basically have the code of how to run the rollout and how everything is formatted, so it's like in a very controlled environment.

**4:34** · However, this is kind of limited because we can only kind of do single-turn tasks in this way. If we want to do longer and long-horizon tasks, and we want to build like higher-order skills into our models, we need to also increase the complexity of our environment. So, with synthetic environments, we have a very similar setup, but we offload a lot of the environment state um outside of the training stack.

### Aufgaben mit längerem Zeithorizont

**4:59** · So, you still have the same orchestrator um from before, but um the task back is maybe a little bit more complicated, and the environment state is uh living outside of the training stack. So, the task back might now include things like tool cost specs or like maybe an initial state for your environment, like a file system.

**5:23** · And the orchestrator is now in charge of running many turns in a in series, where maybe first they ask the model for how it wants to respond, and then if the model wants to call some tools, it'll then call the sandbox to actually like modify the environment state or read the environment state, and then return those results back to the model.

**5:43** · After all that is said and done, you get a full task trace out of this, um, and that task trace is then sent to a grader for grading.

**5:51** · And very similar to what we had before, you'll be able to take the graded chats, you'll be able to then use them to do a weight update.

**6:01** · The main thing to highlight here is that this orchestrator and sandbox setup is replayable, which is basically just saying that for any specific prompt, you can always like roll back to the initial state and like rerun it. Um, you can do that in parallel or you can do that in series.

**6:16** · But, the reason that's important is because the main sort of method that we use for reinforcement learning today is GRPO, and that involves comparing many rollouts for the same prompt, and then comparing like relatively which one is better than the other. And the training engine will then up like make an edit to the model to upweight the trajectories that were more successful, and then downweight the ones that were less successful.

### Belohnungs-Hacking in der Praxis

**6:48** · So, some challenges that we face in this setup is that the environment is something that you want to basically, uh, use to replicate reality, so that after you're done training, like the improvements that you've seen actually translate to when you deploy these models into production. And the main sort of problem is like has kind of two names, which are both the same problem, environment fidelity and reward hacking.

**7:15** · Essentially, the agent is exposed to an environment and sort of any, uh, any quirks of your environment will end up being something that your agent may like learn a model of. So, we have some examples that we've seen where in a trading run in the past, we had some like networking issues causing our environment to have tool calls that failed maybe around 10% of the time.

**7:40** · If that is the case, then we actually saw that the model would then start outputting shorter and shorter responses. Now, this was really surprising to us because in our reward function, we actually didn't have any length penalty. So, like we we couldn't really tell why this was happening, but really what's going on here is if you think about maybe the model is like a human like walking along a sidewalk and like the tool call

**8:04** · failures are like potholes in the sidewalk, like it makes a lot of sense that because there's so many potholes, the model doesn't want to run for that long uh because it might fall in a pothole and then get a zero reward for the rollout.

**8:16** · Um and then conversely, um it's also possible that your model just learns to like output more and more gibberish over time depending on like what your environment looks like. So, in a different case, we had a training run where we um have sandbox timeouts uh just so that they don't run forever, and we usually like filter out the rollouts that timed out from being trained on.

**8:39** · One thing we saw was that if your tool calls take a long time, then if the model feels like the problem is really hard, it will actually just be incentivized to like abuse the tool calls and just like call a lot of them in quick succession and try to time out the sandbox so it avoids getting a reward of zero. It just gets the rollout dropped.

**9:00** · So, as we scale to like more and more complicated tasks, the the task of like replicating these environments becomes increasingly difficult because it's very, very difficult to like perfectly simulate reality and sort of any mistake that you make, even if it's not intentional, will end up inducing these like subtle undesirable behaviors in your model.

### Produktionsumgebungen replizieren

**9:23** · So, that brings us to our next topic of bring your own harness, where we're basically asking like if the agent learns the exact environment distribution, why don't we just use that for our training? Like just directly the real environment, you will no longer need to uh replicate anything. You can just like use exactly how it's going to be used in production.

### Warum das Wiedergeben von realem Datenverkehr schwierig ist

**9:45** · This solves a lot of problems and sounds really good.

**9:49** · The architecture looks something like this where we now have almost everything outside of our training stack. The only thing we have left is the model completion endpoint and some way to uh record the requests and responses that go in and out of the model.

**10:03** · Everything else kind of lives outside of the training stack and can be run in whatever fashion uh that like an existing enterprise or like customer might be using. So, these would be like existing enterprise harnesses and essentially the reason this is nice is because we can meet customers where they're at.

**10:24** · Like, if they're already using the model in a certain way, we can just take our like training methodology and just like plug it right in and then we can help them improve the model for like exactly the way that they're using it.

**10:37** · So, all the orchestration loops and logic will now live outside of the training stack.

**10:43** · Now, this sounds really good, but um This sounds really good, but the challenge here is in The challenge here is in the like data where

**11:00** · I as you're deploying this into uh production and you have less and less control over how the rollouts uh play out, you also have like less signal to learn from because the data is not in like a familiar format.

**11:18** · And this topic is touched on in a related work by Nvidia. Uh this is like a paper from around a month ago where they introduce uh Polar, which is essentially a way to think about transitioning from a harness where you are kind of in charge of micro managing every aspect of the rollouts, kind of like what we were previously talking about. And transitioning to some method of just uh listening in on a black box harness, and you would no longer know exactly what the logic in here is.

**11:51** · So, some challenges is that some challenges we face in this setting are non-re-playability and offline or off-policy data. I think both of these are describing the same issue, which is just that because we've moved so much of the logic outside of our training stock, we just don't have any way of like enforcing invariants or like data structures that we like. We have to be more flexible about the way we do training, and because of that, it just becomes harder to train your model and it may create an update.

### Nicht wiederholbare und nicht richtlinienkonforme Daten

**12:21** · So, an example would be for GRPO, which is like the traditional method, you would want to have many rollouts in parallel for your task, and that may not be possible anymore. If you think about um suppose like a customer chat customer support chat, and you have a record of how one of your chats went, there's not really a way that you could then go back and think, "Oh, if I like said or if I responded in this other way, like would the user have been happier?"

**12:51** · Like there's no way to then get the user's response again.

**12:56** · But, we're optimistic because like we think that humans can do this kind of learning, and so it should be possible to like formulate some kind of method that would work for models as well.

**13:06** · Like, if a human was in a customer support chat, they could understand somehow that like based on the customer's reaction, like what they said was wrong or what they said was good, and then be able to like internalize improvements uh for for the future.

**13:22** · So, I want to talk about some of the frontier research directions we have um towards like solving this problem.

**13:28** · There's kind of three main topics, which are self-distillation, automated data pipelines, and qualitative feedback ingestion. Self-distillation is a pretty new technique, which is still um, I would say relatively like narrowly scoped. So, we've seen successes in inducing like specific new behaviors with models, but it's it's still an open uh, research question of like how general can we push it?

### Automatisierte Datenpipelines

**13:55** · Automated data pipelines is an idea which maybe if you take like a big batch of traces, um, you would be able to like automatically like flag undesirable behaviors or failure modes, and then be able to like put together a like nice batch of training data, um, automatically, and then send that to the model and help it improve.

**14:17** · Currently, this is like pretty manual or like human in the loop, where like we go through traces ourselves, and we're like looking for looking for these failure modes manually, and then like describing how we can improve the model, and then um, looking curating those data sets ourselves. And then finally, I I think an interesting direction is qualitative feedback ingestion. So, as you move to these like production settings, sometimes you don't have access to like a clear-cut binary grade or like a numerical grade.

**14:45** · Um, often times, what you receive back is like, "Hey, for this chat, the customer had this like piece of feedback." Um, if we can find a way to update our models based on that information, uh, that would also be prove extremely helpful. Um, and in fact, like self-distillation is one way in which we're exploring how we can do that, but it's like a pretty um, it's still a pretty open question.

**15:16** · And then finally, I wanted to share a little bit about a vision for what the future of post-editing might look like if we sort of extrapolate out and take this sort of progression to its end.

### Ein Modell, das aus jeder Interaktion lernt

**15:29** · I think eventually we might reach a setting where instead of just limiting ourselves to thinking about a specific task that we can improve the model on, we can actually just think of the model as this one deployment that can interact in many, many different settings. And like the task that you think about might just be the task of improving yourself on everything.

**15:51** · Um and this model may be used for all sorts of different tasks, maybe across different users as well.

**15:58** · And be able to sort of do some kind of reflection or introspection on like okay, for this sort of type of interaction, here's how I like self-evaluate and think that I'm doing. And then for this other type of interaction, um here's how I think I'm doing. And then being able to automatically take these interactions and compute weight updates from them and improve.

**16:27** · And so, yeah, going back to the point that the agent learns every nook and cranny in your environment, um the exact environmental distribution, what if like the environment was just like every interaction that the agent ever has? And then in addition, we had some way that the model could evaluate itself.

**16:44** · Um basically one one like question that we've Or sorry, one challenge that we've seen is like if you're only focusing on like what improving on one task at a time or like flagging one failure mode at a time, you're kind of playing a game of Whac-A-Mole where as soon as a new thing pops up, you need to scramble and like create new data or new environments and improve the model that way.

**17:11** · With this kind of like self-improving system that understands interactions from like understands every interaction from the environment you would like kind of get around this problem and you wouldn't need to worry about it anymore.

**17:28** · So I want to leave people on this quote from a paper on a year ago which I find extremely relevant now which is that AI is at the cusp of a new period in which experience will become the dominant medium of improvement and ultimately dwarf the scale of human data used in today's systems.

**17:51** · And yeah.

**17:52** · If you all have any questions I'm happy to take them after and uh Yeah, you can also email me at that address.

**18:00** · Thank you.

**18:02** · \[applause\] \[music\]