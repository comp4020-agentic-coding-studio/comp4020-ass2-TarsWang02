import type { JumpState, PoseParams } from "./types";

export interface Pose {
  armSwingAngle: number;
  legTuckAmount: number;
  compressionAmount: number;
  // Ground-stride phase in radians, or null when not running. Distance-based
  // (not time-based) so cadence rises and falls with actual speed for free,
  // and a stopped character holds its last stride frame rather than idling
  // through a phase computed from elapsed time.
  runCyclePhase: number | null;
}

const LANDING_SETTLE_SECONDS = 0.25;
const STRIDE_LENGTH = 2.8; // world units per full left-right cycle
const RUNNING_SPEED_THRESHOLD = 0.01;

/**
 * Purely cosmetic. Reads a JumpState but must never be read back by the
 * physics step — a fixed-path posture comparison depends on that being true.
 */
export function computePose(state: JumpState, pose: PoseParams): Pose {
  let armSwingAngle = 0;
  let legTuckAmount = 0;
  let compressionAmount = 0;
  let runCyclePhase: number | null = null;

  if (state.phase === "airborne" && state.takeoffT !== null) {
    const airborneSeconds = state.t - state.takeoffT;
    armSwingAngle = Math.sin(airborneSeconds * 6) * pose.armSwing;
    const risingFraction = state.vy > 0 ? Math.min(1, state.vy / 4) : 0;
    legTuckAmount = risingFraction * pose.legTuck;
  }

  if (state.phase === "grounded" && state.landingT !== null) {
    const sinceLanding = state.t - state.landingT;
    if (sinceLanding >= 0 && sinceLanding < LANDING_SETTLE_SECONDS) {
      const decay = 1 - sinceLanding / LANDING_SETTLE_SECONDS;
      compressionAmount = decay * pose.landingCompression;
    }
  }

  if (state.phase === "grounded" && Math.abs(state.vx) > RUNNING_SPEED_THRESHOLD) {
    runCyclePhase = (state.x / STRIDE_LENGTH) * Math.PI * 2;
  }

  return { armSwingAngle, legTuckAmount, compressionAmount, runCyclePhase };
}
