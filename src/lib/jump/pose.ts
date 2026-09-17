import type { JumpState, PoseParams } from "./types";

export interface Pose {
  armSwingAngle: number;
  legTuckAmount: number;
  compressionAmount: number;
}

const LANDING_SETTLE_SECONDS = 0.25;

/**
 * Purely cosmetic. Reads a JumpState but must never be read back by the
 * physics step — a fixed-path posture comparison depends on that being true.
 */
export function computePose(state: JumpState, pose: PoseParams): Pose {
  let armSwingAngle = 0;
  let legTuckAmount = 0;
  let compressionAmount = 0;

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

  return { armSwingAngle, legTuckAmount, compressionAmount };
}
