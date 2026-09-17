import { computePose } from "./pose";
import type { Field, JumpState, PoseParams } from "./types";

export interface Point {
  x: number;
  y: number;
}

export interface Limb {
  origin: Point;
  mid: Point;
  end: Point;
}

export interface HumanoidGeometry {
  head: { center: Point; size: number };
  torso: { top: Point; bottom: Point };
  leftArm: Limb;
  rightArm: Limb;
  leftLeg: Limb;
  rightLeg: Limb;
}

// Local character space: feet at y = 0, head top at y = 1, centerline at x = 0.
// One geometric humanoid — rounded-square head, simple torso, two articulated
// arms and legs — shared by every preset. Only the pose parameters (fed in via
// computePose) vary between them.
const HIP_Y = 0.45;
const SHOULDER_Y = 0.8;
const HEAD_CENTER_Y = 0.9;
const HEAD_SIZE = 0.22;
const SHOULDER_X = 0.12;
const HIP_X = 0.08;
const ARM_LENGTH = 0.28;
const LEG_LENGTH = 0.45;
const ARM_HANG_ANGLE = -1.35; // radians from +x axis, pointing mostly downward
const LEG_HANG_ANGLE = -1.57; // straight down

function rotate(origin: Point, angle: number, length: number): Point {
  return { x: origin.x + Math.cos(angle) * length, y: origin.y + Math.sin(angle) * length };
}

function limb(origin: Point, angle: number, bend: number, length: number): Limb {
  const half = length / 2;
  const mid = rotate(origin, angle, half);
  const end = rotate(mid, angle + bend, half);
  return { origin, mid, end };
}

function mirrorPoint(p: Point): Point {
  return { x: -p.x, y: p.y };
}

/** Left-side limbs are always the exact mirror of the right side — guarantees a symmetric rest pose by construction rather than by matching trig identities. */
function mirrorLimb(l: Limb): Limb {
  return { origin: mirrorPoint(l.origin), mid: mirrorPoint(l.mid), end: mirrorPoint(l.end) };
}

/**
 * Cosmetic-only geometry for the shared humanoid, derived from computePose
 * (which is itself pure and physics-independent). Never consulted by the
 * physics engine — see engine.ts's stepFrame/runTrial signatures.
 */
export function humanoidGeometry(state: JumpState, pose: PoseParams): HumanoidGeometry {
  const p = computePose(state, pose);
  const facing = state.vx >= 0 ? 1 : -1;

  const rightShoulder: Point = { x: SHOULDER_X, y: SHOULDER_Y };
  const rightHip: Point = { x: HIP_X, y: HIP_Y };

  // The right side swings forward with the direction of travel; the left
  // side is its mirror image, which is exactly opposite-phase arm swing.
  const swing = p.armSwingAngle * facing;
  const rightArm = limb(rightShoulder, ARM_HANG_ANGLE - swing, Math.abs(swing) * 0.6, ARM_LENGTH);
  const leftArm = mirrorLimb(rightArm);

  const tuck = p.legTuckAmount;
  const rightLeg = limb(rightHip, LEG_HANG_ANGLE, tuck * 1.4, LEG_LENGTH * (1 - tuck * 0.3));
  const leftLeg = mirrorLimb(rightLeg);

  const squashY = 1 - p.compressionAmount * 0.25;
  const squashX = 1 + p.compressionAmount * 0.2;
  const squash = (point: Point): Point => ({ x: point.x * squashX, y: point.y * squashY });
  const squashLimb = (l: Limb): Limb => ({
    origin: squash(l.origin),
    mid: squash(l.mid),
    end: squash(l.end),
  });

  return {
    head: { center: squash({ x: 0, y: HEAD_CENTER_Y }), size: HEAD_SIZE * squashY },
    torso: { top: squash({ x: 0, y: SHOULDER_Y }), bottom: squash({ x: 0, y: HIP_Y }) },
    leftArm: squashLimb(leftArm),
    rightArm: squashLimb(rightArm),
    leftLeg: squashLimb(leftLeg),
    rightLeg: squashLimb(rightLeg),
  };
}

export interface Viewport {
  canvasWidth: number;
  canvasHeight: number;
  pixelsPerUnit: number;
  groundYPixel: number;
  cameraX: number;
  cameraY: number;
}

