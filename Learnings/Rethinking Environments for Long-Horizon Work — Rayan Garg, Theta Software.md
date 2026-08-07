---
title: "Rethinking Environments for Long-Horizon Work — Rayan Garg, Theta Software"
source: "https://www.youtube.com/watch?v=2aS7aKoXn64"
author:
  - "[[AI Engineer]]"
published: 2026-08-01
created: 2026-08-07
description: "Everyone wants agents that handle long horizon work, but Rayan Garg starts with the awkward question of what long horizon even means. One popular answer measures the time horizon as the task length at"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=2aS7aKoXn64)

Everyone wants agents that handle long horizon work, but Rayan Garg starts with the awkward question of what long horizon even means. One popular answer measures the time horizon as the task length at which an agent crosses a success threshold, like the sixteen hour mark, which is a useful endpoint but a noisy one, since human time estimates vary and the same wall clock hides very different amounts of real difficulty. How you choose to measure this has an outsized effect on what you conclude about a model.  
  
From there Theta Software's work is about designing the environments and verifiers that make those measurements honest. A task can be artificially stretched by forcing serial dependencies, or made genuinely hard when a bad early query cascades through everything after it, and as environments grow more complex, standardized evaluation gets harder and correctness is best verified from the final state rather than a judge's guess. Garg walks through collapsing a huge state space with sample trajectories, being careful that judges do not see information they should not, and reusing agents to sift artifacts like CI logs. The recurring principle is that long horizon progress lives or dies on environment and verifier design, not on the headline benchmark number.  
  
Speaker info:  
\- https://x.com/RayanGarg  
\- https://www.linkedin.com/in/rayan-garg/  
  
Timestamps:  
0:00 - What does long horizon mean?  
1:13 - Time horizon and the threshold metric  
3:17 - Why the metric is noisy  
4:20 - Measuring what actually matters  
6:38 - Creating tasks and environments  
7:42 - When a bad early step cascades  
10:01 - Why standardized evaluation is hard  
11:17 - Verifying from the final state  
13:46 - Judges, tools, and reused agents  
17:45 - Rubrics, QA, and careful grading

## Transcript

### What does long horizon mean?

**0:12** · It's uh great to see all of you here today. We're super excited to talk about one of our favorite topics uh here at Theta. Um before we get started, we just want to introduce ourselves. Um so, hi, I'm a co-founder and CTO at Data Software.

**0:25** · Hi, I'm Ryan. I'm a co-founder and CEO at Thata Software. Prior to this, I was previously a founding engineer at Deep Silken where we did research into turnary models.

**0:34** · Awesome. So, I can get us started with the topic today. Um, we're going to be talking about oral environments uh within the context of long horizon tasks. And I think the most important thing for us to start with at the beginning is just talk about the trends and what long horizon actually means.

**0:48** · So, you know, we all know that the horizon at which AI agents can work autonomously is accelerating really fast. Um this is just some of the metrics that you can look at to see how this progress is really accelerating. Um but I think it's really important to actually define what the time horizon here actually means. Uh we've gotten this data from one of the most common benchmarks out there that you've probably heard of for time horizons. I'm sure you've seen in your Twitter feed all the time. It's um comes from meter.

### Time horizon and the threshold metric

**1:13** · Uh and meter kind of has one response or answer to this really important question about how do we actually define long horizon? Um, it's really important to understand because what we consider long horizon a year ago probably isn't really long horizon in our definition today. And what's long horizon today probably won't be long horizon in a year or two.

**1:30** · Um, and I think that gets to our first point which is that long horizon is really kind of a scalar metric. Uh, it's useful for kind of measuring relative tasks like one task might be more long than another, but it's really hard to define into kind of a binary category of this task is long and this task is not.

**1:46** · Uh, especially as the kind of scope changes over time. So I think the first way we can talk about defining this is how meter kind of looks at it which is human horizon meaning can we use humans as a benchmark of oh this task takes humans a certain amount of time so if AI agents can do that then they've reached this certain critical uh level of kind of a time horizon uh and the way meter kind of does it is they have thresholds for the tasks they care about.

**2:09** · So, you know, they have a 50% threshold, meaning, you know, if a certain model reaches a 16- hour threshold on this benchmark, that means it can achieve tasks with a 50% success rate that take a human 16 hours. And, you know, there's a really rigorous methodology of how they actually measure how did it take human 16 hours, but we will kind of avoid some of those details. Um, the other way we usually think about what long horizon actually means is not with the reference of humans, but instead the reference of models. Uh so some of the relevant model units we usually care about are things like tokens.

