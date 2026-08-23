---
title: "Cloudflare will make 1000+ AI millionaires"
source: "https://www.youtube.com/watch?v=MNNfat_QP0E"
author:
  - "[[Greg Isenberg]]"
published: 2026-08-10
created: 2026-08-23
description: "In this solo episode I break down Cloudflare's AI agent announcement in plain English and explain why I see it as the new business model for the internet. I walk through AI crawl control, pay per craw"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=MNNfat_QP0E)

In this solo episode I break down Cloudflare's AI agent announcement in plain English and explain why I see it as the new business model for the internet. I walk through AI crawl control, pay per crawl, the monetization gateway, and the x402 payment rail, and I show how a single request turns into a transaction. From there I give three startup ideas built directly on top of this shift: a niche data refinery, agent readiness for businesses, and expert archives turned into agent tools. For each idea I lay out the wedge, the first customer, the first version, and how I would sell it. My core claim: the internet is moving from pages humans visit to resources agents use, and the builders who move now own the doors.  
  
Timestamps  
  
00:00 – Intro  
01:01 – The Old Paradigm of the Internet  
02:57 – The New Paradigm of the Internet  
03:41 – What Cloudflare is actually doing  
06:33 – An AI Index for all our customers  
07:34 – The Agent Internet Stack  
09:09 – Why Now Is the Best Time to Build  
10:29 – Startup Idea 1: The Niche Data Refinery  
17:10 – Startup Idea 2: Agent Readiness for Businesses  
23:43 – Startup Idea 3: Expert Archives as Agent Tools  
30:36 – The Filter for Finding Ideas  
32:33 – Closing Thoughts  
  
Key Points  
  
• The human web monetized attention; the agent web monetizes useful resources, priced per request.  
• Cloudflare's pay per crawl, monetization gateway, and x402 turn the HTTP 402 status code into a live checkout at the edge.  
• Idea 1: refine one niche's messy data into clean fuel for agents, starting with 100 businesses in one city.  
• Idea 2: sell agent readiness by showing a founder exactly what AI says about their company today.  
• Idea 3: package an expert's archive into one job-specific agent tool the audience already wants.  
• Every one of these works as a manual services business today and productizes as agent payments mature.  
  
Numbered Section Summaries  
  
1\. The Old Bargain of the Internet: I describe the trade that funded the web: crawlers took the content, sites got the visitor, and owners monetized that attention through ads, email capture, subscriptions, and affiliate links. Agents change the flow, because the answer reaches the user while the visit stays home. That shift explains why publishers are vocal right now, and I treat it as the first inning of a much larger story.  
  
2\. Cloudflare in Plain English: I cover AI crawl control, which gives site owners visibility into crawler activity plus the power to allow or block; pay per crawl, which lets a site owner charge AI crawlers for access; and the monetization gateway, which extends payment rules to any resource behind Cloudflare, including pages, data sets, APIs, MCP tool calls, files, and search indexes. The rail is x402, built on the HTTP 402 payment required response: the agent requests, the server prices it, the agent pays and retries with proof, and Cloudflare verifies at the edge.  
  
3\. The Request Becomes the Transaction: Paid access starts to feel native to the internet itself: one request, a fraction of a penny, and the resource opens. A human closes the laptop over a third of a cent; a machine happily pays it to finish the job. Tiny resources become real businesses, charging per lookup, per successful call, per answer, or per comparison.  
  
4\. The Agent Internet Stack: I map the layers forming underneath all of this: a messy internet of PDFs, pricing pages, old posts, and support docs; someone cleans it into structured data; someone makes it agent readable through an API, MCP tool, search index, feed, or llms.txt; someone adds payment rules where free drives distribution and paid protects value; and someone adds trust and analytics on freshness, source reliability, and which requests earn money. The guiding question: what resource does an agent need badly, often, and reliably enough to pay for?  
  
