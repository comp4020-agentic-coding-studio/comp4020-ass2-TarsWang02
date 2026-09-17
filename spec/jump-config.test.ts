import { describe, expect, it } from "vitest";
import { decodeMotionConfig, encodeMotionConfig } from "../src/lib/jump/config";
import type { MotionParams } from "../src/lib/jump/types";

function motion(overrides: Partial<MotionParams> = {}): MotionParams {
  return {
    gravity: 14,
    launchSpeed: 7,
    minLaunchSpeed: 3,
    walkSpeed: 4,
    airControl: 8,
    releaseCutFactor: 0.6,
    chargeTimeMs: 600,
    coyoteTimeMs: 100,
    jumpBufferMs: 120,
    ...overrides,
  };
}

describe("jump config encode/decode", () => {
  it("round-trips a full configuration", () => {
    const config = { mode: "charged" as const, motion: motion({ gravity: 22, releaseCutFactor: 0.9 }) };
    const decoded = decodeMotionConfig(encodeMotionConfig(config));
    expect(decoded).toEqual(config);
  });

  it("round-trips through a real URLSearchParams-style query string", () => {
    const config = { mode: "immediate" as const, motion: motion() };
    const query = encodeMotionConfig(config);
    const decoded = decodeMotionConfig(`?${query}`);
    expect(decoded).toEqual(config);
  });

  it("rejects an empty or unrelated query string", () => {
    expect(decodeMotionConfig("")).toBeNull();
    expect(decodeMotionConfig("?foo=bar")).toBeNull();
  });

  it("rejects a missing motion field", () => {
    const config = { mode: "immediate" as const, motion: motion() };
    const query = encodeMotionConfig(config).replace(/&gravity=[^&]*/, "");
    expect(decodeMotionConfig(query)).toBeNull();
  });

  it("rejects a non-numeric motion field", () => {
    const config = { mode: "immediate" as const, motion: motion() };
    const query = encodeMotionConfig(config).replace(/gravity=[^&]*/, "gravity=notanumber");
    expect(decodeMotionConfig(query)).toBeNull();
  });

  it("rejects an invalid mode", () => {
    const config = { mode: "immediate" as const, motion: motion() };
    const query = encodeMotionConfig(config).replace(/mode=[^&]*/, "mode=sideways");
    expect(decodeMotionConfig(query)).toBeNull();
  });
});
