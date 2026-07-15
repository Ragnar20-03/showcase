import { connectToDatabase } from "./mongodb";
import { ProjectOverrideModel } from "./models/ProjectOverride";
import type { ProjectOverrideFields } from "./project-overrides";

export async function getOverrides(): Promise<Record<string, ProjectOverrideFields>> {
  try {
    await connectToDatabase();
    const docs = await ProjectOverrideModel.find().lean<
      Array<ProjectOverrideFields & { projectKey: string }>
    >();
    const map: Record<string, ProjectOverrideFields> = {};
    for (const d of docs) {
      const { projectKey, ...fields } = d;
      map[projectKey] = fields;
    }
    return map;
  } catch {
    return {};
  }
}

export async function saveOverride(
  projectKey: string,
  fields: ProjectOverrideFields
): Promise<void> {
  await connectToDatabase();
  await ProjectOverrideModel.findOneAndUpdate(
    { projectKey },
    { $set: fields },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
