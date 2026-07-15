import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allProducts } from "../../../data/mockData";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the TextTiles public product catalog by keyword. Matches product name, description, category, and tags. Returns id, name, slug, category, price range, rating, and main image.",
  inputSchema: {
    query: z.string().min(1).describe("Keyword to search across the catalog."),
    section: z
      .enum(["women", "men", "kids", "home"])
      .optional()
      .describe("Optional section filter."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, section, limit }) => {
    const q = query.toLowerCase();
    const sectionPrefix: Record<string, string> = { women: "w", men: "m", kids: "k", home: "h" };
    let results = allProducts.filter((p) => {
      const hay = [
        p.name,
        p.description ?? "",
        p.categoryName ?? "",
        (p.tags ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
      if (section && !p.id.startsWith(sectionPrefix[section])) return false;
      return true;
    });
    results = results.slice(0, limit ?? 10);
    const shaped = results.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.categoryName,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      rating: p.avgRating,
      reviewCount: p.reviewCount,
      image: p.variants?.[0]?.images?.[0]?.url,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(shaped, null, 2) }],
      structuredContent: { results: shaped, count: shaped.length },
    };
  },
});
