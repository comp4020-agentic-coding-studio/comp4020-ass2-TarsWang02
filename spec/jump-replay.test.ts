import { describe, expect, it } from "vitest";
import { decodeReplayLink, encodeReplayLink, type ReplayLinkData } from "../src/lib/jump/replay";
import { DEFAULT_MOTION } from "../src/lib/jump/presets";
import type { InputFrame, MotionParams } from "../src/lib/jump/types";

const configA: MotionParams = { ...DEFAULT_MOTION, gravity: 14 };
const configB: MotionParams = { ...DEFAULT_MOTION, gravity: 20 };

function sampleInputs(): InputFrame[] {
  const inputs: InputFrame[] = [];
  for (let i = 0; i < 30; i++) inputs.push({ moveX: 0, jumpHeld: false });
  inputs.push({ moveX: 1, jumpHeld: true });
  for (let i = 0; i < 20; i++) inputs.push({ moveX: 1, jumpHeld: true });
  inputs.push({ moveX: -1, jumpHeld: false });
  for (let i = 0; i < 10; i++) inputs.push({ moveX: -1, jumpHeld: false });
  return inputs;
}

describe("replay link encode/decode round trip", () => {
  it("recovers the exact mode, both configs and the full input trace", () => {
    const data: ReplayLinkData = { mode: "charged", configA, configB, inputs: sampleInputs() };
    const query = encodeReplayLink(data);
    const decoded = decodeReplayLink(`?${query}`);
    expect(decoded).toEqual(data);
  });

  it("round-trips every moveX/jumpHeld combination", () => {
    const inputs: InputFrame[] = [];
    for (const moveX of [-1, 0, 1] as const) {
      for (const jumpHeld of [false, true]) {
        inputs.push({ moveX, jumpHeld });
      }
    }
    const data: ReplayLinkData = { mode: "immediate", configA, configB, inputs };
    const decoded = decodeReplayLink(`?${encodeReplayLink(data)}`);
    expect(decoded?.inputs).toEqual(inputs);
  });

  it("produces a link that survives being embedded in a full URL", () => {
    const data: ReplayLinkData = { mode: "immediate", configA, configB, inputs: sampleInputs() };
    const url = `https://example.test/jump-lab/?${encodeReplayLink(data)}`;
    const decoded = decodeReplayLink(new URL(url).search);
    expect(decoded).toEqual(data);
  });
});

describe("replay link decode — invalid/oversized input handling", () => {
  it("returns null when there is no replay param at all", () => {
    expect(decodeReplayLink("")).toBeNull();
    expect(decodeReplayLink("?a=floaty&b=precise&mode=immediate")).toBeNull();
  });

  it("returns null for non-base64 garbage", () => {
    expect(decodeReplayLink("?replay=not-valid-base64!!!")).toBeNull();
  });

  it("returns null for base64 that isn't JSON", () => {
    const notJson = btoa("hello world");
    expect(decodeReplayLink(`?replay=${encodeURIComponent(notJson)}`)).toBeNull();
  });

  it("returns null for a wrong schema version", () => {
    const payload = btoa(JSON.stringify({ v: 2, mode: "immediate", a: configA, b: configB, i: "0" }));
    expect(decodeReplayLink(`?replay=${encodeURIComponent(payload)}`)).toBeNull();
  });

  it("returns null for an invalid mode", () => {
    const payload = btoa(JSON.stringify({ v: 1, mode: "sideways", a: configA, b: configB, i: "0" }));
    expect(decodeReplayLink(`?replay=${encodeURIComponent(payload)}`)).toBeNull();
  });

  it("returns null when a motion config is missing a required field", () => {
    const incomplete = { ...configA } as Partial<MotionParams>;
    delete incomplete.gravity;
    const payload = btoa(JSON.stringify({ v: 1, mode: "immediate", a: incomplete, b: configB, i: "0" }));
    expect(decodeReplayLink(`?replay=${encodeURIComponent(payload)}`)).toBeNull();
  });

  it("returns null for an empty input trace", () => {
    const payload = btoa(JSON.stringify({ v: 1, mode: "immediate", a: configA, b: configB, i: "" }));
    expect(decodeReplayLink(`?replay=${encodeURIComponent(payload)}`)).toBeNull();
  });

  it("returns null for a packed input string with out-of-range digits", () => {
    const payload = btoa(JSON.stringify({ v: 1, mode: "immediate", a: configA, b: configB, i: "0129" }));
    expect(decodeReplayLink(`?replay=${encodeURIComponent(payload)}`)).toBeNull();
  });

  it("returns null for an oversized encoded payload rather than throwing", () => {
    const hugeInputs: InputFrame[] = Array.from({ length: 50000 }, () => ({ moveX: 0, jumpHeld: false }));
    const query = encodeReplayLink({ mode: "immediate", configA, configB, inputs: hugeInputs });
    expect(() => decodeReplayLink(`?${query}`)).not.toThrow();
    expect(decodeReplayLink(`?${query}`)).toBeNull();
  });
});
