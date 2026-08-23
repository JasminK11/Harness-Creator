---
title: "The Missing Layer: Design Taste in AI Agents — Hassan El Mghari, Together AI"
source: "https://www.youtube.com/watch?v=7GMKdpLsxwU"
author:
  - "[[AI Engineer]]"
published: 2026-08-21
created: 2026-08-23
description: "Most people can spot a vibe coded app in two seconds and cannot say why. Hassan El Mghari names it: the purple gradient background, italics in the header, a scroll to explore prompt nobody asked for,"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=7GMKdpLsxwU)

Most people can spot a vibe coded app in two seconds and cannot say why. Hassan El Mghari names it: the purple gradient background, italics in the header, a scroll to explore prompt nobody asked for, all caps pills with wide letter spacing, too many emoji. He reckons you could list thirty such tells, and naming them is what lets you tell an agent to avoid them. That is most of what Hallmark does, the design skill he shipped six weeks ago to more than 10,000 users. It codifies the patterns as gates and hands the model a library of themes, on the through line that strong inspiration produces much better work.  
  
El Mghari leads developer experience at Together AI and is not a designer. He has shipped roughly ten apps a year for five years, a few reaching millions of users, and credits design for that reach. He starts an app in Codex or Claude Code, then iterates with a smaller open source model, and made the case by putting up two landing pages, one from GLM 5.2 and one from Opus 4.8, and asking the room to guess which was which. Almost nobody could. The rest is practical: keep a vault of screenshots you admire and paste them in, the one habit he says to take away; record a voice note and let the prompt run three paragraphs; send one or two features per prompt instead of seven; write accumulated preferences into a skill file or AGENTS.md. Whatever the agent hands back is a base, never the finished app.  
  
Speaker info:  
\- https://x.com/nutlope  
\- https://www.linkedin.com/in/nutlope/  
\- https://nutlope.com  
  
Timestamps:  
0:00 - Ten apps a year, and why design is the edge  
1:41 - The apps: logos, comics, subtitles, a cloud agent  
3:08 - The tells that give away a vibe coded app  
4:11 - Hallmark: slop gates and a theme library  
6:53 - Iterating with a smaller open source model  
7:30 - Guess which page came from which model  
10:50 - Give the agent references and screenshots  
12:18 - One or two features per prompt

## Transcript

### Ten apps a year, and why design is the edge

**0:01** · \[music\] All right. Hello everybody. Welcome. Uh my name is Hassan. I lead the developer experience team over at Together AAI and I'm super excited to be here today to talk to you about how to make AI apps look good or stop letting your agents ship ugly UIs.

**0:31** · Um, I'm especially passionate about this project because uh a big part of my job and just my personal life I I just love building a lot of these AI apps and uh I'll go to the next slide. Uh I've been building about 10 apps a year for the last uh five years and I've been lucky enough that some of these apps have have gotten you know millions of users that have tried them out and I think the number one reason for that is honestly just design and UX and so that's what I want to talk to you about today is how I approach design and UX in my apps as someone who's not a designer.

**1:01** · Um but before we move on really quick I work at together AI we're an AI native cloud platform. We help you do three things.

**1:08** · We help you run uh open source AI models. Uh chat models like GLM 5.2, image models like nanobanana, audio models, vision models. We have kind of all the different modalities and all the big open source models on our platform through our inference API. We let you fine-tune models on your own data. And then we also uh have a GPU cluster product where you can reserve H100s and B200s to uh train your own models or do your own inference. So, uh, getting into some demos. I just want to start with a couple apps that that I've built so you get a sense of like the the type of stuff that I build.

**1:39** · Uh, they're usually very simple one-page apps, uh, where I try to index on the design and some animations and things like that. So, this is like a logo creator app that I built that got about 85,000 people uh, that that used it. This is one called Make Comics where it'll create a comic book from scratch starring you as as the superhero. Um, and uh, this one actually we actually have in person at our at the Together AI booth at this conference.

### The apps: logos, comics, subtitles, a cloud agent

**2:03** · Um, and where you can go and there's a little iPad and you can take a picture and and get a real comic book printed out that that you can take home. Um, other stuff like uh, this is generating subtitles from from videos. I upload a lot of videos uh to YouTube and to Twitter and so I needed something like this and uh, I looked into just like generating subtitles with with open source models. This one had about 8,000 people that that checked it out. uh you know AI chat app for open source models.

**2:28** · This one's fairly straightforward. Um this one is a is a website that I built to help you build five or six different variations of whatever landing page you want to build and then you can kind of choose one of them. Um and then the the last one I'll show off really quickly is uh like an AI cloud agent where you can ask it to do things and uh give it a GitHub repo and it'll spin up a sandbox and actually u create a PR for you from scratch.

**2:52** · So this is just an example of like some of the stuff that that that I build and I that I put out and and I think really the big takeaway here is uh you know we live in a world now where more and more AI apps are kind of slop.

