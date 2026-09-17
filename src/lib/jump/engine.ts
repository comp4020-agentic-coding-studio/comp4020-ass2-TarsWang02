import { platformAt } from "./field";
import type { Field, InputFrame, JumpMode, JumpState, MotionParams, TrialResult } from "./types";

export function createInitialState(x = 0, y = 0): JumpState {
  return {
    t: 0,
    x,
    y,
    vx: 0,
    vy: 0,
    phase: "grounded",
    chargeMs: 0,
    bufferedJumpAtT: null,
    lastGroundedT: 0,
    takeoffX: null,
    takeoffY: null,
    takeoffT: null,
    apexY: y,
    landingX: null,
    landingT: null,
  };
}

function launch(state: JumpState, launchSpeed: number): JumpState {
  return {
    ...state,
    phase: "airborne",
    vy: launchSpeed,
    takeoffX: state.x,
    takeoffY: state.y,
    takeoffT: state.t,
    apexY: state.y,
    chargeMs: 0,
    bufferedJumpAtT: null,
  };
}

/** Advances one fixed timestep. Pose is never read or written here. */
export function stepFrame(
  state: JumpState,
  input: InputFrame,
  prevInput: InputFrame,
  mode: JumpMode,
  motion: MotionParams,
  field: Field,
  dt: number,
): JumpState {
  let next: JumpState = { ...state, t: state.t + dt };
  const jumpPressed = input.jumpHeld && !prevInput.jumpHeld;
  const jumpReleased = !input.jumpHeld && prevInput.jumpHeld;

  const withinCoyote =
    next.lastGroundedT !== null && (next.t - next.lastGroundedT) * 1000 <= motion.coyoteTimeMs;

  if (next.phase === "grounded") {
    next.vx = input.moveX * motion.walkSpeed;
    if (jumpPressed) {
      next = mode === "immediate" ? launch(next, motion.launchSpeed) : { ...next, phase: "charging", chargeMs: 0 };
    }
  } else if (next.phase === "charging") {
    // Charging must not force a stop: an auto-runner (or a player holding a
    // direction) keeps moving at the same speed as grounded, so charged and
    // immediate jumps can be compared on the same moving approach rather
    // than immediate always running and charged always freezing in place.
    next.vx = input.moveX * motion.walkSpeed;
    if (input.jumpHeld) {
      next.chargeMs = Math.min(motion.chargeTimeMs, next.chargeMs + dt * 1000);
    }
    if (jumpReleased) {
      const fraction = motion.chargeTimeMs > 0 ? next.chargeMs / motion.chargeTimeMs : 1;
      const speed = motion.minLaunchSpeed + fraction * (motion.launchSpeed - motion.minLaunchSpeed);
      next = launch(next, speed);
    }
  } else if (next.phase === "airborne") {
    if (jumpPressed) {
      // A fall that never had an explicit takeoff (walked off an edge) can
      // still launch within the coyote window; any other mid-air press just
      // gets buffered for the jump-buffer check on landing below.
      if (next.takeoffT === null && mode === "immediate" && withinCoyote) {
        next = launch(next, motion.launchSpeed);
      } else {
        next.bufferedJumpAtT = next.t;
      }
    }
    if (jumpReleased && next.vy > 0) {
      next.vy *= motion.releaseCutFactor;
    }
    next.vx += input.moveX * motion.airControl * dt;
    next.vx = Math.max(-motion.walkSpeed, Math.min(motion.walkSpeed, next.vx));
    next.vy -= motion.gravity * dt;
  }

  if (next.phase === "grounded" && !platformAt(field, next.x + next.vx * dt)) {
    next.phase = "airborne";
    next.vy = 0;
  }

  next.x += next.vx * dt;
  if (next.phase === "airborne") {
    const previousY = next.y;
    next.y += next.vy * dt;
    next.apexY = Math.max(next.apexY, next.y);

    // Only a genuine crossing of ground level counts as landing — a
    // character already below ground level over a gap must not snap back
    // up just because horizontal drift carries it under a platform further
    // along; it has to actually fall past the platform's edge first.
    const platform = platformAt(field, next.x);
    if (platform && previousY > field.groundY && next.y <= field.groundY) {
      next.y = field.groundY;
      next.vx = 0;
      next.vy = 0;
      next.landingX = next.x;
      next.landingT = next.t;
      next.lastGroundedT = next.t;

      const bufferedInTime =
        next.bufferedJumpAtT !== null && (next.t - next.bufferedJumpAtT) * 1000 <= motion.jumpBufferMs;
      if (bufferedInTime) {
        next = mode === "immediate" ? launch(next, motion.launchSpeed) : { ...next, phase: "grounded" };
      } else {
        next.phase = "grounded";
      }
      next.bufferedJumpAtT = null;
    } else if (next.y < field.falloutY) {
      next.phase = "fallen";
    }
  } else if (next.phase === "grounded") {
    next.lastGroundedT = next.t;
  }

  return next;
}

const NEUTRAL_INPUT: InputFrame = { moveX: 0, jumpHeld: false };

/**
 * Turns a sequence of already-simulated frames into the same height/
 * displacement/airtime summary runTrial and the live loop both report.
 * Shared so a live trial and a scripted (batch) trial are judged identically.
 */
export function summarizeTrial(frames: JumpState[], field: Field, startX: number): Omit<TrialResult, "frames"> {
  const state = frames[frames.length - 1] ?? createInitialState(startX, field.groundY);
  const complete = state.landingT !== null && state.phase === "grounded";
  const takeoffY = state.takeoffY ?? field.groundY;
  const takeoffX = state.takeoffX ?? startX;
  const height = state.apexY - takeoffY;
  const displacement = (complete ? (state.landingX ?? state.x) : state.x) - takeoffX;
  const airtimeSeconds =
    state.takeoffT !== null && state.landingT !== null ? state.landingT - state.takeoffT : null;

  return {
    complete,
    height,
    displacement,
    airtimeSeconds: complete ? airtimeSeconds : null,
    chargeDurationMs: null,
  };
}

export function runTrial(
  inputs: InputFrame[],
  mode: JumpMode,
  motion: MotionParams,
  field: Field,
  dt: number,
  startX = 0,
): TrialResult {
  const frames: JumpState[] = [];
  let state = createInitialState(startX, field.groundY);
  let prevInput = NEUTRAL_INPUT;

  for (const input of inputs) {
    state = stepFrame(state, input, prevInput, mode, motion, field, dt);
    frames.push(state);
    prevInput = input;
    if (state.phase === "fallen") break;
  }

  return { ...summarizeTrial(frames, field, startX), frames };
}
