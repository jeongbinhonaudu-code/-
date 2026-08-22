import { EquipmentStatus } from "@/types";
import { STATUS_LABEL } from "@/lib/labels";
import clsx from "clsx";

export function StatusBadge({ status, className }: { status: EquipmentStatus; className?: string }) {
  const cfg = STATUS_LABEL[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        cfg.className,
        className
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", cfg.dot)} />
      {cfg.text}
    </span>
  );
}

export function StatusDot({ status, className }: { status: EquipmentStatus; className?: string }) {
  const cfg = STATUS_LABEL[status];
  return <span className={clsx("h-2.5 w-2.5 rounded-full", cfg.dot, className)} />;
}
