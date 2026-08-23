---
title: "Modern Post-Training: A Deep Dive  — Will Brown, Prime Intellect"
source: "https://www.youtube.com/watch?v=V-EDrhIhHzQ"
author:
  - "[[AI Engineer]]"
published: 2026-07-13
created: 2026-08-23
description: "Deep dive into Prime Intellect's open-source ecosystem of post-training tools, including the verifiers and prime-rl libraries, as well as the Lab platform for self-serve training and inference.Speak"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=V-EDrhIhHzQ)

Deep dive into Prime Intellect's open-source ecosystem of post-training tools, including the verifiers and prime-rl libraries, as well as the Lab platform for self-serve training and inference.  
  
Speaker:  
Will Brown — Research Lead, Prime Intellect  
  
Will Brown leads Applied Research at Prime Intellect and builds open research infrastructure to enable every company to train, deploy, and self-improve their own frontier agentic models. He holds a PhD in Computer Science from Columbia University.  
  
X: https://x.com/willccbb  
LinkedIn: https://www.linkedin.com/in/willcb/  
GitHub: https://github.com/willccbb  
Website: https://willcb.com  
  
TImestamps  
0:00 Introduction and Overview of Prime Intellect  
4:20 Defining the Environment in Post-Training  
9:33 Decomposing Environments: Tasks, Harnesses, and Runtimes  
12:46 Verifiers V1: The New Modular Pattern  
17:46 Rewards, Metrics, and Group-Level Rewards  
20:25 Tooling, User Simulators, and MCP Integration  
22:00 The Interception Server Pattern  
24:13 Trace Graphs and Handling Tokenization  
25:35 The Renderers Library for Chat Templates  
29:20 Primaril: Asynchronous Reinforcement Learning  
38:02 Customizing Training Algorithms and Losses  
42:35 The Lab Platform and Hosted Training

## Transcript

### Introduction and Overview of Prime Intellect

**0:12** · Hey guys, how's it going? Thanks for showing up. This was a little bit of a last-minute assembly. I know a few days ago I was like talking to Swix. I was like, "Hey, can I still do a workshop?" And he was like, "We have one slot left. It's Monday at 4:30." And I was like, "I'll take it."

**0:26** · Um and uh then yeah, um I wanted to kind of just do a bit of an update on uh some of the stuff we've been building at Primed and Loaded. So, if you don't uh know me, hi. I'm Will Brown. I lead applied research at Primed and Loaded.

**0:39** · Uh we do a lot of stuff around uh every part of the kind of AI research infrastructure stack. Uh today is going to be about post-training, which is where I spend a lot of my time thinking and building. Um and especially want to be talking about uh the post-training tools that we build uh that are fully open source, uh the verifiers and Primed RL libraries, uh which kind of go hand in hand um both on the environment side and the training infra side.

**0:59** · Um and show \[clears throat\] off some things we've been cooking over the past few months that I think is uh kind of the way that things have evolved as the agent use cases have gotten more complex, but also kind of clearer in terms of what people want out of agents and the sorts of things that are needed to like do the sort of post-training that is needed to uh power like the real-world applications people are building nowadays.

**1:21** · And so, broadly at Primed and Loaded, we are our goal is to make doing large-scale open-source AI research easier and to enable companies to train their own models and deploy them and have them improve based on the scenarios that they actually see in production in terms of use cases for applications and products and internal tasks and workflows. Um and to give people an option to not just use the open-source models that are getting quite good, but to take them and make them even better on their own use cases.

**1:52** · Um and so, we use the phrase the open superintelligence stack to describe what we mean by this. And I think when we said this phrase like a year ago, it felt a little more like marketing and now it feels a little bit more like, oh, yeah, that's that's kind of what it is.

**2:06** · Like the models are getting very, very good. They are superhuman in many ways at lots of things.

**2:11** · Um and what we want to do is give people an open toolkit that they can use to do real training with them.

**2:19** · \[clears throat\] And to have the control that they need to deploy it where they need to deploy it and customize it as much as they need to to kind of get the job done. And so this is the stack that we built. And it all kind of sits on top of compute. So we operate a global marketplace of data centers around the world. A lot of these are like quite large data centers. We currently operate over 10,000 GPUs.

**2:40** · Many in like hundreds or thousands within a cluster. We have our primary training framework.

**2:45** · We have environments built with the Verifiers library and our environments hub platform. We have our platform for research workflows that we're now calling lab, which is an assembly of many pieces including the environments hub, hosted training evaluations, as well as inference and sandboxes. And all of this is in service of empowering and unlocking frontier model training. And so we do this ourselves. We have our intellect model series with some exciting things there coming soon.

**3:11** · And we also train models with our customers where we have lots of people we work with who their goal is to do large scale model training on their own workflows. And so to do all of this, we need to give people the tools they can assemble into the the the pipelines, the workflows, the research that allows them to actually get the results that they need at scale with everything they need to do it.

**3:31** · And so this talk is going to be about going deep into Verifiers and Primary L and showing off some of these new things, but all under the umbrella of what does modern post training look like? What does it mean to kind of take a model and train it to be better at your task? What are all the parts? What are all the kind of gotchas?

**3:48** · And how do you orchestrate this into a system that is actually easy for people to use without needing to go build a massive research team and to be able to kind of have it be accessible in the sorts of things that anyone who's an AI engineer at any like startup or enterprise that wants to invest in post-training can actually do.

