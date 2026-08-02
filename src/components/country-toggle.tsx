"use client";

import type { CountryStatus } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<CountryStatus, string> = {
  visited: "Visited",
  lived: "Lived",
  want: "Want to visit",
};

type CountryToggleProps = {
  currentStatus: CountryStatus | null;
  onChange: (status: CountryStatus | null) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function CountryToggle({
  currentStatus,
  onChange,
  disabled,
  compact,
}: CountryToggleProps) {
  const statuses: CountryStatus[] = ["visited", "lived", "want"];

  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1")}>
      {statuses.map((status) => {
        const active = currentStatus === status;
        return (
          <Button
            key={status}
            type="button"
            size={compact ? "sm" : "default"}
            variant={active ? status : "outline"}
            disabled={disabled}
            onClick={() => onChange(active ? null : status)}
          >
            {STATUS_LABELS[status]}
          </Button>
        );
      })}
    </div>
  );
}

export { STATUS_LABELS };
