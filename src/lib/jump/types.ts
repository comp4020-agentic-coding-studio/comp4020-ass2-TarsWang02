export type JumpMode = "immediate" | "charged";

/** Everything that can change a trajectory or collision outcome. */
export interface MotionParams {
  /** Downward acceleration, world units / s^2. */
  gravity: number;
  /** Vertical launch speed used directly in immediate mode, and as the
   * charged-mode ceiling. World units / s. */
  launchSpeed: number;
  /** Charged-mode floor launch speed (an instant tap still leaves the
   * ground). World units / s. */
  minLaunchSpeed: number;
  /** Ground walking speed, world units / s. */
  walkSpeed: number;
  /** Acceleration available to redirect horizontal velocity while airborne,
   * world units / s^2. */
  airControl: number;
  /** Immediate mode only: releasing early while still ascending multiplies
   * the current upward speed by this factor (0..1), cutting the jump short. */
  releaseCutFactor: number;
  /** Charged mode only: time held to reach launchSpeed. */
  chargeTimeMs: number;
  /** How long after leaving a platform's edge a jump still fires as if
   * grounded, in milliseconds. */
  coyoteTimeMs: number;
  /** How early a jump press before landing still fires the moment the
   * character touches down, in milliseconds. */
  jumpBufferMs: number;
}

/** Cosmetic only — must never be read by the physics step. */
export interface PoseParams {
  /** 0..1, arm swing amplitude during flight. */
  armSwing: number;
  /** 0..1, how far the legs tuck at the peak of the jump. */
  legTuck: number;
  /** 0..1, how far the body compresses on landing. */
  landingCompression: number;
}

export interface Platform {
  x0: number;
  x1: number;
}

/** A single flat ground height, with zero or more gaps in it. */
export interface Field {
  groundY: number;
  platforms: Platform[];
  /** Below this, a falling character is off the playfield, not just
   * mid-flight over a platform that happens to be further down. */
  falloutY: number;
}

export type JumpPhase = "grounded" | "charging" | "airborne" | "fallen";

export interface JumpState {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: JumpPhase;
  chargeMs: number;
  /** Timestamp a jump was last buffered while airborne, or null. */
  bufferedJumpAtT: number | null;
  /** Timestamp the character last stood on a platform, or null while it
   * still has never left one. Used for coyote time. */
  lastGroundedT: number | null;
  takeoffX: number | null;
  takeoffY: number | null;
  takeoffT: number | null;
  apexY: number;
  landingX: number | null;
  landingT: number | null;
}

export interface InputFrame {
  moveX: -1 | 0 | 1;
  jumpHeld: boolean;
}

export interface TrialResult {
  /** True only if the character landed on a platform; a fall into a gap or
   * off the field is not a landing. */
  complete: boolean;
  height: number;
  displacement: number;
  airtimeSeconds: number | null;
  chargeDurationMs: number | null;
  frames: JumpState[];
}
