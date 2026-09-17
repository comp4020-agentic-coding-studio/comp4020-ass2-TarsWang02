# Process overview

The Anatomy of a Jump is a twelve-week course built on the supplied Astro
platform, teaching measurement, control, expression and evaluation through one
shared, deterministic jump-physics engine rather than twelve disconnected
demos. Its core tool, the Jump Lab, covers gravity/launch-speed
experimentation, preset-vs-custom A/B replay, and a fixed-path posture
comparison — matching the three assessments (Jump Autopsy, Take Control, One
Body Three Personalities), each with a non-coding route. Three decisions
shaped it, plus one later correction driven by outside review.

**Same input, not same seed.** An A/B comparison that re-rolls its trial each
time can't isolate one parameter — any difference might be noise, not the
change under test.
[`596a62c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/596a62c)
and
[`e2b1229`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/e2b1229)
instead snapshot configuration A immutably and replay the *exact same*
recorded input trace against configuration B, down to a shareable link that
re-runs the identical trace in a new tab. The only thing that can differ
between A and B is the parameter a student changed.

**Pose can never touch physics.** The renderer
([`f0a5a69`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/f0a5a69))
takes a completed trajectory and a pose in, and returns screen-space geometry
out — it has no way to feed back into `engine.ts`'s simulation. The posture
comparison built on top of it
([`757b597`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/757b597))
runs physics once, then draws two bodies against that one recorded arc,
proving by construction that changing a body's posture cannot change where it
lands.

**Build the experience, then let real play find the bugs.** Interactions were
built runnable first, then exercised by hand rather than only type-checked.
That surfaced problems no build or accessibility scan would catch:
[`b5db334`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/b5db334)
fixed a fast click-and-release landing between two physics polls and being
silently dropped;
[`48dd86b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/48dd86b)
fixed the home page showing every mode-switch control at once instead of the
one relevant to a visitor's current step;
[`48a3473`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/48a3473)
fixed the trial-log table forcing the whole page to scroll sideways at the
390px marking viewport.

**A late correction, from outside review, not my own testing.** A reviewer
reported Body A's head and torso could clip above the posture lab's canvas
after a Restart. Repeated real-browser testing (default settings, extreme
pose parameters, the 390px viewport, rapid repeated restarts) never
reproduced clipping under the prior per-frame camera-follow — but that code
still let each side compute its own camera position independently, which was
the wrong architecture regardless of whether it visibly failed.
[`bf4f017`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/bf4f017)
replaces it with one camera offset computed once from the full recorded
trajectory and shared identically by both bodies, so the two sides cannot
drift apart by construction. The same pass, while re-testing that fix by
actually replaying the A/B lab, separately turned up a real bug of my own
finding: the two side-by-side headings could wrap to a different number of
lines, desyncing the canvases beneath them by about 30px —
[`8f21e10`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-TarsWang02/commit/8f21e10)
reserves equal heading height so that can't happen, and separately trims
Home's copy so the playable canvas needs less scrolling to reach.

`pnpm check` is green as of this account.