5\. The Through Line and the Close: All three ideas share one engine: agents need clean, trusted, useful resources to do great work, whether that shows up as data, structure, access, expert knowledge, a tool, or a payment rule. I encourage building the manual version now — sell the human version, gather the data, package it — so the agent-native version is ready as payments spread. My closing questions for finding your own idea: what decision is expensive, what information is messy, what changes often, who already pays for help, and what would an agent need to do the job better?  
  
The #1 tool to find startup ideas/trends - https://www.ideabrowser.com  
  
LCA helps Fortune 500s and fast-growing startups build their future - from Warner Music to Fortnite to Dropbox. We turn 'what if' into reality with AI, apps, and next-gen products https://latecheckout.agency/  
  
The Vibe Marketer - Resources for people into vibe marketing/marketing with AI: https://www.thevibemarketer.com/  
  
FIND ME ON SOCIAL  
X/Twitter: https://twitter.com/gregisenberg  
Instagram: https://instagram.com/gregisenberg/  
LinkedIn: https://www.linkedin.com/in/gisenberg/

## Transcript

### Intro

**0:00** · Cloudflare launched something huge around AI agents, and I think a lot of people haven't really paid attention.

**0:06** · But, I think the people that pay attention are going to be able to create businesses that monetize in a completely new way that I think is really interesting. So, I wanted to do an episode breaking down everything.

**0:17** · By the end of this episode, I want you to understand three things. The first is, what is Cloudflare actually doing here in plain English around AI agents?

**0:26** · The second is, why does this create a new business model for the internet? And the third is, startup ideas I think you should actually build on top of this. I want to show you the wedge. I want to show you who the customer is, what the first version looks like, how I would sell it, and how I would become a real company. The opportunity is way bigger than Cloudflare launched a thing here.

**0:48** · The opportunity is agents are going to need clean, trusted, useful resources to do their jobs, and the people that figure this out and launch things in the next 18 months are going to do incredible things. I'm going to show you exactly how everything works in plain English. I have no affiliation with Cloudflare. I just want to see you win.

### The Old Paradigm of the Internet

**1:07** · I'm rooting for you.

**1:09** · And I'll see you in there. Enjoy the episode.

**1:14** · \[music\] Let's start with the old bargain. That's the way I think about the old bargain of the internet. For a long time, if for a long time, if you owned a website, you let search engine crawl it because search engines sent you traffic. And then Google would read your site. Google would index your site. Someone would search. Your page would hopefully show up. And then a human being would click through. Once the human being landed on your website, you would monetize that attention. Maybe you'd show ads.

**1:45** · Maybe you'd capture their email. Maybe you'd sell them a subscription or do some affiliate thing.

**1:53** · That was the trade. So, the crawler got the content. The website got the visitor. the visitor got the answer, and the model funded a massive part of the internet. Now, AI agents are changing this flow because an AI agent or AI system can read your page, pull the useful answer, give that answer to the user, and the user might not visit your website. So, the content still created value, but the website may lose the visit. And if the website loses the visit, it loses the ad impression, the email capture, right?

**2:24** · The affiliate click, all that stuff, it just loses it. So, that's why a lot of publishers are upset, but I actually think the publisher conversation is only the first inning. The bigger idea is that agents are going to use the internet in a way software uses infrastructure. So, uh they'll request things, they'll call tools, they'll compare products, they'll retrieve data.

**2:48** · By the way, I'm going to get into how Cloudflare plays into all this uh in a second. They'll buy access, uh they'll take action, and that basically means that the internet needs a new pricing for machine usage.

### The New Paradigm of the Internet

**3:03** · Obviously, a human being doesn't want to pay 0.0003 cents to read a page. That would feel ridiculous. If I clicked on a recipe and it said, "Please pay 1/3 of a cent to see the sauce," I would close a laptop and probably order tacos out of spite.

