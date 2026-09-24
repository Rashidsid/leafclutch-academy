import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { lessonSections } from "@/lib/curriculum";
import { getCourseBySlug, getSettings } from "@/lib/data";
import { formatNpr, MODE_LABELS } from "@/lib/format";

/**
 * GET /courses/<slug>/syllabus — a branded PDF of the course curriculum,
 * generated from whatever the admin has saved in Supabase.
 */

const NAVY = rgb(7 / 255, 32 / 255, 105 / 255);
const INK = rgb(15 / 255, 23 / 255, 41 / 255);
const MUTED = rgb(103 / 255, 111 / 255, 126 / 255);
const LINE = rgb(218 / 255, 222 / 255, 231 / 255);
const TINT = rgb(235 / 255, 240 / 255, 250 / 255);
const MINT = rgb(59 / 255, 227 / 255, 160 / 255);
const WHITE = rgb(1, 1, 1);

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 50;
const FOOTER = 40;

/** The standard PDF fonts only cover Latin-1; replace anything else so rendering never fails. */
function clean(text: string) {
  return text
    .replace(/[→⇒]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/[✓✔]/g, "-")
    .replace(/[≥]/g, ">=")
    .replace(/[≤]/g, "<=")
    .replace(/[^\x20-\x7E\xA0-\xFF‘’“”–—•…€™]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of clean(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= width) line = test;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([getCourseBySlug(slug), getSettings()]);
  if (!course) return new Response("Course not found", { status: 404 });

  const pdf = await PDFDocument.create();
  pdf.setTitle(`${course.title} syllabus | ${settings.site_name}`);
  pdf.setAuthor(settings.site_name);
  pdf.setSubject(`${course.title} curriculum`);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logo: PDFImage | null = null;
  try {
    const res = await fetch(new URL("/brand/logo-footer.png", request.url));
    if (res.ok) logo = await pdf.embedPng(await res.arrayBuffer());
  } catch {
    logo = null;
  }

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - M;
  const width = PAGE_W - M * 2;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - M;
  };
  const ensure = (h: number) => {
    if (y - h < M + FOOTER) newPage();
  };
  const text = (value: string, opts: { x?: number; size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; maxWidth?: number; gap?: number }) => {
    const size = opts.size ?? 10.5;
    const font = opts.font ?? regular;
    const x = opts.x ?? M;
    const lineH = size * 1.45;
    for (const line of wrap(value, font, size, opts.maxWidth ?? width - (x - M))) {
      ensure(lineH);
      page.drawText(line, { x, y: y - size, size, font, color: opts.color ?? INK });
      y -= lineH;
    }
    y -= opts.gap ?? 0;
  };

  /* ---------------------------------------------------------------- Header band */
  const bandH = 150;
  page.drawRectangle({ x: 0, y: PAGE_H - bandH, width: PAGE_W, height: bandH, color: NAVY });
  if (logo) page.drawImage(logo, { x: M, y: PAGE_H - 62, width: 34, height: 34 });
  page.drawText(clean(settings.site_name), { x: M + (logo ? 44 : 0), y: PAGE_H - 50, size: 13, font: bold, color: WHITE });
  page.drawText("COURSE SYLLABUS", { x: M + (logo ? 44 : 0), y: PAGE_H - 63, size: 7.5, font: bold, color: MINT });
  y = PAGE_H - 88;
  for (const line of wrap(course.title, bold, 24, width).slice(0, 2)) {
    page.drawText(line, { x: M, y: y - 24, size: 24, font: bold, color: WHITE });
    y -= 30;
  }
  if (course.subtitle) {
    const sub = wrap(course.subtitle, regular, 10.5, width)[0] ?? "";
    page.drawText(sub, { x: M, y: y - 8, size: 10.5, font: regular, color: rgb(0.85, 0.88, 0.95) });
  }
  y = PAGE_H - bandH - 24;

  /* ---------------------------------------------------------------- Key facts */
  const firstInstallment = course.installments[0];
  const facts = [
    ["Duration", course.duration],
    ["Level", course.level ?? "All levels"],
    ["Total fee", formatNpr(course.fee)],
    ["Learning modes", course.modes.map((m) => MODE_LABELS[m]).join(", ")],
  ];
  const cellW = width / facts.length;
  page.drawRectangle({ x: M, y: y - 56, width, height: 56, color: TINT });
  facts.forEach(([label, value], i) => {
    const x = M + i * cellW + 12;
    page.drawText(clean(label!).toUpperCase(), { x, y: y - 17, size: 7, font: bold, color: MUTED });
    wrap(value!, bold, 10, cellW - 18)
      .slice(0, 2)
      .forEach((line, n) => page.drawText(line, { x, y: y - 33 - n * 12, size: 10, font: bold, color: NAVY }));
  });
  y -= 72;
  if (firstInstallment) {
    text(
      `Payment plan: ${course.installments.map((i) => `${i.label} ${i.percent}% (${formatNpr(Math.round((course.fee * i.percent) / 100))}) - ${i.note}`).join("; ")}.`,
      { size: 9, color: MUTED, gap: 8 },
    );
  }

  /* ---------------------------------------------------------------- Overview */
  if (course.description) {
    text("Course overview", { size: 14, font: bold, color: NAVY, gap: 4 });
    for (const para of course.description.split(/\n\s*\n/)) text(para, { size: 10, color: INK, gap: 6 });
    y -= 6;
  }
  if (course.tools.length) {
    text("Tools covered", { size: 12, font: bold, color: NAVY, gap: 2 });
    text(course.tools.join("  •  "), { size: 9.5, color: INK, gap: 10 });
  }

  /* ---------------------------------------------------------------- Curriculum */
  ensure(60);
  text("Curriculum", { size: 16, font: bold, color: NAVY, gap: 6 });
  course.curriculum.forEach((lesson, i) => {
    ensure(48);
    page.drawRectangle({ x: M, y: y - 24, width, height: 24, color: TINT });
    page.drawText(wrap(`Lesson ${i + 1}: ${lesson.title}`, bold, 11.5, width - 20)[0] ?? "", {
      x: M + 10,
      y: y - 16.5,
      size: 11.5,
      font: bold,
      color: NAVY,
    });
    y -= 32;
    lessonSections(lesson).forEach((section, j) => {
      if (section.title) {
        ensure(30);
        text(`${i + 1}.${j + 1}  ${section.title}`, { x: M + 8, size: 10.5, font: bold, color: INK, gap: 1 });
      }
      for (const point of section.points) {
        const lines = wrap(point, regular, 9.5, width - 40);
        ensure(lines.length * 14);
        page.drawCircle({ x: M + 26, y: y - 6, size: 1.6, color: INK });
        text(point, { x: M + 34, size: 9.5, color: rgb(0.2, 0.25, 0.33) });
      }
      y -= 4;
    });
    y -= 6;
  });

  /* ---------------------------------------------------------------- Footer on every page */
  const pages = pdf.getPages();
  const contact = [settings.phone, settings.email, settings.address].filter(Boolean).join("   |   ");
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: M + 14 }, end: { x: PAGE_W - M, y: M + 14 }, thickness: 0.6, color: LINE });
    p.drawText(clean(contact || settings.site_name), { x: M, y: M, size: 7.5, font: regular, color: MUTED });
    const label = `Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: PAGE_W - M - regular.widthOfTextAtSize(label, 7.5), y: M, size: 7.5, font: regular, color: MUTED });
  });

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${course.slug}-syllabus.pdf"`,
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
