# The Anatomy of a Jump — project harness

## Authority and permission

This repository is COMP4020/COMP8020 Assignment 2. Read README.md, the current
official brief and IMPLEMENTATION_PLAN.md before implementation. Authority:
latest owner direction, assessment/platform contract, this harness, detailed plan,
then implementation defaults. Surface material conflicts.

As of 17 September 2026, the owner authorized planning documents only; Claude began
implementation once the owner sent the handoff prompt. As of 17 September 2026,
the owner additionally authorized pushing to the GitHub repository, flipping its
visibility to public if the platform's ship path requires it (checking pending
changes and history for secrets/tokens first), and deploying to GitHub Pages via
the course's `/ship` skill. Preserve unrelated changes.

## Teaching contract

- Title: The Anatomy of a Jump. All public-facing content is English, including
  controls, error messages, accessibility labels and slides.
- Audience: no game-development experience. Early work requires no coding;
  provide visual tools and later optional, guided starter-code modifications.
  Do not introduce a compulsory JavaScript prerequisite or reward code complexity.
- Twelve dated weeks progress through measurement, control, expression and
  evaluation. Each lesson follows question → experiment → explanation → task.
  Prediction questions are skippable; formulas/code are expandable.
- Assessments: Jump Autopsy (week 3, 20%), Take Control (week 6, 30%),
  One Body, Three Personalities (week 12, 50%). Core tasks have a non-coding route.
- Every task states its output and evaluation criteria. Teach required skills
  before assessing them. Measurements describe behavior; they do not prove fun.
- Avoid generic interchangeable weekly text, invented sources and fake feedback.

## Platform invariants

Preserve Astro, SlopU name/marks/palette, existing four content collections and
keys, build pipeline and generated API as required by README.md. Extend the
platform rather than replacing it. Retain course-code suffix 280; SLOP1280 is
the suggested beginner-level default. Keep identity/dates in their source record.
Respect the deployment base path. Use the existing astromotion slide integration.

## Visual and audio rules

- Playful game-design studio: clean 2D digital playfields, lively typography,
  sparse hand-drawn notes, clear readable teaching pages.
- ONE geometric humanoid: rounded-square head, simple torso, two articulated
  arms and legs, minimal face. Do not use the rejected limbless block.
- Keep identity consistent across Floaty, Heavy and Precise presets; personality
  comes from motion, posture and feedback. Follow institutional palette tokens.
- Light takeoff/landing sounds, visible mute, no background music. Unlock audio
  with user interaction. Never communicate information only through sound.
- Support keyboard/touch, visible focus, reduced motion and DOM explanations.
  Pause on hidden tabs and clear inputs on blur/pointer cancellation.

## Interaction rules

- Home: try immediate jump, try charged jump, choose preference, then free play.
  Allow skip/replay/switch at any time. Never require a successful jump to advance.
- Immediate mode launches on press; holding permits greater height, release cuts
  ascent. Charged mode charges while held and launches on release with a cap.
- Intro comparisons share maximum attainable height, horizontal speed and field.
- Home's first three steps are single jumps on flat ground. Free play is an
  auto-running obstacle course with irregularly (but reproducibly) spaced
  blocks, cleared by jumping over them; a bump resets the run instantly, with
  no lives, failure counter, score or leaderboard.
- Home exposes basic controls, mode, last-jump metrics, reset and a lab link.
  Lab starts with presets, then expandable parameters. Edits show Custom with
  explicit restore. Jump mode is independent of all three presets.
- Separate Motion controls from Pose controls. Pose must never change collision
  or trajectory. Fixed-path posture comparison uses identical physical motion.
- Parameter changes take effect next trial, never in mid-air; snapshot each trial.
- A/B saves immutable A, edits B and replays the same timestamped input from the
  same initial state. Changing jump mode starts a fresh comparison. Slow playback
  changes playback only, not physics constants or simulated measurement time.
- Metrics come from actual simulation in stable world units, not viewport pixels
  or invented readouts. Mark incomplete trials; do not treat resets as landings.
- First priority: home trial, gravity/launch-speed experiment, posture comparison.
  Use one shared engine, not twelve independent games.

## Verification and evidence

Preserve pnpm check and pnpm check:evidence. Test course chronology/weights and
meaningful simulation invariants. Do not weaken checks to pass placeholders.
Verify current official marking viewports; test rendered content, slides, touch,
keyboard, guidance, mode changes, reset, mute, metrics, A/B and production links.
Build success is not proof of readable slides or good feel.

PROCESS.md is an honest 400–600-word account citing real commits, for owner review.
Never fabricate tests, observations, student quotes or future achievements. The
previously read A2 brief requires no separate reflection; check before shipping.
Do not create a repo-local PROJECT_PROGRESS.md. The course source remains:
/Users/organge/Documents/Obsidian Vault/comp 8020/PROJECT_PROGRESS.md.