**3:21** · But a machine doesn't care if the payment is tiny and automatic. If the data helps the agent complete the job, the agent, you know, can pay. And that's really the mental model. The human web monetized attention, and the agent web monetizes useful resources.

### What Cloudflare is actually doing

**3:41** · So, what is Cloudflare actually doing here? Well, there's actually there's a few pieces I want to go over. The first is AI crawl control, which gives site owners visibility and control over AI crawlers. You can see a crawler activity. You can allow certain crawlers to do things, and you can block certain crawlers. You can understand who's accessing your content. They also announced pay per crawl, and that's the direct monetization piece. That's the piece that's going to get people paid.

**4:09** · A site owner now can charge AI crawlers when they access content. The crawler could either present payment intent in the request or receive a 402 payment required response with the pricing.

**4:26** · Then, monetization gateway is even a bigger version of that. So, Cloudflare is basically saying this should not just apply to crawlers reading pages. Any resource behind Cloudflare could have payment rules. A webpage, a dataset, an API, you know, an MCP tool call, basically a premium endpoint, a file, a search index. And the payment rail they're talking about is X402, which uses the HTTP 402 payment required status code.

**4:58** · The agent requests the resource, the server says, "This costs this amount," usually a fraction of a penny, and the agent pays and retries with proof of payment. Cloudflare can verify at the edge before the request hits the origin.

**5:15** · Basically, in plain English, Cloudflare is trying to make paid access feel like part of the internet itself. So, you don't have this giant checkout flow, you don't have to create an account first, there's no sales call, there's no like enterprise procurement stuff. Basically, there's a request that becomes uh the transaction. And that's a really, really big idea.

**5:36** · Um and it's a big idea because the request becomes the transaction, and then there's these tiny resources on the internet that on the internet that could become businesses, and that's what we're going to get into. That's why I'm doing this episode. I'm doing this episode not just because Cloudflare launched this thing, um it's interesting because of all the businesses that could be built on top of it. Uh a data set could charge per lookup.

**5:59** · An API can charge per successful call. A research archive could, you know, charge per answer. A product catalog can charge per comparison. You get the idea.

**6:10** · And, you know, someone in the comment section is basically going to say something like, "Yeah, but, you know, agents don't have wallets." Well, we're moving into a a future where agents are going to have wallets, they're going to have email addresses, and assuming that's true, and I think, you know, there's a good chance that that happen is happening happens cuz it's already starting to happen, they're going to make transactions.

### An AI Index for all our customers

**6:34** · And Cloudflare's AI index points in the same direction. So, they've talked about making websites easier for AI systems to use things like MCPs, LLM.txt, search APIs, and bulk data APIs. That matters because agents need access, but they also need structure. So, humans can tolerate messy websites. It might not be a good experience, but they can tolerate it.

**7:00** · Um you know, we click around, we zoom in, we read the FAQ from 2019, we open a PDF, we're good at suffering, human beings. But, agents need really clean doors. So, they need information in a format they could trust and use. So, the shift is websites become resource layers, content becomes indexes, expertise bec- becomes cable, data becomes metered, and tools become agent accessible.

**7:28** · Um and that's what I'm paying attention to as a founder because I can build on top of it.

### The Agent Internet Stack

**7:34** · So, there's this stack that's forming uh around this whole new internet, and I want to go through it. It's actually simpler than we think. So, first you have a messy internet that is PDFs, pricing pages, old blog posts, you know, YouTube videos, support docs, um comparison sites, websites that look like they were designed uh when people still said web 2.0 without any irony. Uh then someone cleans that into structured data.

**8:05** · Then someone makes it agent-readable through an API, MCP tool, search index, feed, LLMs.txt, or some other clean access point, but it needs to be cleaned.

**8:17** · Then someone adds payment rules. Some things are going to remain free because, you know, free creates a lot of distribution, but some things are going to be paid because they're extremely valuable, and some things are going to be blocked because they should stay private. Um and then someone adds trust and analytics. Like, is the data fresh?

