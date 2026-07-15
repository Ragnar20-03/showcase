import type { Project, ProjectCategory } from "./projects-data";

export type ProjectOverrideFields = {
  hidden?: boolean;
  description?: string;
  fullDescription?: string;
  tech?: string[];
  category?: ProjectCategory;
  github?: string;
  highlight?: string;
};

/** Patches each project with its override (by name), if any, and drops hidden ones.
 * Pure — no I/O — safe to call from server components or API routes alike. */
export function applyOverrides(
  projects: Project[],
  overrides: Record<string, ProjectOverrideFields>
): Project[] {
  const result: Project[] = [];

  for (const project of projects) {
    const override = overrides[project.name];
    if (!override) {
      result.push(project);
      continue;
    }
    if (override.hidden) continue;

    result.push({
      ...project,
      ...(override.description !== undefined ? { description: override.description } : {}),
      ...(override.fullDescription !== undefined
        ? { fullDescription: override.fullDescription }
        : {}),
      ...(override.tech !== undefined ? { tech: override.tech } : {}),
      ...(override.category !== undefined ? { category: override.category } : {}),
      ...(override.github !== undefined ? { github: override.github } : {}),
      ...(override.highlight !== undefined ? { highlight: override.highlight } : {}),
    });
  }

  return result;
}