export function makeViewport(
  canvasWidth: number,
  canvasHeight: number,
  pixelsPerUnit: number,
  groundYPixel: number,
  cameraX = 0,
  cameraY = 0,
): Viewport {
  return { canvasWidth, canvasHeight, pixelsPerUnit, groundYPixel, cameraX, cameraY };
}

/** World units are y-up with groundY = 0; canvas pixels are y-down. */
export function worldToScreen(viewport: Viewport, x: number, y: number): Point {
  return {
    x: viewport.canvasWidth / 2 + (x - viewport.cameraX) * viewport.pixelsPerUnit,
    y: viewport.groundYPixel - (y - viewport.cameraY) * viewport.pixelsPerUnit,
  };
}

// Top of the head above the character's origin, in local character-space units
// (see humanoidGeometry above) — used to keep the whole character in frame.
const HEAD_TOP_RATIO = HEAD_CENTER_Y + HEAD_SIZE / 2;

/**
 * Pans the camera up just enough to keep the character's head clear of the
 * canvas top, and no further — the ground stays pinned at groundYPixel for
 * every ordinary jump, and only very tall jumps (extreme gravity/launch-speed
 * combinations) ever cause a pan. Rendering-only: never consulted by physics.
 */
export function followCharacterVertically(
  viewport: Viewport,
  state: { y: number },
  characterWorldHeight: number,
  topMarginPixels = 24,
): void {
  const headTopWorldY = state.y + HEAD_TOP_RATIO * characterWorldHeight;
  const safeTopWorldY = (viewport.groundYPixel - topMarginPixels) / viewport.pixelsPerUnit;
  viewport.cameraY = Math.max(0, headTopWorldY - safeTopWorldY);
}

/**
 * For side-by-side comparisons that replay the *same* recorded trajectory
 * through two bodies (e.g. the posture lab): a single camera offset, derived
 * once from the full trajectory's highest point, so both sides always share
 * an identical scale, ground baseline and camera position. Unlike
 * followCharacterVertically, this never recomputes per frame and never
 * differs between two viewports fed the same frames — there is no
 * independent per-side follow to drift apart or to flash a stale frame on
 * reset.
 */
export function computeFixedFramingCameraY(
  frames: readonly { y: number }[],
  characterWorldHeight: number,
  viewport: Pick<Viewport, "groundYPixel" | "pixelsPerUnit">,
  topMarginPixels = 24,
): number {
  let maxHeadTopWorldY = -Infinity;
  for (const state of frames) {
    const headTopWorldY = state.y + HEAD_TOP_RATIO * characterWorldHeight;
    if (headTopWorldY > maxHeadTopWorldY) maxHeadTopWorldY = headTopWorldY;
  }
  const safeTopWorldY = (viewport.groundYPixel - topMarginPixels) / viewport.pixelsPerUnit;
  return Math.max(0, maxHeadTopWorldY - safeTopWorldY);
}

export interface RenderTheme {
  primary: string;
  secondary: string;
  tertiary: string;
  bg: string;
  bgAlt: string;
  text: string;
  border: string;
}

