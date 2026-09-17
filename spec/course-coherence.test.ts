import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

function weeksOf(type: string): number[] {
  return api.nodes
    .filter((node) => node.type === type)
    .map((node) => Number(node.meta?.week))
    .sort((a, b) => a - b);
}

describe("course coherence — the promises a marker relies on without re-reading every file", () => {
  it("covers all twelve weeks with exactly one lecture and one session each", () => {
    const expected = Array.from({ length: 12 }, (_, i) => i + 1);
    expect(weeksOf("lectures")).toEqual(expected);
    expect(weeksOf("sessions")).toEqual(expected);
  });

  it("has exactly three assessments whose weights sum to exactly 100", () => {
    const assessments = api.nodes.filter((node) => node.type === "assessments");
    expect(assessments).toHaveLength(3);
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(total).toBe(100);
  });

  it("orders assessment due dates the same way as their assigned week", () => {
    const assessments = api.nodes
      .filter((node) => node.type === "assessments")
      .map((node) => ({ week: Number(node.meta?.week), due: String(node.meta?.due) }))
      .sort((a, b) => a.week - b.week);
    for (let i = 1; i < assessments.length; i++) {
      expect(assessments[i].due > assessments[i - 1].due, "a later-week assessment is due earlier than an earlier one").toBe(
        true,
      );
    }
  });

  it("points the week-7 lecture's slides field at a deck that actually exists", () => {
    const lecture = api.nodes.find((node) => node.id === "lectures/week-07");
    expect(lecture?.meta?.slides).toBe("/decks/week-07/");
  });

  it("ships exactly the one deck the plan requires, and no leftover placeholder", () => {
    const fs = require("node:fs") as typeof import("node:fs");
    const decks = fs.readdirSync(resolve("src/decks")).filter((f) => f.endsWith(".deck.mdx"));
    expect(decks).toEqual(["week-07.deck.mdx"]);
  });
});
