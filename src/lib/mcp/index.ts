import { defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listCategories from "./tools/list-categories";
import checkAvailability from "./tools/check-availability";

export default defineMcp({
  name: "texttiles-mcp",
  title: "TextTiles MCP",
  version: "0.1.0",
  instructions:
    "Public tools for the TextTiles digital textile showroom. Use `list_categories` to explore Women/Men/Kids/Home Textiles sections, `search_products` to find items by keyword, `get_product` to fetch full details by slug, and `check_availability` to get real-time stock status by SKU or slug. All data is from the public product catalog — no authentication required.",
  tools: [searchProducts, getProduct, listCategories, checkAvailability],
});
