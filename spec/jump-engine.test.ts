import { describe, expect, it } from "vitest";
import { computePose } from "../src/lib/jump/pose";
import { flatField, gapField } from "../src/lib/jump/field";
import { runTrial } from "../src/lib/jump/engine";
import type { InputFrame, MotionParams, PoseParams } from "../src/lib/jump/types";

const DT = 1 / 120;
const TRIAL_SECONDS = 3;
const FRAME_COUNT = Math.round(TRIAL_SECONDS / DT);

function baseMotion(overrides: Partial<MotionParams> = {}): MotionParams {
  return {
    gravity: 10,
    launchSpeed: 5,
    minLaunchSpeed: 2,
    walkSpeed: 4,
    airControl: 8,
    releaseCutFactor: 1,
    chargeTimeMs: 500,
    coyoteTimeMs: 100,
    jumpBufferMs: 100,
    ...overrides,
  };
}

function heldFor(ms: number, moveX: -1 | 0 | 1 = 0): InputFrame[] {
  const heldFrames = Math.round(ms / 1000 / DT);
  const frames: InputFrame[] = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push({ moveX, jumpHeld: i < heldFrames });
  }
  return frames;
}

describe("jump engine — immediate mode", () => {
  it("reports height and airtime consistent with analytic projectile motion", () => {
    const motion = baseMotion();
    const result = runTrial(heldFor(2000), "immediate", motion, flatField(), DT);
    expect(result.complete).toBe(true);
    expect(result.height).toBeCloseTo((motion.launchSpeed ** 2) / (2 * motion.gravity), 1);
    expect(result.airtimeSeconds ?? 0).toBeCloseTo((2 * motion.launchSpeed) / motion.gravity, 1);
  });

  it("gives a full hold more height and airtime than a short tap", () => {
    const motion = baseMotion({ releaseCutFactor: 0.5 });
    const held = runTrial(heldFor(2000), "immediate", motion, flatField(), DT);
    const tapped = runTrial(heldFor(20), "immediate", motion, flatField(), DT);
    expect(held.height).toBeGreaterThan(tapped.height);
    expect(held.airtimeSeconds ?? 0).toBeGreaterThan(tapped.airtimeSeconds ?? 0);
  });

  it("never launches with an unreleased cut when releaseCutFactor is 1", () => {
    const motion = baseMotion({ releaseCutFactor: 1 });
    const held = runTrial(heldFor(2000), "immediate", motion, flatField(), DT);
    const tapped = runTrial(heldFor(20), "immediate", motion, flatField(), DT);
    // With no cut at all, launch speed is fixed by the press alone, so both
    // trials reach the same height regardless of hold length.
    expect(tapped.height).toBeCloseTo(held.height, 1);
  });
});

describe("jump engine — charged mode", () => {
  it("scales launch height with charge duration, capped at chargeTimeMs", () => {
    const motion = baseMotion();
    const brief = runTrial(heldFor(50), "charged", motion, flatField(), DT);
    const full = runTrial(heldFor(motion.chargeTimeMs), "charged", motion, flatField(), DT);
    const overcharged = runTrial(heldFor(motion.chargeTimeMs * 2), "charged", motion, flatField(), DT);
    expect(brief.height).toBeLessThan(full.height);
    expect(overcharged.height).toBeCloseTo(full.height, 1);
  });
});

describe("jump engine — gap field", () => {
  it("marks a jump that clears the gap as complete", () => {
    const field = gapField(2, 1);
    const motion = baseMotion({ launchSpeed: 6, walkSpeed: 6 });
    const inputs = heldFor(2000, 1);
    const result = runTrial(inputs, "immediate", motion, field, DT, 0);
    expect(result.complete).toBe(true);
    expect(result.airtimeSeconds).not.toBeNull();
  });

  it("marks a jump that falls short as incomplete, not a landing", () => {
    const field = gapField(2, 10);
    const motion = baseMotion({ launchSpeed: 4, walkSpeed: 2 });
    const inputs = heldFor(2000, 1);
    const result = runTrial(inputs, "immediate", motion, field, DT, 0);
    expect(result.complete).toBe(false);
    expect(result.airtimeSeconds).toBeNull();
  });
});

