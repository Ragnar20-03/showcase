import { CATEGORIES, type Project, type ProjectCategory } from "./projects-data";

export type ProjectOrder = {
  categoryOrder: ProjectCategory[];
  aiOrder: string[];
  web3Order: string[];
  fullstackOrder: string[];
};

const ORDER_KEY_BY_CATEGORY: Record<ProjectCategory, keyof ProjectOrder> = {
  ai: "aiOrder",
  web3: "web3Order",
  fullstack: "fullstackOrder",
};

function sortByNameOrder(items: Project[], order: string[] | undefined): Project[] {
  if (!order || order.length === 0) return items;
  const rank = new Map(order.map((name, i) => [name, i]));
  return [...items].sort((a, b) => {
    const ra = rank.has(a.name) ? rank.get(a.name)! : Infinity;
    const rb = rank.has(b.name) ? rank.get(b.name)! : Infinity;
    return ra - rb;
  });
}

/** Sorts projects by category order, then by per-category project order. Unlisted
 * projects/categories keep their original relative order and are appended last. */
export function applyProjectOrder(projects: Project[], order: ProjectOrder | null): Project[] {
  const byCategory: Record<ProjectCategory, Project[]> = { web3: [], fullstack: [], ai: [] };
  for (const p of projects) byCategory[p.category].push(p);

  const sortedByCategory: Record<ProjectCategory, Project[]> = {
    web3: sortByNameOrder(byCategory.web3, order?.[ORDER_KEY_BY_CATEGORY.web3] as string[]),
    fullstack: sortByNameOrder(byCategory.fullstack, order?.[ORDER_KEY_BY_CATEGORY.fullstack] as string[]),
    ai: sortByNameOrder(byCategory.ai, order?.[ORDER_KEY_BY_CATEGORY.ai] as string[]),
  };

  const categoryOrder = order?.categoryOrder?.length ? order.categoryOrder : CATEGORIES;
  const seen = new Set<ProjectCategory>();
  const result: Project[] = [];
  for (const cat of categoryOrder) {
    if (!CATEGORIES.includes(cat) || seen.has(cat)) continue;
    seen.add(cat);
    result.push(...sortedByCategory[cat]);
  }
  for (const cat of CATEGORIES) {
    if (!seen.has(cat)) result.push(...sortedByCategory[cat]);
  }
  return result;
}