**8:37** · Is the source reliable? Which agents are using it? Which requests are worth money? Which resources drive outcomes?

**8:45** · And that stack is what's going to create this whole generation of, you know, thousands of companies. Um when you're looking for ideas here, you know, you the question really is, what resource does an agent need badly enough, and often enough, and reliably enough to pay for? That's basically the the biggest question of all of this.

**9:07** · That's what I'm asking myself. Um and let's get into the the ideas. There are three ideas that'll get your creative juices flowing around building businesses on top of that. But before I get into it, I saw a lot of chatter on on X. Um Levels.io, who's an incredible Indie Hacker, was talking about how, you know, how hard it is now to build a business, and how a lot of people's traffic and revenue has gone down.

### Why Now Is the Best Time to Build

**9:30** · I think in large part, you know, because of AI overviews, and how basically a lot of software is just not it's not useful anymore because people are vibe coding it themselves and stuff like that. My take is it's an incredible time to be building. In fact, it's the best time ever. Now, I think the types of businesses to create are businesses like this. They're not like little tools that could be vibe coded.

**9:59** · These are startup ideas that, you know, could be profitable on day one that, you know, have some moat that are, you know, are reinvented for an internet that's AI native and AI and agent ready. So, I don't want you to, you know, go on X and just be like devastated that there's no like entrepreneurship is done RIP startups. No, the world is moving, the internet is changing, you have to move with it, and here's three startup ideas that move with it. Let's go.

### Startup Idea 1: The Niche Data Refinery

**10:30** · So, the first startup idea is a niche data refinery. This is probably the one I would start with because it's the most practical. The idea is really simple. So, pick one niche where value information where valuable information is messy, fragmented, changing, annoying to collect, then turn that information into clean fuel for agents.

**10:54** · I'm calling it a data refinery because the raw material already exists. So, the internet already has that data. You know, it's sitting in Google Maps, it's sitting in job posts, it's sitting in reviews, in local directories, PDFs, it sits in pricing pages. It's in all these places, and your job is going to be refining it. So, let's make it con- let's let's make it concrete. I'll give you an example so it drives the point home.

**11:21** · So, imagine you pick med spas because, you know, they're growing a lot in the US. Uh that's and that's the niche you want to pick. Great. A med spa owner wants to know what competitors are charging, what treatments they offer, what reviews complained about complain about, which clinics are hiring, which services are trending, what offers are working, and how the local market is changing. So that information today, you know, lives everywhere really.

**11:50** · It lives on Google reviews, on competitors websites, on Instagram, on job posts, uh meta ad libraries, in the owner's head, in employees' heads. Uh an agent can do incredible work for a med spa owner if it had that information cleanly. Like it would be huge. It could say something like, "Your Botox pricing is above the local median, but your reviews do not support premium positioning yet." That would be super valuable.

**12:19** · It could say, "Three competitors near you started promoting exos- exosome treatments in the last 60 days." Super valuable information to know. It could say, "The most common complaint in local reviews is your confusing pricing, so your offer should lead with simplicity." Great to know.

**12:40** · It could say, "Two fast-growing competitors are hiring injectors, which probably means they're expanding capacity." Really good to know. So all useful information, and more importantly, the usefulness comes from the data, not from a generic AI wrapper. So here's how I would build a wedge into you know, this space, into this business. I would pick one niche and I would pick one city. I would track 100 businesses, not not more. I would do it manually at first.

**13:10** · I would create a a spreadsheet with a you know, your business name business name, website, services, prices, review count, review rating, top review complaints, Instagram links, recent posts, visible ad changes, hiring signals, and booking flow. Then I would create 10 outputs from that data.

**13:28** · It could be like a local pricing map, a competitor gap report, a list of offer ideas, a services to add recommendation, a review complaint summary, a hiring signal report, a monthly market movement report. Now, you have something to sell here.

