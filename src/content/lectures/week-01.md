---
title: What Is Inside a Jump?
description:
  A jump is not one thing — it is anticipation, takeoff, flight and landing.
  Naming the phases is the first step toward measuring any of them.
week: 1
date: 2027-02-22
teachers:
  - marisol-quaye
related:
  - sessions/01-look-inside-a-jump
---

## Question

Watch someone jump — in a game, or across a gap in the real world — and
describe what you saw in one sentence. Most people describe the middle: the
rise, maybe the fall. Almost nobody mentions the half-second before their feet
leave the ground, because nothing has moved yet. That stillness is part of the
jump too.

This course breaks a jump into four phases, and spends twelve weeks on what
each one is for:

1. **Anticipation** — the windup before takeoff. Nothing has moved, but the
   character is visibly about to.
2. **Takeoff** — the instant of leaving the ground. This is where a jump
   starts, in the sense that matters for measurement: airtime and height are
   both counted from here.
3. **Flight** — everything between takeoff and landing. Height, horizontal
   distance and however much control the player has over the air all live in
   this phase.
4. **Landing** — the moment of touching down, and however long the character
   takes to settle afterward.

## Prediction (skip if you'd rather just look)

Before you try anything: which of the four phases do you expect takes the
*longest*, in a typical platformer jump? Which takes the *shortest*? Hold
your answer loosely — the next section is where you check it.

## Experiment

Open the [home page](/) and try both jump modes at least twice each:

- **Immediate** — press to launch; hold to rise higher; release to cut the
  ascent short.
- **Charged** — hold to charge, release to launch; the longer you hold (up to
  the cap), the higher you go.

The home trial reports height, displacement and airtime for every jump —
real numbers from the simulation, not a guess. Airtime is measured from
takeoff to landing, so it already gives you the boundary between phases 2
and 4: everything the trial times *is* the flight phase.

Notice that the trial doesn't report anything for anticipation. That's
because anticipation (and the settle after landing) is a **cosmetic** phase —
a windup pose, not a change in the physics — and this course treats posture
as a separate design problem from week 7 onward. Whatever a character's
anticipation eventually looks like, it will never change a single number the
home trial reports today. That separation — what changes the physics versus
what only changes how it looks — is one of the two or three ideas the whole
course is organised around.

<details>
<summary>If you want the physics under the flight phase now</summary>

The flight phase is governed by two numbers this course will spend weeks 4–6
on: **launch speed** (how fast you leave the ground, which sets your initial
height) and **gravity** (how fast you're pulled back down, which sets how
quickly that height is lost). Airtime up and airtime down are equal exactly
when nothing else touches your vertical speed while airborne — which, for
now, in immediate mode with a full press, is true.

</details>

## Task

Run at least three jumps on the home page — both modes, and at least one
short press versus one full hold in immediate mode — and record, for each:

| Jump | Mode | Height | Displacement | Airtime |
| --- | --- | --- | --- | --- |
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

Then answer, in a sentence each:

- Which of your three jumps had the longest flight phase, and by how much?
- Name one thing that happened *before* takeoff in each jump (however brief)
  that a viewer would still call part of "the jump."

This table is the format the [Jump Autopsy](/assessments/jump-autopsy/)
assessment in week 3 asks for at a larger scale, so the habit you build here
— read the number the trial actually reports, don't estimate it — is the one
that assessment is checking for.
