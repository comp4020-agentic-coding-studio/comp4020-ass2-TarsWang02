---
title: Take Control
description:
  Configure variable jump height and air control, investigate coyote time and
  jump buffering, and explain the tradeoffs you landed on.
week: 6
due: 2027-04-02T17:00:00+11:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Configuration and reproducible trials
      weight: 35
    - name: Forgiveness investigation
      weight: 30
    - name: Explanation of tradeoffs
      weight: 35
spec:
  - a saved Jump Lab configuration link (or exported settings) for your chosen setup, that reproduces your trials when opened
  - at least three trials showing what variable-height release control and air control actually change, with real measurements
  - a coyote time and a jump buffer value you chose, plus one trial each showing the forgiveness window catching a late or early press
  - a short report explaining what you prioritised and what you gave up to get it
---

## The brief

> Design a jump that's forgiving without being formless.

Weeks 4 and 5 gave you two independent levers: how much control you have
while airborne, and whether height responds to how long you hold. This brief
asks you to set both deliberately, on top of the two forgiveness windows —
**coyote time** (how long after leaving a platform's edge a jump still
counts as if you were standing on it) and **jump buffer** (how early a press
before landing still fires the moment you touch down) — and then prove your
choices with trials rather than just asserting them.

There's no single correct setting. A speedrun-precise jump and a
beginner-forgiving jump can both be defensible; what's being assessed is
whether you can show what you built and say what it cost.

## What you submit

- **A configuration you can hand over.** The Jump Lab's *Copy configuration*
  control turns your current settings into a link; paste that link (or the
  exported values it encodes) into your report so a marker can reload your
  exact setup.
- **Trials, not descriptions of trials.** At least three runs demonstrating
  variable height (a short press versus a full hold) and air control (a
  mid-air correction), each with its measured height, displacement and
  airtime.
- **Two forgiveness trials.** One showing a jump pressed slightly *after*
  leaving a ledge still launching (coyote time), and one showing a jump
  pressed slightly *before* landing still firing on touchdown (jump buffer).
  State the window you set for each, in milliseconds.
- **A short report** (roughly 300–500 words) on what you prioritised —
  responsiveness, forgiveness, or predictability — and what that choice cost
  you elsewhere.

The visual controls in the Jump Lab are a complete route to every part of
this brief. If you want to explore the optional starter-code path instead
(or as well), say so in your report — it earns no automatic bonus on top of
an equivalent visual-controls submission, since the brief is about the
tradeoff you can demonstrate, not the tool you used to reach it.
