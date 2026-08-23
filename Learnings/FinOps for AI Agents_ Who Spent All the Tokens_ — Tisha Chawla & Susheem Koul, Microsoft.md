---
title: "FinOps for AI Agents: Who Spent All the Tokens? — Tisha Chawla & Susheem Koul, Microsoft"
source: "https://www.youtube.com/watch?v=GJX19pNhmSw"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "Turning the full policy suite on cut average agent spend by about 78% across benchmark runs on two open source repos, and lifted the share of runs that actually completed from 67% to roughly 96%. That"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=GJX19pNhmSw)

Turning the full policy suite on cut average agent spend by about 78% across benchmark runs on two open source repos, and lifted the share of runs that actually completed from 67% to roughly 96%. That second number is the point. Simple throttling holds the bill down by killing runs, so Tisha Chawla and Susheem Koul built their control plane to steer instead. Their framing is that every software era grew a control surface, usage caps in SaaS, autoscaling policies in cloud, and the agentic era still has none at the layer where code calls a model. Gateways can hard cap and downgrade, but nothing sits between your code and the spend it triggers.  
  
The design splits in two. In your code an annotation marks a boundary around methods you already have, floating attribution up without a rewrite, while a governor holds the list of actions you authorized so the control plane cannot do whatever it likes to your agent. The control plane groups runs into segments by any dimension you emit, sets budgets against a time window, and attaches policies. Actions come in two flavors. Halt is a circuit breaker. Steer is the interesting one: a cost guard watches both how much of the budget is gone and how fast it is going, and when it predicts an overrun it injects an instruction to keep outputs succinct rather than killing the run. They demo it in preview mode first, policies evaluating with enforcement off, which is how you would actually introduce this to a production agent.  
  
Speaker info:  
\- https://www.linkedin.com/in/tisha-chawla  
\- https://dev.to/tisha  
\- https://www.linkedin.com/in/susheemkoul  
\- https://susheemk.substack.com  
  
Timestamps:  
0:00 - From token maxxing to value maxxing  
1:58 - Every era got a control surface, this one has not  
4:30 - First principles at the model call boundary  
6:19 - Why gateways are not enough  
8:57 - The SDK side: boundary, ledger, governor  
13:13 - Segments, budgets, actions, policies  
14:53 - Halt versus steer  
16:36 - Demo: preview mode, then enforcement  
18:17 - Cost guard, and steering on velocity  
19:06 - Benchmark results and the policy catalog  
20:47 - A self learning control plane

## Transcript

### From token maxxing to value maxxing

**0:01** · \[music\] Okay. Um, good morning everyone. So, um, I'm Tisha and I have Sushim with me as my co-presenter. All right. So, we'll be talking about the most expensive question in AI today.

**0:23** · I think a lot of you would have come across the scenario that um you know when you opened an AI bill like through your agent workflows um you couldn't actually trace back where that bill was actually coming from right and um and I don't think that's a problem right now because right now the industry is valuing you know um token maxing that is like spending the most

**0:51** · amount of tokens for exploration for all of those purposes And um people are proud to call themselves token billionaires and um I think that's all right but this talk is you know the shift from token maxing to value maxing you know how do we get there and um we'll talk about it from this question um who spent all the tokens and um if anyone spent all the tokens there has to be value associated with this right and that is um the talk about.

**1:30** · All right. Now in order to minimize the gap you know from token maxing to value maxing we'll kind of see we'll observe the patterns which the like the existing um u like the past software evolution eras had like for instance when we talk about the SAS era the interface was UI

**1:53** · and the control was in the form of usage caps right like or the seat limits or tier based policies Now when we moved on to the cloud era, the control surface again changed. The model became pay as you go and the control moved like in the form of autoprovisioning and you know autoscaling policies.

### Every era got a control surface, this one has not

**2:14** · Now we are in the agentic era right and um now how the cost is calculated here is in the form of model calls right like u how like the code calls your model but

**2:31** · what we've observed is that there isn't a proper control plane in place for that like we do have control plane in place for you in place as model gateways where they're um are hard caps or there is model routing to downgrade the model but the part like where the code you know calls the model that um is what we'll be talking about uh today and um we also you know see um like in

**3:05** · the last year we've seen a lot of unbounded consumption happening like um if you've read the news. There was news about the like the uh AI budget for Uber getting exhausted within 4 months and um there were companies who like who ran into you know like hundreds of millions of dollars within just months or days and like there were a lot of um like other news in place as well where like these runaway loops um led to a very like