**13:49** · And the first kind customer actually might not be a med spa owner. And that's that's a part I think people are missing a little bit. In the early days, your first customer is often the person already selling into the niche. So, instead of trying to sell agent readable competitive analysis to a med spa owner, which is a phrase that is just confusing to the average person, um sell it to med spa marketing agencies, consultants, freelancers, software companies, and even AI implementation people.

**14:19** · You could say, I built local market intelligence for med spas, and you can use it to create better audits, better offers, better landing pages, and better campaigns for your clients. They're going to be able to to charge more. Um so, you know, you what you've built is super valuable. And that's just a way easier sale.

**14:42** · A med spa marketing agency might sell a client for like 5K a month as a growth package. And if your data helps them close one more client or improve their work, they can pay you three, five, 800 dollars a month. And over time, you turn your spreadsheet into a real product.

**15:01** · So, first it's a report, then it's a dashboard, then it becomes an API, then maybe an MCP tool, then agents can pay per lookup or per report when the rails are ready. So, you you know, you're doing basically a crawl, walk, run strategy. I used med spas as an example, but it doesn't need to be med spas. I live live and there just so happens to be a lot of med spots here. Um but you can do it for, you know, roofing. You can do it for, you know, you know, let's say okay, let's say you were to do it for roofing, you would do you track storm events maybe.

**15:33** · You would track permit data, insurance signals, local reviews, competitor offers, and ad angles. Um you can do it for real estate investing. You track zoning changes. You track permits. You track ownership records. You track rent comps. You track tax delinquencies and you track insurance shifts.

**15:53** · You can do it for e-commerce. You can track competitor SKUs, pricing changes, review complaints, influencer rates, UGC hooks, Shopify apps, uh shipping promises. You could do law firms. You could track local competitors, practice area positioning, ad copy, reviews, intake. You get the idea. The filter is pretty simple. The data should be valuable. It should The data should be repeatable, uh changing, fragmented, and annoying. And, you know, valuable data basically means better decisions make or save money.

**16:29** · What does repeated mean? Well, repeated means the customer needs it again and again. It's not like a one-time thing. What does changing mean? It means that, you know, freshness matters in the data.

**16:39** · What does fragmented meaning means it means that one person can't easily collect it? Um what does annoying mean?

**16:47** · That basically means there's some margin there. Um and that's my first startup idea. It's actually It's basically one idea that can give you a lot of ideas depending on what niche that you have some unfair advantage in advantage in. Take one niche's messy internet, turn it into clean fuel for agents. I don't want you to forget that phrase, clean fuel for agents. Let's get down to the next startup idea.

### Startup Idea 2: Agent Readiness for Businesses

**17:10** · So, startup idea number two is agent readiness for businesses. This is like SEO for the agent internet, but I wanted to find it very specifically because AI SEO is already becoming a a buzzy fuzzy phrase. The real business is helping companies become easy for agents to understand, trust, compare, and recommend. Think about a B2B SaaS company.

**17:34** · A human buyer lands on the homepage, reads the hero image, clicks around, looks at the pricing page, reads some docs, maybe books a demo, watches a case study, and maybe asks a friend about this particular product. Agents are compressing that whole process. If someone asked their AI assistant, find me the best payroll provider for a 15-person company in California, the agent has to understand the market.

**18:04** · So, the agent is basically asking, "Who's this product for? What does it cost? What does it replace? What sort of integrations? What are the risks? What does implementation look like? What do a customer say? How does it compare to alternatives?" Most websites actually make this harder than it needs to be.

**18:21** · They hide pricing, they bury docs, they there's just not a lot of information there. They're not constantly updating their website, so they end up having stale websites, stale comparison pages. Uh some of the most important information is actually in PDFs. Um and finding policies is extremely hard to find in general.

