---
title: "SimulationMaxxing: How we ship agents 20× faster — Aman Gupta (Nubank) + Shreya Rajpal (Snowglobe)"
source: "https://www.youtube.com/watch?v=KMR_RBoCa4M"
author:
  - "[[AI Engineer]]"
published: 2026-07-29
created: 2026-08-07
description: "Nubank serves 135 million customers, so an AI agent that mishandles a support conversation fails at scale. The talk opens with the result: five agents in production, higher customer satisfaction, and"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=KMR_RBoCa4M)

Nubank serves 135 million customers, so an AI agent that mishandles a support conversation fails at scale. The talk opens with the result: five agents in production, higher customer satisfaction, and roughly 20 times faster shipping. Shreya Rajpal, CEO of Snowglobe, argues the thing that unlocked that pace was evals, and specifically simulated data standing in for real conversations. Good agent evals are hard because the data is multi turn and stateful, not single turn question and answer, and hand curating it and waiting on production to confirm can take forever.  
  
Snowglobe points at the agent and generates grounded simulations, a customer like Maria trying to order a credit card, complete with account context, tone, and intent, so you can ship, observe, simulate, and feed the results back in a tight loop. Human review found the simulated conversations comparable to real ones about 80% of the time, enough to bring up new agents, derisk changes, and protect the self service rate. With aligned metrics and cheap simulation, the team now tests open models and variant agents freely, because the eval bottleneck is gone.  
  
Speaker info:  
\- https://x.com/aman2304  
\- https://x.com/ShreyaR  
\- https://www.linkedin.com/in/shreya-rajpal/  
\- http://shreya-rajpal.com  
  
Timestamps:  
0:00 - Opening with the results  
0:39 - Nubank at 135 million customers  
2:34 - Why evals matter most  
2:47 - Why simulated data works  
3:49 - What makes agent eval data hard  
4:49 - How teams get eval data today  
6:44 - Simulations in minutes, not weeks  
7:35 - Pointing Snowglobe at your agent  
8:48 - A grounded simulation: Maria orders a card  
10:31 - Ship, observe, simulate, repeat  
11:34 - How close simulations are to real  
13:43 - Testing models and variants

## Transcript

### Opening with the results

**0:01** · \[music\] Hi everybody, my name is Shrea. I am the CEO of Snow Globe and we have with us Ammon who is a principal machine learning engineer at new. And this talk is going to be about simulation maxing and how you can ship or how new bank ships uh agents 20x faster using simulations.

**0:32** · Hey everyone, I'm Aman. Uh so let me talk about New Bank at a glance. We are the lead leading digital bank in Latin America. We have 135 million customers uh in Brazil, Mexico, and Colombia and we are launching in the US real soon. uh our quarterly revenue crossed 5 billion in Q1 2026.

### Nubank at 135 million customers

**0:49** · Our NPS customer love is very high and we are the perfect company for using AI agents for customer support where human Xpers are fanatical customer care people and AI agents together solve customer issues in a fast empathetic and correct manner. AI handles a lot of routines end to end. uh humans focus on the hardest and longtail cases and together we aim to delight our customers.

**1:19** · So as Shria said this talk is only about uh one thing really. If you generate your eval data in sim instead of waiting on production data you can ship agents 20x faster and we'll give you evidence for that. So let's start with the results directly.

**1:35** · Uh uh so this is you know the average of TNPS which is a measure of customer satisfaction for five of our AI agents in production and at the beginning uh they were not so great but now in a with a few months of uh of work and a few quarters worth of effort we've been able to massively increase the TNPS and customer love for our AI agents and many of them are approaching human quality and this data is a bit stale many of them are exceeding human quality.

**2:04** · So we are at the stage where we are actually able to show proof that this actually works in production. Uh here's a QR code for our KD paper in case you want to check it out. It's going to be presented uh in Korea uh in August.

**2:21** · Uh awesome. So we open with results and you know it's really about this journey of how do you implement the right systems uh for evaluation in order to you know be able to achieve those results. So in this talk we basically split it up into these three sections.

### Why evals matter most

**2:34** · The first is why evals are so important and essential but why they're also the bottleneck from being able to you know do a lot of high throughput experimentation to get the results that Amen was showing earlier and then why the second part of this talk is about why simulated data uh works as well as collected data and helps you circumvent a lot of this bottleneck that we're going to talk about and then the third part is really digging deep into the systems and the findings that we had by implementing uh you know this framework at scale in new Uh, awesome.

### Why simulated data works

**3:04** · So, eval there this there's like a whole talk track dedicated at this conference to eval. Evals are absolutely critical for building good agents and evals are really only about two things, right? There's metrics and there's data. uh metrics again I hope you attended many of the amazing talks yesterday on the evals track but metrics are really while they're challenging we have a playbook for how to build metrics that are really well aligned with you know the rubrics that we care about right which is you essentially use um you know LM as a judge style uh you know

