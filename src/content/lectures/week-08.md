---
title: Anticipation and Follow-Through
description:
  Two of animation's oldest principles, applied to a jump that already has
  its physics locked in — a windup before takeoff, a settle after landing.
week: 8
date: 2027-04-12
teachers:
  - idris-fenn
related:
  - sessions/08-windup-and-settle
  - assessments/one-body-three-personalities
---

## Question

The moment before your character leaves the ground, and the moment right
after it lands, aren't governed by gravity or launch speed at all — the
trajectory hasn't started yet, or it's already over. So what's happening on
screen during those moments, and whose job is it?

## Prediction (skip if you'd rather just look)

Before opening the Lab: do you expect a longer landing compression to make a
jump feel heavier or lighter? Would your answer change if the trajectory
itself was unchanged either way?

## Experiment

In the posture comparison, hold the trajectory fixed and push landing
compression from its lowest to its highest setting. At the low end, the body
barely reacts to touching down; at the high end, it visibly absorbs the
impact before recovering. Nothing about when or where it landed changed —
only how the landing *reads*. Try the same with arm swing during the ascent.

## Explanation

Anticipation and follow-through are animation principles older than any
digital jump: a windup before an action telegraphs it to the viewer, and a
settle after an action shows that the impact registered. Here, they're
implemented entirely through pose parameters — arm swing and landing
compression — computed from a trajectory that pose can't influence back.
That's exactly last week's separation put to use: you can chase a
"heavier-feeling" landing purely through compression, without touching a
single physics number, and know for certain you haven't changed how far or
long the jump actually was.

<details>
<summary>Why this isn't "just juice" layered on top</summary>

It's tempting to treat pose as decoration added after the real design work
is done. But a jump's landing compression is often the first thing a player
notices, before they've consciously registered the height or the timing —
which is exactly why keeping it separable from the physics matters: you can
iterate on how a jump *reads* as fast as you like without re-running any of
the measurements from weeks 4–6.

</details>

## Task

Pick one preset and design a landing compression and arm swing pairing that
you think reads as "anticipating" the jump and "settling" after it, distinct
from the pairing you chose for that preset in week 7. Describe in one
sentence what changed between the two pairings and why.