**3:39** · massive increase in the cost and there wasn't proper mechanisms to control it.

**3:47** · Um so when we see all of this the first thing that comes to our mind is is there a tool or is there a product to save us?

**3:54** · But uh we'll instead talk about the first principles of how you know we can design a system which is actually true enough to solve the problem from the very root. So for that let's um like dive onto the principles. First of all, let's talk about token being the unit of cost. Right? We are charged in terms of token. So the now we have to see value also in terms of token. Right?

**4:23** · Next um we all know that cost is created at the LLM like the model call boundary. Um so that is what we'll have to track and if we don't have proper attribution like if we don't know what agent want run made that particular call we we can't you know control it right we we just know the like the broad uh picture of what went wrong but we don't we can't you know trace it back or narrow it down.

### First principles at the model call boundary

**4:53** · So that is why attribution is a very important element to have and um like once you know which particular run or which particular agent is actually you know attributing to the cost you should have proper policies in place to actually stop it.

**5:11** · Like um let's take example that um if you have a you know um a loop which is you know running um very excessively and which is not required or you know if your context is growing very out of range. you should have in place policies which can um like solve that particular thing there and there instead of halting that and if um and as the last resort only a like a halting or a should happen from a budget cap. So these are the first principles.

**5:46** · Now let's see how we can you know define an ideal uh platform on top of that from these principles which we talked about.

**5:56** · All right. Uh so one thing which is very important that which matters here is that u when we talk about um like the um existing frameworks for token ops or for token management most of them are at the um like u basically monitor the model uh request. they like they are like model gateways which will u you know u basically um do like model routing or hard budget capping.

### Why gateways are not enough

**6:26** · But what we need right now is something which you know um like monitors you at the run instead.

**6:35** · Like um if you see we need something uh which can control the loop between like the agent call between the tool um and the agent. something you know which can um uh see or control the the spawning of multiple sub aents happening from a one main agent or um like something which can control the growing of context. So like that is the need of the right and that is what we need.

**7:05** · So for all of this um we like uh kind of are proposing a platform which first of all um has a cumulative budget across like the uh like the attribution runs which happened and then where enforcement actually happens in call path rather than um you know a separate thing like for example if something goes wrong if your like if your context is just growing heavily.

**7:38** · Then like in place compaction should happen or like in place caching or something like that should happen. And um after that if like after basically exhausting the list of all in place policies only like uh the budget cap should happen at the very last. Um so that is something which we are proposing.

**8:01** · But um if you look at the landscape today, if you see the uh like the uh tools like um this light LLM, port key, cloudflare, all of those they happen at again the request level right um like if you see like halting is there, routing is there for some of those but all of this again is at a request and you can't control the cost at the uh request layer uh at the model layer, Right.

**8:34** · So this is the missing piece which is you know the u basically navigating it at the um you know the model the agent run layer.

**8:47** · So for that we have token ops which is uh you know a runaway token governance for AI agents and u this is the uh architecture for that. So first of all one thing I would want to highlight is the like the intentional design decision we took here was an out ofbound plane.

### The SDK side: boundary, ledger, governor

**9:07** · So it doesn't interfere with your code at all. Um so if you see here that out of the bandound plane has three modules which I'll be talking about. The first one being instrumentation. It is a common observability layer where you know you'll u like uh have u like the basic telemetry the open telemetry the cost in microns and um like the um like enrichment layer and basically um the uh

**9:37** · attribution like what caused that uh like particular run and then there is um obviously accounting where you'll basically accumulate it in a kind of a ledger like the total runs which are happening.

**9:54** · And finally we have this enforced layer which has uh two main purposes. one is steering it um through the policies which we've defined which I think will cover later and um then we have halt in place as the you know final um like u final thing if um you know your budget is getting exhausted so yeah that is there now when we again look at the landscape this kind of will

**10:26** · solve a lot of problems um which kind of happened uh when we like look at the previous um tools or products there because uh it is at happening at run and it is you know uh helping you solve the problem from the very root by steering it in place.

**10:48** · All right. So uh with this I would like to hand it over to Sashim for the demo.

**10:53** · Yeah.

