---
title: "Inside 847 Production Clinical AI Notes — Sebastian Fox, Composo"
source: "https://www.youtube.com/watch?v=yqF6XhzbWBk"
author:
  - "[[AI Engineer]]"
published: 2026-08-22
created: 2026-08-23
description: "A clinical note from a real consultation reads like a routine tension headache, and nothing in it is wrong. What never reached the page is that the patient also mentioned her jaw aches when she chews,"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=yqF6XhzbWBk)

A clinical note from a real consultation reads like a routine tension headache, and nothing in it is wrong. What never reached the page is that the patient also mentioned her jaw aches when she chews, which alongside a new headache over 50 is a red flag for a condition that can take her sight within days. Sebastian Fox pulled that error, and every other failure here, out of three leading production ambient scribes in one afternoon. In the largest real world study of these notes, roughly one in 20 carried an error serious enough to cause significant harm, nearly one in five had an important omission, and more than one in 10 contained a hallucination. Ambient scribes now run in about a third of US practices, and almost none of this surfaces as a reported incident.  
  
The obvious fix is a checker after the generator, and Fox built the best version he had seen: a frontier model, a faithfulness rubric with worked examples, automatic rubric optimization, deterministic concept counting. One in five of the notes it waved through still hid a serious error. Verification is only cheap for the easy half, spotting what changed between transcript and note. Deciding which differences matter is tacit, contextual and always moving, so it was never written down anywhere a rubric could read. Two notes drop the same holiday detail, and France is noise while Lake Malawi is the diagnosis. His answer is to keep the standard as examples rather than specifications, discovered from real outputs and assembled per note.  
  
Speaker info:  
\- https://www.linkedin.com/in/seb--fox/  
\- https://composo.ai  
  
Timestamps:  
0:00 - The note that looks completely fine  
1:29 - The obvious errors, and how common they are  
4:02 - Mapping every failure across three production scribes  
5:30 - Mishearings, additions, changes, omissions  
7:03 - The hard part is knowing what matters  
7:56 - Put a checker after the generator  
9:35 - The best judge waved a fifth of them through  
12:06 - France versus Lake Malawi  
13:49 - Discover, capture, calibrate  
17:13 - Three judges on the same notes  
18:06 - Beyond healthcare

## Transcript

### The note that looks completely fine

**0:01** · \[music\] This is a clinical note an AI wrote from a real consultation.

**0:17** · Take a few seconds and read it.

**0:19** · It reads like a routine headache.

**0:21** · A new headache, likely tension type, take some paracetamol, come back if it doesn't settle.

**0:27** · Looks completely fine, doesn't it?

**0:30** · Here's what's missing.

**0:32** · In the room, she also mentioned her jaw aches when she chews. A new headache, over 50 with jaw pain on chewing, that's giant cell arthritis.

**0:42** · And untreated, it can take her sight within days. It's a same day start steroids now emergency.

**0:48** · And that one line, it never made it into the note.

**0:50** · On the page, it's a paracetamol headache.

**0:52** · And nothing in the note is technically wrong.

**0:55** · It's the dangerous part is what isn't there.

**0:59** · And so that's what I'm going to talk about today.

**1:01** · The dangerous failures are often the ones that actually look completely fine.

**1:07** · Firstly, who am I? I'm Seb, medical doctor by background, and now I'm Composure, where we build AI evaluation systems for high-stakes domains.

**1:19** · So, that one was a subtle kind of error, but sometimes it's not subtle at all.

**1:25** · A man in his 20s sees his GP for a sore throat, tonsillitis.

### The obvious errors, and how common they are

**1:29** · The AI writes that up. It gets him chest pain, suspected angina, diabetes medications he's never taken, and an address for a hospital that doesn't exist.

**1:38** · And I I really like the LLM for this one. I think it's it's a good attempt at hospital name. Um and weeks later, he's invited to diabetic eye screening for diabetes he doesn't have.

**1:50** · That's genuinely a real case that happened recently.

**1:54** · Obviously, these kind of crazy ones someone notices, but it's those quiet ones that sit in the record uncalled that are the most challenging and can actually do a lot more damage.

**2:06** · And they're not rare at all. In the largest real-world study of these notes, about 1 in 20 carried an error that was serious enough that it could cause significant harm to the patient.

**2:17** · 1 in 20. That's not theoretical in testing, that's in production on real patients.

**2:23** · And that's only the serious the ones. If you widen that lens to all errors, nearly 1 in 5 had an important omission and more than 1 in 10 had a hallucination.

**2:33** · And AI is being deployed at scale across healthcare fast. Ambient Scribes are one of the leading cases, already in about a third of US practices and climbing.

