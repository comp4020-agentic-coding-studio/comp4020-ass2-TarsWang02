---
title: What a Jump Sounds Like
description:
  A takeoff blip and a landing blip are the entire sound budget this course
  allows — which is exactly enough to test what sound is actually for.
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
related:
  - sessions/09-sound-off
  - assessments/one-body-three-personalities
---

## Question

Mute the Jump Lab and run a trial. Now unmute it and run the same trial
again. What did the sound actually tell you that the visible pose and
trajectory didn't already show?

## Prediction (skip if you'd rather just look)

Before testing: do you expect a muted trial to be *harder* to read, or just
different? If a player relied on the takeoff sound to know they'd left the
ground, what would that imply about the visuals?

## Experiment

Run three trials with sound on, paying attention to exactly when the
takeoff and landing sounds fire relative to the pose changing. Then mute and
run three more. If you can still tell, without sound, exactly when takeoff
and landing happened just from watching the body, the sound was
reinforcing something already visible. If you genuinely can't tell the
difference between two similar trials without it, that's a sign the
information was living only in the audio channel — which this course's
audio rules treat as a bug, not a style choice.

## Explanation

The Jump Lab plays a short takeoff sound and a short landing sound,
nothing else — no background music, no continuous audio — and every sound
requires a real user gesture to unlock, because browsers block audio until
one occurs and because a jump game shouldn't assume sound is even wanted.
Mute is always visible and always available. The stricter rule underneath
all of this: no information is ever communicated *only* through sound. A
deaf player, or a player with sound off, has to be able to reconstruct
takeoff, landing, and every measurement this course cares about from the
visuals alone. Sound here is confirmation, not a channel.

<details>
<summary>Why "light" sound design is a constraint, not a lack of polish</summary>

It would be easy to add a rising pitch during ascent, a whoosh scaled to
speed, background music matching a preset's personality. All of that risks
crossing from confirmation into information — a player who can't hear the
pitch rise loses something a sighted, hearing player has. Two short,
confirmatory blips is the largest sound budget that stays safely on the
confirmation side of that line for every player.

</details>

## Task

Run one trial fully muted and describe, from the visuals alone, exactly when
takeoff and landing occurred and what the trial's outcome was. Then unmute
and confirm your description against the sound. Report whether anything in
your muted description was wrong or missing.
