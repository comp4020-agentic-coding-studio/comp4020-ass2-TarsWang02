import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/lib/jump/engine";
import { computeFixedFramingCameraY, humanoidGeometry, makeViewport, worldToScreen } from "../src/lib/jump/renderer";
import type { JumpState, PoseParams } from "../src/lib/jump/types";

const NEUTRAL_POSE: PoseParams = { armSwing: 0.6, legTuck: 0.5, landingCompression: 0.6 };

describe("worldToScreen", () => {
  it("maps world origin to the camera-centred ground pixel", () => {
    const viewport = makeViewport(800, 400, 40, 320, 0);
    expect(worldToScreen(viewport, 0, 0)).toEqual({ x: 400, y: 320 });
  });

  it("flips y: increasing world y moves up the screen (smaller pixel y)", () => {
    const viewport = makeViewport(800, 400, 40, 320, 0);
    const higher = worldToScreen(viewport, 0, 2);
    expect(higher.y).toBeLessThan(320);
    expect(higher.y).toBe(320 - 2 * 40);
  });

  it("shifts x opposite the camera so the camera target stays centred", () => {
    const viewport = makeViewport(800, 400, 40, 320, 5);
    const atCamera = worldToScreen(viewport, 5, 0);
    expect(atCamera.x).toBe(400);
  });
});

describe("humanoidGeometry — standing, neutral pose", () => {
  const grounded: JumpState = createInitialState(0, 0);

  it("is left/right symmetric with no compression, swing, or tuck", () => {
    const g = humanoidGeometry(grounded, NEUTRAL_POSE);
    expect(g.leftArm.origin.x).toBeCloseTo(-g.rightArm.origin.x, 5);
    expect(g.leftLeg.origin.x).toBeCloseTo(-g.rightLeg.origin.x, 5);
    expect(g.leftArm.end.x).toBeCloseTo(-g.rightArm.end.x, 5);
  });

  it("places the torso above the hips and below the shoulders", () => {
    const g = humanoidGeometry(grounded, NEUTRAL_POSE);
    expect(g.torso.top.y).toBeGreaterThan(g.torso.bottom.y);
    expect(g.head.center.y).toBeGreaterThan(g.torso.top.y);
  });
});

describe("humanoidGeometry — airborne pose", () => {
  it("changes arm position when facing direction flips", () => {
    const rising: JumpState = { ...createInitialState(0, 1), phase: "airborne", vy: 3, vx: 2, takeoffT: 0, t: 0.1 };
    const facingRight = humanoidGeometry(rising, NEUTRAL_POSE);
    const facingLeft = humanoidGeometry({ ...rising, vx: -2 }, NEUTRAL_POSE);
    expect(facingRight.rightArm.end.x).not.toBeCloseTo(facingLeft.rightArm.end.x, 2);
  });

  it("gives visibly different geometry for different pose parameters on the same frame", () => {
    const rising: JumpState = { ...createInitialState(0, 1), phase: "airborne", vy: 3, vx: 0, takeoffT: 0, t: 0.15 };
    const soft = humanoidGeometry(rising, { armSwing: 0.9, legTuck: 0.9, landingCompression: 0.9 });
    const stiff = humanoidGeometry(rising, { armSwing: 0.05, legTuck: 0.05, landingCompression: 0.05 });
    expect(Math.abs(soft.leftArm.end.x - stiff.leftArm.end.x)).toBeGreaterThan(0.01);
    expect(Math.abs(soft.leftLeg.end.y - stiff.leftLeg.end.y)).toBeGreaterThan(0.01);
  });
});

describe("humanoidGeometry — landing compression", () => {
  it("squashes the body shorter immediately after landing than while standing idle", () => {
    const idle: JumpState = createInitialState(0, 0);
    const justLanded: JumpState = { ...idle, landingT: 0, t: 0.01 };
    const idleGeometry = humanoidGeometry(idle, NEUTRAL_POSE);
    const landedGeometry = humanoidGeometry(justLanded, NEUTRAL_POSE);
    expect(landedGeometry.head.center.y).toBeLessThan(idleGeometry.head.center.y);
  });
});

describe("computeFixedFramingCameraY — shared framing for side-by-side comparisons", () => {
  const groundYPixel = 270; // canvas.height (300) - 30, matching the posture lab's canvases
  const pixelsPerUnit = 125;
  const viewport = makeViewport(320, 300, pixelsPerUnit, groundYPixel, 0);

  it("stays at 0 when the whole trajectory fits under the safe margin", () => {
    const lowFrames: JumpState[] = [
      createInitialState(0, 0),
      { ...createInitialState(0, 0.2) },
      { ...createInitialState(0, 0) },
    ];
    expect(computeFixedFramingCameraY(lowFrames, 1, viewport)).toBe(0);
  });

  it("pans up exactly enough to keep the highest frame's head under the margin, with no extra slack", () => {
    const apexY = 1.435; // matches the posture lab's canned charged-jump apex height
    const frames: JumpState[] = [createInitialState(0, 0), createInitialState(0, apexY), createInitialState(0, 0)];
    const cameraY = computeFixedFramingCameraY(frames, 1, viewport);
    const headTopRatio = 0.9 + 0.22 / 2; // HEAD_CENTER_Y + HEAD_SIZE / 2, kept in sync with renderer.ts
    const headTopWorldY = apexY + headTopRatio;
    const safeTopWorldY = (groundYPixel - 24) / pixelsPerUnit;
    expect(cameraY).toBeCloseTo(headTopWorldY - safeTopWorldY, 10);
    // The resulting screen position of the head top must land exactly on the margin, never above it.
    const headTopScreenY = groundYPixel - (headTopWorldY - cameraY) * pixelsPerUnit;
    expect(headTopScreenY).toBeCloseTo(24, 6);
  });

  it("derives an identical camera offset for two independently-built viewports fed the same frames", () => {
    const frames: JumpState[] = [createInitialState(0, 0), createInitialState(0, 2.1), createInitialState(0, 0)];
    const viewportA = makeViewport(320, 300, 125, 270, 0);
    const viewportB = makeViewport(320, 300, 125, 270, 0);
    const cameraYA = computeFixedFramingCameraY(frames, 1, viewportA);
    const cameraYB = computeFixedFramingCameraY(frames, 1, viewportB);
    expect(cameraYA).toBe(cameraYB);
  });

  it("never clips: no frame's head top is ever above the safe margin once the fixed offset is applied", () => {
    const frames: JumpState[] = Array.from({ length: 40 }, (_, i) => {
      const t = i / 39;
      // A smooth up-and-down arc peaking at 3 world units, well above the pan threshold.
      const y = Math.sin(t * Math.PI) * 3;
      return createInitialState(0, y);
    });
    const cameraY = computeFixedFramingCameraY(frames, 1, viewport);
    const headTopRatio = 0.9 + 0.22 / 2;
    for (const state of frames) {
      const headTopWorldY = state.y + headTopRatio;
      const headTopScreenY = groundYPixel - (headTopWorldY - cameraY) * pixelsPerUnit;
      expect(headTopScreenY).toBeGreaterThanOrEqual(24 - 1e-9);
    }
  });
});