**10:57** · Oh yeah. Now I think I should be able to everyone in the back can hear me. All right, perfect. So yeah, we have established the principles behind token ops till now. Right. Now let's shift gears, talk about the design part of it and uh maybe get into the code and the eventual demo. Right? So what I have behind me on the screen is the like bird's eye view of what token ops looks like today. It's it's three layers.

**11:21** · We'll go left to right and top to bottom. So on the left most you have your own agent runtime which you're trying to instrument and kind of manage the cost for right the middle layer is what we're calling the bridge that basically shuffles data between your agent and the control plane and the control plane is where the mind of the system lies right so let's talk about the bridge layer very briefly if we uh go from top to bottom you have the attribution on top so what we're trying to do here is every agent run that you

**11:48** · do it's attributed to some user dimensions so the idea is everything that you do every run of the agent is accounted to some usability or some usage. This comes in handy later. We'll talk about it. Uh the second part which is the boundary annotation that you see this is pretty much the heart and soul of this middle layer. So the idea behind the boundary annotation is that you take any method. It doesn't matter what framework you're using. You might be using uh let's say lang chain lang whatever. If you have a method you can annotate it with boundary. What this annotation is going to do is it's going to do two things.

**12:19** · First it's going to track the input and the output and it's going to flight that up to the control layer and record it there as a ledger entry. Now this will be annotated with the further agent run ID and the other attributes and so on. The second thing the boundary annotation does is it acts as a channel through which the control plane can push actions down to the agent. This is where the entire intelligence lies. So we do not have a single directional highway. We want the control plane to be able to tweak the behavior of the agent on the fly to ensure that we are able to squeeze in more runs inside our budget cap.

**12:49** · Right now let's say the control plane pushes down an action. Let's take a small example. Let's say you have a rag retrieval tool which is generating like 20 chunks every retrieval for every call and that's eating up eating up your budget. And let's say the LLM is not even using the chunks that are after five because they are just not relevant, right? They're sorted by relevance. So let's say the control plane observes this and it wants to limit the output to just five chunks. So it can push down an action but that action has to be received by boundary and then has to be executed by something. That is where the third node, the governor node comes in.

### Segments, budgets, actions, policies

**13:22** · The governor knows what actions are allowed on your agent by you as a developer and it receives those actions from the control plane and knows how to apply it in a non-destructive way. So that's the first three. The fourth one wrap uh the wrap complete is essentially just a helper method. So as we know most of the agent providers or the model providers they provide objects rather than methods for their LMS right. So wrap complete is just another way of applying boundary on objects rather than methods. Let's shift right to the control plane. On the control plane the first layer is the segment.

**13:52** · Now this is where the attribution that we talked about earlier comes into picture. So any dimensions that you float from the attribution layer. Let's say you have a preview agent that you share with everyone in this room and your agent is floating a dimension saying that cohort is AIE 2026 right so you can create a

**14:12** · segment which is a cohort of users which is based on this tag like dimension being AI 2026 right and you can apply your budgets at this cohort level so you don't necessarily have to restrict everything at an agent level or a run level you can do you can do rollups you can do fine grain or coarse grain control right so that's the segmentation part of Ledger as I mentioned is just one agent run all the traces in one place. Then you have budgets. Budgets are basically just the static thresholds that work across a time window against a particular segment or an agent run. And then you have actions.

**14:43** · So on the actions part we have broadly two flavors. First is the halt type actions which basically just kill your agent if it exceeds a budget. The second part where we are adding value is the steer type actions. So here we do not kill the agent.

### Halt versus steer

**14:58** · Instead we try to steer the behavior of the agent or the components of the agent to try and fit that particular run within the alerted budget. Right? And then the policies layer is where it all comes together. You basically uh group the budgets the actions and then set your policies against certain segments or agent runs and that is where it executes. Right? So moving on uh what changes in your code that is the boundary annotation that we just talked about. As Disha mentioned earlier this is all out of band. So you do not have to change your code. You just have to apply the annotation on the methods that you have.

**15:29** · This boundary annotation will take care of floating all the information up to the control plane. And uh the control plane lies in your own tenant. So you do not need to worry about any data leaks or anything. Then if I talk about the governor, so for the governor, you just have to create an instance. You just have to pass it your own configs. These configs will basically declare what sort of actions are allowed for those agents, right? so that your control plane cannot just willingly do any random things on your on your agents.

