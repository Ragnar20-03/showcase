import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { saveOverride } from "@/lib/project-overrides-store";
import type { ProjectOverrideFields } from "@/lib/project-overrides";
import { CATEGORIES, type ProjectCategory } from "@/lib/projects-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const projectKey = typeof body?.projectKey === "string" ? body.projectKey.trim() : "";
  if (!projectKey) {
    return NextResponse.json({ error: "projectKey is required" }, { status: 400 });
  }

  const fields: ProjectOverrideFields = {};

  if (typeof body.hidden === "boolean") fields.hidden = body.hidden;
  if (typeof body.description === "string") fields.description = body.description.trim();
  if (typeof body.fullDescription === "string") {
    fields.fullDescription = body.fullDescription.trim();
  }
  if (typeof body.github === "string" && body.github.trim()) fields.github = body.github.trim();
  if (typeof body.highlight === "string") fields.highlight = body.highlight.trim();
  if (Array.isArray(body.tech)) {
    fields.tech = body.tech.filter((t: unknown) => typeof t === "string" && t.trim().length > 0);
  }
  if (typeof body.category === "string" && CATEGORIES.includes(body.category as ProjectCategory)) {
    fields.category = body.category as ProjectCategory;
  }

  try {
    await saveOverride(projectKey, fields);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to save override: ${message}` }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