**2:39** · How many tokens are consumed in a trajectory, how many steps it took, how many tool calls it kind of takes. Um and these can be really noisy, right? Because I'm sure you guys have used different models. Um like you know a lot of the codeex models are seen as more token efficient than some of the cloud models. Um and it's a pretty noisy estimate for a couple reasons. One is that which model you're using like I just said and different harnesses you care about have a pretty big impact on how many tokens are actually consumed on a task. Right? So, um, this can be pretty hard to interpret when you're not holding variables constant.

**3:08** · Um, you know, if a task takes GPT model 500,000 tokens, that doesn't really tell you a lot about what that task would look like for cloud models until you actually run on those cloud models. But despite it being a pretty noisy metric, it's actually really useful uh and important for us to understand because, you know, the amount of tokens that are consumed tells us a lot about how difficult a task actually is for an AI agent to kind of tackle it autonomously, right? uh we have to deal with things like compaction over long horizons.

### Why the metric is noisy

**3:35** · Um you know they don't really stay coherent over enough steps or trajectory uh length that you kind of achieve. So even though it's kind of a noisy metric uh it can be really useful when you know if we look at what a GPT 5.5 model can do uh now and then you use the same model generation and kind of see oh now can actually achieve a a million trajectory based on an increased context window or improved compaction endpoint. That tells us a lot about how autonomous AI agents can actually go for long periods of time in that sense. Um, and it really defines for us what the technical frontier actually means uh for models right now.

**4:06** · Maybe not really human adjacent. It's really hard to say how many tokens a task takes for a human because we don't really think in tokens, but still very useful in that kind of sense. Um, so these are two different approaches we can think about. But what's actually the right way to think about this? Uh, the answer is that we probably want to think about all of these. And if we just look at one of these metrics in isolation, it's probably not a great way of measuring things. So, I went through some of the weaknesses with measuring with like model specific metrics like tokens and and steps, but there's also a lot of weaknesses in the other approach of kind of relying on humans.

### Measuring what actually matters

**4:37** · Um, you know, what's long horizon for a human isn't necessarily that difficult for a model depending on what the actual task you care about is. You know, there's a lot of tasks that are really tedious and time inensive. Maybe like, you know, some financial analyst has to go into like an Excel file and fix a bunch of formatting issues throughout uh the the task. Maybe they're changing like the theming of like the colors in the in the actual file, right? That might be really tedious for a human to take.

**5:01** · It might take them like days to do that if it's a really big Excel file, but for a model, it can maybe write a Python script or find some other cool trick to do that really quickly. And that's not really hard for it to do, but you never really expect a financial expert to do that because, you know, they most of them don't really know how to write these Python scripts. Um, so I think that's one thing to note. And the other that I kind of briefly touched upon before is that the methodology of how we actually measure this has a really big impact.

**5:25** · And if you, you know, someone is out there saying, "Hey, we have some tasks or environments that are 16 hours long on average, someone else is 20 hours." That's really hard to compare across people because there's so many different things in the methodology that really impact uh kind of what that actually means. It can mean, you know, the quality of the experts you're using.

**5:40** · Some more experienced experts might actually be way more efficient at doing a certain type of financial or coding task, whatever it kind of is. Um and I think this becomes really really important as we start shifting towards uh kind of the frontier of even human capabilities. So you know as this meter talks about this but as you shift towards more long resin tasks and tasks that only the top 10% the top 1% top.1% of humans can really do these estimates start to get really really noisy and it's something that we really have to consider.

**6:06** · Uh and I think you know the way agents work is kind of developing in its own separate path and there are a lot of different bottlenecks and different things that AI agents are better at than even the way humans work.

**6:16** · And with that in mind uh you know as these paths kind of diverge of how humans do work and what their limitations are and what agents do and what their limitations are. Uh it's really important to kind of keep both these metrics in mind because they kind of tell and paint different pictures uh of of what's actually relevant and and you don't really get the whole picture by just looking at one in that sense.

**6:36** · Yep. So now the question becomes, how do you measure model capabilities? And this is a really important question because fundamentally long horizon tasks aren't the only thing we care about. This is the larger question that we want to think about every time we're trying to create tasks, create environments to train our models. And so the first way we can think about this is environment complexity. And specifically environment complexity related to tool coordination, right? So how many tools or external dependency does the agent have to coordinate?

