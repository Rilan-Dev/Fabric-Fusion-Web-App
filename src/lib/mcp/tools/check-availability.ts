import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allProducts } from "../../../data/mockData";

type VariantAvailability = {
  sku: string;
  variantId: string;
  size?: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  isActive: boolean;
};

const LOW_STOCK_THRESHOLD = 10;

function statusFor(qty: number): VariantAvailability["status"] {
  if (qty <= 0) return "out_of_stock";
  if (qty <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export default defineTool({
  name: "check_availability",
  title: "Check product availability",
  description:
    "Return real-time availability and inventory status for a product looked up by SKU or product slug. Reports per-variant stock quantity, status (in_stock, low_stock, out_of_stock), price, and an overall total.",
  inputSchema: {
    sku: z
      .string()
      .min(1)
      .optional()
      .describe("Variant SKU, e.g. 'BS-RED-001'. Provide either sku or slug."),
    slug: z
      .string()
      .min(1)
      .optional()
      .describe("Product slug, e.g. 'banarasi-silk-saree-red'. Provide either sku or slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ sku, slug }) => {
    if (!sku && !slug) {
      return {
        content: [{ type: "text", text: "Provide either 'sku' or 'slug'." }],
        isError: true,
      };
    }

    const checkedAt = new Date().toISOString();

    // SKU lookup: single variant
    if (sku) {
      for (const product of allProducts) {
        const variant = product.variants.find((v) => v.sku === sku);
        if (variant) {
          const availability: VariantAvailability = {
            sku: variant.sku,
            variantId: variant.id,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            stockQuantity: variant.stockQuantity,
            status: variant.isActive ? statusFor(variant.stockQuantity) : "out_of_stock",
            isActive: variant.isActive,
          };
          const payload = {
            checkedAt,
            productId: product.id,
            productName: product.name,
            slug: product.slug,
            variants: [availability],
            totalStock: availability.stockQuantity,
            overallStatus: availability.status,
          };
          return {
            content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
            structuredContent: payload,
          };
        }
      }
      return {
        content: [{ type: "text", text: `No variant found with SKU "${sku}".` }],
        isError: true,
      };
    }

    // Slug lookup: all variants of a product
    const product = allProducts.find((p) => p.slug === slug);
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found with slug "${slug}".` }],
        isError: true,
      };
    }

    const variants: VariantAvailability[] = product.variants.map((v) => ({
      sku: v.sku,
      variantId: v.id,
      size: v.size,
      color: v.color,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stockQuantity: v.stockQuantity,
      status: v.isActive ? statusFor(v.stockQuantity) : "out_of_stock",
      isActive: v.isActive,
    }));

    const totalStock = variants.reduce((sum, v) => sum + Math.max(0, v.stockQuantity), 0);
    const overallStatus: VariantAvailability["status"] = statusFor(totalStock);

    const payload = {
      checkedAt,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      variants,
      totalStock,
      overallStatus,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
