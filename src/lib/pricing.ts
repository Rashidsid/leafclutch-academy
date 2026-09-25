import type { CoursePricing, LearningMode } from "./types";

export const MODE_ORDER: LearningMode[] = ["online", "hybrid", "physical"];

export interface ModePrice {
  mode: LearningMode;
  /** Price before discount */
  price: number;
  /** Discount in percent (0–100) */
  discount: number;
  /** Price the learner pays */
  final: number;
}

type Priced = { fee: number; modes: LearningMode[]; pricing?: CoursePricing | null };

export const applyDiscount = (price: number, discount: number) =>
  Math.max(0, Math.round((price * (100 - Math.min(100, Math.max(0, discount)))) / 100));

/** Prices for every mode the course offers, in Online → Hybrid → Physical order. */
export function modePrices(course: Priced): ModePrice[] {
  return MODE_ORDER.filter((m) => course.modes.includes(m)).map((mode) => {
    const p = course.pricing?.[mode];
    const price = Number(p?.price ?? course.fee) || 0;
    const discount = Number(p?.discount ?? 0) || 0;
    return { mode, price, discount, final: applyDiscount(price, discount) };
  });
}

/** Cheapest option, used for "From Rs. X" on cards and listings. */
export function lowestPrice(course: Priced): ModePrice {
  const prices = modePrices(course);
  return (
    prices.reduce<ModePrice | null>((best, p) => (!best || p.final < best.final ? p : best), null) ?? {
      mode: "physical",
      price: course.fee,
      discount: 0,
      final: course.fee,
    }
  );
}

export function priceFor(course: Priced, mode: LearningMode): ModePrice {
  return modePrices(course).find((p) => p.mode === mode) ?? lowestPrice(course);
}

/** True when the course charges different amounts for different modes. */
export function hasVariablePricing(course: Priced) {
  return new Set(modePrices(course).map((p) => p.final)).size > 1;
}
