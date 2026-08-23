---
title: "Coding Agents Don't Scale Themselves. Neither Do Your Teams. — Patrick Debois, Tessl"
source: "https://www.youtube.com/watch?v=zCJtYuqwm7E"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "In 2009 people told Patrick Debois that continuous delivery was crazy. He hears the same thing now about the dark factory, and reads it the same way: not that the technology cannot work, but that the"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=zCJtYuqwm7E)

In 2009 people told Patrick Debois that continuous delivery was crazy. He hears the same thing now about the dark factory, and reads it the same way: not that the technology cannot work, but that the organization is not set up for it yet. His starting assumption is that harnesses and loops will commoditize, possibly into a service a frontier lab just sells you, so none of that will be anyone's differentiator. What actually changes is the team, the platform and the organization around them.  
  
Developers pushed back on the conductor framing, telling him they did not sign up to write better prompts. What brought them back was tooling. Once the team started building harnesses for the agent, a genuinely technical path reopened, and the loudest skeptics turned out to be the right people to hand context authoring to, precisely because they were angry about the output. The shift he pushes is to stop fixing the code the agent produced and improve the system instead. Retros stop being about the code and become about where the agent hit the same wall repeatedly. Planning splits into work scoped tightly enough to hand off and work that still needs a conversation. He tracks two numbers: how many human touches it takes to get the right result, which should fall, and how much of each fix is shared, because one improvement to a common harness lands for everybody rather than making a single person 10x. Above the team it is paved roads and a named owner, not a thousand flowers blooming.  
  
Speaker info:  
\- https://x.com/patrickdebois  
\- https://www.linkedin.com/in/patrickdebois/  
\- https://jedi.be  
  
Timestamps:  
0:00 - It will not work here, and what that signals  
2:46 - Developers who did not sign up for prompting  
5:20 - Stop fixing the code, improve the system  
7:04 - Retros, planning, and the downstream squeeze  
9:38 - Two metrics: human touches and reuse  
10:29 - The platform team's new problems  
12:12 - Sprawl, paved roads, and making spend visible  
14:43 - Enabling the organization without a champions program  
15:36 - Hiring when the job titles mean nothing  
18:07 - Optimize the spend instead of capping it  
20:38 - A dim factory, and knowledge as the moat

## Transcript

### It will not work here, and what that signals

**0:01** · \[music\] Well, welcome.

**0:14** · Um last day, I guess. That's what happens.

**0:18** · Um I'm going to talk to you maybe not on the technical side, but more on the organizational side. So, if you're here for any technology, you can still leave if you want to.

**0:31** · So, in 2009, um a lot of people were telling me the idea of continuous delivery was crazy.

**0:38** · And I feel we're in kind of the same era or kind of the same thing right now with a dark factory. It will not work here. That's what I keep hearing over and over again.

**0:50** · Um but what they're actually signaling to me, we're not ready yet.

**0:54** · So, it's not the technology that can't make it work. It's not something they won't be able to do eventually, but they're just not set up for this.

**1:04** · And there's been a lot of conference talks here about optimizing agents with loops and harnesses and all those pieces, and I think that's great. But eventually, we'll get there, right? It's not that this is the rocket science. And yes, we'll have to assemble this in a good way, but one day, this will kind of become commodity. Somewhere maybe even going into one of the, you know, frontier labs that just offers this as a service and will kind of make this work. Uh and that's not going to be the differentiator um for your organization.

**1:38** · So, I'm starting from there up. Assume we're heading towards the dark factory, some kind of form of autonomous working within an organization.

**1:48** · Um what I've seen for the people adopting this within our organization, including here where I work at Tessal, it changes dynamic of the way you collaborate around us. And for those familiar, there's like Conway's Law, like, you know, the way you organize yourselves and the tools, there is a relationship on how they interact and kind of work together on this.

**2:12** · But today, I'm not talking about like how do you become better with your agent, but it is about how will will change your team dynamics, your platform, and your organization. So, that's what I'll take you through.

**2:26** · Enabling the team. I assume most of you somewhere work in a team and that you're not somewhere a solopreneur \[music\] working. So, it kind of works different than just you with your Claude code and a team working together around that with Claude or any of the coding agents there as well.

### Developers who did not sign up for prompting

**2:46** · The narrative that I heard a lot is well, the developer eventually becomes more of a conductor and an orchestrator of agents.

**2:56** · And then I think that's fair. That's been an evolution that we're on on the path where more like becoming the managers of the agent, they're kind of dealing with the agents.

**3:06** · Now, what I've seen is that if eventually a lot of developers told me, "We didn't sign up for this. We didn't sign up for better prompting, writing better specs.

**3:16** · We're engineers. We're technical." And that creates friction, like, is this the role that we really want to do?