**15:55** · So before we move on to the demo, I'll just briefly touch upon the uh test that we're going to use today. So it's a simple two agent workflow. We have a research agent which has access to a search tool. Uh you give it a question. It's allowed to look up on the web as many times as it wants.

**16:12** · And once it knows that it has all the data, it passes the findings on to the second agent which is a summarizer which creates creates a research report.

**16:19** · Right? So with that out of the way, let's just quickly walk over to the demo. So for the demo, we have three different scenarios that we're going to talk about. For the first one, we're going to run the token ops in what we call preview mode. So in preview mode, what happens is that all the policies run as is, but the enforcement doesn't happen. So if you see we ran a particular run over here which completed but we did not see any sort of failures there.

### Demo: preview mode, then enforcement

**16:45** · The policies executed but the actions that were associated with those policies were not allowed to be executed. So we're just going to load the dashboard screen here. Yeah. So this is the governance output. Governance is off. The run completed.

**17:02** · But in the dashboard you can see the policies have executed. So you can see the cost budget, the cost guard and so on. Right? So this was the first scenario. For the second scenario, what we're going to do is we're going to turn on the governance. Now while that is happening, I just want to touch upon why this is important. So if you want to like include this product into your production agents, you want to have a safe environment or a safe way to firstly put it in your production environment, test the guardrails, tweak the guardrail, see what's the policies are doing and then finalize the thresholds. Right?

**17:30** · So this is the second one where we have now enforced the governance and you can see in the dashboard that the pre-all cost cap has exceeded. So you had a budget allotted for this run but the agent exceeded the budget and it was killed immediately. So that's the simple circuit breaker sort of a methodology. So this is the halt behavior. And now let's see the steer behavior which is the which is where we are trying to add value to this entire cost management scenario. So this time we're going to run the third the second prompt.

**18:00** · The budget allotted for this one is slightly higher but it's still not high enough for the agent to complete in time. So what instead happens is there is something called cost guard which kicks in. This cost guard it takes into account two things. First how much of your allotted budget have you consumed?

### Cost guard, and steering on velocity

**18:17** · Second what is the velocity at which you're consuming tokens. \[music\] Now based on these two things if it predicts that you're going to run out of your tokens or your allotted budget by the end of the run it's going to inject something into your system instructions that something could be as simple as hey you're running out of budget so make sure that the LM outputs are more succinct or more summarized right so

**18:39** · that is the way we are doing the steering now the this was a very simple test bench to show you like how this works on a like working code we have also benchmarked it on a couple of open source repos. So we have benchmarked it on browser use as well as metagp. Uh we ran it across multiple iterations across stress tests across simple scenarios hard scenarios and everything. And the results we see are the average spend goes down by almost 78% with token ops enabled with the full policy suit that we have today.

### Benchmark results and the policy catalog

**19:07** · On the completion part when we compare it with throttling just simple throttling your simple throttling is going to kill your agent runs no matter what. Right? So with the reduced average spend what you get is you get an uplift in that completion percentage from 67% to roughly 96%. So that is the value ad that token ops is doing here.

**19:27** · Now this is the policy catalog that we run this benchmark against. This is what we support today. We kind of researched what are the different failure modes that are there today out in the wild and tried to cover most of them here. So you have things across spend management, you have things across context management like context compaction, tool output reduction, you have things across loop detection and progress detection and stuff like that. So this is the entire set of policies that we support. And at the bottom you can see the actions. So as I mentioned earlier, we have two flavors. You have the uh the halt type actions and then the steer type actions.

**19:58** · So for the steer we can do allow, mutate, inject and so on. And for the halt, it can be a simple kill. But this is not the end state that we envision for this. The end state is we have a lot of data right we have a ledger that is continuously being updated. So what we want to try is we want to try a self-learning module within the token ops plane within the control plane which can look at this ledger and ask this question hey why or what is the failure

**20:24** · mode that I'm still not able to catch and then based on that it can do two things one is it can enhance it can generate new policies on the fly based on the missing or the still uh runaway costs or it can refine the existing parameters for the existing policies that are there so that the runaway costs are managed more effectively in the future. So with that I think uh that is all we have for you guys today. Thank you so much for your time and you can scan this QR code that's the public wiki. We are updating it almost regularly.

### A self learning control plane

**20:54** · So you can scan this and stay up to date and uh Tisha and I are around so if you guys have any questions or if you want to discuss more about it just let us know. That's it. Thank you. \[applause\]