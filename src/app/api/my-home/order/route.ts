import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjectOrder, saveProjectOrder } from "@/sanity/lib/projectOrder";
import { defaultProjects, CATEGORIES, type ProjectCategory } from "@/lib/projects-data";
import type { ProjectOrder } from "@/lib/project-order";

export async function GET() {
  const order = await getProjectOrder();
  return NextResponse.json({ projects: defaultProjects, order });
}

function isCategoryArray(value: unknown): value is ProjectCategory[] {
  return (
    Array.isArray(value) &&
    value.every((v) => typeof v === "string" && CATEGORIES.includes(v as ProjectCategory))
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    !isCategoryArray(body.categoryOrder) ||
    !isStringArray(body.aiOrder) ||
    !isStringArray(body.web3Order) ||
    !isStringArray(body.fullstackOrder)
  ) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const order: ProjectOrder = {
    categoryOrder: body.categoryOrder,
    aiOrder: body.aiOrder,
    web3Order: body.web3Order,
    fullstackOrder: body.fullstackOrder,
  };

  try {
    await saveProjectOrder(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to save order: ${message}` }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
