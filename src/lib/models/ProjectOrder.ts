import { Schema, models, model, type InferSchemaType } from "mongoose";

const ProjectOrderSchema = new Schema({
  categoryOrder: { type: [String], default: [] },
  aiOrder: { type: [String], default: [] },
  web3Order: { type: [String], default: [] },
  fullstackOrder: { type: [String], default: [] },
});

export type ProjectOrderDocument = InferSchemaType<typeof ProjectOrderSchema>;

// Reuse the compiled model across hot reloads in dev instead of redefining it.
export const ProjectOrderModel =
  models.ProjectOrder ?? model("ProjectOrder", ProjectOrderSchema);