**2:43** · Physician AI use doubled last year and none of this is tracked.

**2:48** · So, for most of these systems, there's no adverse event reporting at all. The errors never show up as incidents, they just sit in the record.

**2:55** · So, errors this common that are going unseen is is quite hard for me to believe that it's not already affecting patients.

**3:03** · It's not that we checked and it's fine, it's that we're flying blind.

**3:09** · And this isn't just a healthcare problem, it's every high-stakes use of AI.

**3:14** · Healthcare shows it more viscerally because here being confidently wrong can be life and death.

**3:20** · But, everything I show you can map straight back onto other domains as well.

**3:25** · So, here's what I want to do. I'm going to show you what exactly is going wrong, why it's going wrong, why the systems we built to catch it don't work, and a suggestion at how maybe we can start to fix that.

**3:39** · So, first, what's going wrong and why?

**3:41** · So, LLMs are getting good, obviously. They don't make stupid mistakes anymore most of the time. So, it's not about dumb errors.

**3:48** · Everything here came out of three of the best production Ambient scribes on the market.

**3:54** · Ones that we all know.

**3:55** · We generated a load of notes across them last week. And this is exactly what's going on right now. This is every failure we found. Each dot is an error colored by type.

### Mapping every failure across three production scribes

**4:06** · Left to right, how much it matters.

**4:07** · Bottom to top, whether a strong automated check catches it.

**4:11** · And that split is the point.

**4:14** · A handful up top get caught. But almost everything sits below the line. The ones I care about most are these on the bottom right. The high stakes and missed ones.

**4:26** · Let me show you what a couple of those looks like.

**4:29** · So, a woman comes in with a headache.

**4:33** · Doctor asks, "Did it come on suddenly or build up gradually?"

**4:37** · She says she doesn't know. It just happened. The note records that as abrupt sudden onset.

**4:42** · And sudden onset is a red flag. You can see why it just happened could maybe be interpreted and inferred as abrupt onset.

**4:50** · But, that's a feature that points to a bleed on the brain. She never said it.

**4:54** · The model decided it. And now that one word drives the whole workup.

**5:00** · Here's another.

**5:01** · Doctor suggests running some tests.

**5:03** · Patient says, "Can we just try try antibiotics instead?"

**5:07** · They agree, hold off on the tests, treat, and see how it goes.

**5:11** · Note records the opposite.

**5:13** · Arrange tests today.

**5:15** · It kept the plan that they talked out of, not the one they chose. Every line in the note reads fine because it's not really a hallucination at all. It's not wrong. It was there in the original.

**5:26** · But, it's just not what they ended up deciding.

### Mishearings, additions, changes, omissions

**5:30** · So, why are these happening?

**5:33** · There's, you know, in ambient scribes, there's first transcription and then generation.

**5:38** · A lot of it does happen on the transcription layer.

**5:42** · It can be words misheard for their sound-alikes. So, Humalog heard Humulin.

**5:48** · Two insulins on completely different timelines, so swapping them could crash a blood sugar.

**5:53** · Hyperthyroidism becomes hypothyroidism, the opposite condition.

**5:57** · Or a drop to no on uh no evidence of cancer that becomes evidence of cancer.

**6:04** · So, these these are really hard problems, and they are common.

**6:07** · Not the ones I'm going to focus on, because most of what goes wrong is actually even with a perfect transcript.

**6:14** · It's the model reading the words correctly and still doing one of three things.

**6:19** · Either it adds something that was never said, it changes something that was, or it omits something that should be there.

**6:28** · Now, the blatant version of each of these is is really easy to catch. The hard part in all three is the same. It's telling whether that thing that was added or changed or dropped actually matters.

**6:41** · It's detecting that slight over inference versus the dangerous fabrication. The harmless rephrase versus the meaningful edit.

**6:49** · A dropped line of small talk versus a dropped allergy.

**6:53** · So, the ones that matter slip through along with all of the ones that don't.

**6:59** · That call which different matters is taste, effectively.

### The hard part is knowing what matters

**7:05** · Not aesthetic taste, but essentially judgment. It's It's whether in this context a missed allergy might kill someone or is not important.

**7:15** · And I think there's there's three properties that really matter about this.

**7:18** · It's tacit, so your domain experts have it, but they can't fully write it down.

**7:23** · It's contextual, so the same detail is critical in one note, noise in the next.

**7:28** · And it's moving. The model changes, guidelines change, two good doctors disagree, different hospitals have different definitions. So, there's no fixed target to write down.

**7:39** · And so, the model knows the facts, ultimately. They're extraordinarily capable, but what they lack is a sense of what matters here, for this specific example. And that's why even brilliant models make these mistakes.

