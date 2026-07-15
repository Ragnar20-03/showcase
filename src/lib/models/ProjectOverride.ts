import { Schema, models, model } from "mongoose";
import { CATEGORIES } from "@/lib/projects-data";

const ProjectOverrideSchema = new Schema(
  {
    projectKey: { type: String, required: true, unique: true },
    hidden: { type: Boolean, default: false },
    description: { type: String, required: false },
    fullDescription: { type: String, required: false },
    tech: { type: [String], required: false },
    category: { type: String, enum: CATEGORIES, required: false },
    github: { type: String, required: false },
    highlight: { type: String, required: false },
  },
  { timestamps: true }
);

export const ProjectOverrideModel =
  models.ProjectOverride ?? model("ProjectOverride", ProjectOverrideSchema);