**3:06** · You know you can kind of look at it and within a second or two you can kind of tell that like h this this kind of looks AI generated and so I think just doing a little bit of extra effort like a little 10 to 20% after just focused on the UI uh is a really really big competitive advantage for these things. Um, so like I said, vibe coded apps kind of all look the same. They have the same tells. Um, they have the same kind of purple gradient background in every single one.

### The tells that give away a vibe coded app

**3:30** · Uh, they have italics in in headers. Um, they always have the scroll to explore for some reason. Uh, they have these pills that are all like all caps and with with spaced out um uh letter spacing. They have these gradient logos.

**3:45** · They use a bunch of emojis. And so it's it's the same kind of stuff. sometimes some some spacing and padding issues.

**3:51** · Um, but the point is it's it's actually just like a if you really think about it and you look at all of these AI generated websites, you can come down, you could make a list of like 20 or 30 different things that are like, okay, this is this is what AI slop is, right?

**4:02** · All these like random graphics. Um, and so I'm going to talk about two different ways that I've tried to overcome this.

**4:09** · Um, and and the first one I'm going to start with is this design skill that I built called Hallmark. And Hallmark basically takes all of these uh AI slop patterns uh and uh codifies them uh and and tells AI models like hey like don't don't use these you know don't do a purple gradient um uh don't use italics in the title uh and and all of these uh AI slop gates is what I call them or slop patterns. Uh so that's one thing it does. And then the second thing it does which I think is really important when you're building stuff is it gives your AI model a lot of different themes.

### Hallmark: slop gates and a theme library

**4:41** · And so I I built a bunch of these different themes. We feed them into Hallmark. And so like when you ask Hallmark to create a a website for you, it'll use these as context. And then and that's kind of that's going to be a theme throughout this talk as well is of like if you give AI models really really good inspiration, they tend to perform uh very very well. Um and so I launched this about uh a month and a half. I have about a month and a half ago. I have a little over 10,000 people that have tried it out so far.

**5:10** · These are some examples of of uh I've mostly indexed it on landing pages, but uh landing pages using Hallmark. And so this is build a landing page for an indie podcast and it gives you that uh and there's different skills and stuff that I'm not going to get too deep into. Uh but the main things I just wanted to uh I just wanted to cover the AI slop gates and the themes and and those two things really uh they do a lot. Um and so this is the announcement tweet and and I got a bunch of really great feedback and we're still iterating a lot to to try to make it really really good. Um, but I found this to be a uh one way that I try to avoid slop AI slop websites.

**5:41** · Uh, and so this is uh some some more examples of hallmark generated pages. This one's build a landing page for like an invoicing uh app. And and you can see like they don't have a lot of the same tells that you'd expect from an AI generated website. And these also are just one shot. Uh right, this is one single prompt and you get this whole website. And really a lot of the magic also is in kind of iterating on these things over and over and over again. Um, so this is uh this is another one. Uh, and then like a before and after. This is a a pretty good example. This is like build a page for like a learning app for kids.

**6:12** · And on the left is like without Hallmark and on the right is with Hallmark. You can see it like, you know, it's just a little bit cleaner. It's a little bit nicer. Uh, it has more like animations, which I didn't record a video to show it, but um, it just looks a little bit nicer in general. This is another one as well. On the left, kind of like the the classic AI generated page with the with the gradients and and everything like that.

**6:31** · And on the right is is with Hallmark. you you know you can look at the one on the right and still say like oh well that's not a perfect landing page um but it does give you a much better base to start out from right and then you can kind of iterate your way to something that you know really really looks incredible \[snorts\] um and you know I've been indexing on this thing but app iteration is also very important and I think specifically uh a lot of people I think undervalue

### Iterating with a smaller open source model

**6:55** · the importance of using uh smaller faster models for these app iteration uh cycles a lot of the apps that I build now I'll kind of start in like codec or cloud code to build a base and then for iterating I'll use usually smaller open source model like GLM 5.2. GLM 5.2 is amazing. Uh who who here has used it? Uh show of hands. Okay, a few people. Um so this is a model that came out two weeks ago that in my opinion was like the first open source model that to actually be very very good at design.

**7:20** · And actually we're going to play a little game here where one of these landing pages was generated by GLM 5.2 which is like a cheaper open source model and the other one was generated with Opus 4.8.

### Guess which page came from which model

**7:32** · Um, raise your hand if you think GLM 5.2 is a.

**7:37** · Okay, four hands. That was the GLM 5.2 one, right? So, they're almost almost indistinguishable in certain ways where the one on the left is generated with the GLM 5.2. It was created way faster um as well because it's just it's a smaller model, so it's just inherently a lot faster. And the one on the right, you know, cost five times as much and and was a lot slower as well. Um, so anyway, this is another one where the left and the right, the left one arguably is even more AI generated. Uh, and that's the one uh that that that Opus actually created, right?

**8:08** · So anyway, like when I say like use a cheaper model to iterate with, it still needs to be sufficiently good and and um GLM 5.2 is one of those models I feel is is really really incredible for for this kind of stuff. So this is another example where it's very hard to tell the difference.

