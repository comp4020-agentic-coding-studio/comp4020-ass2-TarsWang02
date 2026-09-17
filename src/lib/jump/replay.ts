import { MOTION_KEYS } from "./config";
import type { InputFrame, JumpMode, MotionParams } from "./types";

export interface ReplayLinkData {
  mode: JumpMode;
  configA: MotionParams;
  configB: MotionParams;
  inputs: InputFrame[];
}

// Generous but bounded: protects decode from a corrupted or hand-edited link
// blowing up into a huge allocation, without ever being hit by a real
// recording (a jump lasts a few seconds at 60 fps, i.e. a few hundred frames).
const MAX_ENCODED_LENGTH = 20000;

function packInputs(inputs: InputFrame[]): string {
  // Each frame is one of 6 combinations (moveX in {-1,0,1}, jumpHeld in
  // {false,true}) -> one ASCII digit '0'-'5', so the whole recorded trace
  // packs into a single compact string instead of a JSON array of objects.
  let out = "";
  for (const frame of inputs) {
    const code = (frame.moveX + 1) * 2 + (frame.jumpHeld ? 1 : 0);
    out += String(code);
  }
  return out;
}

function unpackInputs(packed: string): InputFrame[] | null {
  if (!/^[0-5]*$/.test(packed)) return null;
  const inputs: InputFrame[] = [];
  for (const ch of packed) {
    const code = Number(ch);
    const moveX = (Math.floor(code / 2) - 1) as -1 | 0 | 1;
    const jumpHeld = code % 2 === 1;
    inputs.push({ moveX, jumpHeld });
  }
  return inputs;
}

function parseMotion(value: unknown): MotionParams | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const motion = {} as MotionParams;
  for (const key of MOTION_KEYS) {
    const raw = source[key];
    if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
    motion[key] = raw;
  }
  return motion;
}

/**
 * Encodes an immutable A/B comparison — mode, both motion configurations and
 * the exact recorded input trace — as a query string (no leading "?"). This
 * is the "saved replay link" the One Body, Three Personalities brief
 * requires: opening it reproduces the same comparison, not just the same
 * parameters, because the input trace is part of the link.
 */
export function encodeReplayLink(data: ReplayLinkData): string {
  const payload = {
    v: 1,
    mode: data.mode,
    a: data.configA,
    b: data.configB,
    i: packInputs(data.inputs),
  };
  const encoded = btoa(JSON.stringify(payload));
  return new URLSearchParams({ replay: encoded }).toString();
}

/**
 * Inverse of encodeReplayLink. Returns null if the link is missing, too
 * large to plausibly be a real recording, or malformed in any way — callers
 * should fall back to a fresh comparison and tell the user why, rather than
 * throwing.
 */
export function decodeReplayLink(search: string): ReplayLinkData | null {
  const params = new URLSearchParams(search);
  const encoded = params.get("replay");
  if (!encoded) return null;
  if (encoded.length > MAX_ENCODED_LENGTH) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(atob(encoded));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (record.v !== 1) return null;
  if (record.mode !== "immediate" && record.mode !== "charged") return null;

  const configA = parseMotion(record.a);
  const configB = parseMotion(record.b);
  if (!configA || !configB) return null;
  if (typeof record.i !== "string") return null;
  const inputs = unpackInputs(record.i);
  if (!inputs || inputs.length === 0) return null;

  return { mode: record.mode, configA, configB, inputs };
}
