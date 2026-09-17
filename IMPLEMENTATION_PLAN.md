# The Anatomy of a Jump — agreed plan

Prepared 17 September 2026, Australia/Sydney. Planning handoff only. No website
implementation, dependency installation or runtime validation is claimed here.

## 1. Purpose and status of decisions

A credible twelve-week Slop University course about one mechanic: designing a
2D jump. Beginners experiment, measure, distinguish motion from posture, then
explain design choices using controlled comparison and observed play.

Owner-approved: English only; no game-development experience needed; playful
studio; articulated geometric humanoid; clean 2D graphics; light sound/no music;
low-pressure experiments; guided immediate/charged choice; presets before tuning;
A/B replay; experiment-first lessons; the curriculum and 20/30/50 assessment
split below; optional guided coding. Exact numerical tuning remains open.

Proposed implementation defaults are explicitly named below. Refine ordinary
engineering choices without reopening every agreed product decision.

## 2. Official requirements and dates

Sources:
- https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/assignment-2/
- https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/
- https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/crits/06-a2-retro/
- https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crit-groups.json
- Repository README.md (platform contract).

Previously verified in this conversation: real A2 deadline **21 September 2026,
12:00 AEST**; Yunlin C6 cutoff **23 September 2026, 12:00 AEST**, with session
14:00–15:30. Not re-fetched during this document write; reverify before release.
These are ANU submission dates, not the fictional syllabus dates.

Previously read marking weights: process 45%, response to brief 35%, deployed
artefact 20%. Requirements include twelve dated teaching weeks, assessment weights
totaling 100%, at least one substantive linked deck, course-specific tests and
real process evidence. C6 presents a breakthrough from A2 PROCESS.md.

Preserve university identity/palette, Astro, content collections, build/API and
Pages workflow. Replace starter content through actual authorship, not deletion
of markers alone. Keep code suffix 280. Do not substitute another site stack.

## 3. Audience and outcomes

No prior game development and no compulsory programming prerequisite. Core tasks
can be completed in the provided visual tools with records and explanations.
Later examples may include short editable starter code, with guided optional
changes. Never assess untaught programming as a hidden requirement.

Students learn to identify jump phases; measure height/displacement/airtime;
explain gravity, launch speed and air control; compare input mechanisms and
forgiveness; change posture independently of physics; run controlled comparisons;
and revise a design using play observations.

Voice: welcoming, concrete, curious and precise. Explain terminology when first
used. No generic motivational padding or claims that one setting is always best.

## 4. Curriculum

| Week | Lecture question / working title | Practical output |
| --- | --- | --- |
| 1 | What Is Inside a Jump? | Annotated anticipation, takeoff, flight and landing frames |
| 2 | How Do You Measure a Feeling? | Height, displacement and airtime measurement table |
| 3 | Two Jumps, Two Stories | Jump Autopsy report, assessment 1 |
| 4 | Press to Go, Release to Go | Immediate versus charged input comparison |
| 5 | Who Is in Control in the Air? | Variable-height and air-control experiment |
| 6 | The Input That Almost Worked | Input buffering/coyote time; assessment 2 |
| 7 | Same Path, Different Body | Arm-swing and leg-tuck controlled comparison |
| 8 | What Makes a Landing Heavy? | Landing compression and visible feedback experiment |
| 9 | Can You Hear the Weight? | Sound on/off comparison with equivalent visible cues |
| 10 | Build a Fair Test | Fixed platform field and reproducible test procedure |
| 11 | Let Someone Else Play | Actual observations and a targeted revision |
| 12 | One Body, Three Personalities | Final jump lab, comparisons and explanation |

Lesson rhythm: a specific question, observation target, optional prediction,
experiment, explanation, concrete task. Workshops specify preparation, activity,
output and criteria. Link prerequisites and assessments. Every week must have
distinct substance and contribute to later work.

Fictional term dates are not yet selected. Proposed default: retain SLOP1280,
Semester 1 2027, author twelve explicit weekly dates within a coherent teaching
period and consistent timezone. Use the real content schema and verify all dates.
Do not present starter/fictional teaching dates as ANU submission deadlines.

## 5. Assessments

