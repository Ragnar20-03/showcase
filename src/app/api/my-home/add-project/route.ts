import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { addManualProject, DuplicateProjectError } from "@/lib/synced-projects-store";
import { CATEGORIES, type ProjectCategory } from "@/lib/projects-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const fullDescription =
    typeof body?.fullDescription === "string" ? body.fullDescription.trim() : "";
  const github = typeof body?.github === "string" ? body.github.trim() : "";
  const highlight = typeof body?.highlight === "string" ? body.highlight.trim() : "";
  const category = body?.category as ProjectCategory;
  const tech: string[] = Array.isArray(body?.tech)
    ? body.tech.filter((t: unknown) => typeof t === "string" && t.trim().length > 0)
    : [];

  if (!name || !github || !CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "name, github, and a valid category are required" },
      { status: 400 }
    );
  }

  try {
    await addManualProject({
      name,
      description,
      github,
      tech,
      category,
      ...(fullDescription ? { fullDescription } : {}),
      ...(highlight ? { highlight } : {}),
    });
  } catch (err) {
    if (err instanceof DuplicateProjectError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