**3:37** · classifiers and you align it with human judgment and and getting human data and you can iteratively build on it using you know auto optimization and autoprompt tuning uh techniques the thing that's a bottleneck And that still remains very challenging and unsolved is what is the data that you're actually computing these metrics on and that process is very timeconuming and very expensive specifically so for agents.

### What makes agent eval data hard

**3:57** · So once again people have been talking about you know if if you're around like machine learning era circa you know 2018 it would be like ML work is 85% data work right so data has always been challenging but with agents the level of sophistication that data requires is just so much more expensive.

**4:16** · So here's examples you know of what structured ML data looked like uh and what even early era of AI uh data for you know chat bots or single turn QA which was you know much more manageable and tractable and you could still think of it as these structured rows. Uh but now for multi-turn agents each data point is a trajectory with a lot of internal tool calls that all need state etc. And that becomes very even one data point is expensive to generate and annotate right but scaling it up on a sample set becomes even harder.

### How teams get eval data today

**4:49** · Um so how teams primarily get eval data today is two methods. Uh one is either manual or the second is production traces and both of those are painful but for different reasons right manual authoring I mean this one's obvious it is so timeconuming especially the kind of data that I was showing you on the previous slide. You have to hand plan you know state updates.

**5:09** · You have to hand plan the trajectory that you want to take this uh you know agent data point in and synthetic uh the the state for these data points has to stay consistent across all tool calls etc that you make right production traces in comparison are almost free. You don't have to pay for them. You're going to get them anyway. But the cost is that you're testing on real live users every time you're testing it.

**5:33** · So for example, if you want to run, you know, many parallel experiments at scale, which is often something you want to do in a machine learning setting is it becomes very hard to do that in prod.

**5:46** · So for those of you who build agents, you know how difficult building a new agent and maintaining uh an existing agent is. So if you want to change the agent harness, you want to change the prompt, the tools, anything around the the LLM that powers your agent, that can take a few hours and in in the best case. But as Fria mentioned, running offline evals on hand curated data can take a few days.

**6:06** · And then the the worst part is if you run an AB test in production and monitor regressions, see if you get a statistically significant improvement of of a previous version that can take forever because customer feedback is through some kind of a feedback form and it can be sparse, it can be noisy and can take forever to know am I moving in the right direction or not.

**6:27** · So I'm here to tell you that uh we have verified in production that yes simulations circuit this timeline short circuit this timeline from a few weeks you can go to less than a day sometimes even a few hours a few minutes and uh as I mentioned earlier uh you know with simulations it takes a few hours uh without simulation it takes a few hours to change the harness and offline evals and all of that's become super fast now with simulation the agent

### Simulations in minutes, not weeks

**6:55** · harness chain still takes a few hours running offline evals becomes a lot easier because you have a simulated user to fall back on. You're not waiting on hand curated data. You're not waiting on you know people to create data for you.

**7:07** · And the best part if you want to know that am I doing well in production? Is this version going to do well? That can take just a few hours. So this has been a real gamecher for us at New Bank.

**7:20** · Um all right. So we talked about you know like simulations shortening the release cycle but what is mechanically a simulation you know it's existed in robotics it's existed in you know a lot of different domains but simulations for agent eval you know mean a specific thing and this is really where snow globe enters and you know sets up a lot of that core infrastructure for you.

### Pointing Snowglobe at your agent

**7:39** · So simulations are essentially you know it works by first like wrapping your agent you know using a um uh like pointing the snow globe SDK at your agent without requiring any code changes and you know you can gro what are the tools that you really need in to mock in order to make the simulation really work. The second input is about how you want to drive or steer your your simulation. So you know who are the personas what are the use cases what are the data points that we're really simulating.

**8:06** · Once you have those inputs ready, snow globe essentially runs the simulation and on the output you end up getting you know first just a data set. So you get like thousands of multi-turn conversations against your real agents. These conversations have you know tools mocked etc. have all of the bells and whistles needed to be actually you know useful for evaluating your agent already ready and then you run like judges on top of it so that on this data set you get you

**8:32** · know per turn information about how your agent is really behaving and it then like pipes directly into you know your evaluation pipeline so that you can really get data on demand.

**8:42** · Um this is an example of what a sim what the what what a concrete output of simulation is like right so this is as an example like one simulated persona and then the corresponding conversation or data point for that simulated persona so here for example this is totally synthetic a user named Maria Souza uh

### A grounded simulation: Maria orders a card

**9:01** · you know she wants to order a credit card this is who she is she's 34 a designer first-time credit card customer in addition to you know this basic information about this synthetic user we also will generate, you know, this essential grounding data as an example, this fake address, a fake credit card, etc. that stays consistent across your agent execution so that you know your agent can actually be evaluated against that. And then you also have things like tone, voice, how do they really interact?

**9:27** · And then oops, and then when you actually run this persona through the conver through the agent, you end up getting, you know, this uh conversation that's consistent with the simulated intent, right? So you see for example that this user has very curt oneline messages in terms of how they interact because this is how the persona was set up or that you know when the agent wants

**9:49** · to when the agent runs its tool when Maria enters the chat the agent is actually able to get a valid output mocked by the simulator that you know is able to identify who the user is where the address is the address can be verified etc. Um and then finally all of this is also grounded in like account data as well.