**3:24** · There was a thing that came around which maybe is more context engineering that put a first step around like, "Hey, it's not just a prompt. We'll test the prompt. We'll kind of evaluate the prompt. We'll kind of distribute the prompt and kind of optimize the prompt."

**3:39** · So, yes, there's a little bit of engineering, but still a lot of developers kind of felt empty just working kind of with a prompt and a specification as such.

**3:51** · What I've seen is that when we started introducing harness and loops and eventually more autonomous work within the whole organization, a new technical path opened.

**4:02** · All of a sudden, we were helping the agent with tooling, building tooling for the agent, and that kind of reignited some of the developers who kind of felt that it wasn't for them. Now, all of a sudden, they were like, "Yes, we can do this. We have that knowledge. We're like somehow helping this even with a kind of programmatic way." So, I I think that's interesting that the identity, where we say abstraction, abstraction, abstraction, technically, all of a sudden, the craft created some new location for more engineering stuff to go to.

**4:37** · Now, when I get the question, "Can we please help people?" And there's skeptical people, what do they do?

**4:45** · And I always really say that these are really great people to engage in creating better context for the agent because you tell them, "Please improve. Please put all your knowledge to improve the result of the agent." And the same with the harness. So, if you have those kind of more resistant people that like complain maybe about the quality that things were produced by just the vanilla kind of coding agent, use almost that anger, use kind of that skepticism to kind of make it better.

### Stop fixing the code, improve the system

**5:20** · And the big mentality shift, if I would advise a a a a company right now for their developers, is kind of stop fixing the code that the agent kind of produced, but improve the system.

**5:36** · I'm I have I'm not the only one saying this in this event, but kind of that is the difference. Like you kind of improve the system. And I think it was Swyx uh a couple of years who said it, like stop building the thing, but build the thing that builds the thing, right? So, we going on that abstraction where that is with context, with harness, with loops.

**5:56** · And that is kind of the change that a lot of people who are still very tightly in the loop, auto completion, prompting, that they kind of need to think about elevating this to the system thinking.

**6:09** · So, what we're really trying to do is minimize the human touches, but still with good engineering practices.

**6:19** · And some of the narrative that comes up more often in the beginning, we're like, "Oh, great. I write code in a prompt, and then it gives a result, and we can keep going."

**6:27** · Where we now see, well, we're kind of instructing it through prompts, but we're also instructing this like, "Please do it with tests. Please update the documentation. Please do this." All the things that we're saying to good engineers, we're now asking the agents to do. So, if you still have people who kind of yoloing their way into this, I think you should tell them, "No, stop doing this." Like, engineering practices still matter for you to maintain the system, and also for the agent to keep getting better at this.

**7:03** · What I started seeing in some of the more advanced kind of teams is that their rituals of "Hey, we're doing a planning, and we're doing a retro in a team."

### Retros, planning, and the downstream squeeze

**7:15** · That they weren't about like, "Hey, we had issues with the code."

**7:19** · But we're saying, "We had issues with the system."

**7:22** · So, on the retro part is like, "Hey, the agent went over and over hit this problem.

**7:29** · Can we fix the system?" That's something you'll learn in the retro.

**7:33** · And on the planning side, what I started seeing is that things who were that were sufficiently scoped enough were easy to pick up by agents because they were well-defined and what still was left for the humans were the things that weren't scoped out well.

**7:51** · So, we were like a split in the planning where we said, "These things can straight go into agents, well-defined, and the harness is getting better, and this is conversational things that we need to decide as a team."

**8:04** · And what I find important is you there's a certain kind of cycle that developers go through. Yes, they learn first about prompting, they get better, specs, context, harness loop. Also, the industry is learning like that.

**8:20** · But, there is the lead of the team can say, "Well, stop prompting.

**8:27** · Make the context reusable."

**8:29** · Now, we got that. Now, we jump to the next. So, part of the team lead is putting that pace and almost that constraint and that directive in the team where it is doesn't work where you just say, "Go figure it out and do something on your own."

**8:45** · And one of the impacts of that is that if you start producing as a team more, the people downstream, GTM, people like that, they have a hard time keeping up. Even users have a hard time keeping up. So, you need to help them also with automation. So, your harness doesn't stop at your coding. It also is extended to those people as well. And the same thing with kind of requiring uh like gathering requirements, the input might not come fast enough for your team.

**9:15** · So, that's another kind of piece that you need to tap into that workflow as well.

**9:24** · There's a lot of metrics that people are saying like, "Hey, is your like tokens spend and all that stuff?" I started to believe in these two metrics kind of see on how to be more productive.

**9:37** · One is you start measuring how many human touches you still do to have the agent do the right thing.

### Two metrics: human touches and reuse

