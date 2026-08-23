---
title: "Give the Agent a Budget, Not a Token — Sachin Malhotra, Anthropic"
source: "https://www.youtube.com/watch?v=rbjWzZK2LU0"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "An agent tidying up after itself listed the workloads it no longer needed and deleted them. One stage of the pipeline evaluated to nothing, the filter dropped out, and the selector matched everything:"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=rbjWzZK2LU0)

An agent tidying up after itself listed the workloads it no longer needed and deleted them. One stage of the pipeline evaluated to nothing, the filter dropped out, and the selector matched everything: about 200 workloads gone in 90 seconds, roughly 20 engineers affected, some of it long running training jobs that were never checkpointed. Nothing malicious happened, and the agent did nothing Sachin Malhotra could not have done himself, because it was using his token. The failure was handing unbounded power to something nobody was watching closely.  
  
A token is a boolean, a static list of scopes you hold or you do not, and the standard fix of narrowing it fails the way it would with a new hire. You do not take the verb away, you bound it. A budget has four dimensions: how much, how fast, what can be undone, and who notices. That becomes three things you enforce and one question you ask. Asymmetric verbs, meaning give the agent the operations that fail loudly, like unskipping a test, and keep a human on the ones that fail silently, like skipping one. Rate limits on every write, refilling on their own so nobody files a ticket for more. Trip wires rather than allow lists, because a list written up front goes stale while aggregate counts tell you what actually happened. The undo test sizes all three. Underneath it all, identity has to be stamped by a proxy and never claimed by the caller, or the agent simply changes the header and its limit resets.  
  
Speaker info:  
\- https://x.com/edorado93  
\- https://www.linkedin.com/in/edorado93  
\- https://bruteforced.dev/  
  
Timestamps:  
0:00 - The demo, and what happens after it ships  
1:02 - 200 workloads deleted in 90 seconds  
2:42 - Why a narrower token scope is the wrong fix  
4:23 - A token is a boolean, a budget has dimensions  
6:05 - Asymmetric verbs, and skip versus unskip  
8:34 - Rate limits: a ceiling that refills  
10:16 - Trip wires beat allow lists  
12:47 - The undo test, and the second key  
13:37 - Feature flags: canary versus production  
15:19 - Where the policy lives, text and infrastructure  
17:49 - Why the proxy stamps identity, not the caller

## Transcript

### The demo, and what happens after it ships

**0:01** · \[music\] Hello. All right. Uh, let's get started.

**0:16** · So, um, well, welcome to the talk. Give the agent a budget, not a not a token.

**0:23** · Um, quick intro about me. My name is Sachin. Um, I'm an engineer on the CI team at Entropic. Uh we basically build and manage all of the test machinery for all the code that people write. Uh so everything from test quarantining to merge automation to CI autoscaling to merge cues, everything and anything in between. Um it's it's basically the plumbing that allows a few thousand engineers every day to ship code safely.

**0:45** · Uh I've been at the company for a little over 10 months. I'm based out of Seattle. Um and outside of work, I love dialing my espressos and climbing some crazy mountains.

**0:54** · So a lot of cool agent demos they they start with the same way really. So someone gives an agent a god token um and gives it an access to some sort of tool list and just watch as it goes. So and it does go like in in this particular example it it'll spin up like a cute little coffee website. It'll build all the pages, deploy them, uh bring it up live and it's done in 3 seconds. Uh people will nod people will clap and someone will ship it into production.

### 200 workloads deleted in 90 seconds

**1:18** · And this this talk is basically about what happens after that after the demo ships once the agent is starting to do some like real work in production. \[snorts\] So here's what after looked like in in our one of our scenarios. So what you're looking at is like a real command. Um the agent was trying to clean up after itself. Um it it was basically listing a bunch of workloads that were no longer interesting or useful to itself. Um and then it found them and deleted them.

**1:42** · Now that's that's completely reasonable except one stage in the pipeline basically evaluated to nothing and the filter dropped out and now the selector matched everything.

