import type { MotionParams, PoseParams } from "./types";

export interface JumpPreset {
  key: "floaty" | "heavy" | "precise";
  label: string;
  summary: string;
  motion: MotionParams;
  pose: PoseParams;
}

const SHARED: Pick<MotionParams, "minLaunchSpeed" | "walkSpeed" | "chargeTimeMs" | "jumpBufferMs"> = {
  minLaunchSpeed: 3,
  walkSpeed: 4,
  chargeTimeMs: 600,
  jumpBufferMs: 120,
};

export const PRESETS: JumpPreset[] = [
  {
    key: "floaty",
    label: "Floaty",
    summary: "Long airtime, generous in-air correction, a soft release cut.",
    motion: {
      ...SHARED,
      gravity: 9,
      launchSpeed: 7,
      airControl: 14,
      releaseCutFactor: 0.75,
      coyoteTimeMs: 120,
    },
    pose: { armSwing: 0.8, legTuck: 0.6, landingCompression: 0.3 },
  },
  {
    key: "heavy",
    label: "Heavy",
    summary: "Short airtime, committed once airborne, a firm landing.",
    motion: {
      ...SHARED,
      gravity: 22,
      launchSpeed: 8.5,
      airControl: 3,
      releaseCutFactor: 0.9,
      coyoteTimeMs: 60,
    },
    pose: { armSwing: 0.3, legTuck: 0.2, landingCompression: 1 },
  },
  {
    key: "precise",
    label: "Precise",
    summary: "Fast response, sharp release cut, tight in-air correction.",
    motion: {
      ...SHARED,
      gravity: 16,
      launchSpeed: 7.5,
      airControl: 10,
      releaseCutFactor: 0.45,
      coyoteTimeMs: 80,
    },
    pose: { armSwing: 0.45, legTuck: 0.4, landingCompression: 0.5 },
  },
];

export function getPreset(key: string): JumpPreset | undefined {
  return PRESETS.find((p) => p.key === key);
}

/** The Home page's single fixed baseline jump — Home never exposes tuning controls. */
export const DEFAULT_MOTION: MotionParams = {
  ...SHARED,
  gravity: 14,
  launchSpeed: 7,
  airControl: 8,
  releaseCutFactor: 0.6,
  coyoteTimeMs: 100,
};

export const DEFAULT_POSE: PoseParams = { armSwing: 0.5, legTuck: 0.4, landingCompression: 0.5 };