**9:46** · That's supposed to go down the better your harness is, the better your context is, the better your guidelines are.

**9:53** · And on the other hand, if you're going from solo to shared system, that becomes a multiplier. You fix something once, everybody gets the benefit. This is not the multiplier from the one person becoming the 10x person, but the one change that optimized the agents has an impact on all the people.

**10:16** · So, that is kind of the part that we're all You can start that in a team working together within your repo, sharing the context, working on a harness. But what you basically want to do is you want to scale this out.

**10:28** · So, you come into the realm of the platform people, right? Because they're the typical shared organization working on this.

### The platform team's new problems

**10:36** · Now, the platform people, they might not be paying close attention because they're like infrastructure and cloud and working on like MCP gateway and stuff like that. But there's new things like bubbling up there. They need to think about like maybe skill registries or eval systems for your context and guardrails specifically for coding agents and identities and stuff.

**10:59** · So, they need maybe a little bit of a hand kind of growing to that role.

**11:04** · And that kind of central role, it's hard.

**11:10** · You need an owner to drive that program, but is it the platform team?

**11:15** · Is it developer experience team? They don't typically own any of those pieces of the infrastructure and the other people don't really do the development.

**11:24** · So, there's somewhere a blend, but you need to kind of make sure that there's an owner driving this centralized piece and not just within your team.

**11:34** · Because you won't have paved roads.

**11:36** · And that's how I see it. Reusable context across teams.

**11:40** · Why are we all inventing how we do the authentication system?

**11:44** · Right? This is a shared component. Let's put it in the registry.

**11:48** · Why are you building all your harnesses?

**11:50** · Well, if we're all using the same linters and the same security tools, that's a reusable component. So, I think that will centralize similar to the paved path for cloud into that platform registry of reuse.

**12:05** · But, if everybody can put stuff like on the internet in a repo, it becomes a sprawl.

### Sprawl, paved roads, and making spend visible

**12:13** · And it becomes a thing like, well, he has a skill, he's maintaining it. That person is also has a similar skill and forked it. Now, what I do? Like, which one do I pick? So, there is a kind of thing that you say, there's an owner for this area. And they also care about making it testable. They make sure that it's modular, that other people can extend kind of the context, for example, or the harness, that it's security scanned.

**12:39** · So, you build kind of a more centralized and the fact that it's secured and kind of maintained as something instead of just something I share around in my organization.

**12:52** · Now, that consensus is hard.

**12:54** · I'm not saying this is tabs versus spaces, but at times it feels like that.

**12:59** · If you have two developer teams having to have consensus on the how the way they work, that requires a lot of communication and brokerage. So, you probably don't end up with one thing, but a catalog of three, four paved roads where they can pick off. And they can still do their own, but that's on their own budget. Right?

**13:18** · The centralized pieces will be maintained, and that is supposed to be the easy way of adoption to go there.

**13:26** · Now, if they do this blindly, we also want to make sure that they know what it costs.

**13:33** · Because if we visualize the cost, they might be eager to do some optimization in there.

**13:38** · Right? And that kind of is part of the platform team is making that visible.

**13:43** · How much is he spending? How much is that kind of like helping? If I can reduce the number of iterations the agent has to run through, that is an optimization that I can run. But if I don't visualize that and I just see the end result, then we don't know, right?

**13:57** · So, that is part of the platform team helping people.

**14:01** · And so, what I'm arguing is that we should somewhere move from the solo developer to the team shared kind of context and pieces to a multiplayer system in the organization. And I think that's where the multiplication effect will happen.

**14:17** · Right? Because you're have this flywheel of improvements that go into multiple directions.

**14:25** · Now, one layer higher, the VP of Engineering says, "How do I enable the organization?" Right? And that is that I you know, I can predict the story in your organization. Hackathon, a lunch and learn, let's share the successes, have a shared Slack channel, have a champions program. That's all generic transformation. It could have been Agile that transformed like that. It could have been DevOps. It doesn't matter.

### Enabling the organization without a champions program

**14:49** · And on the other side, we know that the strategy of just, you know, give life to something and educate people, do something, let a thousand flowers bloom, it doesn't work. So, what I'm advocating is that the kind of on the organizational is that you give the team leads and the platform that mandate to start doing that work. And it's not the solo developer piece.

**15:15** · Now, finding people that help you externally is is mess.

**15:21** · Yes, we have all the titles, the new job titles, AI product engineer, forward deployed engineer, you know, there was a whole talk on this, agentic engineer, AI engineer. It doesn't mean anything.

**15:32** · You cannot judge whether what the kind of the maturity of this because nobody's really that mature.

### Hiring when the job titles mean nothing

**15:40** · But it's a signal when you put a job posting out there that people might with the new intention will be looking there.

