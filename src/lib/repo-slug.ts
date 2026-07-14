/** Derives a stable identifier from a GitHub URL — the repo name segment right after
 * the username, ignoring any /tree/... subfolder suffix. Falls back to the raw URL if
 * it doesn't look like a GitHub URL, so manually-entered non-GitHub links still work. */
export function extractRepoSlug(githubUrl: string): string {
  const match = githubUrl.match(/github\.com\/[^/]+\/([^/]+)/);
  return match ? match[1] : githubUrl;
}