// Several SlopU tokens (--at-bg, --at-bg-alt, --at-text, --at-border) are
// defined via light-dark(oklch(...)) rather than a plain hex value. Reading
// them with getComputedStyle().getPropertyValue() returns that unresolved
// function text, which Canvas's fillStyle silently rejects (leaving the
// previous fillStyle in place) rather than throwing. Resolving each token
// through a probe element's `color` property forces the browser to compute
// it down to a concrete rgb()/oklch() string Canvas can actually parse.
function resolveColor(referenceEl: Element, cssValue: string): string {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:${cssValue}`;
  referenceEl.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

/** Reads the site's live SlopU brand tokens so the renderer never hardcodes colour. */
export function readTheme(el: Element): RenderTheme {
  return {
    primary: resolveColor(el, "var(--at-primary)"),
    secondary: resolveColor(el, "var(--at-secondary)"),
    tertiary: resolveColor(el, "var(--at-tertiary)"),
    bg: resolveColor(el, "var(--at-bg)"),
    bgAlt: resolveColor(el, "var(--at-bg-alt)"),
    text: resolveColor(el, "var(--at-text)"),
    border: resolveColor(el, "var(--at-border)"),
  };
}

export interface SceneOptions {
  state: JumpState;
  pose: PoseParams;
  field: Field;
  viewport: Viewport;
  theme: RenderTheme;
  /** World-unit height of the character, e.g. 1 world unit tall. */
  characterWorldHeight: number;
}

function drawLimb(
  ctx: CanvasRenderingContext2D,
  toScreen: (p: Point) => Point,
  l: Limb,
  color: string,
  lineWidth: number,
) {
  const o = toScreen(l.origin);
  const m = toScreen(l.mid);
  const e = toScreen(l.end);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(m.x, m.y);
  ctx.lineTo(e.x, e.y);
  ctx.stroke();
}

/** Draws the playfield and the shared humanoid for one frame. Pure side effect on ctx. */
export function drawScene(ctx: CanvasRenderingContext2D, opts: SceneOptions): void {
  const { state, pose, field, viewport, theme, characterWorldHeight } = opts;
  const { canvasWidth, canvasHeight } = viewport;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = theme.bgAlt;
  for (const platform of field.platforms) {
    const topLeft = worldToScreen(viewport, platform.x0, field.groundY);
    const bottomRight = worldToScreen(viewport, platform.x1, field.falloutY);
    ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  for (const platform of field.platforms) {
    const a = worldToScreen(viewport, platform.x0, field.groundY);
    const b = worldToScreen(viewport, platform.x1, field.groundY);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const geometry = humanoidGeometry(state, pose);
  const scale = characterWorldHeight;
  const toScreen = (p: Point) => worldToScreen(viewport, state.x + p.x * scale, state.y + p.y * scale);
  const limbWidth = Math.max(2, viewport.pixelsPerUnit * scale * 0.075);

  drawLimb(ctx, toScreen, geometry.leftArm, theme.secondary, limbWidth);
  drawLimb(ctx, toScreen, geometry.rightArm, theme.secondary, limbWidth);
  drawLimb(ctx, toScreen, geometry.leftLeg, theme.tertiary, limbWidth);
  drawLimb(ctx, toScreen, geometry.rightLeg, theme.tertiary, limbWidth);

  const torsoTop = toScreen(geometry.torso.top);
  const torsoBottom = toScreen(geometry.torso.bottom);
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = Math.max(3, viewport.pixelsPerUnit * scale * 0.14);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(torsoTop.x, torsoTop.y);
  ctx.lineTo(torsoBottom.x, torsoBottom.y);
  ctx.stroke();

  // A tailored geometric suit, with a light centre seam and articulated boots.
  const suitWidth = viewport.pixelsPerUnit * scale * 0.24;
  ctx.fillStyle = theme.primary;
  ctx.beginPath();
  ctx.moveTo(torsoTop.x - suitWidth / 2, torsoTop.y);
  ctx.lineTo(torsoTop.x + suitWidth / 2, torsoTop.y);
  ctx.lineTo(torsoBottom.x + suitWidth * .36, torsoBottom.y);
  ctx.lineTo(torsoBottom.x - suitWidth * .36, torsoBottom.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = theme.bg;
  ctx.lineWidth = Math.max(1, limbWidth * .22);
  ctx.beginPath();
  ctx.moveTo(torsoTop.x, torsoTop.y + 3);
  ctx.lineTo(torsoBottom.x, torsoBottom.y - 3);
  ctx.stroke();
  for (const leg of [geometry.leftLeg, geometry.rightLeg]) {
    const foot = toScreen(leg.end);
    ctx.fillStyle = theme.text;
    ctx.fillRect(foot.x - limbWidth * .7, foot.y - limbWidth * .6, limbWidth * 1.4, limbWidth * .65);
  }

  const head = toScreen(geometry.head.center);
  const headPx = geometry.head.size * scale * viewport.pixelsPerUnit;
  ctx.fillStyle = theme.primary;
  const roundRect = (
    ctx as CanvasRenderingContext2D & {
      roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
    }
  ).roundRect;
  ctx.beginPath();
  if (typeof roundRect === "function") {
    roundRect.call(ctx, head.x - headPx / 2, head.y - headPx / 2, headPx, headPx, headPx * 0.22);
  } else {
    ctx.rect(head.x - headPx / 2, head.y - headPx / 2, headPx, headPx);
  }
  ctx.fill();

  // Dark inset visor keeps the face legible at small sizes.
  ctx.fillStyle = theme.text;
  ctx.fillRect(head.x - headPx * .38, head.y - headPx * .23, headPx * .76, headPx * .4);
  const eyeOffsetX = headPx * 0.18;
  const eyeOffsetY = headPx * 0.05;
  const eyeRadius = Math.max(1, headPx * 0.06);
  ctx.fillStyle = theme.bg;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(head.x + dir * eyeOffsetX, head.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
