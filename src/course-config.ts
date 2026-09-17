import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
//
// The code's last three digits were assigned to this repo when it was
// provisioned, and no other course in the cohort has them. The first digit is
// the level; SLOP1280 (beginner-level) is the suggested default for this
// no-prerequisite course.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP1280",
  title: "The Anatomy of a Jump",
  session: "Semester 1",
  year: 2027,
  level: 1,
  startDate: "2027-02-22",
  endDate: "2027-05-28",
  description:
    "A twelve-week studio in game feel, built around one mechanic: designing a " +
    "2D jump. No game-development experience is assumed --- you measure, tune " +
    "and compare a single jump using visual tools and controlled experiments, " +
    "with guided code exploration as an optional extra.",
  tags: ["game feel", "interaction design", "playtesting"],
}) satisfies CourseMetaInput;

/** The four phases the twelve weeks progress through, in order. */
export const coursePhases = [
  { key: "measure", label: "Measure", weeks: [1, 2, 3] },
  { key: "control", label: "Control", weeks: [4, 5, 6] },
  { key: "express", label: "Express", weeks: [7, 8, 9] },
  { key: "evaluate", label: "Evaluate", weeks: [10, 11, 12] },
] as const;
