import { QUALITY_RESULT_LABEL } from "@/lib/labels";
import clsx from "clsx";

export function QualityResultBadge({ result, className }: { result: string; className?: string }) {
  const cfg = QUALITY_RESULT_LABEL[result] ?? QUALITY_RESULT_LABEL.unchecked;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        cfg.className,
        className
      )}
    >
      {cfg.text}
    </span>
  );
}