**7:53** · So, one natural move, you're never going to make that generator perfect. Generator is cheap. Generation is cheap, so stop fixing it at the source.

### Put a checker after the generator

**8:02** · Let it write, put a checker after it, pass only what clears the bar.

**8:06** · And that checker should be the easier job. The generator has to get everything right and it pay attention to lots of varying instructions.

**8:15** · Whereas the checker only has to find the one thing that's wrong and just focus on that task. You can also give it more time, more tokens, the exact failure modes to hunt for.

**8:23** · Evaluation should be easier than generation.

**8:25** · It's the asymmetry of verification, verifies law. That's why AI is raced ahead anyway, you can cheaply check the answer, maths and code.

**8:35** · And doing this is exactly what the best teams do. They put a lot of energy into evaluation. It starts with the gold standard, which is expert humans reviewing notes, which obviously works offline, but you can't put a human on every note in production.

**8:50** · So, they automate it.

**8:52** · They build a serious system and some of the best versions of this that I've seen are you take the transcript and the note and context, put in front of the judge, a detailed rubric for faithfulness with worked, pass and fail examples.

**9:10** · The rubric maybe auto-optimized with GPA or something like that. Maybe you have some deterministic NLP to sort of count up medical concepts that are differing between the two.

**9:20** · That's a powerful system.

**9:22** · And yet, I pulled all of those errors earlier out of Ambient Scribes in an afternoon.

**9:29** · So, if the evaluation is this good, how are these errors still getting through?

**9:34** · So, I built this system and ran those same notes through it.

### The best judge waved a fifth of them through

**9:39** · And it scored most of them fine.

**9:42** · It flagged a handful of them and signed off the rest.

**9:46** · \[clears throat\] But one in five of those clean passes still had some sort of serious error buried in it. And often that was an omission. The things that should have been there and actually quietly weren't. And that's the best version of a judge I've seen in a lot of teams and it waved them through. Why did it do that? It's not stupid.

**10:09** · It's a frontier model, serious engineering behind it, more than clever enough to read the whole encounter and catch every obvious error. And it's not blind, either. And and that's part of the trap. If you take a note that says start amoxicillin, when the real decision was actually to wait and see, it's faithful to the words, amoxicillin did come up, but it's a lie about the intent. A good judge might catch that, might.

**10:34** · But whether it flags that versus the other doesn't have other things that it could comment on depends on it knowing what decision matters most. And so it's not blind, it just can't tell what counts, essentially. So the note passes confidently and you put a judge like that in front of your system, you've not added a safety net, you've added a second silent failure that just nods along with the first.

**10:59** · And here's the root of it. So in math or code, the verifier comes with free, a unit test, a compiler. But for is this note safe and complete, there's no unit test. You have to build the verifier yourself and verification is only easier than generation for the easy bit, i.e. spot the difference between transcription note.

**11:22** · But that's not the hard bit. The hard bit is knowing of all those differences you've seen, which matter. And that's harder than writing that plausibly good general note in the first place. Because that standard of good was never written down anywhere that the judge can read it. A rubric that you pre-specify is only the taste you could write down. The taste that matters is the part that you couldn't.

**11:43** · And so here's here's a bit more detail on what what matters looks like. Two patients, both with blood in their urine, both notes dropped the same kind of line where they'd been on holiday. One had been to France, the other to Lake Malawi. Same English emission, same shape, same mistake. Well, not really, because blood in the urine obviously warranted away and you're going to have to investigate it, but the France trip is irrelevant.

### France versus Lake Malawi

**12:10** · The Lake Malawi trip is the diagnosis. Fresh water in sub-Saharan Africa means schistosomiasis until proven otherwise and it completely changes what the management plan is. So that same dropped line in one note is pure noise, in the other it's the answer. And which one it is, you simply just can't write all of that down in advance.

**12:29** · So if you can't write it down, you can't write taste down, how do you get that into your evaluator and your whole application system?

**12:38** · Well, we've answered a version of this before. RLHF exists because you can't write the reward function for good. You learn it from examples by showing it. The only question is where you keep what you've learned. And there's three places. You can either specify it up front, you can stuff the prompt, write the perfect rubric. We just watched that fail essentially.

**13:01** · You can bake into the weights, fine-tuning or continual learning, but for a standard that's still moving and a score that has to be explainable, the weights, I think, are the wrong place to keep that. They go stale, they can't tell you why and you can't change them without a retrain.

**13:19** · So there's the third option, which I'll show you, which is you essentially just keep the taste as the examples themselves. Past judgments, expert corrections, references, and for each output, you retrieve the ones that bear on it into the judges context, add one and it's live on the next call. You can point at exactly what moved the score. For this problem, it's both better and also cheaper to do.

