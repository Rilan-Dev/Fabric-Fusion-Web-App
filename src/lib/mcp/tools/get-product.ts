import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allProducts } from "../../../data/mockData";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description:
    "Fetch full details for a single product from the TextTiles public catalog by slug, including variants, prices, colors, sizes, stock, and images.",
  inputSchema: {
    slug: z.string().min(1).describe("Product slug (e.g. 'banarasi-silk-saree-red')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const product = allProducts.find((p) => p.slug === slug);
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found with slug "${slug}"` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
