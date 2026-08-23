---
title: "Building Agents Is Trivial Now, Context Is the Next Frontier — Jeff Ng, Unblocked"
source: "https://www.youtube.com/watch?v=HvMyYLTfvhg"
author:
  - "[[AI Engineer]]"
published: 2026-08-21
created: 2026-08-23
description: "An agent built to enrich Linear tickets read a report that time to first character in Unblocked's own QA pipeline had gone from hundreds of milliseconds to three or four seconds, and recommended turni"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=HvMyYLTfvhg)

An agent built to enrich Linear tickets read a report that time to first character in Unblocked's own QA pipeline had gone from hundreds of milliseconds to three or four seconds, and recommended turning async dispatch back on. The recommendation was wrong. A support engineer had explicitly disabled that setting days earlier because it caused an outage. The agent had the ticket and the repository and reasoned soundly from both, but never saw the Slack thread where the engineers worked through the failure, or the postmortem that came out of it. Jeff Ng's point: standing an agent up has become the easy part, and missing context is what still breaks them.  
  
Six months ago the same build took a team a quarter, because checkpointing, sandbox isolation, and observability all had to be solved first, none of which improves what an agent can do. Cloud primitives and agent frameworks have absorbed that work, so defining an agent now comes down to a model, instructions, tools, and a sandbox. What that removes is the plumbing, not the judgment a person supplies on every turn: why the code is the way it is, what broke last time, what the team decided to do about it. Something has to carry that load once nobody is babysitting, and Ng argues MCP does not, because access is not understanding and an agent left to reconcile contradictory results picks badly. He reruns the same agent against a context engine spanning docs, code, tickets, and conversations, and the recommendation flips from repeating the outage to preventing it.  
  
Speaker info:  
\- https://getunblocked.com  
  
Timestamps:  
0:00 - Six months ago this took a team a quarter  
1:02 - The taxes: state, sandboxes, observability  
3:02 - Primitives and frameworks remove the plumbing  
4:21 - Demo: enriching a Linear ticket  
5:36 - The fix that had already caused an outage  
7:00 - Why this does not happen locally  
8:17 - What a context engine does  
10:36 - The same agent, grounded

## Transcript

**0:01** · \[music\] Hi all.

**0:14** · Uh my name is Jeff. I'm a founding engineer at Unblock, and I'm here to talk to you about how building agents has actually gotten pretty easy.

**0:22** · But unfortunately, they still get things confidently wrong.

**0:26** · So, 6 months ago, it required a team's effort and basically a quarter to build out an agent.

**0:33** · Um an agent is more than just models and tools. It's the models, the tools, and everything required to build out a production service.

**0:43** · Here are some examples of the different systems that were necessary in order to build something out.

**0:49** · Each one of these was basically its own company or at least a company function.

**0:54** · Not going to go through each one of these, but you know, a few that stood out to me.

**0:59** · First one, checkpoint and state persistence.

**1:02** · Agent runs, they're typically long-lived and stateful.

**1:06** · Um unfortunately, uh infrastructure itself though, those that's ephemeral.

**1:12** · Crashing without durability can actually lead to a lot of state loss. And that state kind of includes things like message history, tool calls, as well as, you know, where you are in the loop.

**1:26** · Without these things, you can't resume the session.

**1:29** · Uh one option is, you know, maybe you want to restart the session.

**1:32** · Unfortunately, that's actually quite expensive as well.

**1:36** · Uh you lose out on all the tokens that you'd originally used, um as well as, you know, latency. Uh from a user experience standpoint, you've already triggered that session. Now you have to wait for the whole thing to go again.

**1:50** · And lastly, side effects. Your agent might have performed some side effects, and now there's a chance of those doubling up.

**1:58** · So, next thing, sandbox infrastructure, right? So, as we all know, we're running more and more agent-generated code as well as third-party code. This gets all run on your infrastructure, and due to that, there are some complexities. Uh because of that, we want to introduce isolated sandboxes, which help prevent uh unnecessary reads of environment secrets, unnecessary network access, you know, just in general, we don't want to take down the shared host.

**2:29** · And then, observability.

**2:31** · How do we answer the question, "Where did this fail?"

**2:35** · Typically, this includes tracking logs and traces from across half a dozen systems.