describe("jump engine — forgiveness windows", () => {
  it("still launches a coyote-time press just after leaving a platform edge", () => {
    const field = gapField(1, 5);
    const motion = baseMotion({ walkSpeed: 5, coyoteTimeMs: 200 });
    const frames: InputFrame[] = [];
    const walkFrames = Math.round(1 / motion.walkSpeed / DT) + 3; // just past the edge
    for (let i = 0; i < FRAME_COUNT; i++) {
      frames.push({ moveX: 1, jumpHeld: i === walkFrames });
    }
    const result = runTrial(frames, "immediate", motion, field, DT, 0);
    expect(result.height).toBeGreaterThan(0);
  });

  it("does not launch a press held past the coyote window", () => {
    const field = gapField(1, 5);
    const motion = baseMotion({ walkSpeed: 5, coyoteTimeMs: 10 });
    const frames: InputFrame[] = [];
    const walkFrames = Math.round(1 / motion.walkSpeed / DT);
    const lateFrame = walkFrames + Math.round(0.2 / DT); // well past a 10ms window
    for (let i = 0; i < FRAME_COUNT; i++) {
      frames.push({ moveX: 1, jumpHeld: i === lateFrame });
    }
    const result = runTrial(frames, "immediate", motion, field, DT, 0);
    expect(result.complete).toBe(false);
    expect(result.height).toBe(0);
  });

  it("fires a buffered jump the instant a pre-landing press touches down", () => {
    const motion = baseMotion({ jumpBufferMs: 150 });
    const first = runTrial(heldFor(20), "immediate", motion, flatField(), DT);
    expect(first.airtimeSeconds).not.toBeNull();
    const airtimeMs = (first.airtimeSeconds ?? 0) * 1000;

    const frames: InputFrame[] = [];
    const firstPressFrame = 0;
    const bufferedPressFrame = Math.round((airtimeMs - 80) / 1000 / DT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      frames.push({ moveX: 0, jumpHeld: i === firstPressFrame || i === bufferedPressFrame });
    }
    const withoutBuffer = runTrial(
      frames.map((f, i) => (i === bufferedPressFrame ? { ...f, jumpHeld: false } : f)),
      "immediate",
      motion,
      flatField(),
      DT,
    );
    const withBuffer = runTrial(frames, "immediate", motion, flatField(), DT);

    // The buffered press should trigger a second launch that a trial with
    // only the first press never sees.
    const relaunched = withBuffer.frames.some(
      (f, i) => f.phase === "airborne" && i > FRAME_COUNT / 2,
    );
    expect(relaunched).toBe(true);
    expect(withoutBuffer.frames.some((f, i) => f.phase === "airborne" && i > FRAME_COUNT / 2)).toBe(
      false,
    );
  });
});

describe("jump engine — determinism and pose independence", () => {
  it("produces byte-identical trajectories for identical inputs", () => {
    const motion = baseMotion();
    const inputs = heldFor(1500, 0);
    const a = runTrial(inputs, "immediate", motion, flatField(), DT);
    const b = runTrial(inputs, "immediate", motion, flatField(), DT);
    expect(a.frames).toEqual(b.frames);
    expect(a.height).toBe(b.height);
    expect(a.airtimeSeconds).toBe(b.airtimeSeconds);
  });

  it("never changes the trajectory when only pose parameters differ", () => {
    // Pose parameters are not accepted by runTrial/stepFrame at all, so the
    // only way to check "does pose affect physics" is architectural: this
    // test pins that contract by asserting a pose-only change to the render
    // layer cannot touch a state object already produced by the engine.
    const motion = baseMotion();
    const inputs = heldFor(1500, 0);
    const frames = runTrial(inputs, "immediate", motion, flatField(), DT).frames;
    const floatyPose: PoseParams = { armSwing: 0.9, legTuck: 0.9, landingCompression: 0.9 };
    const heavyPose: PoseParams = { armSwing: 0.1, legTuck: 0.1, landingCompression: 0.1 };

    const beforeX = frames.map((f) => f.x);
    const beforeY = frames.map((f) => f.y);
    frames.forEach((f) => computePose(f, floatyPose));
    frames.forEach((f) => computePose(f, heavyPose));

    expect(frames.map((f) => f.x)).toEqual(beforeX);
    expect(frames.map((f) => f.y)).toEqual(beforeY);
  });

  it("gives different presets visibly different poses from the same physics frame", () => {
    const motion = baseMotion();
    const inputs = heldFor(1500, 0);
    const frames = runTrial(inputs, "immediate", motion, flatField(), DT).frames;
    const airborneFrames = frames.filter((f) => f.phase === "airborne");
    const midFlight = airborneFrames[Math.floor(airborneFrames.length / 2)];
    const floaty = computePose(midFlight, { armSwing: 0.9, legTuck: 0.9, landingCompression: 0.9 });
    const heavy = computePose(midFlight, { armSwing: 0.1, legTuck: 0.1, landingCompression: 0.1 });
    expect(Math.abs(floaty.armSwingAngle - heavy.armSwingAngle)).toBeGreaterThan(0.01);
  });
});