**18:43** · And there's just a lot of marketing speak, so you'll see things like unlocking operational excellence. So, there's a lot of just like foggy copywriting. So, the startup idea is basically to make these websites agent-readable. Here's the wedge I would use. Start with a paid audit, and I've done episodes on the podcast with Corey Ganim around some of these things. Uh you can go deeper in into with Vas, where we talked about um what is a forward deploy engineer, uh where we've talked about paid audits.

**19:15** · But I want you to pick one vertical. B2B SaaS is obvious, but you know, you can do Shopify apps, law firms, health care clinics, financial advisors, insurance broker brokers, home services, whatever you you know, and then run, you know, 20 to 50 buyer intent prompts across major AI tools. So, you're going to ask questions like, "What is the best software for this use case? Compare this company to top alternatives. What does this company cost? Who is this product best for?

**19:47** · What are the risks of choosing this vendor? Would you recommend this product for a 20-person company? What integrations does it support?" Then you show the company the answers. And this is really the sales moment because you might show a founder, "When buyers ask AI for your category, you do not show up." Or you show up, but AI gets your pricing wrong. On your website, it's $20 a month, but AI for some reason is getting $8 a month.

**20:14** · Or the AI recommends your competitor because their docs are cleaner. Or your website has the answer, but it's buried in a PDF from 2002. That gets their attention, especially if you're doing cold email and stuff like that. Then you sell the fix. The fix is an agent readable source of truth. So, that might include an a clean lms.txt file, which is a file that, you know, it helps uh LLMs crawl your website. Uh a better

**20:48** · documentation structure, uh pricing page a pricing page agents can parse, comparison pages that are honest and specific, use cases pages written in just like plain uh plain simple language, customer proof organized by segment, structured FAQs around real buyer questions, schema markup, a product feed, a change log, a lightweight MCP server or search endpoint if the company has enough data uh enough useful content. If they don't, then probably not that.

**21:18** · And then, the recurring product is the measurement loop. So, every month you rerun the prompts, you see what's changed, you see whether AI answers are more accurate, whether the company appears more often, whether the competitor comparisons improve or get worse, and you see where the website needs more structured proof. And this could start off as an easy services business. So, you can charge something like 3,000 to 10,000 for the audit and cleanup. And then, for larger B2B companies, it could be something like, you know, 10, 15, 20,000.

**21:50** · And after you do 10 clients in the same niche, you're going to see a bunch of repeated work. And this is why I love starting with services businesses and then a productizing it with software as you go.

**22:04** · You're going to learn things like the same docs are missing. The same pricing pages are unclear. The same questions matter. The same structured files need to be created. The same monthly report needs to be delivered. This is when you turn it into software. And the way to sell this is very simple. You're not selling the future, you're selling the screenshot. You show them what AI says about their company today. And that becomes the whole sales deck.

**22:30** · For local businesses, this eventually becomes let AI assistants book appointments with you. For e-commerce, it becomes something like make your product catalog easy for shopping agents to compare and buy.

**22:47** · For B2B SaaS, it becomes make your product easy for procurement agents to evaluate. And for publishers, it becomes make your archive easy for AI systems to understand and license. And I think that there's going to be uh venture-backed companies and you're already starting to see it happen doing these horizontal products that do this. The opportunity here is to go extremely vertical.

**23:11** · Obviously, B2B SaaS is like too big, right? You want to pick a specific niche, go go deep into that. But I think this is a wonderful business that's cash flow on day one that could productize, that could eventually sell at some point in the future. Basically, help businesses become easy for agents to understand, trust, compare, and recommend. There's a ton of demand from businesses right now for this. Cuz they're feeling this pain.

**23:42** · So, you just solve it. Last but not least, startup idea number three is turning expert archive into agent tools.

### Startup Idea 3: Expert Archives as Agent Tools

**23:50** · I'll explain what I mean by that. This one is probably the most fun for creators, media companies, analysts, consultants, researchers, people like that that have, you know, are sitting on years of valuable content or can get their hands on valuable content. What do I mean by valuable content? I'm I'm saying I'm talking about things like YouTube videos, podcasts, newsletters, templates, things like that, community posts.