**8:24** · uh and and for iteration. So this is like a uh a really simple website I on one shot with just that one prompt. This is using GLM 5.2. And you can see this does have a lot of AI tells. It's impressive that it actually works. It's an image playground where you send it a prompt and you get an image. Um but just with a little bit of iteration on the left. I'm not going to go through all of it. um you get to a website that looks it it looks roughly similar, but it just looks a lot nicer and it has a much better logo and way better loading states and animations and uh just better spacing overall uh with with just a sing one or two follow-up prompts.

**8:56** · So I I think like uh iteration is is extremely extremely important.

**9:02** · Um, so the final part of my talk is just takeaways for like how how I approach building apps that look good as someone who's not not really a designer as well.

**9:12** · Um, a lot of other people speaking on this track are are incredibly talented designers and and you should take a look at their thing. My my objective is not necessarily to make the best designed app in the world. It's just to make apps that look and feel really good or at least much much better than like purely kind of AI generated slop. Um so so my my main takeaways for this one is like getting familiar with a lot of these AI tells right we went through some of the like patterns of of AI slop.

**9:38** · Uh a lot of the time you know I sit down with people and I show them a website and they're like oh that's AI generated right in two seconds but they can't tell me why right they're like it just looks AI generated.

**9:49** · I have no idea what it is. And so I I think it's it's worth understanding that like well yeah it's it's purple gradient and it's this this logo and it's this thing. Uh and when you understand that stuff I think it becomes a lot easier to um to uh bake that into the apps that you build or ask the AI models to hey like hey don't don't do this or don't do that. Um so so that's that's one tip I have. Uh another one that's kind of tangential is like saving your preferences in some sort of skill or markdown file. You can do an agent.mmd.

**10:16** · You can do kind of whatever you want.

**10:18** · Um, but the big thing here I think is as you build stuff, you start to build an intuition for like what you want, what you don't want. Like you generate a website and every single time the logo looks like crap and you have to regenerate the logo. Um, you can start to build out an agent.mmd that has a bunch of this stuff like avoid this for the logo. Do them this way. For this, do it that way. Uh, and and as I've gone, I've kind of built up like a substantial agents.mmd that helps me do this. And and to a degree, this is kind of what Hallmark is as well, right? If you don't have your own, you can use something like like Hallmark. Um, this is maybe the most important one.

### Give the agent references and screenshots

**10:50** · If you take one thing away from this talk, please give your agents references and screenshots.

**10:56** · I don't build anything uh nowadays without uh giving AI models a lot of inspiration. And I kind of have this like inspiration vault for like anytime I look at like a website or an app that I really like or that I'm like, "Wow, like this this looks amazing." I'll just save it. Uh I'll just save it somewhere.

**11:12** · And now I have a a really large collection of them. And so when I'm building a new app, I usually will will be like, "Oh, I actually I kind of I think I want this look like a a mix of Dolingo and a mix of this app and a mix of this app." And I'll paste in a ton of screenshots for the AI model to look at and and the output will always be way way way better. So um always try to use references and and uh uh screenshots. Um longer and more specific prompts are always better. Um these days I I will just record voice notes.

**11:40** · Uh, and so I'll start a voice note for like one, two, three minutes and I'll just rant and be like, well, I want to build an app that looks like this and here's how uh you you should use it and here's the type of user that's going to use it and we have a text box here and we have an image upload thing and here's how it should look and here's and here's some inspiration, right? And so it's usually like all my prompts now are like two two to three paragraphs. Um, so they're they're a lot longer prompt and and they usually do a lot better. Like this is like an example of a much longer prompt.

**12:07** · I'm not going to go through all of it, but uh it just produces something that's just a little bit better like at the uh the thing on the bottom was was kind of produced with with with this prompt. Um break things down into steps. I think like so I just talked about make your prompt longer.

### One or two features per prompt

**12:22** · Um but also if you're building seven different features, you probably don't want to put them all in the same prompt, right? probably want um you can do one, you know, one or two features per prompt where you talk about them extensively and uh and uh usually I'll send off like the start of the app will be like a a huge prompt with a bunch of screenshots of inspiration and then immediately I'll queue up like a bunch of other messages of like oh we'll do this feature and do this feature and do this feature and I'll kind of uh uh let it go. So that's something that I that I've seen helps.

**12:52** · Cool. Uh this is one this is the one I talked about iterating with a cheaper open source model can be using closed source models for everything. Um for iteration tasks I I' I've found they're a lot better. Um I think uh cursor did a great job proving this with like composer 2.5 which is like an open source model that they postrained. Um and uh it kind of feels magical using it for iteration because it's so so so fast. And so you'll see that in in uh some of these uh open source models.

**13:19** · Cool. Cool. And then the last thing is um I see people kind of trying to oneshot apps and then being like, well, that's it. I'm done. You know, I'm going to post this as is. And it's really really important to understand that like whatever your agent creates is just the base, right? And it's on you to kind of like give it additional context, give it additional inspiration, and go back and forth and um make the apps look and feel really good, keep them simple, uh and and uh kind of iterate that way.

**13:48** · Cool. That's all I got. Thank you so much for coming. \[applause\]