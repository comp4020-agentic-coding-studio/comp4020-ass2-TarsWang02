import type { Field } from "./types";

type Platform = Field["platforms"][number];

export function flatField(width = 400): Field {
  return {
    groundY: 0,
    platforms: [{ x0: -width, x1: width }],
    falloutY: -20,
  };
}

export function gapField(gapStart: number, gapWidth: number, reach = 200): Field {
  return {
    groundY: 0,
    platforms: [
      { x0: gapStart - reach, x1: gapStart },
      { x0: gapStart + gapWidth, x1: gapStart + gapWidth + reach },
    ],
    falloutY: -20,
  };
}

export function platformAt(field: Field, x: number): Platform | null {
  return field.platforms.find((p) => x >= p.x0 && x <= p.x1) ?? null;
}