**4:05** · And so there's a cookbook repo that is that's kind of like an alpha release right now. It's still changing a bit, but it's a preview of kind of all the stuff we've been building over the past several months. And so today we'll be kind of following along that framing a good bit. And so I think the first thing we'll talk about is just kind of what is an environment.

### Defining the Environment in Post-Training

**4:23** · People talk about environment in the context of RL and they think of like RL environments, but environments are more than just for RL. They're for all sorts of things in post-training and evaluation.

**4:32** · We're going to talk about what we're going to call the the V1 version of the Verifiers library, which is a full overhaul. Everything else still from before still works, but we're kind of we kind of wanted to redo it all. And so we have a new way of doing everything that we think is going to make a lot more sense, be a lot more powerful for what people are looking to do going forward.

**4:47** · As well as kind of talk about how Primer RL has evolved as a library. And so Primer RL is our like full-stack open-source training framework to support asynchronous reinforcement learning.

**4:57** · And we've got a lot of fun new bells and whistles to show off in terms of both scale and features. A lot of this is in service of custom algorithms. So making it much easier to do the kinds of things that people are interested in for modern post-training.

**5:10** · If you have been following the news on on policy distillation or self-distillation or all these other fun new algorithms that people are coming out with. It is the the age of research indeed. And we don't want to just like train small models. We want to train big models. We want to train them really efficiently because as models get bigger, the compute starts adding up.

**5:29** · And if you want to make this accessible to people, especially if you want to be able to iterate on it, it has to be fast. It has to be cheap. It has to be affordable and reliable. And all of these kind of funnel into our lab platform. We'll talk about both some of the things that we've already released there as well as some things that are coming soon.

**5:46** · And so the post-training loop in my mind kind of revolves around environments in the sense of environments are a language for specifying what you want your model to do.

**5:57** · Um, they are an encapsulation of the data you might have, the scenario you might want your agent to be in, uh, the way it'll interact with that environment, uh, as well as how to to score what good looks like, to determine what was good and bad. Um, and often this is the first thing you want to do with an environment is just evals.

**6:17** · And so I think a lot of people are maybe nervous about getting into post-training. They're like, "Oh, it seems like a lot of work. There's a whole new tool chain. Um, what if I'm already using like the frontier models and I want good results out of them, uh, or I'm getting good results out of them, or I want to like see what I can do at the harness level first or prompt optimization." And that's all good. Like we're not necessarily asking people to just like throw everything away. I think in many cases what people will find and what we see with our customers is that um, the systems that work best for them involve using both.

**6:44** · And you kind of want to be able to make these decisions about what is the right where is the right place to train, uh, where's the right place to use a frontier model that is available via some API. Um, and so evaluations are kind of very key to this. And so like evals are the thing that opens the door to post-training. And so environments and evals are essentially the same thing. Um, but once you have evals, now this is the same kind of unit of, uh, like logic that you actually need to do post-training anyways.

**7:11** · And so, uh, building evals is like just good for your product hygiene no matter what you're doing. If you want to kind of decide whether to use GPT or Claude, or decide do you need Opus or uh, Sonnet or Mythos for a task. Like if you want to min-max on like intelligence versus dollars, um, evals are a very good way to do this. But evals also then unlock this this flywheel. And in terms of modern post-training, I think historically people have done SFT then RL as like the main uh, frontier model recipe, although on policy distillation has certainly found its way into a lot of workflows.

**7:42** · Um, and I think some people are also very eager about algorithms like self-distillation. We can talk a bit about that and when it makes sense and when it doesn't, but uh, in particular one area where it does make sense to do like the whole on-policy distillation thing is when you're training experts where you have multiple different things you want your model to be good at, and people have found that if you have a bunch of different environments that are all different things, and you want to have one model be really good at them, a nice way to do this is train individual RL experts on top of the same base model and then do distillation from those teachers into the same uh, checkpoint.

**8:14** · Uh, that just generally ends up being more reliable.

**8:16** · Um, and then once you have this, you want to deploy the trained model, which could be a full uh, base model with a full weight training, or it could be a Lora adapter, and you want to serve this at scale, and ultimately what is useful about this whole process is it's not just a thing you do once. Like I think some people also say like, "Oh, why should I do post-training if the the frontier models are going to get better?" Well, your model should get better, too. Like it's not it like everything's going to get better. Uh, the point of this is to have flywheels that make everything get better.

**8:41** · And so what you really want is to be able to not just post-train like today, but to be able to uh, have this iterative process of model refinement, and the sort of thing where you can kind of have the training compute end up be a pretty small fraction of your overall inference budget that you amortize out such that your model is always getting better and better um, as you are getting more signal from the real world. And getting this signal from the real world isn't trivial. Like that's kind of largely an open question as to like how you go about um, getting information from real world feedback into your environments.

**9:12** · It's an engineering problem, it's a research problem, but it's the sort of thing we're all here at this conference to kind of think about and learn about. And so I'll I'll touch on that a little bit uh, in the talk as to kind of how we we think about this. But but really the goal is going to be thinking about what do these tools look like? How do you actually do this? What are the parts?

**9:30** · Um, and how do we build it?

**9:31** · Um, and so environments as evals, uh, Uh, what is an environment? Um, I think it's useful to decompose environments into tasks and a harness.

### Decomposing Environments: Tasks, Harnesses, and Runtimes

