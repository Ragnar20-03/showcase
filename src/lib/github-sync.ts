import { defaultProjects, type ProjectCategory } from "./projects-data";

const GITHUB_USER = "Ragnar20-03";
const EXCLUDED_SLUGS = new Set(["showcase"]);

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
};

export type NewSyncedProject = {
  name: string;
  description: string;
  github: string;
  tech: string[];
  category: ProjectCategory;
  repoSlug: string;
};

function extractRepoSlug(githubUrl: string): string {
  const match = githubUrl.match(/github\.com\/[^/]+\/([^/]+)/);
  return match ? match[1] : githubUrl;
}

/** Fetches all public repos for the account and returns only the ones not already
 * represented (by repo slug) in the hardcoded project list or the given known-slugs set. */
export async function fetchNewGithubProjects(
  alreadyKnownSlugs: Set<string>
): Promise<NewSyncedProject[]> {
  const knownFromDefaults = new Set(defaultProjects.map((p) => extractRepoSlug(p.github)));
  const known = new Set([...knownFromDefaults, ...alreadyKnownSlugs, ...EXCLUDED_SLUGS]);

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created`,
    { headers: { Accept: "application/vnd.github+json" } }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: GithubRepo[] = await res.json();

  return repos
    .filter((r) => !r.fork && !known.has(r.name))
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      github: r.html_url,
      tech: r.language ? [r.language] : [],
      category: "fullstack" as ProjectCategory,
      repoSlug: r.name,
    }));
}
