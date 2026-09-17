import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createInputController } from "../src/lib/jump/input";

/**
 * Minimal EventTarget-like stub. createInputController only calls
 * addEventListener/removeEventListener and reads `e.code`/calls
 * `e.preventDefault()` on the event objects it receives, so a real DOM
 * (jsdom) is unnecessary for these tests.
 */
function createFakeElement() {
  const listeners = new Map<string, Set<(e: any) => void>>();
  return {
    addEventListener(type: string, fn: (e: any) => void) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener(type: string, fn: (e: any) => void) {
      listeners.get(type)?.delete(fn);
    },
    dispatch(type: string, event: any = { preventDefault() {} }) {
      for (const fn of [...(listeners.get(type) ?? [])]) fn(event);
    },
  };
}

const key = (code: string) => ({ code, preventDefault() {} });

describe("createInputController — jump short-press edge latching", () => {
  let originalWindow: unknown;

  beforeEach(() => {
    originalWindow = (globalThis as any).window;
    (globalThis as any).window = createFakeElement();
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
  });

  it("a full keydown+keyup that lands between two polls still produces one true frame", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);

    // The press-and-release both happen before the physics loop ever polls —
    // this is the exact scenario a fast click/tap produces.
    container.dispatch("keydown", key("Space"));
    container.dispatch("keyup", key("Space"));

    expect(input.getFrame().jumpHeld).toBe(true);
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("does not repeat a stale press on later polls", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);
    container.dispatch("keydown", key("Space"));
    container.dispatch("keyup", key("Space"));

    expect(input.getFrame().jumpHeld).toBe(true);
    expect(input.getFrame().jumpHeld).toBe(false);
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("still reports jumpHeld continuously across many polls for a genuine long hold", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);
    container.dispatch("keydown", key("Space"));
    expect(input.getFrame().jumpHeld).toBe(true);
    expect(input.getFrame().jumpHeld).toBe(true);
    expect(input.getFrame().jumpHeld).toBe(true);
    container.dispatch("keyup", key("Space"));
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("latches a fast pointerdown+pointerup on a touch/mouse jump button the same way", () => {
    const container = createFakeElement();
    const jumpButton = createFakeElement();
    const input = createInputController(container as any, { jump: jumpButton as any });

    jumpButton.dispatch("pointerdown");
    jumpButton.dispatch("pointerup");

    expect(input.getFrame().jumpHeld).toBe(true);
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("clears a pending latch on blur so it never fires a phantom jump after losing focus", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);
    container.dispatch("keydown", key("Space"));
    container.dispatch("keyup", key("Space"));
    container.dispatch("blur");

    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("never leaves jump stuck true after pointercancel or pointerleave on a touch button", () => {
    const container = createFakeElement();
    const jumpButton = createFakeElement();
    const input = createInputController(container as any, { jump: jumpButton as any });

    jumpButton.dispatch("pointerdown");
    expect(input.getFrame().jumpHeld).toBe(true); // press edge consumed

    jumpButton.dispatch("pointercancel");
    expect(input.getFrame().jumpHeld).toBe(false);
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("never leaves movement stuck after window blur", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);
    container.dispatch("keydown", key("ArrowRight"));
    expect(input.getFrame().moveX).toBe(1);

    (globalThis as any).window.dispatch("blur");
    expect(input.getFrame().moveX).toBe(0);
    expect(input.getFrame().jumpHeld).toBe(false);
  });

  it("moveX reflects held left/right keys and clears on keyup", () => {
    const container = createFakeElement();
    const input = createInputController(container as any);
    container.dispatch("keydown", key("ArrowRight"));
    expect(input.getFrame().moveX).toBe(1);
    container.dispatch("keyup", key("ArrowRight"));
    expect(input.getFrame().moveX).toBe(0);
  });
});