**9:42** · Um, and this is foreshadowing some of the the refactoring we've done in verifiers over the past months. Uh, if any of you have used the verifiers library before, you may be familiar with the the multi-turn environment pattern or tool environment pattern where there's kind of one loop that is owned by the environment that you can plug in various tools into and that was really great for a very long time for getting started for people, especially back in the day when people were mostly just trying to graduate from single turn into multi-turn tool tool use.

**10:07** · Uh, but what we found and as we kind of iterated on different patterns and extended it in various different ways, we found ourselves repeating a lot of work of like adding patterns for a CLI agent or adding patterns for MCP. Um, and we wanted to be able to like step back and rethink like how should an environment work. Um, and what it really is there's a notion of a harness. And so and you there's also a notion of a task.

**10:31** · And I think one of the reasons that this is kind of subtle and tricky and was a a design problem that we went over many iterations over the past 6 months really is um, certain things it's not clear where they live. Like there's certain things that might belong to the harness and might belong to the task. There's certain tools that uh, in some cases it's I want this uh, task I'm going to do to use a certain tool. In some case the harness has certain tools. Same with skills or system prompts or many other pieces of the puzzle in assembling like the full world that your agent is going to be operating in or your model is going to be operating in.

**11:01** · Um, but ultimately the we're going to call all of these parts of the environment. Um, and the goal of this is to have some notion of verification where you plug in a model uh, into the environment which includes a harness. You give it a task. It does a rollout and then you verify what it did.

**11:18** · Um, and this same process works both for evaluation offline just understanding which model is better as well as for doing reinforcement learning RL uh, as well as for generating data for SFT. Uh, I think in many cases people think of SFT is this thing where they want to like upload a data set, but really often what they're doing there is they're essentially cobbling together something that's essentially an environment and they're doing rollouts in it and saving it offline and putting it in one format and uploading it and then changing it to another format and then plugging it into a trainer.

**11:48** · And the way we've kind of approached this is saying, "Well, you can just kind of cut all that out and just like treat it like a a a problem where you're doing rollouts in an environment. Just in this case there's a teacher." And the teacher could be another it could be replaying from another data set. But ultimately it's about collecting rollouts and training on those rollouts.

**12:07** · And then on policy distillation again takes the same form where you are doing rollouts in an environment just as you would for RL, but the scoring is from a teacher and the the log probs of the teacher the likelihood of the teacher rather than the the reward signal itself. And so these all in our framework are Python packages. So you can have any task as you want. You can pull data from anywhere you want.

**12:31** · There's a lot of flexibility that we've unlocked in terms of what these tasks can look like, what these harnesses can look like. And our goal is to just make this a really flexible toolkit for all the kinds of evaluation things people want to do both for API models as well as for post training.

**12:45** · And so Verifiers V1 is what we're calling it, which is it's not actually released as V1 yet, but we took inspiration from VLUM doing this and decided that we were going to kind of have this be the new pattern that we want to have everything kind of be centered around. And the key pieces we broke things down into were a task set, a harness, and a runtime. And so these are all composable. You can mix and match them and they're all individually loadable in different ways.

### Verifiers V1: The New Modular Pattern

**13:16** · But the way to think about it is that task sets are the data and the rules of what should be done that are agent agnostic. So they're the sort of thing you could plug an agent into.

**13:28** · Um and we wanted to take a very general approach in supporting a lot of the great work being done throughout the ecosystem. So, we integrate natively with Hugging Face datasets, with Harbor, uh with NeMo Gym and Open Ended. And most other tools that you see out in the wild that are kind of under the umbrella of uh an RL environment, we would call these a task set.

**13:47** · Um we generally have found that it's useful to have these be harness agnostic where they represent the the back end of the server or some state that you're interacting with, but they don't own everything about what the model is doing. And so, it doesn't In some cases, it doesn't make sense to plug a model into a task set. Especially because we're kind of gravitating towards an agent world where everything is running in a terminal or it has skills or it uh is using CLI tools. Um and these things like often look more complex than just basic loops.

**14:18** · Um but we also want to support basic loops.

**14:21** · So, we want to kind of allow both the old way of doing things and the new way of doing things. And so, uh everything that was the old way is now the default harness where it's system prompt and tools in a loop. Um but the harness pattern also supports much more flexible execution of things like recursive language models or CLI agents like Codex, Cloud Code, Open Code, or classics from the research literature like Mini Sweep Agent or building your own with arbitrary Python libraries like LangChain or DSPy. Um and so, we've been able to decouple these into a pattern where you get to write your harness independently of your task set.

**14:52** · Uh there are kind of some basic sanity checks about properties that like harnesses either do or don't support and task sets do or don't require. Uh and these kind of click together. And the runtime is where this executes. And so, we've uh still been embracing a lot of the async IO patterns from before, but we've leaned a little more into having things be subprocesses uh where you can still run everything locally. You don't have to use sandboxes, but you can use local Docker, or you can use our own Prime sandboxes layer.

**15:21** · You can use any other sandbox layer you'd like or kind of build from scratch. And so the harness the runtime back end just is a place where the harness can run its code. And so the harness just needs to be able to run code somewhere as a script essentially.

**15:37** · We've used a lot of the UV tooling where UV script is a very powerful pattern to be able to kind of mix and match and kind of contain dependencies. But what happens is once you plug these together, you run a rollout on a task from a task set and you get a trace.

**15:51** · This is live on the verifiers main branch for prim and elect AI / verifiers on GitHub as well as it's released as a dev release. The stable main release will be kind of coming to PyPI any minute now, but you can install the dev and play around with it if you want. And so what do these look like? So tasks are just like a row of a data set.

