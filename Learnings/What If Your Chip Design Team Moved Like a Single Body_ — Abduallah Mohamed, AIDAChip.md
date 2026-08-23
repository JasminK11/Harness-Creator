---
title: "What If Your Chip Design Team Moved Like a Single Body? — Abduallah Mohamed, AIDAChip"
source: "https://www.youtube.com/watch?v=0I6aoPSRzVc"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "They told the agent not to write to the spec files. It agreed, then wrote to them through bash. They blocked bash, so it used sed. They blocked sed, so it used cat. The lesson Abduallah Mohamed drew i"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=0I6aoPSRzVc)

They told the agent not to write to the spec files. It agreed, then wrote to them through bash. They blocked bash, so it used sed. They blocked sed, so it used cat. The lesson Abduallah Mohamed drew is that once an agent is capable enough, the substrate it runs in matters more than the agent itself, so the fix was blocking at the system level rather than tool by tool. Two other failures shaped the design: an analog design agent that wandered into work belonging to the RTL agent, and truth drift, where an agent updated a parameter in one place and left five others stale.  
  
The setting is chip design, where nothing can be patched once silicon is printed and getting it wrong means printing again, which averages around $50 million. Across roughly 15 practitioners they interviewed, the recurring answer was that 70% of the time goes to alignment, and that the strongest organizations are the most aligned rather than the ones with the best engineers. Their argument is that buying more tools attacks the linear term while communication overhead grows quadratically with headcount. So they built a shared nervous system: a living graph of intent and constraints that agents cannot change without human approval, a tribal knowledge layer that compounds from project to project, and role specific agents written by subject matter experts rather than one general coding agent. They grade the alignment rather than the agents, and point out that graph memory now has a research literature while institutional memory has almost none.  
  
Speaker info:  
\- https://www.linkedin.com/in/abduallah/  
\- https://abduallahmohamed.com/  
\- https://www.linkedin.com/in/khaledalashmouny/  
\- https://aidachip.com  
  
Timestamps:  
0:00 - Eleven players, and why alignment beats skill  
2:53 - The quadratic term nobody is solving  
3:47 - No patch for silicon, and 70% spent on alignment  
5:32 - Fragmented intent, and the shared nervous system  
7:18 - Demo: the graph, and the approval echo  
10:40 - Grading alignment, and the research gap  
13:11 - What broke, including cat versus the spec  
14:50 - Block at the source, and the substrate lesson

## Transcript

### Eleven players, and why alignment beats skill

**0:01** · \[music\] Hello everyone.

**0:14** · Um So, I want to start with a simple question.

**0:19** · What if your team or your org or company moves like a single body?

**0:24** · I'm Abdullah Muhammad, the VP of AIML at A Data Chef.

**0:28** · And today was supposed to be Khalid with me to present this, but he's he's down with our development partner at the moment.

**0:34** · So, I will be presenting the whole presentation for today.

**0:38** · So, let's go for the next slide.

**0:41** · So, how many of you have been attending the World Cup soccer or watching some games on ice? We have a couple of fans.

**0:49** · Yeah, it's over all over the place. And imagine for a moment, just a single moment, you are a soccer player, all right?

**0:58** · And if you are a soccer player, you have this intent the moment you go into the field, you just going to run and score a goal.

**1:07** · This is what you want to do.

**1:10** · And for the second thing, you have this knowledge that you've been accumulated through your training the whole day, your exercises with your coach, and the best practices and the videos you have watched.

**1:21** · And you at the moment in the field like the moment of truth that you are there, you combine both of the intent and knowledge and compound both of them.

**1:30** · And through your nervous system, you execute to achieve your goal.

**1:35** · And we can call this, in a sense, you are being self-aligned as a single entity by yourself.

**1:44** · And accept the fact that a soccer team or a football team, depending where you're coming from, is not a single player. It's actually 11 players.

**1:54** · And on the field, you are up against another team with 11 players they playing against you. And at this moment it's not about your individual skills, it's about how your team working together well.

**2:11** · So, in general like the team keep changing and everything is getting harder and harder and the team that wins actually the team that the most aligned in both of the both of teams. So, in short we can say alignment beats individual skills.

**2:31** · \[snorts\] Okay.

**2:33** · Now, what if your team is over 50 engineers or 50 players?

**2:38** · This is completely changes the whole scene right now. So, everyone at these days we empower the engineers with AI tools, AI agents and we want to increase the productivity. But we know from literature that the more people you have, the quadratic term of communication between them and alignment them keep growing and keep growing. And at a specific point actually it actually starts to going declining. Your throughput actually is not what you getting.

### The quadratic term nobody is solving

**3:10** · It's diminishing cost.