**1:56** · So you can see it took out about 200 workloads uh which ended up impacting about 20 engineers worth of stuff and all of that was gone in 90 seconds.

**2:05** · Nobody was being malicious in this case like the agent genuinely thought it was tidying up after itself. uh some of these workloads were long running training jobs and stuff. Maybe some of these were not even checkpointed and it was just like hours of progress that was gone poof in like 90 seconds and stuff, right? Um the the problem in in this case is that this idea of like here's a token and here's a tool list that is just like not enough like it just doesn't scale when the agent is starting to do some some like real work in production.

**2:37** · So here's just a brief summary of like what we're going to talk about today. Uh I'm going to walk through three primitives um and asymmetric verbs. We we're going to look at some like rate limits. We're going to look at this idea of like trip wires over allow lists. And then I'm going to talk about this one lens that which I call the undo test that you can sort of use to size up the other three primitives. Uh so three things that you basically enforce and then one question you sort of ask about all of them.

### Why a narrower token scope is the wrong fix

**3:06** · So here's basically what bugged me uh after the cleanup was done for the incident that I was just showing you. Uh the the agent technically hadn't done anything that I couldn't have done. Uh it was using my token after all. The the failure wasn't the model itself. The failure was that I was giving the agent unbounded amount of power to do something that I wasn't watching super intently. Um and it was we've basically solved this the same kind of problem except not for agents but like the first time you onboarded like a junior engineer on onto your own teams, right?

**3:37** · So just think about it like we don't we don't basically sit around watching um every engineer or new boarded person just like type out every keystroke on their keyboard, right? Like we're not behind their chairs just watching everything that they're doing. Uh there is always a path on whenever a new engineer wants to ask for something. Um there is always an escalation path. uh the catastrophic stuff is just structurally out of reach for them. So the the other side of the coin is that the agents are very different. They they never get tired. They never sleep. And every so often they're just like very confidently wrong.

**4:07** · Um and if I'm being honest, that's that's maybe most of us on the first month of our jobs anyways. And so what what we're going to talk about in a little bit in is just this idea of like your onboarding checklist, but written down as policy for for agents.

### A token is a boolean, a budget has dimensions

**4:23** · So that and that brings me to the word in the title of my my talk here is that the the the standard fix for an incident like that is basically that you narrow the token scope, right? Like you just take the deletes away effectively. You would technically never do that for like a new hire, right? Like you would you wouldn't take the whole verb away from them. And it also doesn't work for an agent either.

**4:43** · Maybe it works for about a week, maybe two, but then you eventually end up in a situation where the agent is genuinely trying to delete something that it feels like is just not in the infrastructure and you will just be there sitting and pressing enter by hand all over again. The the core concept with a token that I feel like is wrong is that a token is a boolean. It's just a yes or no. It's a static list of scopes. Um you either have it or you don't have it. So if the token list is too tight, then your agent is effectively useless.

**5:12** · If the token list is too wide, then you're maybe writing writing like a postmortm. A budget is a very different shape. A budget is is um not just like one number. It just has like four different four different dimensions, right? How much can the agent do? Uh how fast can it do it? What can it undo on its own? And then who's noticing while it's actually taking those actions? And that's roughly the umbrella for like my four primitives.

**5:36** · Uh is that each of the things that follow, they're basically being um one of the things along these dimensions. and they're going to replace a yes or no question with a budget.

**5:47** · So, I'm going to start off with this first verb which I call asymmetric verbs. Uh, and by verbs I simply means operations or actions that an agent can take. So, like it could be API calls, it could be uh CLI commands, it could be really anything. And they're asymmetric because the same sized action even though it looks same size, they're they can have very different blast radius in actuality depending on which direction it goes. So the the core point is that you need to stop thinking about resources for a second and think about verbs. So specifically think about what happens when one of the verbs goes wrong. So some verbs they fail out loud.

### Asymmetric verbs, and skip versus unskip

**6:22** · So in this particular example, let's say if an agent decides to unskip a test and say it's the wrong call, the worst that would happen is CI would go red uh for a bunch of people. Um same with paging.