**16:09** · And the very basic version of it is you just start loading a data set from hugging face or anywhere else. And so the new pattern here is from verifiers V1 I just to keep the old stuff separate. The old stuff still works just fine, but this is how we have been able to kind of decouple and iterate on the new version. As well as we've really embraced this decorator pattern.

**16:30** · We found it to be very useful. We also if you were a rubric fan, we killed rubric. Didn't make sense anymore if you were using old verifiers rubric patterns. But still it's you have functions and loaders.

**16:43** · We are very heavy on PyDantic so everything is super typed. We have lots of powerful config features where you can have everything in a toml file. You can override it in the CLI and everything is kind of clean and guaranteed to kind of type check at like validation time rather than waiting for something to fail later down the road.

**17:00** · And so examples of this are things like sweet wrapper where you can do a genetic code search. You can do the classic games like Wordle. You can do search over documents with judges. You can do complex things like harbor that support a lot of popular benchmarks now that need agents running in a terminal.

**17:16** · And all of these are going to be combinations of the the the task that pattern with uh pick your own runtime and pick your own harness.

**17:24** · Um and so rewards and metrics I think are also kind of uh just functions that take in the kind of records uh of what's happening in a rollout and return numbers. Uh so rewards are the main thing that'll drive progress in RL. Um metrics are just kind of like logging uh what has happened. So counting tool use and counting errors. Um these sorts of things are very useful to be able to expose in your dashboards. Um and then group rewards.

### Rewards, Metrics, and Group-Level Rewards

**17:46** · I think this is something that we have fought hard to kind of make sure still is first class because we see it as very important to um a lot of the research pattern people want to do, but I think it's also ignored in a lot of like uh tooling out there. Where in in many RL frameworks it's actually quite hard to do group rewards because things are very decoupled and things kind of assume that all rollouts are going to live independently and that they don't need to talk to each other.

**18:08** · But there's a lot of things where you really want to do pairwise judging or you want to do ranking or you want to give a bonus to the uh the shortest correct answer uh in terms of tokens used. Um and so these sorts of things are really flexible uh in terms of the we really design for flexibility in supporting the the things that we see as like the most exciting papers we've read or all the algorithms that we think people may want to innovate on um while still allowing people to have like the core primitives that they kind of expect out of an RL framework.

**18:38** · Um and so like in group rewards, I think this concise this pattern is one that I find very useful a lot. I think um like a big pattern that comes up a lot are doing post-training is uh models will love to like think and think and think if you let them. Um and if you don't give them some kind of pressure to like be more efficient, uh I think a lot of people will notice that like open models often have really really long chains of thought. Because on one hand it's like this is a useful strategy for a model, but it's also the sort of thing that will grow like out of control if you don't counteract it.

**19:09** · Um and so in reward design like one of the big things people will want to do is uh something like a length penalty um or a conciseness bonus. Um, and so one of the reasons this is tricky is because you don't know the optimal length for a problem. Like if I give you a math problem, I could say, "Oh, solve it in less than N tokens." But also like who knows what the right N is. It's also going to change as the model gets smarter over time. It's going to be different for every problem. And so you kind of can't know this up front. And the only way you can do it is take advantage of variance.

**19:39** · So one of the nice things about RL is you have multiple samples typically. Um, and this allows you to use the fact that you have multiple samples to shape the reward. Um, and so if you have multiple rewards in a group, what you could do is uh look at all the ones that were the correct answer or just all the ones in general and give a bonus to the ones that are the most concise. Where if you also have a uh a correctness reward like these are going to uh ensure that um you're both incentivizing correctness as well as incentivizing efficiency.

**20:08** · And so juggling multiple objectives simultaneously is kind of one of the hard challenges in RL in reward design. Um, but doing things like group level comparisons and kind of these sorts of bonuses are are quite useful in many cases.

**20:24** · Um, I also want to talk about like tools and user simulators, which I think have been uh becoming more important uh in a lot of complex applications where you have models that are In many cases there's like a core agent harness, but there's also In many cases you are putting a model in a setting where it's going to be in some task where a user is giving it additional tools. Whether these are In some cases you might want to model these as skills. In some cases you might want to model them as MCP servers. We use MCP as a kind of uh a back-end framework um that can interact with the runtime uh both for tools and for user simulators.

### Tooling, User Simulators, and MCP Integration

**20:54** · So user simulators, especially if you want to do training where there's a a user in the loop, um you don't want just your agent to go do some task, but you want to be able to do some task that involves understanding how a user will interact. You can essentially have this user be an MCP as well where we make it so the model sees it as a user, not as a tool. Um but behind the scenes, it is a server that has some script or something and it has some LLM that is going to get some context and it's going to be able to be like a user in the context of a rollout.

**21:24** · Uh in many cases, benchmarks have found that this is very useful for simulating the realism of like having a multi-turn setting where there are users in the loop, especially given that people are building products now where there are these users in the loop. And so you want kind of a first-class way to incorporate this into um your uh your RL environments. And so we've found that it's useful to have all of these things be kind of modular and pluggable. And so the harness can connect to each of these which run as a as a UV script.

**21:49** · Um we also have UV script support for grading in addition to the basic reward function patterns. Um and we also are using this idea called an interception server. So the harness, we want people to be able to use real harnesses and not have to like break the harness and like retrofit it into like an RL harness. And so ideally, we don't know anything about the harness code.

