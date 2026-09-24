/**
 * Curriculum helpers shared by the website, the admin panel, the PDF export
 * and the SQL seed generator (keep this file free of path aliases).
 *
 * Outline text format (used for "paste outline" in the admin and in seed data):
 *
 *   # Python Programming Language          ← lesson
 *   ## Introduction to Python              ← section (shown as 1.1)
 *   - What exactly is Python?              ← point
 */
import type { CurriculumModule, CurriculumSection } from "./types.ts";

/** Removes "Lesson 1:", "1.1", "2." style prefixes so numbering is always generated. */
function stripNumbering(title: string) {
  return title
    .replace(/^\s*(lesson|module|unit|chapter)\s*\d+\s*[:.\-–]\s*/i, "")
    .replace(/^\s*\d+(\.\d+)*\s*[:.)\-–]?\s+/, "")
    .trim();
}

/** Always returns sections; the older flat `topics` list becomes one untitled section. */
export function lessonSections(lesson: CurriculumModule): CurriculumSection[] {
  const sections = (lesson.sections ?? [])
    .map((s) => ({ title: (s.title ?? "").trim(), points: (s.points ?? []).map((p) => p.trim()).filter(Boolean) }))
    .filter((s) => s.title || s.points.length);
  if (sections.length) return sections;
  const topics = (lesson.topics ?? []).map((t) => t.trim()).filter(Boolean);
  return topics.length ? [{ title: "", points: topics }] : [];
}

export function curriculumStats(lessons: CurriculumModule[]) {
  let sections = 0;
  let points = 0;
  for (const l of lessons) {
    for (const s of lessonSections(l)) {
      if (s.title) sections += 1;
      points += s.points.length;
    }
  }
  return { lessons: lessons.length, sections, points };
}

export function parseOutline(text: string): CurriculumModule[] {
  const lessons: CurriculumModule[] = [];
  let lesson: CurriculumModule | null = null;
  let section: CurriculumSection | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      if (!lesson) {
        lesson = { title: "Lesson", sections: [] };
        lessons.push(lesson);
      }
      section = { title: stripNumbering(line.slice(3)), points: [] };
      lesson.sections!.push(section);
    } else if (line.startsWith("# ")) {
      lesson = { title: stripNumbering(line.slice(2)), sections: [] };
      lessons.push(lesson);
      section = null;
    } else {
      const point = line.replace(/^[-*•]\s*/, "").trim();
      if (!point) continue;
      if (!lesson) {
        lesson = { title: "Lesson", sections: [] };
        lessons.push(lesson);
      }
      if (!section) {
        section = { title: "", points: [] };
        lesson.sections!.push(section);
      }
      section.points.push(point);
    }
  }
  return lessons;
}

export function toOutline(lessons: CurriculumModule[]): string {
  return lessons
    .map((l) =>
      [
        `# ${l.title}`,
        ...lessonSections(l).flatMap((s) => [...(s.title ? [`## ${s.title}`] : []), ...s.points.map((p) => `- ${p}`)]),
      ].join("\n"),
    )
    .join("\n\n");
}
