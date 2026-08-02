// Real-time inventory availability, powered by the public `check_availability`
// MCP tool. Refetches periodically so shoppers see current stock.

import { useQuery, useQueries } from '@tanstack/react-query';
import { invokeMcpTool } from '@/lib/mcpClient';

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface VariantAvailability {
  sku: string;
  variantId: string;
  size?: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  status: AvailabilityStatus;
  isActive: boolean;
}

export interface AvailabilitySnapshot {
  checkedAt: string;
  productId: string;
  productName: string;
  slug: string;
  variants: VariantAvailability[];
  totalStock: number;
  overallStatus: AvailabilityStatus;
}

const REFETCH_INTERVAL = 30_000;
const STALE_TIME = 15_000;

function fetchAvailability(
  args: { slug?: string; sku?: string },
  signal?: AbortSignal,
) {
  return invokeMcpTool<AvailabilitySnapshot>('check_availability', args, signal);
}

export function availabilityQueryOptions(args: { slug?: string; sku?: string }) {
  return {
    queryKey: ['availability', args.sku ?? null, args.slug ?? null] as const,
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchAvailability(args, signal),
    enabled: Boolean(args.sku || args.slug),
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    retry: 1,
  };
}

/** Availability for one product (by slug) or one variant (by sku). */
export function useAvailability(args: { slug?: string; sku?: string }) {
  return useQuery(availabilityQueryOptions(args));
}

/** Availability for many products at once — shares the cache with useAvailability. */
export function useAvailabilityBatch(slugs: string[]) {
  return useQueries({
    queries: slugs.map((slug) => availabilityQueryOptions({ slug })),
  });
}