### The Interception Server Pattern

**22:11** · And so the pattern that we use with the interception server is that um we are responsible for giving each harness rollout a fake base URL, which could be OpenAI compatible or Anthropic compatible. And the harness just thinks it's talking to some endpoint. So any harness that can just talk to some endpoint, we're good to go. And then we intercept each request. Uh we can do some some back-end maneuvering to make sure that we're getting the log probs and setting the right temperature. Um and then we send this to our uh inference server for with the RL trainer. Uh and then as it completes, we send back the request.

**22:43** · And so the the harness doesn't know that it's doing RL. The harness just is a harness running as if it would be running in a real-world environment. And so you can kind of very easily move between the RL setting and the deployment setting where your harness is just code. Doesn't need to be anything specialized to verifiers or RL.

**23:00** · We also have found it really easy useful to be able to kind of go from this like local to global and like have this hot swap pattern. Um so we have this new like uh eval CLI where um you can just like choose the harness you want. You can have a task set where you're going to say I'm going to run an eval on this set of tasks. Okay, I want to use recursive language models and RLMs. I want to use Codex. I want to run it locally. I want to run it in sandboxes. Uh I want to run it in Docker. These are all just like interchangeable.

**23:26** · Um and so we found that this is super useful in the iteration loop as you go from testing something out at a small scale towards scaling it up towards being able to understand questions like what's the best harness for this model? Um does this harness generalize across tasks? Um as well as being able to both have the convenience of like local prototyping where you can kind of run things fast on your MacBook um without having to like wait for a cloud job to finish, but also you can like go right to the cloud when you need to.

**23:53** · And so there's been a lot of fun patterns we've had to kind of innovate on um as we've done this overhaul. And we we're quite happy with how it's turned out. It's made our lives a lot easier for both client projects and research and just uh being able to have have a lot more flexibility and power and control over the the kinds of agents we want to be training.

**24:12** · Um and so one of the fun things behind the scenes uh is what we call the trace graph. And so we had kind of been having this grow out of control in terms of the old way of doing things and we decided this was another opportunity to like really overhaul our system to like have really good support for sub agents and parallel branching trees while also still preserving the kind of linear sequential dependencies that you need for RL with uh careful token control. Um and so here uh there's a a notion of a of branches that are kind of like at the message level.

### Trace Graphs and Handling Tokenization

**24:43** · So conceptually um the things that matter logically in environment space and in harness space are messages which are just text. Uh the harnesses don't think about tokens, uh but if you've done any RL experimentation you may have uh encountered issues where uh re-tokenization or like some messages if a model will say something and you turn it into text and you put it back through tokenizer, it can change a little bit.

**25:05** · That because tokenization isn't is many to one. And so this causes lots of very subtle numerical problems, especially late in large scale training runs. And so you want a really nice back and forth between uh messages and tokens. And so the trace data structure that we created here partly is to enable this where we can store things both at trace level and then map them back into token level in the right sequences as needed.

**25:31** · And we also released a library called renderers recently, which is a standalone toolkit that anyone can use that we have found the sort of thing that we're working with some of the inference tooling to support. So renderers are really all about like essentially rethinking tokenizers and chat templates where behind the scenes it's just making calls to the tokenizer, but chat templates if people have spent time debugging with them, it sucks. Ginger is awful.

### The Renderers Library for Chat Templates

**26:01** · It's very very painful and there's so many subtle things that we kept running into where like a model would sometimes have an extra new line and the chat template would strip it out and this would like cause a mismatch in your trainer and inference that would either force you to go off policy because you now have a trainer and inference mismatch or it would cause a logical branch where a thing that is a branch in like uh it becomes a branch in token space even though it shouldn't be in logic space because of tokenizer subtleties.

**26:30** · And so renderers as as an abstraction it was kind of pioneered by OpenAI's harmony with the GPT- OSS release and used prominently in thinking machines cookbooks as well for tinker, but we found it was useful to just kind of make it a standalone thing. And so this is just a Python library that doesn't depend on any other prime stuff.

**26:47** · You could use it with any inference engine you want just as a standalone thing that is really designed for being able to manage this token in token out concatenation without thinking about it too much yourself because we kind of turn each of these chat templates for these the popular models into programmable artifacts where you can do things like look up a history of secret you can use the kind of history of a trace to be able to understand like what is the right tokenization?

**27:17** · Like do I essentially have like a logical prefix hit in message space even if I don't in tokenization space after re-tokenizing?

**27:25** · And so this is the sort of thing where I think people have gone back and forth on like whether they want LM APIs to be stateful in general. I think a lot of people were hoping that like we could just have every model API be stateless. I think maybe people are less concerned about this now because we're moving towards this agent world where agents themselves are going to be stateful APIs.

**27:45** · But I think this has revealed to us like going through all of the the things here like why opening eye responses decided to be stateful. There are some kind of like unavoidable issues that kind of come up when you're doing large-scale agentic rollouts where you you do need to kind of manage this very carefully and it's kind of unavoidable just because of how tokenizers work.

**28:07** · And so you want to be able to maintain these dual streams of the logical text and the the tokens and you kind of want these to be cleanly interoperable where users don't have to think about the tokens very much but the trainer gets to see everything nicely in token space as well as the inference engine.

