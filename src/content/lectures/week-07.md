---
title: Same Path, Different Body
description:
  Two characters can follow the exact same trajectory and still look like
  they're jumping for different reasons — because posture was never physics.
week: 7
date: 2027-04-05
teachers:
  - marisol-quaye
slides: /decks/week-07/
related:
  - sessions/07-posture-workshop
  - assessments/one-body-three-personalities
---

## Question

If two characters follow an identical recorded path through the air — same
height, same displacement, same airtime, frame for frame — can they still
look like they're jumping differently? If your answer is yes, what's left to
change once the trajectory is fixed?

## Prediction (skip if you'd rather just look)

Before opening the Lab: name one thing about a jump's *look* you'd expect to
change even if the *path* through space doesn't move at all.

## Experiment

Open the Jump Lab's posture comparison and load the same fixed trajectory
into both bodies. Push one body's arm swing and landing compression high and
the other's low, leaving the trajectory untouched. Watch both side by side.
The paths are identical — you could overlay them and they'd match exactly —
but one body reads as loose and reactive, the other as stiff and
controlled. See this week's [slides](/decks/week-07/) for a worked
comparison across all three presets.

## Explanation

Pose parameters — arm swing, leg tuck, landing compression — never feed back
into the physics engine. They're computed from the trajectory after it's
already been decided, not the other way around, which is why the Jump Lab's
posture comparison can hold the path fixed and only vary the body. This
matters for more than demonstration purposes: it means a character's
"personality" (how heavy or springy it looks) and a level's actual
difficulty (how far it can jump, how forgiving the timing is) are two
completely separate design levers, and changing one is guaranteed not to
break the other.

<details>
<summary>Why this had to be true before this week, not just demonstrated this week</summary>

If pose changes had leaked into collision or displacement, every experiment
from weeks 4–6 would have been contaminated by whatever posture happened to
be selected at the time — a gravity comparison would really have been a
gravity-and-posture comparison, silently. The separation isn't a stage
direction for this week's lesson; it's a constraint the whole course has
been depending on since week 4.

</details>

## Task

Using the posture comparison, pick two pose settings you think best express
"floaty" and "heavy" as characters, independent of which physics preset
either name is attached to. Describe your two choices in one sentence each,
and confirm in writing that the trajectory shown for both was identical.
