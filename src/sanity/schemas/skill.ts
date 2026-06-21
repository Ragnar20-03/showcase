import { defineField, defineType } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skills",
  type: "document",
  fields: [
    defineField({ name: "category", title: "Category", type: "string", validation: (r) => r.required() }),
    defineField({ name: "items", title: "Skills", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
