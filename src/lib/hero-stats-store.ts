import { connectToDatabase } from "./mongodb";
import { HeroStatModel } from "./models/HeroStat";
import type { HeroStat } from "./hero-stats-data";

export type HeroStatDoc = HeroStat & { id: string; order: number };

export async function getHeroStats(): Promise<HeroStatDoc[]> {
  try {
    await connectToDatabase();
    const docs = await HeroStatModel.find()
      .sort({ order: 1 })
      .lean<Array<{ _id: unknown; value: string; label: string; order: number }>>();
    return docs.map((d) => ({ id: String(d._id), value: d.value, label: d.label, order: d.order }));
  } catch {
    return [];
  }
}

export async function addHeroStat(input: HeroStat): Promise<void> {
  await connectToDatabase();
  const count = await HeroStatModel.countDocuments();
  await HeroStatModel.create({ ...input, order: count });
}

export async function updateHeroStat(id: string, input: HeroStat): Promise<void> {
  await connectToDatabase();
  await HeroStatModel.findByIdAndUpdate(id, { $set: input });
}

export async function deleteHeroStat(id: string): Promise<void> {
  await connectToDatabase();
  await HeroStatModel.findByIdAndDelete(id);
}