**24:19** · Right now, most of that content makes money through ads, sponsorships, sometimes subscriptions, sometimes communities, sometimes consulting. But in the agent internet, that archive could become a tool. So, imagine a founder agent that can access a startup's expert archive and critique your idea. Imagine a sales agent that can use a specific sales trainer's framework to rewrite your cold email. Imagine a fitness agent that can use a coach's training philosophy to build a personalized plan.

**24:54** · The startup is archive to API. You take someone's expertise and you package it so agents can use it. The key is to start with one job. Don't go to a creator and say, "We're going to turn your whole brain into AI." That honestly sounds a little creepy, a little vague, and honestly like a SaaS landing page that should be illegal. You got to say something that's specific. So, what do I mean by that? Something like, "You have 300 videos about sales. We're going to turn them into a tool your audience could use to improve cold emails."

**25:25** · Or hey, "You've got 500 episodes about startups, podcast episodes about startups. We're going to turn them into a startup idea feedback tool." Or maybe it's to a designer. It's like, "You have a decade of these design teardowns. We're going to turn them into a landing page critique tool."

**25:45** · You know, you've got this one archive with one painful job, one workflow, and here's how I would build this startup idea. So, I would pick an expert with a deep archive and a specific audience. Me partic- in particular, I'd pick someone who is more in like the B2B space, but it could work for B2C.

**26:06** · Specific matters just because a general business creator, for example, is is just going to be harder to harder to do, but maybe a creator known for cold email or Shopify growth or local business acquisitions, tax strategy, fitness programming, or like what we talked about, teardowns. That would work really well. Second, you want to go and collect the archive. So, you're going to want to go and transcribe the content if that's videos, if it's podcasts, pull the newsletters, clean the docs.

**26:39** · And then third, you're going to do tagging. So, you're going to tag the archive by job, by topic, by audience, by example, by framework, and by out- outcome. A lot of people get lazy at this part. They throw everything into a vector database and then just call it a day. That usually gives you a search box with confidence, but a real product needs structure. So, if it's a sales if it's a sales archive, you want to tag by prospecting, by subject line, by offer, by objection, by follow-up, personalization, deliverability, and close.

**27:10** · If it's a startup archive, you want to tag by the idea, by the market, the wedge, the distribution, the pricing, the MVP, the community, the mode and examples. So, you're very specific, right? I think that that the the best tools here are going to be very specific. Um and then that's going to help get the best outcome for people ultimately.

**27:32** · Um fourth way you want to do is build one useful workflow. So, for a sales uh expert, that workflow could just be paste your cold email. The agents are going to critique it using that expert's uh principles. Maybe it's Alex Hormozi, let's say. Alex Hormozi is going to go in and critique it. It sites the source lessons. It rewrites the email. It gives you a score. It gives you one test to run. And that's that's the product.

**28:00** · Um you know, for a startup expert, the workflow could be paste your idea. The agent gives you the wedge. It gives you the customer. It writes the first offer. It suggests the first distribution channel. And it tells you what to validate this week. And that's kind of what we're doing with ideabrowser.com.

**28:17** · You know, you are one of our most popular features is adding the MCP. And it just it's so good because it takes your LLM and just uh makes it better, right? And it's got all this data that we've cleaned um to help you do that. So, I'm I'm practicing what I'm preaching here.

**28:35** · Um for a real estate expert, you know, what could that be? Well, it could be something like you paste the deal. The agent checks the assumptions. It identifies the risks. It compares it to the expert criteria. And it tells you whether to ask the broker. That would be super super useful.

**28:52** · Um, what's cool about doing something like this, the creator already has the distribution, so you don't have to worry about the marketing, the customer acquisition. They've got all that trust already built built in, but the audience wants the expertise. And uh, you uh, the the creator might not want to do consulting with everyone, right? So, this uh, democratizes that. So, you can charge a lot cheaper. You could be something like $19 a month or $50 a month.

