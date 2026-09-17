# Process overview

## What I built

The Anatomy of a Jump is a twelve-week course built on the supplied Astro
platform, teaching measurement, control, expression and evaluation through one
shared, deterministic jump-physics engine rather than twelve disconnected
demos. A student's core tool is the Jump Lab: gravity/launch-speed
experimentation, preset-vs-custom configuration with an A/B replay that holds
input fixed and varies one parameter, and a fixed-path posture comparison that
demonstrates pose can never touch trajectory or collision. Every core task has
a non-coding route, matching the three assessments (Jump Autopsy, Take
Control, One Body Three Personalities).

## How I got here

The engine came first and stayed dependency-free:
[`192c827`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/192c827)
adds `src/lib/jump/engine.ts` as pure, fixed-timestep simulation with no DOM
access, so `spec/jump-engine.test.ts` could assert exact analytic
height/airtime formulas and byte-identical determinism from day one.
[`f0a5a69`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/f0a5a69)
adds the procedural humanoid renderer as a second, independent module — pose
parameters go in, screen-space geometry comes out, and nothing about a body's
posture can reach back into the physics state. That separation is the
project's central architectural bet, and it is what
[`757b597`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/757b597)'s
posture-comparison tool and
[`596a62c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/596a62c)'s
A/B replay both lean on: two bodies, one recorded trajectory.

Real use caught a real gap:
[`fceaad8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/fceaad8)
fixes the Jump Autopsy brief's `?a=floaty&b=precise&mode=immediate` shorthand
link, which the Lab was silently ignoring in favour of its own stored
defaults — found by actually following the link the brief promises, not by
reading the code that generates it.

[`9ac2e90`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/9ac2e90)
replaces both remaining placeholder deliverables (the week-1 deck, the
policies page) and writes weeks 3-12 as a question-experiment-explanation-task
arc that cross-links to whichever assessment each week rehearses for.
[`6812ccf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/6812ccf)
adds tests for exactly the promises that expansion depends on and that no
existing test covered: all twelve weeks present, exactly three assessments
summing to 100%, and the week-7 deck actually wired to its lecture.

Final verification was real-browser, at the course's own two marking
viewports (1920×1080 and 390×844, from the assessment page's marking-
environment section), not just `pnpm check`'s automated build/axe/link
checks. It found one genuine bug —
[`48a3473`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/48a3473):
the ten-column trial-log table had no scroll wrapper, so it forced the entire
page to overflow horizontally at 390px — fixed by containing the overflow in
the table's own box instead of changing its columns or ten-row cap. The same
pass also produced two apparent failures (a mid-air parameter edit, an A/B
replay) that turned out, on inspection with a debug script, to be my
verification script stealing keyboard focus by calling `.fill()` on a slider
outside the playfield's focus region — the app's own focus-scoped input
handling was working correctly, and I fixed the script rather than the app.

`pnpm check` and `pnpm check:evidence` are both green as of this account.