### Jump Autopsy — week 3, 20%
Compare two supplied jumps. Submit phase annotations, measurements, a reproducible
method and an explanation of differences. Provide samples so students do not
need to own a game. Evaluate accuracy, reproducibility and interpretation rather
than artistic drawing skill.

### Take Control — week 6, 30%
Configure variable height and air control, investigate forgiveness, record settings
and explain tradeoffs. Submit reproducible configuration/trials and a short report.
Visual controls are a complete route; starter-code changes are optional and receive
no automatic bonus. Provide an actual way to preserve settings/results (a simple
copy/export record is a proposed implementation default, not a backend).

### One Body, Three Personalities — week 12, 50%
Same character in Floaty, Heavy and Precise forms; one single-variable comparison;
an observed play-test problem and revision; a concise explanation with actual data.
Students define their intended feel and justify it. Neither distance nor success
rate alone is quality. Rubric subweights and submission lengths are defaults for
Claude to author consistently, not previously approved exact numbers.

Distinguish these fictional student tasks from the owner's real Assignment 2.
No enrollment, grading service, file-upload backend or student accounts are needed.

## 6. Site structure

- Home: title, promise, guided playable introduction, outcomes, twelve-week route,
  concise assessment overview.
- Weeks: dated overview grouped into Measure / Control / Express / Evaluate.
- Lectures: twelve substantive entries using existing collection.
- Workshops: twelve sessions using the existing sessions collection/key.
- Assessments: index plus three briefs/rubrics.
- Jump Lab: complete shared experiment and comparison tools.
- People: minimal coherent fictional teaching team; no fabricated real endorsements.
- Policies: access, workload, evidence, attribution and consistent submission rules.
- Slides: a complete week-7 deck, Same Path, Different Body, linked from its
  lecture. Include question, comparison, explanation and exercise.

Proposed navigation: Course / Weeks / Jump Lab / Assessments / People. Policies
remain readily accessible. All visible copy in English. No fake enrollment
metrics, testimonials or marketing checkout. Use the existing astromotion system.

## 7. Shared interaction specification

### Home
Try immediate, then charged, choose a preference, free play. Guidance is contextual
and short, always skippable/replayable; never require success. Start with flat
ground and introduce a small gap. Immediate launches on press, holds for height,
cuts ascent on release. Charged holds to charge and launches on release, capped.
Share maximum attainable height, horizontal speed and introduction geometry.
Record charge duration separately if shown; airtime begins at takeoff.

Keyboard/touch provide left/right/jump. Proposed keys: arrows or A/D and Space.
Capture keys only when the experiment is engaged, not while reading the page.
Handle blur, pointer cancellation, multi-touch and released keys. Show active mode;
reset pending inputs on mode change. Local preference persistence has a fallback.

No lives, failure counters, scores or leaderboard. Missing resets promptly and
preserves the last path. Successful landings get a marker. Home shows height,
displacement, airtime, reset, mode and lab link, not the full parameter console.

### Presets and controls
Lab opens with Floaty / Heavy / Precise, then expandable tuning. Mode selection
is independent; all presets work in both modes. Edits show Custom, with restore.
Motion controls: launch speed, gravity, horizontal speed and air control.
Pose controls: arm swing, leg tuck and landing compression. Lessons expose only
relevant parameters; specialized forgiveness/audio controls appear where useful.
Edits apply next trial, with clear pending state and a trial settings snapshot.

Floaty emphasizes airtime/correction; Heavy emphasizes body anticipation and
landing commitment; Precise emphasizes response and predictable placement.
Exact values/ranges require trials. Heavy in immediate mode still launches on
press: cosmetic anticipation must not silently add control latency.

### A/B
Save immutable settings A, edit B, record/reuse identical timestamped input from
the same initial state and same field. Replay synchronously, including trajectory,
pose and real measurements. Never use two independently operated characters as
a controlled comparison. Changing input mode starts a new comparison. Slow replay
changes playback speed only, not simulation constants or metric time. Allow replay
and replacing A without hidden accumulated state.

### Physics, rendering and measurements
Recommended engineering default: a deterministic fixed-step model, stable collider
and procedural articulated character rendered through Canvas or SVG. Avoid a large
game framework unless justified. Rendering and physical state are separate.
Changing arm/leg/landing animation cannot change trajectory or collision geometry.
The posture experiment should share one physical path across both characters.

