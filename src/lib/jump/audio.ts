export interface JumpAudio {
  /** Must be called from within a real user-gesture handler (keydown/pointerdown). */
  unlock(): void;
  playTakeoff(): void;
  playLanding(): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
}

function blip(ctx: AudioContext, frequency: number, durationSeconds: number) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + durationSeconds);
}

/** Light takeoff/landing blips only — no background music, per the course's audio rules. */
export function createJumpAudio(initialMuted = false): JumpAudio {
  let ctx: AudioContext | null = null;
  let muted = initialMuted;

  return {
    unlock() {
      if (!ctx) ctx = new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
    },
    playTakeoff() {
      if (muted || !ctx) return;
      blip(ctx, 660, 0.12);
    },
    playLanding() {
      if (muted || !ctx) return;
      blip(ctx, 330, 0.15);
    },
    setMuted(value: boolean) {
      muted = value;
    },
    isMuted() {
      return muted;
    },
  };
}
