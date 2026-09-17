import type { InputFrame } from "./types";

export interface TouchButtons {
  left?: HTMLElement | null;
  right?: HTMLElement | null;
  jump?: HTMLElement | null;
}

export interface InputController {
  getFrame(): InputFrame;
  destroy(): void;
}

const LEFT_KEYS = new Set(["ArrowLeft", "KeyA"]);
const RIGHT_KEYS = new Set(["ArrowRight", "KeyD"]);
const JUMP_KEYS = new Set(["Space"]);

/**
 * Keyboard is scoped to `container` (only captured while the widget has
 * focus, not the whole page) and touch/mouse is unified through Pointer
 * Events so multi-touch and mouse both work with one code path.
 */
export function createInputController(container: HTMLElement, touchButtons: TouchButtons = {}): InputController {
  let leftHeld = false;
  let rightHeld = false;
  let jumpHeld = false;
  // The fixed-step physics loop polls getFrame() at most once per ~16.67ms
  // tick. A fast tap (mouse click or key tap) can press *and* release the
  // jump button entirely between two polls, so `jumpHeld` alone can miss it.
  // This latch remembers "jump was pressed since the last poll" and is
  // consumed (cleared) the next time getFrame() runs, guaranteeing at least
  // one poll observes jumpHeld === true and produces a real press edge.
  let jumpPressedLatch = false;

  const clearAll = () => {
    leftHeld = false;
    rightHeld = false;
    jumpHeld = false;
    jumpPressedLatch = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (LEFT_KEYS.has(e.code)) {
      leftHeld = true;
      e.preventDefault();
    } else if (RIGHT_KEYS.has(e.code)) {
      rightHeld = true;
      e.preventDefault();
    } else if (JUMP_KEYS.has(e.code)) {
      jumpHeld = true;
      jumpPressedLatch = true;
      e.preventDefault();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (LEFT_KEYS.has(e.code)) leftHeld = false;
    else if (RIGHT_KEYS.has(e.code)) rightHeld = false;
    else if (JUMP_KEYS.has(e.code)) jumpHeld = false;
  };
  const onBlur = () => clearAll();

  container.addEventListener("keydown", onKeyDown);
  container.addEventListener("keyup", onKeyUp);
  container.addEventListener("blur", onBlur);
  window.addEventListener("blur", onBlur);

  const pointerBindings: Array<{ el: HTMLElement; down: (e: PointerEvent) => void; up: (e: PointerEvent) => void }> =
    [];

  function bindTouchButton(el: HTMLElement | null | undefined, set: (held: boolean) => void) {
    if (!el) return;
    const down = (e: PointerEvent) => {
      container.focus({ preventScroll: true });
      set(true);
      e.preventDefault();
    };
    const up = () => set(false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", up);
    pointerBindings.push({ el, down, up });
  }

  bindTouchButton(touchButtons.left, (held) => {
    leftHeld = held;
  });
  bindTouchButton(touchButtons.right, (held) => {
    rightHeld = held;
  });
  bindTouchButton(touchButtons.jump, (held) => {
    jumpHeld = held;
    if (held) jumpPressedLatch = true;
  });

  return {
    getFrame(): InputFrame {
      const moveX = leftHeld === rightHeld ? 0 : leftHeld ? -1 : 1;
      const effectiveJumpHeld = jumpHeld || jumpPressedLatch;
      jumpPressedLatch = false;
      return { moveX, jumpHeld: effectiveJumpHeld };
    },
    destroy() {
      container.removeEventListener("keydown", onKeyDown);
      container.removeEventListener("keyup", onKeyUp);
      container.removeEventListener("blur", onBlur);
      window.removeEventListener("blur", onBlur);
      for (const { el, down, up } of pointerBindings) {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("pointerleave", up);
      }
    },
  };
}