**29:17** · You can bundle into like a paid community or you can charge it or you can even make it a lead magnet for the consulting or you can license it to license it to agencies or software companies, that sort of thing.

**29:30** · Um, this is really where the cloud-first style monetization becomes interesting because if the archive becomes this resource and agents can pay per request, the creator gets paid when the knowledge is used, the builder gets this trusted, you know, expert layer, the person, you know, consuming it gets this expert layer, um, and, you know, gets better output. Um, that's way better than hoping someone watches a pre-roll ad before a 47-minute interview from 7 years ago.

**30:01** · I think the biggest mistake in this category that I've noticed is I've seen a lot of like chat with an expert uh, products, but that's too broad. So, I think the specific uh, you know, the specific use case is way more interesting. It's and it's way more outcome-based. It's not chat with a salesperson or chat with a sales creator. It's, you know, rewrite the cold email using the sales system. Um, so, if you can turn expert archives into job-specific agent tools, um, I think that could be really cool.

**30:34** · Um, and someone should do it. So, those are the three startup ideas. The, you know, number one, the the data refinery. Number two, the agent readiness for business, and number three, the expert archives turned into agent tools. Um what connects all three of these ideas is agents need clean, trusted, and useful resources to do really good work.

### The Filter for Finding Ideas

**30:54** · So, that resource can be data, but it could be structure, it could be access, it could be expert knowledge, it could be a tool, uh it could be a payment rule. The The Cloudflare news matters because building part of the access and payment layer, that's what they're building and and that's a huge thing. But, you don't have to wait for Cloudflare's whole new agent internet to mature in order to start building out some of this stuff.

**31:22** · So, um you know, you can start by building the manual version first. You know, you can sell the human version now. You can build the data now, um and you can package this up now. So, as agents become more capable and agent payments become more and more common, you're you're not scrambling to start building this stuff. This is the early you're early, you know? Not many people are talking about this.

**31:47** · Um and if you're looking for ideas in the space, the questions you should ask yourself are what decision is expensive, what information is messy, what changes often, what are who already pays for help, and what would an agent need to do to do the job better?

**32:06** · That's basically the map to be thinking about and the questions to be thinking about, so you can spend the next 6, 12, 18 months building up this data, curating the data before it bec- it becomes hyper-competitive.

**32:20** · Um I truly believe the internet is shifting from pages human visit to resources agents use, and I don't think it's crazy to say that. Um and if you made it this far, you probably agree, too. Um the best opportunities look really small right now, um because the agent internet is small relative to where it's going to be.

### Closing Thoughts

**32:43** · But I think that's how a lot of the biggest businesses start started, right? You know, you're you're this is like building an app when the App Store came out in 2009. You know, there's going to be an incredible you know, this cohort of businesses starting in this era 2026, 2027. I think there's going to be just an incredible amount of businesses created here. It's very clear that the agent internet is the next wave.

**33:09** · So when you see Cloudflare talking about AI crawlers, X402, paid access, MCP tools, and monetization, don't just think that's a little interesting thing, or don't just think, "Oh, publishers can now charge bots now." It's way bigger than that. Agents are becoming buyers, websites are becoming resources, and the next great internet businesses and the next great internet businesses might be these tiny paid doors that agents walk through all day that you're going to own. It's an asset. And I can't wait to see what you build, what you do.

**33:44** · If this has been helpful or got your creative juices flowing, shoot me over a comment, like, and subscribe for more of this in your feed. I read every single comment, by the way. And I'll see you on the next time. Thank you for listening to the Startup Ideas podcast. Have a creative day.

**34:00** · I'll see you next and well, I already said I'll see you next time, so I'm just I'm missing you already, you know? I can't wait to I can't wait to the next episode. See you.