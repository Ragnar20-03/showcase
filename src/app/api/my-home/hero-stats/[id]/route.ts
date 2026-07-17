import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { updateHeroStat, deleteHeroStat } from "@/lib/hero-stats-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  const value = typeof body?.value === "string" ? body.value.trim() : "";
  const label = typeof body?.label === "string" ? body.label.trim() : "";

  if (!value || !label) {
    return NextResponse.json({ error: "value and label are required" }, { status: 400 });
  }

  try {
    await updateHeroStat(id, { value, label });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to update stat: ${message}` }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteHeroStat(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to delete stat: ${message}` }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