**13:44** · So, that's the way to do that is one repeating loop, three steps. Discover the failure modes from real outputs, capture how your experts judge them, calibrate every output against that, and when the standard moves, the loop moves with it. So, in more detail, discover. You don't write that rubric in a vacuum. You have to put the system in production and look at the real outputs.

### Discover, capture, calibrate

**14:06** · Cluster what goes wrong and the failure modes surface on their own. You name them. This is your failure mode ontology. Discover from your data, not guess on a whiteboard. And you can't shortcut it. The ways that a real system goes wrong are effectively unbounded and synthetic test cases only cover the failures you already imagined. The ones that hurt you are often the ones that you didn't. And you'll only find those in real outputs.

**14:30** · So, this ontology is your map, what to capture judgment on, what to retrieve against, including the failures that you never thought to check for. After that, it's capture and then calibrate. So, those discovered modes, they're not a checklist that the judge runs, but they organize everything. What you What you ask your experts about, how you index the cases that you'll retrieve, and capturing is a simple part. You put real outputs in front of your experts.

**14:57** · Clinicians spend a focused few hours leaving comments. A session doesn't have to be a month-long labeling project to start with. And you collect their judgment. Not just a score, but the reasoning and corrections. And over time, you build up that record of how your experts actually judge.

**15:12** · You then calibrate.

**15:14** · That's the the the generic part of this you can write down once easily. For example, be faithful or don't drop anything important. But what you can't write down is what counts as a serious miss for this specific note. That's contextual. And it shifts from note to note.

**15:29** · So, what we recommend is you assemble that on the fly. For each output, your judging agent pulls in everything that bears on this one case. It's memory of the most similar outputs that it's judged before and how they scored, the expert corrections that apply, the reference documents and guidelines. Just context engineering per output.

**15:50** · And crucially not just one pre-specified rubric in a vacuum, and not a model that you have to retrain every week, but a full sort of case-specific standard assembled for this output. And it's a loop as well. Every output you judge, every correction, sharpens the next. And when a brand new failure mode appears, Discovery surface it, and it flows straight back in.

**16:15** · And so, to make that a little bit more concrete, that headache that I opened with, the one that was really a possible blindness emergency, here's the kinds of things that you would want to pull in for that note. The nearest cases that your experts have judged, not this exact patient, but the same shape, maybe a red flag filed as routine.

**16:33** · Uh the corrections that apply, like a new headache over 50, um suggests something that you need to check red flags on, and some criteria and guidelines, and you pull all of that in. It hasn't memorized this case. It's a capable model. And handed the right context to reason from, held against that, the dropped red flag stands out. It was never actually hard to catch. It just didn't know what mattered.

**16:59** · And so, if you take that same data set generated notes from the start and pass it through these three judging systems, the first, a strong off-the-shelf judge with a rubric frontier model, um it's better than a coin flip, but it misses most of what matters. The second, that sort of serious system that we talked about before, rubric, deeper, maybe some detona stick checks, better again, but still missing quite a lot of what counts.

### Three judges on the same notes

**17:28** · The third, the judge running this loop, discovered failure modes, calibrated for output against what experts judged, is performing a lot better on this specific data set.

**17:39** · Same notes.

**17:41** · The only thing that changes is what the judge was shown. And the difference here, it's not more compute or a better prompt, it's that the first two fight taste and lose. They guess the criteria, they freeze one standard, and they go stale. This repeating evolving loop does the opposite. It discovers the modes, fits the standard to each mode, and keeps learning.

**18:01** · So, you might not write chemical notes, but if you ship anything where being confidently wrong has a cost, the contract review that misses the clauses that change the deal, the support agent that promises a refund you don't offer, the same thing is true for all of those.

### Beyond healthcare

**18:17** · It's watched, if at all, by a judge with no taste for what matters in your domain. So, three things. Discover your failure modes from real outputs, don't guess them. Capture your experts' judgment on them, the standard that they can't write down. Calibrate every output against the cases that they've already judged, not a static rubric, not a retrained model. Then keep that loop running.

**18:42** · And if you take one thing away, easiest place to start is your experts leaving free-form comments on real outputs. That's the real That's the raw material for everything else. Your judge can verify anything that you write down in advance, but the standard of good never could be. And so, stop trying to write it all down in advance, and just start capturing it case by case, and evolving it.

**19:07** · That's why evaluation can't be a thing you build once and freeze. The standard it checks against doesn't exist on paper. It has to be discovered from real outputs captured from the people who hold it and kept alive as it moves. Evaluation isn't something you have, it's something that you do continuously over time.

**19:27** · Thank you.

**19:29** · \[applause\]