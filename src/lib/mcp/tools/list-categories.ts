import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { mockCategories } from "../../../data/mockData";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description:
    "List TextTiles product categories. Returns top-level sections (Women, Men, Kids, Home Textiles) and their subcategories from the public catalog.",
  inputSchema: {
    parentSlug: z
      .string()
      .optional()
      .describe("If provided, return subcategories under this parent slug instead of the top level."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ parentSlug }) => {
    const shape = (c: { id: string; name: string; slug: string; children?: unknown[] }) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      childCount: Array.isArray(c.children) ? c.children.length : 0,
    });
    let items;
    if (!parentSlug) {
      items = mockCategories.map(shape);
    } else {
      const parent = findBySlug(mockCategories, parentSlug);
      items = (parent?.children ?? []).map(shape);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { categories: items },
    };
  },
});

function findBySlug(list: any[], slug: string): any | null {
  for (const c of list) {
    if (c.slug === slug) return c;
    if (c.children) {
      const hit = findBySlug(c.children, slug);
      if (hit) return hit;
    }
  }
  return null;
}
