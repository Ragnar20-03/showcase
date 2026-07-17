import { Schema, models, model } from "mongoose";

const HeroStatSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HeroStatModel = models.HeroStat ?? model("HeroStat", HeroStatSchema);
