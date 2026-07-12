import { connectToDatabase } from "./mongodb";
import { ProjectOrderModel } from "./models/ProjectOrder";
import type { ProjectOrder } from "./project-order";

export async function getProjectOrder(): Promise<ProjectOrder | null> {
  try {
    await connectToDatabase();
    const doc = await ProjectOrderModel.findOne().lean<ProjectOrder | null>();
    return doc ?? null;
  } catch {
    return null;
  }
}

export async function saveProjectOrder(order: ProjectOrder): Promise<void> {
  await connectToDatabase();
  await ProjectOrderModel.findOneAndUpdate({}, order, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}