**3:12** · So, everyone trying to solve this linear problem of more tools and more stuff but nobody actually tackling the quadratic term over there. And this is why the alignment is important. If you are able to change this quadratic term into a linear term or build a multi-layer AI system that will solve this problem. Okay, moving into ship design. Ship design is a different story.

**3:39** · If you are in software company, you have a bug in your software, you can ship a batch to fix it. You can roll out a new version. It's most of the time is doable. But in ships, you can't do this in ships. It's hardware, fixed it on silicon has been printed. And if you're going to do this, there is a cost actually, we call it the risk band cost.

### No patch for silicon, and 70% spent on alignment

**4:00** · On average between chip design companies about $50 million. And for some companies like being 1 month late in the market, it's a make or break for them. And we spoke to many practitioners in the field. On average like 15 practitioner and we found that most of them pointed towards the same problem. That we spend 70% of our time doing alignment.

**4:26** · Alignment to make sure that once we print the chip, nothing is there. And one of the key words that we heard and still resonating that the most successful chip organization are not the one with the best engineers, but they are the most aligned organized.

**4:44** · So, how chip design today works?

**4:49** · We start with bottom figure like the fragmented intent and decision. You attend couple of meetings, you talk about decisions, what you're going to do next. You have the specs written everywhere, you have the Slack messages, you have emails, everything is fragmented over there. And then we go into a second part, which is the knowledge. Nobody updates wikis, right? Many of us has wikis.

**5:12** · They've been collecting dust for years and the code keep evolving outside the wikis, it's not over there. And now we have the tools that you execute with, which comes with many many fractions. And these tools like the data is lost over there, what input, what output, what results, most of the time are not being captured.

**5:31** · And what you see here is not something we came with like draw from our imagine, this is actually how is it today. We wrote from inside the companies and from the backgrounds of the people we have in our team.

### Fragmented intent, and the shared nervous system

**5:44** · And what we're trying to solve here is building a multi-layer AI with a shared nervous system. Instead of having scattered knowledge or scattered intent all over the place, we build a living graph. We call it the system of intent.

**6:00** · And this living graph actually has all the constraints of the system, has all the decisions over there. It keep evolving. And as an AI person actually, we don't allow the agents to touch it except with human in the loop approval for specific changes. And this thing is like the Bible of the whole system. This is where the whole org is going or whole company is going.

**6:26** · And the next one is the tribal knowledge layer. The tribal knowledge layer we can think about it as a memory that keeps evolving with day-to-day usage and the knowledge base that capture all the information and documents. And it's keep evolving from a project to project and keeping the best practice over there.

**6:45** · And lastly, instead of having this general coding agent that everyone uses today, we have a special designed agent that being developed by subject matter experts to help the engineers doing their work. So for example, like we have digital design agent, analog design agent, and so on. And by combining all of this, you will have this shared nervous system that allows you to move fast and move forward.

### Demo: the graph, and the approval echo

**7:18** · Okay. So it's easy to say an idea on a slide. It's nice. Everyone makes slides. But I want to show you like a demo from what we have today and showing the intent, knowledge, and execution. It will be short demos. And we'll start with the first one. Yeah, the Yeah. Okay, cool. So we can see that each engineer gets a role-based AI teammate specific to their role.

**7:45** · They can check the knowledge base of the whole project that being contained and being growing and compounding over time and now they have their own intent. And you have single place for design where it captures all the tooling you have. It captures the results. It captures what you did and what you're going to do next and analysis of everything. So, everything being contained in one place. And here we see a human finishing their work.

**8:23** · This human signing off the the results of some space simulation and the system of intent realizes, okay, this person is done with this. I'm going to notify the next stakeholders of what they should do and signal to them that they are done with this.

**8:42** · And now the system of intent, which actually the nervous system or the Bible of the system, it's a graph living graph that keep compounding with time. We see in this example, like it realizes like there is something off, like some value out of constraints that shouldn't be there that might cost you $50 million actually to suspend the whole ship and it notified the system and the notification goes and some engineers start working on it. And once it got it fixed, it submit a game into the system and it keep evolving over time.

**9:15** · Okay.

**9:16** · Good.

**9:18** · So, let's say for example, like um you were working in the system, you look at the Bible, you find, oh, there there's something wrong about it. Uh I don't like this value.

**9:31** · And then you propose a change. So, the system of intent and this big graph captures all the values over there, all the stakeholders, and you start doing this modification, and it gather all the shared knowledge, and then it fire a request, as you can see here, and this request goes to an architect or an owner of the system. The owner can approve or decline it, and the moment they approve that this is a valid change, it actually goes and echo in the whole system. Like everyone will know that this decision has been made.

