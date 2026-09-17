import type { JumpMode, MotionParams } from "./types";

export const MOTION_KEYS: (keyof MotionParams)[] = [
  "gravity",
  "launchSpeed",
  "minLaunchSpeed",
  "walkSpeed",
  "airControl",
  "releaseCutFactor",
  "chargeTimeMs",
  "coyoteTimeMs",
  "jumpBufferMs",
];

export interface MotionConfig {
  mode: JumpMode;
  motion: MotionParams;
}

/** Encodes a mode + full motion configuration as a query string (no leading "?"). */
export function encodeMotionConfig(config: MotionConfig): string {
  const params = new URLSearchParams();
  params.set("mode", config.mode);
  for (const key of MOTION_KEYS) {
    params.set(key, String(config.motion[key]));
  }
  return params.toString();
}

/** Inverse of encodeMotionConfig. Returns null if anything required is missing or malformed. */
export function decodeMotionConfig(search: string): MotionConfig | null {
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  if (mode !== "immediate" && mode !== "charged") return null;

  const motion = {} as MotionParams;
  for (const key of MOTION_KEYS) {
    const raw = params.get(key);
    if (raw === null) return null;
    const value = Number(raw);
    if (!Number.isFinite(value)) return null;
    motion[key] = value;
  }
  return { mode, motion };
}
