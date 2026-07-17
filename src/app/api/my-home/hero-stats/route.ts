import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getHeroStats, addHeroStat } from "@/lib/hero-stats-store";

export async function GET() {
  const stats = await getHeroStats();
  return NextResponse.json({ stats });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const value = typeof body?.value === "string" ? body.value.trim() : "";
  const label = typeof body?.label === "string" ? body.label.trim() : "";

  if (!value || !label) {
    return NextResponse.json({ error: "value and label are required" }, { status: 400 });
  }

  try {
    await addHeroStat({ value, label });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to add stat: ${message}` }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