**28:22** · Um, and so from the harness interception server we have clients that can be used both for training and inference. And so you can kind of like swap between these modes without thinking about it because certain models like don't need to in in a training setting you need to be able to get log probs and set the temperature. Some model APIs won't let you do this. They won't return log probs because like open eye models with reasoning like won't show you the reasoning trace so there's no way they give you the log probs for everything.

**28:48** · And so like that's fine, it's just eval only and so we have this this client layer where you can go between eval and train to be able to support all these models, but we still use the interception server pattern either way because it allows us to have like this notion of a dialect where like you can choose OpenAI chat completions or responses or Anthropic and all of these are kind of easily supportable as just like translation layers between a raw request into something that'll get passed through a renderer potentially if you're on the train client side and formatted into a a message via tokens.

**29:18** · Um And so this brings us to Primer RL. So Primer RL is our training framework that is consumes the environment. So once you have an environment with your task set and your harness and your interception server and your runtime and your renderer and all those things, this plugs into what we call the orchestrator.

### Primaril: Asynchronous Reinforcement Learning

**29:34** · And so Primer RL has been async from the ground up. Uh so I think async RL is one of those things that I think people were kind of one foot in and one foot out and a lot of training frameworks you see them uh will still kind of support synchronous training. Um some people I think have their reasons for wanting to do synchronous training. I don't agree with them.

**29:52** · Um I think kind of want to bite the bullet of the off-policyness anyways for reasons that come up with agents um in terms of you want to be able to overlap long rollouts and not always be waiting on your slowest rollout. And this kind of means you can't be fully on policy unless you want to kind of accept always waiting on your slowest rollout.

**30:11** · Um and so this is really why we went all in on async. And so the orchestrator's job is to allow the inference and trainer to just be separate processes, separate servers. Uh they don't share GPUs. They don't really know about each other all that much. They just consume from each other. Um the but the orchestrator job is to really like manage the run. And so the orchestrator uh will make sure that the environment is running with the endpoint mapping to the inference server. It'll do rollouts. Uh it'll package these up into a batch.

**30:39** · It'll send this batch to the trainer and it'll be up to the trainer to figure out what to do with the batch, uh which will be kind of printing some uh sequence to feed into a loss function um based on the the specification. Um and so the the server pattern we use for environments is just an engine that can like send requests to inference and like send batches back to your trainers. It's very client-server. Um and we found that this is just a really useful way to uh allow scaling concerns to be decoupled as well. And so like for example, you can have a lot of environments running or you can have one environment running.

**31:08** · You can have um a bunch of infra replicas, you can have one infra replica. Um you can have sandboxes or no sandboxes. Uh and the trainer doesn't care about this, the inference doesn't care about this. It's just separation of concerns at a system level uh allows you to kind of not really worry about these things as uh like combined units versus like in some cases uh people will want to like have training and inference on the same stack where it's like especially the the closer that you kind of fold in your logical in one then it's like sometimes you can't even run your environments if you're not doing RL, but that means then you can't really experiment.

**31:39** · You also can't use them as evals. There's a lot of reasons why just like pulling everything apart into these pieces and just like having nice APIs for them to talk to each other uh makes your life way easier.

**31:49** · Um and we've also just been like really scaling it. Um and so we've been doing a lot of work on uh like GLM-5 series and Kimi K2.5 2.6 series just to make sure that we can do like really good large-scale RL efficiently. And so some results we found we have recently. This was uh the run was on GLM-5 before the 521 came out.

**32:09** · It supports 52 as well, but um on the latest primary RL version, we can do um a GLM-5 step on 28 nodes in less than 5 minutes for long horizon coding tasks with 131K context, um which means you can do a 1,000-step run in 3 days. And that costs for rental prices about 50K.

**32:31** · And so 50K is not cheap, but it's like if you're doing a full run on a frontier size model on like a proper real world agent environment, like it's a lot cheaper than what OpenAI's raising for it. Um it's a lot cheaper than like some of the clusters people are are uh selling, and it's the sort of thing that like just starts making sense for a lot more enterprises if you can like actually do this. It becomes pretty justifiable if you can kind of get to the point where uh you have the the tooling chain to be able to like build ready valves and like uh do all this stuff.

**33:02** · Um and so this is like the sort of thing where it's like let's say you do you wanted to like you have a bunch of tasks that are like representative of like your coding workflows, and you want to like do a big RL run. Like this is a pretty big RL run, but it's also the sort of thing that like you could people spend this much on tokens in a month sometimes. Um and so you can uh start finding a lot of savings if you kind of think about doing large scale post training, and that's kind of what we're we're here to help people do.

**33:25** · Um I guess more on the async side uh one of the reasons why you really want to do async is that um there's a long tail of how long your coding agents take. Like if you fire up a coding agent task, just like think your Claude coder Codex tasks, like how many minutes is it going to take you?

**33:42** · Sometimes it'll be 30 seconds. Sometimes it'll be like 2 minutes. Sometimes it'll be a goal that goes for like 3 hours. Um and these can all be rollouts. And so one of the goals of async RL is to have your like forward progress speed not be tied to the speed of your individual rollout. And so this means you can kind of allow your rollouts to finish long after they start and just go into the first batch that they can accept them even if that is from a much different copy of the model.

**34:08** · Um and so then the the inference server is just always taking the latest version of the model. And so um what people have generally found and what we've done with our experimentation and found as well is that you can go reasonably far off policy. Like I think 16 is where we typically are often operating is like an average. Um but this means that you just also can have a lot more room to not worry about certain things about speed. Like you don't need to worry about the boot up time of your sandboxes as much or the weight sync time or like the time of any environment or your or your grading.

