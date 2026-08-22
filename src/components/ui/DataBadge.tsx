import { DataReliability } from "@/types";
import { RELIABILITY_LABEL } from "@/lib/labels";
import clsx from "clsx";

export function DataBadge({ reliability, className }: { reliability: DataReliability; className?: string }) {
  const cfg = RELIABILITY_LABEL[reliability];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        cfg.className,
        className
      )}
    >
      {cfg.text}
    </span>
  );
}