**15:47** · But it's not a validation of the skills as such, right? So that is challenging for people um kind of hiring people.

**15:57** · Now, they come to the interview and I heard stories about uh people using AI to reflect uh in their ears be response to the interview person and stuff like that.

**16:10** · I think what what I hear from most companies is they say first step is we give them an exercise and we want them to really go nuts on the AI to solve this.

**16:22** · You know, if they have help from AI, that's all good. That shows you kind of like how much they can kind of leverage the AI to do this.

**16:32** · Now, after they pass this, you do a walk-through and you actually say, "Please explain me what happened. Why is this a good idea?"

**16:40** · That's where you are testing the taste and the engineering skills on why they're doing this. First part AI, then engineering.

**16:47** · And this third thing is how do you collaborate? Are you willing to share?

**16:52** · Are you open or are you a solo player?

**16:54** · That's another signal that you tap into.

**16:57** · Right? But that fits into that whole thing of like making it shareable, making it reusable, making it engineering grade within our organization. Those are the people that you look for, not people who studied ML or AI, not people who are like experts per se at the coding. There's a blend on this. Now, you might not find a person who has all three, which is okay, but at least you know, like, hey, they're very savvy on this piece, but then for the other piece, they need mentoring and they need tutoring.

**17:27** · But, like, don't put all the three pieces into one kind of saying like they're junior or they're senior. They have like different skills on there.

**17:36** · Now, the VP of Engineering has to defend this and they would uh have to make the case, right?

**17:46** · Well, we have X amount of licenses that we sold. We have faster delivery, maybe they they can promise, but hard to prove. We have quality that improved, again, hard to say.

**17:56** · But, similar to what I said with the metrics of how effective are your agents, you can show that how much turns and how much improvement that you're making on that journey.

### Optimize the spend instead of capping it

**18:09** · And same thing, how much there is reuse.

**18:12** · So, it's an easier way to kind of show metrics than comparing productivity with and without agent decoding that help you in kind of those discussions as well.

**18:24** · And so, when people say, uh the vendors are charging completely nuts, so we're going to limit the spends, you shouldn't say like, let's limit all the spends.

**18:36** · Your reflection should be, let's optimize the spend and help them kind of reduce that uh in a good way, where that's as simple as saying, pick the right model, educate them on the model, but also on like giving them better context and harnesses because that will make your cost go down there as well.

**18:55** · The debate around smaller and bigger teams, yes, it's nice to have like one person who can do it all. That's the ultimate dream. They can do everything.

**19:04** · Typically, they're paired with a complementary skill, maybe PM, design, and so on.

**19:09** · Okay, then we need a backup if one of them is on holiday so that amounts back to three.

**19:15** · And then maybe somebody has to care about production and tickets coming in.

**19:20** · Could be the same people if you're really productive, but yeah, you know, you lose speed of features if you're still doing bugs and that depends a little bit on your quality. And then there's the junior you want to get on the road as well to kind of make sure they're still learning what good looks like in one of those three areas. So, I think we're still limited in the way in an organization that we're not going to each team being a solo or one or two.

**19:46** · Yes, a lot of experience, but I think that is the thing. Now, we keep investing in actually education for that piece as well.

**19:53** · So, one of the final things is the dark factory, which is probably a dim factory.

**19:58** · You have to see what risk you're willing to take for what features. So, not all features will become autonomous, but you can invest more in auditing like problems, like who changed the code, verifiers that kind of check whether that code was useful and when it fails, you invest in situational awareness as well. So, there's a whole spectrum from being a micro manager to being on a autonomous approval that everything kind of is correct, but you make the decision on what your risk level is.

**20:29** · And I think your mode is capturing the knowledge.

**20:32** · Right? The knowledge you're putting now into skills, you're in your context, and maybe in your harness, the way you kind of restrain this, your business context.

### A dim factory, and knowledge as the moat

**20:41** · And for me, that kind of brings continuous delivery actually to continuous learning.

**20:47** · And if you ask the question of how fast can we swap in swap out something new, that's your reactive mode. And if you can improve that ultimately, it's not about making the whole system more reliable, but can I keep it reliable while changing more of the system.

**21:07** · I'm working on a website that kind of where I try to list some of the agent enablement patterns that I described. I couldn't list them all within this time.

**21:16** · Tell me what you're missing. I'm trying to source social kind of stories. So, if you have a story of how things are going in your organization, please tell me and I am happy to put on a link in there as well.

**21:29** · And if you're interested in kind of the slides, happy to share those. And I think if there's one takeaway, it's not the solo player that will win the game.

**21:39** · It's kind of like at the different levels how we improve our organizations.

**21:43** · Thank you very very much for listening and I hope it was useful.

**21:48** · \[applause\] \[music\]