### Creating tasks and environments

**7:04** · How many tools or external dependencies does the agent have to move information across? So if we start off kind of thinking about what the world looked like before a long horizon task uh you know world, we'll notice that there was you know a low complexity world where the agent maybe had to read one file or one set of files in a code base and that's kind of what a task entailed.

**7:23** · But now we can see increasingly as these tasks become more long horizon what is important to define for measuring model capabilities is okay the the agent should be using a ton of different tools like graphana for observability to parse logs or GitHub

**7:38** · for CI/CD or AWS cloudatch or reading and writing to a database and we're going to notice that as we sort of start to have these agents and these environments use many tools that we also start to think about environment complexity in regards to state changes which is effectively the degree to which the environment changes throughout the task. And so fundamentally the way we want to think about this is right all long horizon tasks aren't equal.

### When a bad early step cascades

**8:01** · So for example, one task can you know maybe be made by artificially long horizon by chaining together unrelated independent tasks. However, that doesn't actually tell us or meaningfully measure the model capabilities. Instead, a key component of this is actually being able to have the earlier decisions in the in the environment influence the later decisions. And this comes back to how the agents are asked to interact with the tools, how these tools change the state of the environment, etc.

**8:30** · So, we can look at an a concrete example for this. One example where you'll see paralyzable complexity, which is effectively not involving a lot of state changes, is when you can maybe have an agent analyzing a large code base and then the agent needs to spawn off multiple sub aents and it can very easily paralyze this, right? it can look at a lot of the different files in parallel, come back to the to to the master agent and then kind of wrap this all up, right?

**8:51** · But meanwhile, if we look at sequential complexity, we'll see if you have to use a dashboard or logs, a bad early query or a misread can cascade into these downstream steps that really start to have major consequences later on, right? It's all dependent on how you use those tools and how the state of the environment changed.

**9:09** · So the third area that we also need to consider for measuring model capabilities is ambiguity, right? And ambiguity is defined as the information you give the agent and the environment when starting the task. So this could be the instructions, this could be the artifacts, etc. And increasingly as these agents work with more artifacts at the start, right? We want to have them mirror the work that humans really do.

**9:30** · And the work that humans really do has a lot to deal with ambiguity, right? They always are are don't have the most complete information and they want to let exploration happen. And so we believe that to measure model capabilities, we need to test the model's ability to explore and explore throughout the environment as well and explore these artifacts similar to how a human would. Now the trade-off with this, right, is that if you are going to have ambiguity in the materials you give, there's a lot more possible paths that the agent could take. There's a lot more ways the agent could be right.

**9:59** · And that means that standardized evaluation gets much, much harder.

### Why standardized evaluation is hard

**10:06** · Awesome. So I'm going to talk about one of the hardest things there are to build environments and one of the most complex things to really think about where there's a lot of nuance which is the verifier in the environment. How do we actually know that the work the agent did was correct and give it some reward signal during the training process. So I think there's a few challenges here.

**10:21** · Um you know I think just to give a high level overview um you know tasks are getting more complex the environments are getting more complex the trajectories are getting longer and we've shifted a lot from you know a lot of the early RL that we were doing in in recent times was really in hard verifiable domains and that's why we saw these gains in in math and kind of uh

**10:40** · like data structure style coding problems but what's happened over time is now we really care about a bunch of economically valuable work in software file domains is is a way to put it where uh you know we can't just run a Python script or run test cases is or or write a proof to really see whether or not the output was correct or whether or not the environment was changed correctly. We have to start using other techniques and the main way we're really going to use that is kind of introduce a judge model or critic model as some people put it and they kind of can add a lot of nuance to how we actually look at a few things here.

**11:09** · Um you know very critical for how we actually determine correctness and assign reward. Um they'll look at two things mainly. One is usually either the state final state of the environment and kind of how it was impacted. Um and the other is looking at the trajectory of how the model that you're actually training made kind of changes to the the state of the environment as well and and what kind of correctness look like there. Um so you know why do we actually use uh judges and usually rubrics um as a technique?

### Verifying from the final state

**11:37** · I think it's really important to understand before we can even understand how to use them properly which you know I think there's a few reasons. One is that like I said for these software fellow domains there's like an entire class of problems that are really important and a lot of the problems we care about that really you can't really write a deter deterministic verifier for um they would be really impractical brittle or just downright impossible depending on what the problem setup really is.