**6:32** · Like if an agent decides to page a human and if it's the wrong call, the worst that's happening is that it's a nuisance for the on call. But there's always a human to correct it. There are other verbs that fail silently, right? So if the agent decides to skip a test uh due to whatever reason, it shouldn't have.

**6:48** · Nothing technically turns red. A real bug can actually walk into production with green checks and nobody would notice it until much later. So unskip and skip in this example, they're effectively the they're the same kind of action, but the difference is which of the failures would show up on a dashboard and which one wouldn't. And so the core idea is that you give um access to verbs that can fail out loud loudly on a dashboard to your agent and for the other ones just involve a human.

**7:14** · Uh just a bit of context on CI stuff and how this plays out for us is that we have a test quarantining service behind the scenes and it basically holds a list of um all the tests that are currently skipped because an on call decided that it had to uh they had to like break glass a certain situation whenever there was like an incident or something. Now the agent has the ability to reenable any one of these own depending on like when it evaluates when the tests are uh working fine and stuff.

**7:38** · Again if it's the wrong call the worst that would happen is a bunch of different builds and tests would just like start showing up red and then a human can actually put them back very cheaply. The skip is a break glass verb itself right like it's basically as I mentioned what our on call would reach for uh during a very critical situation during under pressure and stuff. And so in that scenario if like uh an agent actually gets it wrong a real production bug can actually a real bug can walk into production. So this needs a human and it will always leave an audit trail.

**8:05** · Uh and the key detail is that the agent itself is not responsible for writing the row or the audit trail itself. There is a proxy in the middle that I've highlighted that I'm going to talk about in a little bit. Uh which is responsible for stamping the caller's main identity on every call whether it's a skip or an unskip. um the agent technically never holds uh the pen on its own provenence.

**8:26** · The second primitive is about rate limits. Uh it's pretty standard concept but and this is the most concrete form of like the budget idea as a whole. So a ceiling that refills. So every caller gets a small amount of disruptive actions uh per time window. So you can spend them however you want. Uh there's no approval, there's no waiting. And if you cross the line, the request simply bounces back with a count saying that you're actually exceeding your count um your budget. You wait a bit and then the limit essentially refills. And that's that's the whole thing. So the agent gets full autonomy within the limit.

### Rate limits: a ceiling that refills

**8:55** · And there is a hard ceiling on how bad a single loop can get. And every write effectively gets a rate limit. There are no exceptions to that. What changes is the size of the rate limit. So if if if I'm if I'm trying to delete a bunch of workloads in my own name space like my my rate limit might be higher but if I'm trying to touch resources in a shared namespace my budget or my rate limits might be smaller.

**9:19** · So this is uh effectively the solutioning for the incident that I was showing earlier. Um after the incident the team sort of that sits next to mine they they built an admission web hook of sorts uh whose sole job is to cap the number of deletes at a fixed number per hour per resource kind per name space.

**9:35** · There is always a bypass flag because sometimes you genuinely want to delete more than you're allowed for and maybe some on call scenario or whatever. And the part that I absolutely love in this case is that inside a cloud code session or inside an agent session effectively the the bypass flag simply refuses to do anything. All it's going to do is tell the agent to ask the human to run the command itself. So the agent effectively gets the rate limit and the human keeps the override and nobody effectively has to file a ticket for uh the limit because it just like refills.

**10:05** · The third primitive is about this concept of trip wires over allow lists.

**10:10** · So in my mind like an allow list is effectively a guess that you're making up front about what the agent needs or about model behavior or agent behavior itself. uh I feel like it's pretty static and you write it up front before before you have any data on like how the agent is behaving in different situations. A trip wire on the other hand is how you get that data like after the fact. So for cheap actions you let the agent act and every action gets recorded with the actor sort of stamp identity stamp and these two kind of go well together like rate limits are the enforcement um they they put a hard limit on uh the rate itself.

### Trip wires beat allow lists

**10:40** · Trip wires are how you find out what actually happened so you've got something to react to. So you effectively watch the aggregate and not like individual calls.

