// Real-time inventory status badge fed by the check_availability MCP tool.

import { cn } from '@/lib/utils';
import type { AvailabilityStatus } from '@/hooks/useAvailability';

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus;
  stock?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  isLoading?: boolean;
  className?: string;
}

const statusStyles: Record<AvailabilityStatus, string> = {
  in_stock: 'bg-success text-success-foreground',
  low_stock: 'bg-warning text-warning-foreground',
  out_of_stock: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<AvailabilityStatus, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

export function AvailabilityBadge({
  status,
  stock,
  size = 'sm',
  showCount = true,
  isLoading = false,
  className,
}: AvailabilityBadgeProps) {
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  if (isLoading || !status) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-block rounded-full bg-muted animate-pulse',
          size === 'sm' ? 'h-5 w-20' : 'h-6 w-24',
          className,
        )}
      />
    );
  }

  const label =
    status === 'low_stock' && showCount && typeof stock === 'number' && stock > 0
      ? `Only ${stock} left`
      : statusLabels[status];

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap shadow-sm',
        sizing,
        statusStyles[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-1.5 w-1.5 rounded-full bg-current',
          status !== 'out_of_stock' && 'animate-pulse',
        )}
      />
      {label}
    </span>
  );
}

export default AvailabilityBadge;
