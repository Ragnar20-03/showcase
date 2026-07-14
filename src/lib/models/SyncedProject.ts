import { Schema, models, model, type InferSchemaType } from "mongoose";
import { CATEGORIES } from "@/lib/projects-data";

const SyncedProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    github: { type: String, required: true },
    tech: { type: [String], default: [] },
    category: { type: String, enum: CATEGORIES, default: "fullstack" },
    highlight: { type: String, required: false },
    repoSlug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export type SyncedProjectDocument = InferSchemaType<typeof SyncedProjectSchema>;

export const SyncedProjectModel =
  models.SyncedProject ?? model("SyncedProject", SyncedProjectSchema);
