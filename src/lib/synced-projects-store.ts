import { connectToDatabase } from "./mongodb";
import { SyncedProjectModel } from "./models/SyncedProject";
import { extractRepoSlug } from "./repo-slug";
import type { Project, ProjectCategory } from "./projects-data";
import type { NewSyncedProject } from "./github-sync";

type SyncedDoc = {
  name: string;
  description: string;
  fullDescription?: string;
  github: string;
  tech: string[];
  category: Project["category"];
  highlight?: string;
};

export async function getSyncedProjects(): Promise<Project[]> {
  try {
    await connectToDatabase();
    const docs = await SyncedProjectModel.find().lean<SyncedDoc[]>();
    return docs.map((d) => ({
      name: d.name,
      description: d.description,
      github: d.github,
      tech: d.tech,
      category: d.category,
      ...(d.fullDescription ? { fullDescription: d.fullDescription } : {}),
      ...(d.highlight ? { highlight: d.highlight } : {}),
    }));
  } catch {
    return [];
  }
}

export type ManualProjectInput = {
  name: string;
  description: string;
  fullDescription?: string;
  github: string;
  tech: string[];
  category: ProjectCategory;
  highlight?: string;
};

export class DuplicateProjectError extends Error {}

/** Throws DuplicateProjectError if a project for this GitHub URL already exists. */
export async function addManualProject(input: ManualProjectInput): Promise<void> {
  await connectToDatabase();
  const repoSlug = extractRepoSlug(input.github);

  try {
    await SyncedProjectModel.create({ ...input, repoSlug });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      throw new DuplicateProjectError(
        `A project for this GitHub link already exists (matched as "${repoSlug}")`
      );
    }
    throw err;
  }
}

export async function getKnownSyncedSlugs(): Promise<Set<string>> {
  await connectToDatabase();
  const docs = await SyncedProjectModel.find().select("repoSlug").lean<Array<{ repoSlug: string }>>();
  return new Set(docs.map((d) => d.repoSlug));
}

export async function addSyncedProjects(newProjects: NewSyncedProject[]): Promise<void> {
  if (newProjects.length === 0) return;
  await connectToDatabase();
  await SyncedProjectModel.insertMany(newProjects, { ordered: false });
}