**11:55** · Um and you know I think the other thing also is that like I said we're going to look at the trajectory uh and you know not all solutions are really created equal and not all paths of those solutions are equal either. uh you know the worst case of a bad solution we can get is some reward hacking that happens. Lots of different types of reward hacking can happen depending on the setup or the task you kind of care about. You know agent can escape a sandbox maybe see privilege information it shouldn't be seeing about maybe a hidden test suite for like a coding task.

**12:21** · Um this is all behavior that we want to prevent obviously because those are not actually really valid solutions we really care about.

**12:28** · Um, and you know, a lot of this mitigating this is going to require strengthening your verifier and your environment setup, but the judge is really, really important in actually catching this behavior. And that's an important reason of why we actually look at the trajectory that the agent actually took to get there. Um, yeah, and I think there's a lot of careful things you want to be doing here. Uh, one is that there's nuance in how much guidance or uh like explicit rigidness you want to add to the trajectories that the model can actually take. um if we kind of enforce this too tightly, we collapse the state space of how many actual paths the agent actually explores.

**12:59** · Uh and that can be really bad, especially because I think some of the more simple approaches we've seen with judges early on is, hey, we'll just give it a reference answer or solution or maybe a sample trajectory of what a good solution looks like and then just compare against uh what the model did and say, hey, does it match up with that? Uh and that really does not work for these more ambiguous or open-ended tasks because there's so many possible correct solutions. It's basically impossible to account for every single one. and we want to check for more robust methods that allow for these different solutions.

**13:28** · So now that we've kind of established why we use judges, uh we want to go through some of the general heristics and kind of principles we think about when we're designing good judges. Um some of the things that we think about at data. So you know I think the first important uh consideration to make is that judges are agents too. Um, you know, so as environments get really complex, oftent times we a consideration we kind of have is like, hey, we have to make sure the harness can kind of scale and and kind of match up with whatever environment uh you kind of have. Maybe that means introducing a bunch of new tools and making sure your harness can support those tools really well.

### Judges, tools, and reused agents

**13:59** · The agent has clear observability over what's happening in the environment. Um, but I think like we said, the way the judge determines correctness is that it oftent times has to look at the state of the environment itself as well. So a lot of the harness that you've designed for the agent might also be reused uh for the judge as well. Um, I think the best way to illustrate this is the example we have here.

**14:17** · Let's say you've defined a task where, you know, there's some deployment failure with the software engineering task of some platform you're deploying and the agent's task is to like sift through the CI/CD logs on GitHub, look through the cloud cloudatch logs, figure out whatever happened, uh, kind of apply the changes you care about to the codebase and then open a PR and and kind of kick off a redeploy there once the PR is merged.

**14:36** · Um for a lot of for a lot of that if the judge actually wants to verify uh whether or not this is correct besides just like looking at the tool calls agent mate which are usually not very reliable it actually has to also check the GitHub logs it might check the AWS logs or the GitHub logs after the deployment happened to make sure oh are things actually working properly. So it's really important that the judge has access to the environment in the same way uh with some important safeguards of course. One is that we don't want the judge to make an accidental mutation in some way to the environment after the agent is done. So you want to be very careful about that.

**15:06** · Maybe that means enforcing readon permissions for a lot of this information. It can't actually kick off a deployment or anything like that. So those are things to be careful about.

**15:12** · But I think this is really really important especially where there's a lot of open-ended approaches and the only way we can really verify correctness is to actually look at the state itself. Uh you the answer isn't obvious of whether or not the agent completed the task just from looking at the trajectory. So I think that's one example where this approach is really really important. Um

**15:29** · I think uh the other thing to be notable of is you know as these environments get more complex the agent trajectories get longer and longer and part of the reason we also need the judge to be an agent is that you can't just use this really basic approach of taking the trajectory and stuffing it in the context window of the judge and kind of have it be a basic LM call. Uh these trajectories can get really really long and really really complex. So we need to do a lot more thoughtful uh processing of the trajectory in some meaningful way. So you know that might mean we put into some database. We use sub agents to actually enrich certain information.

**16:00** · Maybe we parse out specific phases that the agent was actually in. Maybe the beginning part was it going through logs. The second part was actually writing code. The third part was actually it checking what happened after that. These are all different things we want we want to do. And in that sense we need to make the trajectory itself queryable. So that might mean enriching of information like I just said or some other metadata we can kind of look at at certain steps. is really important so the agent can find critical steps um you know like failure points and and verify whether or not those are actually failures. Making that uh kind of usable for the agent is really really important.