Measure apex relative to takeoff, displacement relative to takeoff and airtime
until actual landing. Use declared world units and seconds, independent of screen
size. Mark failed/incomplete trials; resetting below the playfield is not landing.
Label predicted values separately if added. Keep measurement precision sensible.

### Scope priority
First finish home trial, gravity/launch-speed experiment and fixed-path posture
comparison. Use one engine for presets and A/B. Other weeks can use annotated
figures, recorded examples and concrete tasks. Do not build twelve separate games,
but do ensure tools promised by assessed tasks actually exist or have a supported
alternative. Never present decorative controls as working features.

## 8. Visual, audio and access specification

Rounded-square head, simple torso, articulated arms/legs, minimal face; consistent
character across pages/presets. Clean 2D playfields, selective trails and sparse
handwritten-style annotation; readable long-form text. Derive colors from SlopU
tokens. The concept sheet's left-hand humanoid is the approved silhouette, not
its paper texture or every decorative detail.

Optional local reference:
/Users/organge/.codex/generated_images/01a01d6e-2848-7191-94a6-2f480a81e0b3/exec-7ee1e759-4565-4bda-bd23-46c97d347877.png

This is a reference only, not a website dependency. Do not embed the comparison
sheet. Programmatic character graphics support variable postures. No new asset
generation is part of this planning write.

Light jump/landing effects; visible mute; no music; gesture-unlocked audio.
Reduced-motion removes cosmetic shake/trails/transitions while retaining explicit
user-triggered teaching demonstrations. Provide pause and equivalent explanation.
Semantic controls, visible focus, touch targets and accessible DOM measurements;
avoid announcing every animation frame. Check mobile scroll and contrast.

## 9. Staged implementation, after owner starts it

1. Read current brief/platform, inspect working tree/runtime, run baseline checks.
2. Establish dated course record, page structure and one representative lesson.
3. Build/test shared motion model, renderer and genuine measurements.
4. Complete three core interactions, then presets/A-B; verify touch and keyboard.
5. Expand curriculum, assessments, policies, team and real deck coherently.
6. Browser-test at current official marking viewports, including slide readability,
   home-to-week-to-assignment journeys, audio and experiment controls. Record real
   observations and revise. Distinguish browser automation from human playtests.
7. Prepare honest evidence, run final checks and report readiness. Keep commits
   incremental if authorized. Do not push, publish or run ship automatically.

## 10. Verification and process

Tests should protect promises, not mirror code: twelve dated weeks in period;
three assessments totaling 100%; prerequisite order; linked resources; both jump
modes and charge/release limits; reset/input cleanup; deterministic A/B; unchanged
world metrics across viewport/playback speed; pose independence; immutable A;
next-trial rather than airborne parameter application.

Run pnpm check and pnpm check:evidence. Preserve platform link/accessibility
checks. Manually inspect actual rendered slides and behavior. Record viewport,
input method, observed outcome and unresolved issues. Green builds do not prove feel.

PROCESS.md must be a real 400–600-word narrative with resolvable commits and the
owner's decisions, for owner review. Separating physics from posture is a candidate
decision to discuss only once actually implemented/evaluated. Never invent a
before/after, success or student feedback to fit the plan. No extra local progress
file: use the existing Obsidian course-level PROJECT_PROGRESS.md if requested.

## 11. References and skills

- https://callingbullshit.org/ — distinctive purpose and voice.
- https://fab.cba.mit.edu/classes/863.25/ — dated practical progression.
- https://missing.csail.mit.edu/ — focused learning gap and usable resources.
- https://cs007.blog/ — audience clarity and direct lecture/deck access.
- https://github.com/ANUcybernetics/astromotion — existing slide system.

Local frontend-design and emil-design-eng skill files were previously found;
course doctor/submission-preflight/ship files also exist. Check current availability
and read a skill before using it. Institutional requirements override generic
design advice. Skill availability is not permission to deploy or replace the stack.

## 12. Open implementation details

Physics ranges, preset values, forgiveness windows, charge curve, pose angles,
animation times and sound envelopes need actual trials. Fictional dates, team
names, rubric subweights and submission lengths need coherent authored defaults.
No accounts, backend, competitive score, character roster or compulsory advanced
coding. These plans are not claims of finished implementation.
