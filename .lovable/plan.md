## Goal

Show real-time stock status badges (In Stock / Low Stock / Out of Stock) on product cards and product detail pages, powered by the deployed `check_availability` MCP tool instead of the static `stockQuantity` snapshot currently rendered.

## What the user sees

- **Product cards (listings, grids, search results):** a small colored badge on the image corner — green "In Stock", amber "Only N left" for low stock, gray "Out of Stock". Replaces today's hard-coded `< 5` check.
- **Product detail page:** a prominent inline badge next to the price / add-to-cart row, updating when the shopper switches variant (color/size). Shows exact remaining count on low stock.
- Badges refresh automatically every ~30s and on tab focus, so the number reflects the latest server response.

## Technical section

1. **Availability hook** — `src/hooks/useAvailability.ts`
   - `useAvailability({ slug?, sku? })` React Query hook.
   - Calls the deployed MCP tool at `${VITE_SUPABASE_URL}/functions/v1/mcp/.mcp/invoke-tool/check_availability` with a POST body `{ slug }` or `{ sku }`.
   - Returns `{ overallStatus, totalStock, variants[], checkedAt }` from the tool's `structuredContent`.
   - `staleTime: 15s`, `refetchInterval: 30s`, `refetchOnWindowFocus: true`.
   - For grids, a `useAvailabilityBatch(slugs[])` variant that runs the queries in parallel (React Query `useQueries`) so each card fetches independently and caches share.

2. **Badge component** — `src/components/common/AvailabilityBadge.tsx`
   - Props: `status: 'in_stock' | 'low_stock' | 'out_of_stock'`, `stock?: number`, `size?: 'sm' | 'md'`, `showCount?: boolean`.
   - Uses existing shadcn `Badge` with semantic tokens (success/warning/muted). No hardcoded colors.
   - Loading state: subtle skeleton pill so layout doesn't jump.

3. **ProductCard integration** — `src/components/common/ProductCard.tsx`
   - Replace the current inline Low Stock / Out of Stock badges (lines ~111–120) with `<AvailabilityBadge>` fed by `useAvailability({ slug: product.slug })`.
   - While the query is pending, fall back to the static `stockQuantity` from mock data so the card never renders empty.
   - Disable "Add to Cart" quick action when `overallStatus === 'out_of_stock'`.

4. **ProductPage integration** — `src/pages/ProductPage.tsx`
   - Add `<AvailabilityBadge>` in the price/CTA block, driven by the currently selected variant's SKU: `useAvailability({ sku: selectedVariant.sku })`.
   - Disable Add-to-Cart / Buy Now buttons when out of stock; show "Only N left — order soon" copy on low stock.

5. **MCP invoke helper** — small internal `src/lib/mcpClient.ts`
   - Single `invokeMcpTool(name, args)` wrapper that handles the JSON-RPC envelope, throws on `isError`, and returns `structuredContent`. Keeps the hook clean and reusable for future MCP-backed UI.

## Out of scope

- No changes to the MCP tool itself, catalog data, cart logic, or checkout.
- No new database tables — the tool already reads the same mock catalog.
- No auth changes; the MCP endpoint is public per prior setup.