**34:38** · Like, it's it's fine if you have these things that take time cuz you can't If you're doing like grading with a judge, you can't like force your judge to be super fast all the time. And so, you want to have a system where it's okay if there are pockets of your life cycle that don't use GPU time but do use time um and you can kind of overlap these without kind of wasting GPU cycles. And so, that's really the the key benefit of of async RL in our eyes. Um and we've done a lot of work on the loss function side. The DPPO paper is one that I think has gotten popular that we've been using a lot as well of like how do you make sure that this like stuff stays stable.

**35:12** · Um we found that it's very stable up to thousands of uh steps. Um we're pushing towards 10,000 in kind of current experiments um in terms of the the scale that we're trying to kind of get the stuff to reliably. Um as well as doing this at big batch sizes where you kind of need to pull out all the bells and whistles on parallelism.

**35:30** · And so, what we found is that I guess I can go back to uh like doing like this uh expert parallel on the trainer as well as kind of parallel. Um and then on inference doing uh wide expert parallel for the big MOEs uh meaning multi-node uh experts across multiple nodes as well as disintegrated prefill. Um and you can kind of throw all the inference bells and whistles that people would do for normal serving into your RL stack and get same wins there as well.

**35:55** · Um and so, here to kind of fully kind of recap all the the advancements we've been pushing into the the stack. We've been leaning in towards FP8 um wide expert YDP um disintegrated prefill lots of stuff at the routing and KV offloading and management of just kind of where things live. Especially things like router re-place. The router re-place is actually a really nasty systems problem because it requires tracking a lot of metadata per rollout because you have this for every single layer.

**36:20** · Um so, it's like it's a big multiple over just the like tokens and log probs uh that you actually have to store um because especially if you're multi routing to multiple experts for layer, um and so the storage concerns for these, as well as like for multi-modal, um if you have like images that you need to store, like there's a lot of stuff where you want to kind of offload the heavier artifacts onto some like object storage system or other file system, um and not just have it floating around in memory.

**36:45** · Um and so we've rebuilt a lot of our systems to support this, as well as just really pushing uh there's a lot of kind of like special cases that you need to worry about where it's like certain models will want certain types of context parallelism, which have different considerations about what you can do uh in terms of like other aspects of the system.

**37:03** · Um and so we've just been trying to really refine the recipes for making sure that this works really well, especially for models like JLM.

**37:10** · Um and we've done this all on top of a Torch Titan base. I think a lot of people are like, "Why do you use Torch Titan and not Megatron?" Um and it's because Torch Titan is just like really easy to like hack, and Megatron is kind of this monolith um that I think some people will hack it, but it's I think uh we just started with Torch Titan a long time ago and kind of find the pieces we want to bring in, and especially when a new model comes out it's like, "Well, you want to train on it." Or you want to let's say you want to there's some new paper that you read that like has some new idea, you want to be able to like make everything really hackable and modular.

**37:37** · And so like our our team is not that big, like our whole research team that maintains Prim Rels like less than 10 people, um and the company is less than 40 people. Um and so there's a lot of work that we want to make sure people can parallelize, but also move quickly. Um and so uh this is all stuff that we've kind of been able to to figure out over the past few months as we've really been pushing it for scale.

**38:01** · Um another thing that's I think fun is algorithms. So I think a lot of what researchers care about I think researchers some people will love thinking about the system problems of scale. Um if you do talk to us, um but if you don't, I think what a lot of people want to spend their time thinking about is algorithms in terms of the on-policy distillation stuff or like OP SD or uh if you saw the Echo paper, I think that got a lot of people excited of like thinking about how do you do world modeling with RL um and folding these in as well as just basic stuff like SFT. Um there's also this Max RL paper from a while back that was super cool.

### Customizing Training Algorithms and Losses

**38:30** · And so we were just we were seeing all these papers and we were like we just want to do all of these. We want it to be much easier to kind of like mix and match these and to not have to like add another if statement buried super deep in the code um and like pipe a bunch of stuff all the way through. And so we kind of decompose things into the loss which is like the thing that is taking the gradient as well as the algorithm which we say is the thing that's kind of like preparing the data.

**38:52** · Um and so we have different losses we can kind of like pipe things to um in terms of like the signal and the masking. Uh and you can use these to kind of assemble uh different algorithms. Um and so now algorithm is like a class where you have you can have a class that does different things in terms of scoring or uh the groups.

**39:08** · Um and and you'd kind of pick which loss you want to target with it. Um and so we support all of these all the popular ones and you can kind of add your own that look like adding in a function to like assign advantages uh to a rollout. Um Uh yeah. And so then then from your algorithm then from your configs you can just kind of say hey I want like this algorithm and it's just going to pick one from the registry. You can add your own to the registry if you want. Um and then this will be the algorithm used for your training run.

**39:37** · Um and you can do this on a per environment basis if you want. Um but all of these algorithms that people are looking at kind of fall into this like table where there's questions about like what are your where are your rollouts coming from? Are they coming from your current policy model or are they coming from some other source like a teacher?

**39:55** · Um and so any algorithm people call like on policy or like slightly off policy in terms of the async RL stuff. This is one where like your your actor in RL sense is going to be the model you're training your policy. Your policy is your actor.