**16:32** · Um I think another important thing to consider is learnability of our environments. Um you know the most important thing here is just the density of the reward signal and a lot of that comes from your rubric and kind of how the judge is defining that. So, I think if you be very careful with just uh you know overloading with density in in your rubric, a lot of times, especially for frontier problems that models aren't really capable of yet, judges will really struggle to apply that rubric consistently. So, there's a lot of QA we kind of need to do to make sure judges are able to apply that information correctly.

**16:58** · Um, you know, there's other learnability factors that we care about and we measure in environments like the distribution of tasks and and and the actual underlying data there is. Uh and and these are all kind of things we think about for learnability and it's really important otherwise you're just wasting a bunch of compute on on problems where the model can't actually effectively learn.

**17:16** · Um you know these are some emerging rubric judge patterns we've seen. I'll quickly skim over this. Um you know oftent times you deterministic verifiers aren't completely dead. oftentimes we use them in tandem with judges. Maybe generating an artifact for the judge to actually look over where you're maybe collecting metrics or interesting thing that we could also use is dynamic evaluation time rubrics where we're actually generating um you know we're maybe giving partial credit where we've baked in some assumptions that the models made and assume they're correct.

**17:42** · It's like grading a test assuming like if you got the first part wrong, let's just assume it's correct, did they get the rest of the part right? That can be really important as well as well for kind of assigning credit there. skip over this part. Um I will let R just close things off with some things about QA for rubrics.

### Rubrics, QA, and careful grading

**17:58** · Yep.

**17:58** · So for each rubric we produce, we run a couple different tests. We won't go into all of them. Some of them are pretty basic, right? Gold, no op variance. These are tests you want to be considering regardless for your verifiers, but I think increasingly, you know, as as you involve AI in the process of even creating rubrics or verifying rubrics or aiding experts, you need to have more and more tests, especially as the tasks become more long horizon. And so that really touches on the coverage and the expert agreement.

**18:21** · But I think what we wanted to close off with today is why a lot of this stuff matters, right? We spent a lot of time earlier in this presentation defining what long horizon means. And a huge reason we did that is because we feel like a lot of the literature and data, a lot of the literature shows that a lot of the data being produced right now and being used to train and evaluate models is actually flawed. So we present three major benchmarks in the area of finance predominantly. And so this is GDP valer toolbench and Apex agents. There's a couple of notable issues here.

**18:47** · First, if you look at the average human hours per task, based on what Meter has defined for a lot of the leading frontier models, a lot of these different average human hours per task fall far below that and so they wouldn't actually be considered long horizon tasks. The second notable issue here, right, is that we see that these benchmarks are already reasonably saturated and we think this is a downstream effect of the average human hours per task. So, it's really important to look at the metrics that are being used here.

**19:12** · If you look at, you know, the Apex agents IB section of this benchmark that they put out, pass at one effectively means that for like 57% of cases, the tasks are 100% solved. That is effectively telling us that like there's a large part of these tasks that models are solving similar to what we've seen already. But I think a third key important part here is the breath. For each of these different uh benchmarks, particularly GDP val, they have a very narrow set of Excel tasks that they consider for finance. And for Apex agents, they're largely focused on IB.

**19:43** · What this means is that a lot of these more important areas for learnability like, you know, credit, debt, risk in the domain of finance don't really get covered. And then I think lastly, I'll I'll I'll note there the reward signal as Gver mentioned is really important. And in regards to the reward signal here, we'll we'll notice that there's like really, you know, if you look at if you look at what you need for a rubric, you need very granular, detailed reward signal.

**20:10** · You need, you know, we we have 20 different subriteria and 10 different subriteria per criteria. So, I think there's a lot of room that's left when you read these benchmarks into how granular reward signal they're giving, which is really important for being able to go ahead and train your models. With that, I think I wanted to round off with a couple of stats about the data we produced. Here we, you know, you can look at some statistics for our finance data. We can see that the human time to complete one task on average is 15 hours over a 50 task sample set. Furthermore, it takes models a pretty long time to work through these tasks.

**20:40** · And after all of that, across all the domains we care about within finance, for example, they still struggle significantly. And so here we provide mean five notably different than, you know, all of these previous scores uh we see here. So, thanks for for taking the time to talk with us today.

**20:56** · Thank you.