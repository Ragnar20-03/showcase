import { connectToDatabase } from "./mongodb";
import { SyncedProjectModel } from "./models/SyncedProject";
import type { Project } from "./projects-data";
import type { NewSyncedProject } from "./github-sync";

export async function getSyncedProjects(): Promise<Project[]> {
  try {
    await connectToDatabase();
    const docs = await SyncedProjectModel.find().lean<
      Array<{ name: string; description: string; github: string; tech: string[]; category: Project["category"] }>
    >();
    return docs.map((d) => ({
      name: d.name,
      description: d.description,
      github: d.github,
      tech: d.tech,
      category: d.category,
    }));
  } catch {
    return [];
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
