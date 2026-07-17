export type HeroStat = {
  value: string;
  label: string;
};

/** Fallback shown only if the database is empty/unreachable — the real source of
 * truth is the HeroStat collection, managed via /my-home. */
export const defaultHeroStats: HeroStat[] = [
  { value: "63+", label: "GitHub Repos" },
  { value: "300+", label: "LeetCode Solved" },
  { value: "10+", label: "Web3 Projects" },
  { value: "Ninja", label: "Dominator — CN" },
];
