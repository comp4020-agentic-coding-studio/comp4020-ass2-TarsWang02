---
title: What Makes a Measurement Trustworthy?
description:
  A number is not evidence by itself — this week is about the difference
  between a measurement someone else could reproduce and one they'd have to
  take your word for.
week: 3
date: 2027-03-08
teachers:
  - marisol-quaye
related:
  - sessions/03-autopsy-rehearsal
  - assessments/jump-autopsy
---

## Question

You've now measured height, displacement and airtime for two weeks. Suppose
you hand your week-2 table to a classmate with nothing else attached, and ask
them to get the same numbers. Could they? If your honest answer is "only if
they already knew which preset I used, which mode, and roughly how long I
held the button" — that information was doing real work, and it wasn't
written down.

## Prediction (skip if you'd rather just look)

Of the following, which do you expect varies *most* between two people
independently running "the same" trial: the preset, the mode, or the hold
duration? Which matters least once the other two are fixed?

## Experiment

Open the [Jump Lab](/jump-lab/) and pick any preset. Run five immediate-mode
jumps aiming for what you'd call "a full hold" each time, without watching
the clock. Look at your five airtime values. They won't be identical — your
thumb doesn't release at exactly the same instant twice — but they should
cluster, because the preset (gravity, launch speed, air control) hasn't
changed at all between trials. The spread you're seeing is measurement noise
from a human input, not noise in the simulation: the physics engine is
deterministic, so the same recorded input replayed through it produces the
same output every time, which is exactly what the Jump Lab's A/B tool relies
on later this course.

## Explanation

A measurement is reproducible when a second person, given your method and
nothing else, lands inside the range your numbers already show. That method
is three things: **which configuration** (preset name, or the exact
parameter values if you changed any), **which mode**, and **how many
trials**. Leave any one out and your table stops being a measurement of the
jump and starts being a measurement of whatever the reader has to guess.

This is also why the [Jump Autopsy](/assessments/jump-autopsy/) brief, due
this week, asks for a method section before it asks for an explanation of
the difference. An explanation built on numbers nobody else can regenerate
isn't wrong because the physics is wrong — it's wrong because there's no way
to check it.

<details>
<summary>Why "average of three" is the floor, not a ritual</summary>

Averaging three trials doesn't make imprecise input precise; it estimates
the noise floor from your own hold-time variation and moves your reported
value toward the true one for the configuration you ran. One trial can't
distinguish "this preset is floaty" from "I happened to hold a little
longer than usual." Three usually can.

</details>

## Task

Take one preset from the Jump Lab and run three trials in immediate mode,
recording height, displacement and airtime for each, plus their averages.
Write a two-line method statement above the table (preset, mode, trial
count) short enough that a classmate could reproduce it without asking you
anything else. This table and method statement are the exact shape the Jump
Autopsy brief scales up to two jumps — if this one is reproducible, that one
will be too.
