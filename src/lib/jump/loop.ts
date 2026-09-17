import { createInitialState, stepFrame, summarizeTrial } from "./engine";
import type { Field, InputFrame, JumpMode, JumpState, MotionParams, TrialResult } from "./types";

const FIXED_DT = 1 / 60;
const MAX_CATCHUP_STEPS = 5;

export interface LiveLoopConfig {
  mode: JumpMode;
  motion: MotionParams;
  field: Field;
  startX?: number;
}

export interface LiveLoopCallbacks {
  getInput(): InputFrame;
  onFrame?(state: JumpState): void;
  onTakeoff?(): void;
  onLanding?(): void;
  /** Fired once a trial ends, whether landed (complete) or fallen (incomplete). */
  onTrialComplete?(summary: Omit<TrialResult, "frames">): void;
}

export interface LiveLoop {
  start(): void;
  stop(): void;
  reset(): void;
  /** Takes effect on the next reset()/trial start, never mid-air. */
  reconfigure(config: Partial<LiveLoopConfig>): void;
  getState(): JumpState;
}

const NEUTRAL_INPUT: InputFrame = { moveX: 0, jumpHeld: false };

export function createLiveLoop(config: LiveLoopConfig, callbacks: LiveLoopCallbacks): LiveLoop {
  let { mode, motion, field, startX = 0 } = config;
  let state = createInitialState(startX, field.groundY);
  let prevInput: InputFrame = NEUTRAL_INPUT;
  let framesSinceReset: JumpState[] = [];
  let rafHandle: number | null = null;
  let lastTimestamp: number | null = null;
  let accumulator = 0;

  function tick(timestamp: number) {
    rafHandle = requestAnimationFrame(tick);
    if (document.hidden) {
      lastTimestamp = null;
      return;
    }
    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
      return;
    }
    accumulator += (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    let steps = 0;
    while (accumulator >= FIXED_DT && steps < MAX_CATCHUP_STEPS) {
      stepOnce();
      accumulator -= FIXED_DT;
      steps++;
    }
    if (steps === MAX_CATCHUP_STEPS) accumulator = 0;

    callbacks.onFrame?.(state);
  }

  function stepOnce() {
    const wasPhase = state.phase;
    const input = callbacks.getInput();
    state = stepFrame(state, input, prevInput, mode, motion, field, FIXED_DT);
    prevInput = input;
    framesSinceReset.push(state);

    if (wasPhase !== "airborne" && state.phase === "airborne") {
      callbacks.onTakeoff?.();
    }
    const justLanded = wasPhase === "airborne" && state.phase === "grounded" && state.landingT !== null;
    if (justLanded) callbacks.onLanding?.();
    if (justLanded || state.phase === "fallen") {
      callbacks.onTrialComplete?.(summarizeTrial(framesSinceReset, field, startX));
    }
  }

  return {
    start() {
      if (rafHandle !== null) return;
      lastTimestamp = null;
      accumulator = 0;
      rafHandle = requestAnimationFrame(tick);
    },
    stop() {
      if (rafHandle !== null) cancelAnimationFrame(rafHandle);
      rafHandle = null;
      lastTimestamp = null;
    },
    reset() {
      state = createInitialState(startX, field.groundY);
      prevInput = NEUTRAL_INPUT;
      framesSinceReset = [];
      accumulator = 0;
    },
    reconfigure(next) {
      if (next.mode !== undefined) mode = next.mode;
      if (next.motion !== undefined) motion = next.motion;
      if (next.field !== undefined) field = next.field;
      if (next.startX !== undefined) startX = next.startX;
    },
    getState() {
      return state;
    },
  };
}