**10:10** · So for those of us building real agents, you know how hard things are. Uh you don't know if your agent is good, you don't know if your evals are good. You have no idea what's happening. And that was me a few quarters ago. Uh since the theme of uh this year's conference is self-improving agents. So we are also kind of jumping on the bandwagon. So this is our self-improvement loop. You ship your agent, you observe, you create robust evals. You spend a lot of time creating robust evals using automated prompt optimization with algorithms like Japa. And then you also do simulation.

### Ship, observe, simulate, repeat

**10:43** · You run simulation and you pipe the simulation data and real data through your evals. And that gives you rich signal to then optimize your agent harness. And once you verify the agent harness optimization is good, you ship.

**10:57** · And this has enabled us to do many many many AB tests for a given agent. And we have many many such agents across the company. So this has been a real gamecher for us in terms of improving our agents and the proof as I already showed you is that you know the quality of our agents is going up uh pretty dramatically.

**11:14** · This is some data on how simulation really tracks real production data. So when you run uh simulations you want to compare is my simulation comparable to production data. So we looked at sim quality via evals. So far uh you know quality of uh with evals from sim and real data the correlation is pretty high and we had human review done where 80% of our domain expert labels confirmed that sims give us usable data not just for uh mature agents but also for green field agents.

### How close simulations are to real

**11:44** · So this has been uh pretty useful for us in bringing up a new agent from scratch and also taking an existing agent and and massively improving it.

**11:55** · And as as we as I mentioned, you know, simulation is not just about improving uh and sh also talked about this. We are derisking a lot of things that could have made to production. For instance, we caught a regression uh with simulation that could have made it to production, but simulation caught it.

**12:09** · And at the same time, we also caught in another agent an issue uh which could have lowered our self-service rate making it less efficient. And all of this has resulted in pretty large improvements. Uh for instance, one of our agents, the TNPS, has 2xed uh thanks to simulation, robust evals, and investing in something super principled rather than, you know, throwing something at the wall and see what sticks. Um it's been pretty awesome to see simulation saving us so much time.

**12:37** · So now the team uses snow globe and tries different ideas and they're able to short circuit launching AB test. They don't launch until they're happy with the same output. So imagine if you're running 10 AB tests a quarter for your agent or probably more if you have more data. Now you can just run a bunch of stuff through SIM and launch just one AB test which kind of shortcircuits launching the first five or six. And at the same time uh this this is often discussed in customer service circles that TNPS can come at the cost of self-service rate.

**13:07** · Sometimes there's a trade-off but I'm happy to report that we are not compromising all self- service rate with SIM. We are also able to pretty dramatically improve SSR across the board. But in one particular case, we were able to improve it by 4%. All of this makes us a much more efficient company and makes sure that we keep our customers really happy and we keep our SSR rates and TPS rates very very high.

**13:33** · This is one example that I am most excited about. As you know, all of you know open source models have been on a tear recently. So many of them have come out. So, we've been trying to test various open source models in our agent harnesses and see which ones are the best. And with SIM, we have the perfect recipe to just throw a bunch of ideas, open source models at our agent harness and eval setup and see which model versions uh you know really really work for us.

### Testing models and variants

**14:01** · Uh this has saved us multiple weeks of effort and probably underelling it. It's it's been it's been pretty awesome and uh we have AB test running as I speak uh figuring out are these open source models as good as you know uh the frontier models. So SIM is is is been super super helpful in helping us figure out uh kind of you know spreading our cards uh a bit.

**14:26** · Um awesome. So um the core three takeaways from this talk right is about um where eval is today and how you can really remove a lot of bottlenecks to it. So we lied when we said earlier that there's just one thing you should take away from it. That one thing is still essential but there's a few key downstream things that you can unlock if you know you adopt it which is the first is if you generate your evaluation data in simulation rather than solely relying

**14:52** · on production to get signal on how you know different agents are performing uh you'll be able to undercut or you'll be able to short circuit a lot of the uh bottleneck in in releasing you know versions of your agents much faster. The second is in order for any of these gains to really be unlocked uh you know you really need to close out the sim toreal gap.

**15:10** · So you need to you know set up like offline online human review kind of metrics to really understand how sim performs visav real production data that you've seen uh so that you you you are able to kind of like trust the results of these simulations. Um and the third is again there's so much excitement around you know like auto research self-improving agents RSI etc. uh in an enterprise setting when you're building an agent, it really does come down to two things, data and metrics.

**15:36** · If you have align metrics that are able to really catch the signals you care about and you have a reliable way of generating data that those metrics can give you signal on, it's then very easy to put together a loop of an agent that you know continuously improves itself from like feedback it receives from all of these places. Uh which you know again is like where the future of this field is heading.

**16:01** · Um, awesome. That's that's us. Uh, thank you for coming for the talk. Uh, there's few like contact links and details for us, you know, if you guys want to get in touch and otherwise we'll be around here if you guys want to ask us any questions.

**16:27** · \[music\]