**10:51** · And usually when a trip wire goes off the fix is like maybe one or two lines in the agents context and not really a big code change. Uh the core point is that allow lists don't really get better over time. They can get stale but trip wires do get better over time. So here's like a loopin practice for us.

**11:06** · So like we track one number uh which is the number of investigation threads that our agent is launching per hour for a given test job failure. So one morning say the number was way above the baseline and the trip fire page is on call and that part's important because a trip wire that nobody sees is practically useless. Uh it pages after the right has already happened after the the limit has been crossed not before.

**11:27** · It's effectively the smoke detector not the lock on the door. Uh the agent has spun up in this particular scenario a bunch of like investigation threads for dozens of job that were all failing with the same kind of error signature. Each thread effectively looked reasonable on its own, but like if you took them in aggregate, you would realize that it was actually an infrastructure failure that was causing the same test failure signatures across the board.

**11:46** · So the fix in this case was as simply as telling the agent on like, hey, the next time you encounter something like this, maybe try to correlate a bunch of different failures and test jobs and stuff before launching a separate investigation thread. So that correlation is important. Um and the next time when this happened, uh it did exactly that because that that example and that line of like how it should react and like how it should like uh debug things was was right there to guide it.

**12:12** · So that's three rough primitives. Now the lens I mentioned at the start is this idea of undo test. And this one's slightly different. It's it's not something you effectively enforce in code. It's the question you ask when you're sizing the other three. So it's two questions really. One, can the agent put it back by itself? and how bad would the impact be if it actually got it wrong. And this this this sounds like asymmetric verbs in a sense, but it's kind of difference because the verbs ask whether you would notice the failure and undo asks whether you can recover from it.

**12:42** · So if if if the agent can effectively roll back its own change and the blast radius is acceptable to you, you effectively log it and you let it go. If either of the answers is no, then you effectively need a second key and the second key is not something that the agent holds itself. It has to be someone else. Um, and there has to be an audit record so that you can you can track on like what happened, why the second key was involved and stuff like that.

### The undo test, and the second key

**13:07** · Let me let me just show you this another example of like how this works outside of like the CI domain specifically. So our agent has a key for one of our feature flag services. So on the canary side which is basically our staging traffic and a bunch of like dog fooding customers the agent effectively has the full dial. It has the ability to um ramp up a specific feature flag roll it out to uh all of the canary traffic and it can take it all the way from zero to 100 and it also has the ability to sort of uh look at any bugs that are being filed and toggle it back off and on. What the agents key is not scoped to do is for promoting the flag to real production.

### Feature flags: canary versus production

**13:39** · The best that an agent can do for now in a lot of cases is that it can propose uh that an that someone actually promote the feature flag in production because it's been tested out in Canary. But that's pretty much it. Um the second key in this scenario is not necessarily a new O system. It's a scoped key for production and a scoped key for Canary.

**13:59** · So this is what it looks like day-to-day for for me personally. is like I I ask cla tag in our slack channel to to own the loop the entire loop uh on on rolling out a flag. It can it can basically ask me a clarifying question on whether this is for internal dog fooding group or early access or whatever. Uh and the important part is that I'm not in the middle of any of these things. Every action that the agent is taking is stamped with its own identity and not mine. And that stamp is basically what ties the whole thing the whole thing together.

**14:27** · So the these these primitives they compose together nicely because each one asks us a different question right the verbs ask what the agent is touching the rate limit asks how often and the trip wires catch what happened afterwards and the undo test is sort of the length that I personally used to to size all these three now the original sort of cold open delete that I was showing you the the incident itself the rate limit itself would have capped it at a few couple of tens of workloads itself the undo test if you would be thinking about it it will basically tell you that you can't unddelete a running job in someone else's namespace.

**14:56** · Um so so anything past the cap basically need a human with the with a with a second key. So the the important part is that you don't need all the checks in every right scenario.