**2:43** · Everything I've mentioned here, none of this actually improves an agent's capabilities.

**2:48** · They're all taxes one has to pay in order to get an agent out there to play the game.

**2:56** · Thankfully, things have changed quite a bit.

**2:59** · Um the whole ecosystem has matured quite a bit, and cloud infrastructure players such as Cloudflare, uh Vercel, AWS, they've gone and taken some of that complexity away and built primitives that these frameworks, Flu, Vercel E Maestra, with these together, you know, they've taken a lot of complexity away, and you can focus more on building the actual agent itself. The core logic that actually helps you and your team and your customers.

**3:33** · So, here's an example of one.

**3:36** · Uh I played around with Flu and Cloudflare, and as you can see on the left-hand side, you know, we basically handle everything as mentioned before.

**3:45** · So, the primitives plus the framework lead to a situation where it's actually not that much code to define an agent.

**3:53** · Uh one of the things I was shocked at when I first took a look at the documentation.

**3:57** · To get in the details, all you really have to do when defining agent is A, deciding which model you want to use.

**4:04** · B, the instructions or, you know, the system prompt.

**4:07** · C, the tools that you want to ask the agent to have access to.

**4:12** · Skills, the things I can do.

**4:15** · As well as the sandbox location, where things are being run.

**4:19** · So, uh to give you an example of this, I've actually gone and built out a issue enrichment system specifically for Linear.

**4:31** · So, what this does is, given a Linear ticket and access to your code repository, it'll go out, you know, fetch the Linear ticket, determine whether or not it's a feature or a bug.

**4:43** · From there, it'll do some code searching, provide all that context to the agent, and then come up with a plan of next steps.

**4:51** · On the left-hand side here, this is a issue that one of my colleagues, uh smart engineer, had posted, I think, a month ago.

**4:59** · Uh to summarize it, what had happened was, we had some pretty serious degradation in our agentic QA pipeline.

**5:06** · Time to first character was taking 3 to 4 seconds when it should realistically be in the hundreds of milliseconds.

**5:13** · So, let's see what happens when, you know, we put this through the system.

**5:20** · So, as you'll see here, I've set up the agent to go fetch the agent.

**5:24** · I've given it the skills and tools to actually go and fetch the code, search the code, and query against that.

**5:31** · That's being passed back to the agent, which is doing some reasoning against that right now.

**5:36** · And then, wait a little bit. At this point, we've updated the Linear issue ticket.

**5:42** · The recommendation here is to re-enable our async dispatch, which makes sense.

**5:47** · It allows us to run a lot more of our QE pipeline in parallel on a single machine.

**5:52** · Sounds great, right? Unfortunately, uh this is wrong.

**5:57** · This had actually caused an outage a few days ago in one of our uh support engineers had explicitly disabled this uh before this ticket was uh shown.

**6:07** · So, where did things go wrong? Why was the uh you know, why did I get it wrong?

**6:15** · The agent I had written, it didn't have a full picture.

**6:18** · It was missing the context from the Slack discussion that happened after the issue where the engineers came together, uh went through the actual outage, what went wrong, what was the fix, and the next steps.

**6:31** · It also was missing the postmortem uh linear ticket, which came as a result of that.

**6:36** · In general, it had a narrow understanding of the problem.

**6:41** · This concept of missing knowledge and intent that's stored across an organization and different systems is something that comes back and back again.

**6:49** · And since this was deployed as a background agent, this is going to make that mistake silently in the background, misinforming both my teammates and potentially other agents.

**7:00** · So, I guess the next question is, why don't we run into this locally? You know, we all use agents locally, we don't necessarily run into these issues.

**7:08** · Well, you, the human, the engineers, we currently act as that context layer.

**7:14** · When working with an agent, you know, you're there to ask questions, catch any errors, and supply the missing facts on every single turn.

**7:23** · A person knew why the code is the way it is, what broke last time, and what we've decided to do about it.

**7:30** · The agent, though, it only has what's on the right-hand side, right? It has instructions, the tools and skills we specifically gave it, the code, as well as the ticket in front of it.

**7:40** · When an agent is in the loop, well, sorry, when a human is in the loop with the agent, we're there to catch the steer.

**7:47** · Ultimately, we're there to babysit the agent.