**10:02** · There is that change that advises everything over there.

**10:08** · What?

**10:14** · Good. So, moving to a very difficult topic we have like how we going to evaluate uh our claims and measure the success of the system. The philosophy we are using this or the philosophy toward this, we don't grade the agents.

**10:34** · We try to grade alignment itself. So, we have four axes, two horizontal, two vertical. The horizontal axes like qualitative, the vertical axes like qualitative and quantitative values, which is typical in this domain at the moment. And then horizontal ones, which is bare component and the system into it.

### Grading alignment, and the research gap

**10:53** · And \[snorts\] if we're going to zoom into the bare component, you can measure like if that agent giving you the correct output for this voltage, like known values versus golden answers. Or you can use LNM judge and measure the golden answer versus the expert we have for this one. Which is okay. You can measure how good my memory, like if the recall state of art, which is the case in our thing. Are we doing inference really good?

**11:21** · But then it comes into the harder question, which is basically are we doing a task completion? Like if someone uses this whole thing, is he really completing the task he want to do.

**11:33** · Is he frustrated while using this? Are our agent overstepping human in the loop approval or not?

**11:39** · Sometimes the agent go goes out on that end. And we measure also does does our system allow you to work concurrently on multiple task in parallel? This is a success metric or success goal we have. And the last one is token tax. We don't want to overload you once you use this with all the lovely tokens and increase your budget.

**12:01** · And there is hard frontier here like in the future now the topic of memory or graph memory or graph rag, whatever the title is, is there is around like 150 papers in this area at the moment and all of them are addressing in a nice way. You can measure the recall there is data sets.

**12:20** · But there is no work and research at the moment that targets tribal memory or institutional memory. Like what does it mean exactly?

**12:28** · How do you measure tribal memory success?

**12:32** · And also for the chip design domain, it's actually even harder because there is not enough data sets like computer vision domain, there is many data sets over there. So there is nothing collected. So we have our own wheel and going with SMEs collecting this kind of data sets.

**12:49** · Cool.

**12:50** · So \[snorts\] what broke? Which actually when I attend any talk I like to hear what broke, how do you fix it?

**12:57** · First, agent overstepped.

**13:00** · In early design phases of the system, we found that an analog agent that's specifically for analog design actually overstepping and doing RTL agent work. Which wasn't really great. Even we tried to enforce it, but it was a difficult problem. And then another thing is we noticed that truth has drifted. An agent modifying something in the system not necessarily means it modifies it everywhere it should be modified.

### What broke, including cat versus the spec

**13:28** · And that make it harder. Like we have the cases specifically where one agent were modifying a parameter, it updated it in one place, five other places were forgotten. And the third one is one of my favorite is we asked the agent do not write into specs. Just don't don't change the specs.

**13:46** · They said, "Okay, I obey you. I'm not going to write into specs." But then they moved into bash and they used set to write into specs. We blocked, bash we blocked set. They said, "Okay, cool. I will use cat actually to write over the specs." So we're being like a cat chasing a mouse around to just to prevent it from writing over specs.

**14:07** · And based on these three failures we have, we came up with principles that we are working today.

**14:14** · First, we have a spec hierarchy with agent scope and file isolation to allow them only to work on this specific task or specific domain. That's all this our problem of agents stepping on each other. Second one is we have a single source of truth with automatic conflict detection that is not element based but actually rule based that can detect that this agent did this issue.

**14:39** · And we can or want to change this value and actually resonate in the whole system immediately. And thirdly, which I think of it as an IT administration for agent, we block at the source. Like we block from system level, not about level like tool by tool, but just we try to block it over there.

### Block at the source, and the substrate lesson

**14:57** · And the key lesson we learned here that agents care about like if you have your agents which are intelligent, it what matters is substrate layer that they are living in. Like the world they living in is more important than the agents itself. Like what they can do, what they cannot do, what you allow and what you don't allow.

**15:19** · Cool. So, I'm going to use the word bottleneck. It's been used many times, but actually it's bottleneck in our case. It wasn't missing intelligence. It was missing alignment. And a shared nervous system lets your team move like a one body. As we see at the moment, one of the things I like hearing from our subject matter experts that they're saying that at the beginning of system is not working fine.

**15:42** · Now it is good. Now I feel it's racing me. This is success for our case. And we think that this gives you four x leverage from our measurement at the moment. And alignment is universal. We're building it for the hardest case, which is ship design. So currently we're in alpha stage with our development partners.

**16:06** · And the sign ups for beta are open. And you can actually join now and we expect it to release it in October 26. If you want to reach out us, sign up for the beta, just use this QR code or the link over there. Thank you everyone.

**16:27** · \[applause\] \[music\]