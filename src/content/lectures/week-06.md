---
title: How Forgiving Should a Jump Be?
description:
  Release cut, coyote time and jump buffer don't change the physics of a
  clean jump at all — they only change what happens when your timing is off.
week: 6
date: 2027-03-29
teachers:
  - idris-fenn
related:
  - sessions/06-forgiveness-rehearsal
  - assessments/take-control
---

## Question

If you press jump a fraction of a second before your feet actually reach the
ground, should the game count it as a jump anyway? If you release the jump
button a fraction of a second after leaving a ledge, should that cut your
height the same as releasing it on solid ground? Neither answer is
"obviously yes" — this week is about what changes when you pick one.

## Prediction (skip if you'd rather just look)

Before running anything: do you expect a short coyote time window to change
the *maximum* height a jump can reach, or only whether a jump happens at
all?

## Experiment

Open the [Jump Lab](/jump-lab/) and run an immediate-mode trial releasing
jump almost immediately after pressing it, then another holding it the full
charge. Compare their heights — the gap between them is what release cut
factor controls: how much a short release shrinks your height relative to a
full hold. Now, separately, try leaving a platform edge and pressing jump
just after your character has walked off it. Whether that counts as a jump
at all is coyote time; whether pressing jump slightly *before* landing still
fires the moment you touch down is jump buffer. Both are pass/fail, not
height-changing.

## Explanation

Release cut factor is a *continuous* forgiveness: it scales how much
tapping instead of holding costs you, and it's part of the same vertical
physics that gravity and launch speed shape. Coyote time and jump buffer are
different in kind — they're small windows of *timing* forgiveness around
input and ground contact, and they don't touch height or airtime for a jump
that already happened; they only change whether a jump happens in the first
place when your input was a few frames early or late. Reporting all three
the same way you reported height last week would hide that difference.
That's why forgiveness numbers get reported in milliseconds and as an
attempt outcome, not as a distance.

<details>
<summary>Why forgiveness windows can't be read off the trial log the way height can</summary>

The Jump Lab's log records what a completed trial measured, not why an
attempted press succeeded or failed. To measure coyote time or jump buffer
honestly, you have to deliberately construct the edge case — press a beat
early, press a beat late — and report what happened, the same discipline
week 3 asked of any other measurement.

</details>

## Task

Using the Gravity Lab, find your own working definition of "short release"
versus "full hold" and report the height difference between them at your
current release cut factor. Then run one coyote-time and one jump-buffer
attempt, each deliberately mistimed by a small amount, and report in
milliseconds how early or late you pressed and whether the jump fired.
