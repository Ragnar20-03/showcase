import { defineField, defineType } from "sanity";

export const projectOrder = defineType({
  name: "projectOrder",
  title: "Project Order",
  type: "document",
  fields: [
    defineField({
      name: "categoryOrder",
      title: "Category order (All tab)",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. [\"ai\", \"web3\", \"fullstack\"] — which category shows first in the All tab",
    }),
    defineField({
      name: "aiOrder",
      title: "AI / ML project order",
      type: "array",
      of: [{ type: "string" }],
      description: "Project names, in display order",
    }),
    defineField({
      name: "web3Order",
      title: "Web3 / Blockchain project order",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "fullstackOrder",
      title: "Full Stack project order",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
