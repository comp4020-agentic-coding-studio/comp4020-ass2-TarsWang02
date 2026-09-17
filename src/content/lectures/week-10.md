---
title: One Change at a Time
description:
  The A/B lab replays the exact same recorded input through two
  configurations — which is what makes it possible to trust the comparison.
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
related:
  - sessions/10-fair-fight
  - assessments/one-body-three-personalities
---

## Question

You want to know whether raising launch speed makes a jump feel better. You
raise launch speed, jump again, and it does feel better. Is that evidence
launch speed was the reason — or could it just as easily be that your
second attempt happened to hold the button a little longer?

## Prediction (skip if you'd rather just look)

Before opening the Lab: if two trials use different human-pressed input,
how many things changed between them — the parameter you meant to test, or
that parameter *and* whatever your hands did differently the second time?

## Experiment

Open the [Jump Lab's A/B comparison](/jump-lab/#ab-lab). Record configuration A, then change
exactly one parameter and press replay. Both A and B run the identical
recorded input trace — the same held keys, at the same frame, for the same
duration — through two different configurations. Now imagine trying the
same comparison by just jumping twice by hand instead: your hold duration
alone would introduce a second thing that changed, on top of the parameter
you meant to isolate.

## Explanation

A fair comparison changes exactly one variable and holds everything else,
including the input, identical. The A/B lab enforces this structurally: it
can't run two trials with different human timing, because it replays one
recorded trace through both configurations. This is stronger than being
careful — a careful human comparison can still drift, but a replayed trace
cannot. Every A/B result you produce this way is worth more as evidence than
any number of hand-jumped comparisons, no matter how attentively you tried
to hold your timing steady.

<details>
<summary>Why A is locked once B starts changing</summary>

If both sides of the comparison could be edited after recording, "A" would
stop meaning anything fixed to compare against — you'd just have two moving
targets. The lab keeps A immutable specifically so that every version of B
you try is being measured against the same fixed reference, not a rolling
one.

</details>

## Task

Record a configuration A, then run three separate B comparisons, each
changing exactly one different parameter from A (for example: gravity only,
then air control only, then release cut factor only). Report which single
change produced the largest visible difference in the replay, and which
parameter changed it.