**7:50** · But as agents have gotten trivially easy to deploy as I showed earlier with Flu Cloudflare, the without the human in the loop, this issue becomes more and more prevalent.

**8:02** · This missing context becomes a sign of failure.

**8:05** · You know, all that intuition and knowledge that we've had as humans needs to be replaced.

**8:10** · Something needs to carry the load.

**8:14** · So, that thing, that's a context engine.

**8:17** · A context engine is a system that provides task-relevant information based on who you are and what matters.

**8:25** · It also resolves all the conflicts across multiple data sets.

**8:29** · It understands your access rules or the agent's access rules and only uh respects that and only provides information that's relevant. And most importantly, it delivers a synthesized understanding that an agent can act on, not just a list of documents that I have to reason upon itself.

**8:47** · So, how does this context engine work?

**8:50** · Well, let's take a step back. What does an agent actually need?

**8:55** · An agent needs Clearly, it needs context outside of just your source code.

**9:00** · Think about everything that you need to work day-to-day.

**9:03** · It's not just the code. It's, you know, the Slack discussions where decisions are made, the documentation where we show all the best practices.

**9:13** · All that is important to your day-to-day process, and that's true for your agent as well. So, what we do here is we connect everything. The docs, code, tickets, conversations. We then build a model of your organization, of your system. And we piece how all these things work together and make it generally available to your agents.

**9:32** · From that model, the agents are only provided a a of that data, which has been reconciled, ranked, and scoped to your permissions.

**9:40** · Scattered context comes in, grounded context comes out.

**9:45** · The obvious next question is, why can't we just do this with MCP, right? You could connect a Slack MCP, a Linear MCP, a GitHub MCP, and with that, all that data is accessible.

**9:57** · MCP is great at access, but access isn't understanding.

**10:02** · An MCP hands the agent the raw results, and you know, you're now dependent on that agent to actually decide what to believe in.

**10:09** · You end up flooding the agent with irrelevant data, filling up the context window, and you know, overall context costs just go up.

**10:17** · It also leaves the local agent to handle conflicts in data. You know, your Linear MCP and your Slack MCP may come back with different results.

**10:25** · You're just leaving the agent to make that decision somewhat ad hoc at the moment.

**10:32** · So, back to the original problem I had earlier. This is the same file, same engine, but now we've connected the context agent.

**10:40** · Uh what we do here is is we're currently prompting Unblock to do some research on the ticket and provide that context to the agent.

**10:49** · So, let's see that in action.

**10:54** · Sorry about that.

**11:01** · So, here we go. Uh we're doing the very similar thing. We're fetching the Linear ticket. But, you'll notice here that we're actually calling the Unblock context engine.

**11:09** · And what's done here is actually it's found the relevant Linear postmortem, as well as a Slack conversation where we've had the entire discussion between the engineering teams.

**11:18** · And as part of that, we've returned a understanding, and that's now been provided to the agent as a summary.

**11:26** · So, the agent no longer has to actually reason from those documents.

**11:31** · Uh at this point, you'll notice here the agent now has been updated.

**11:41** · Uh the recommendation has gone from breaking and causing another issue to actually preventing a another outage.

**11:53** · So, the example I've shown here is issue ticket management, but this context layer can actually go a lot further.

**11:59** · Uh for example, coding.

**12:02** · Everyone here does uh coding with uh cloud code or cortex.

**12:05** · Using an Unblocked context engine to actually hydrate the agent plan goes a long way in terms of saving context and tokens.

**12:13** · Uh code review.

**12:15** · It makes the PRs look as if they've been reviewed by an expert on your team. Who doesn't like that?

**12:21** · As well as surfacing the correct answers to your customer success team as well as sales.

**12:27** · In general, there are many instances where you might want an agent to have institutional and tribal knowledge of your organization.

**12:37** · Just want to leave you on this. I think this quote encapsulates what we're trying to solve at Unblocked. The gap isn't intelligence, it's context.

**12:46** · So, thank you. Uh I'll be at booth P16 along with the rest of my team if you guys have any questions.

**12:53** · There will be additional breakout sessions later tomorrow, I believe, that goes a lot more in depth about actually how the context engine works and you know, how you can benefit from that.

**13:03** · Cheers.

**13:04** · \[applause\]