**40:07** · Um in other cases you're doing stuff where your your actor is some other model. So if you're doing context distillation or you're doing SFT, like these are ones where you are uh going to have some other like model or prompt potentially be the teacher that is generating the data that you're going to be training on. And so all of these kind of fit within this family. Then the other thing is the advantage. And so the advantage is just like if you generalize it to like a score, like you can now call like just cross entropy loss or negative log likelihood is like everything has like advantage one.

**40:37** · Um there's a lot of all of the like OPD algorithms can kind of you can kind of think of it as the log probability is being the advantage.

**40:45** · And with RL like your your reward minus some baseline usually group mean or something like it is your advantage. And so we just kind of like took a step back and looked at all these things and we're like, "Oh, we can just kind of like factor this all out pretty nicely." And have almost everything else be shared but these things get kind of swapped and so your infra doesn't need to change just because your loss function needs to change.

**41:09** · And so for on policy distillation like it's just plugging in with a different loss target and it's like talking to the teacher and being like, "Okay, the thing I need to get is reference log probs from some teacher and I already have my like sequences. So I just need to send these to a teacher as prefill in terms of like a like you can get prefilled by just like asking for like a one token response. Now I I get my sequences and I can just like stick these in as my reference log probs." For self distillation you can have like a hint that you're kind of putting in before your your like this teacher.

**41:38** · So you're not saying the same prompt you're saying a different prompt using renders to kind of pack these together and then you get back the same like sequence that you can slice out into the original form so that you can kind of add these as your reference log probs there.

**41:51** · You could do echo where you have like two different algorithm components. You could have one that is targeting the uh the doing cross entropy on your environment tokens while doing like an RL objective on your your action tokens. And you can mix and match these. So you can have like different like you can decide which teacher is going to be done your you're going to be sampling from your student or your teacher.

**42:14** · Um you can like decide which algorithm you're going to be using on a per environment basis.

**42:18** · Um and you can have like this one we have like both um a normal like OPD as well as GRPO. Um and then Ah yes. So like this whole family we now support within Primerl natively. Um and one thing you may also have poked around at or seen or tried is uh we have our hosted training platform uh which means you don't have to worry about GPUs at all. Um And so this is just hosted Primerl. The version we have that is kind of the the broad uh self-serve version today is multi-tenant Laura um which is focused mostly on RL.

### The Lab Platform and Hosted Training

**42:50** · Um what we have coming quite soon that we'll be rolling out is full fine-tuning um which supports changing as much as you want in Primerl in terms of the model and everything else where we still give you all the same abstractions for uh not needing to think about the GPUs and kind of auto-scaling and uh magic restarts and uh having a dashboard where you can log everything and have unified billing for sandboxes and judges and all these things.

**43:14** · Um but also you get to develop your environments on CPU on your laptop, push them to the platform as environment packages, and specify them in your configs. Um and then this allows you to um have a lot of flexibility in like deciding when you want to go to different levels of the stack. So in many cases you don't actually want to change anything in the trainer. You just want to change your reward function. And you can do this in environment space.

**43:40** · Maybe you want to configure the trainer but not change it in which case you want to kind of poke into like slightly more complex knobs for uh things like different loss functions or learning rates. Um additionally you may want to like actually go deeper into the trainer and like uh do new algorithms at the environment level at the algorithm class level or at the loss function level or maybe something else entirely that needs going even deeper. And so we we support all of this with the the um the full fine-tuning as well. And so uh multi-tenant Laura, if you're unfamiliar, is a a very useful pattern for allowing multiple people to do training runs on the same architecture.

**44:12** · Um on the same uh model weight copy.

**44:13** · It's so you have a base model that's kind of This is how all inference for like token-based pricing usually works as you're doing multi-tenant inference where you have one big copy of Claude uh that is just getting everyone's requests and hitting a shared uh like KV pool uh that is managed um with This is really nice with Laura because you can just have multiple Lauras available that you can hot swap and each person can have their own Laura without needing to replace the base model. Uh and you get one kind of inference pool that serves everybody at once even if they're using different models. This allows you to do things like token-based pricing uh and not need to reserve GPUs.

**44:43** · Um For full fine-tuning, it kind of does have to be GPU-based. Um but we've been getting a lot more GPUs and so we have the ability to let people run stuff on their GPUs. Um and uh this allows going like pretty like going to full parameter training where especially for algorithms like large-scale SFT or mid-training, um you will want to kind of have more than just a Laura adapter um as well as the ability to kind of really customize at at every layer you might want um like how your algorithm is going to work.

**45:11** · Um but so we The multi-tenant Laura one is already live and you can go use it today.

**45:18** · Um full fine-tuning is coming out in the next coming next couple weeks. Um the V1 stuff from before is already uh out uh as a kind of a alpha feature that is a stable release coming the next I don't know, quite soon hopefully. Um and then the cookbook I mentioned earlier is also out. Um And that's mostly what I want to talk about. Um bit informal and I can People have questions, I can uh dig into any individual parts people think are curious. We're also uh we're hiring. Uh we are small team based in mostly San Francisco um becoming a much larger team quickly.

**45:50** · Um and uh we'll have some other exciting news about that coming later this week uh to I don't know.

**45:58** · Uh demonstrate our commitment to scaling the team. Um but yeah, we are we're growing and we're I think in a unique position of like we do very open research work like all this code is on GitHub if you want to go play with it but we also like our a real company that trains big models and makes money.

**46:17** · And so yeah, we think we figured out a good business model to do real open research and it's been an incredible journey thus far and would love to have excited passionate talented people join the team.

**46:32** · \[applause\] \[music\]