**15:07** · Only some of these might be relevant for like whatever kind of action you're trying to evaluate. Uh and if any of these really sound familiar, it it should because this is effectively some sort of onboarding checklist for your engineers like what can a new engineer touch, how much rope do they get, who signs off on their operations, and how do we know it's effectively working? We just wrote it for people. It's now the same checklist that we want for agents.

### Where the policy lives, text and infrastructure

**15:30** · So where does all the policy that I've been talking about really live? Uh it's two places and I feel like you need both. The first one is text. Uh that's prompts. That's your context files markdown the agent reads before it can act. And this is where you can explain your why the the intent. We've we got exactly the same sentence that I was showing earlier um written down in a markdown file. It works about 80% of the time. Uh the the upside is that it's very cheap to change and you can explain the reasoning. The downside is you have to garden it because the the files can grow over time and at the end of the day it's just advice.

**16:00** · Uh text can shape the intent but there is no enforcement anywhere. The the second place is infrastructure uh which is the proxy layer for us. So the proxy is is not reading the prompt. It doesn't know why the agent wants to do something and it doesn't really care. It will see a delete happening. It'll see like a budget being crossed and it'll simply return a 403 and that's the whole conversation really. It's narrow. It's deterministic. It it counts, compares, it can allow a delete or deny.

**16:26** · What it can't do is explain the why and a clever like prompt injection cannot really talk it out of the rule itself. So you need both. Uh the text shapes what an agent is trying to do and infra is bounding how wrong can it go.

**16:42** · So zooming out, this is where uh the the infrastructure sort of really lives for us. So like every agent session has its own proxy running right next to it. The agent starts off by reading its own context file. The the markdown files that I was showing earlier that's that's the text layer and every outbound call goes through the proxy after that point which is the infrastructure layer. So the proxy is not like whatever the agent is trying to do the the proxy is only responsible for stamping that action with the agent's identity.

**17:06** · Uh like if the if the if the agent is trying to launch a bunch of jobs in a Kubernetes cluster the the proxy is not following it. what is following is the stamp itself, the identity itself. So the in this example, the cluster would write the stamp onto the job as a label. Um and every child job or anything that's happening afterwards simply inherits the same identity and the every safeguard that is there in the rest of our systems that that are simply they're simply reading that like one label.

**17:32** · Uh whether it's ownership, whether it's kotaas, rate limits, approvals, trip wires, whatever it is, they're all keyed on the same stamp and the agent never got to touch it.

**17:43** · So that's roughly the shape of it. But before I wrap up, I want to spend like 30 seconds on why it has to be a proxy layer, like a different layer that is doing the stamping on this identity and not the caller itself. Because without it, the agent can roughly pick a different name. Um, and every limit that you've basically set resets.

### Why the proxy stamps identity, not the caller

**18:01** · So say the agent has the ability to set its own identity in a header, right? So let's say it hits a specific limit and what's the easiest fix from an agent's point of view that it can do? it'll just change the header. In this case, it'll just say instead of such in such in two and voila, you just have a fresh budget to work with. Now, in this case, you technically don't have a rate limit. You just have a suggestion. Uh with the proxy in the path, the agent never gets to say who it is. The proxy already knows. It's the thing that's holding real credentials and it stamps every call with the identity that it already knows, not the one that agent claims.

**18:35** · And because proxy is the one that is stamping, you also get this per session ID so that you're able to differentiate different sessions that are running all for you and see which one's overreacting or which one's not acting as it's supposed to be.

**18:49** · U so again just stuffs that I want you to take home with is give the agent access to verbs that would fail out loud uh and keep the human on the ones that can fail out quietly. Two, you you put a ceiling on every right and that has the ability to refill on its own so nobody's effectively filing tickets. Three, you watch the aggregate and not the individual calls that help you understand the agents behavior. Um, and then you fix whatever you can with the sentence. And four, you use the undo test to sort of size all of these three or any other u primitive that you have for your own write operations.

**19:20** · And underneath all of this uh is is this concept of identity which has to come from the infrastructure, not from the request. I feel like that's one rule. If you get that one rule right, everything else is uh just just tuning.

**19:34** · Thank you.

**19:35** · \[applause\] \[music\]