import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchNewGithubProjects } from "@/lib/github-sync";
import { addSyncedProjects, getKnownSyncedSlugs } from "@/lib/synced-projects-store";

export async function POST() {
  try {
    const knownSlugs = await getKnownSyncedSlugs();
    const newProjects = await fetchNewGithubProjects(knownSlugs);

    if (newProjects.length > 0) {
      await addSyncedProjects(newProjects);
      revalidatePath("/");
    }

    return NextResponse.json({ added: newProjects.length, projects: newProjects });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Sync failed: ${message}` }, { status: 500 });
  }
}
