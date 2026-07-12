import { client } from "./client";
import { writeClient } from "./writeClient";
import type { ProjectOrder } from "@/lib/project-order";

const ORDER_DOC_ID = "projectOrder-singleton";

const ORDER_QUERY = `*[_type == "projectOrder"][0]{categoryOrder, aiOrder, web3Order, fullstackOrder}`;

export async function getProjectOrder(): Promise<ProjectOrder | null> {
  try {
    const doc = await client.fetch(ORDER_QUERY);
    return doc ?? null;
  } catch {
    return null;
  }
}

export async function saveProjectOrder(order: ProjectOrder): Promise<void> {
  await writeClient.createOrReplace({
    _id: ORDER_DOC_ID,
    _type: "projectOrder",
    ...order,
  });
}
