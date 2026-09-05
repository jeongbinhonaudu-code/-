"use client";

import { Equipment, FactoryZone } from "@/types";
import { formatDateTime } from "@/lib/format";
import clsx from "clsx";

const RESULT_BADGE: Record<string, { text: string; className: string }> = {
  ok: { text: "OK", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  recheck: { text: "재확인", className: "bg-amber-50 text-amber-700 border-amber-200" },
  nonconforming: { text: "NG", className: "bg-red-50 text-red-700 border-red-200" },
  unchecked: { text: "대기", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export function RecentQualityChecks({ equipment, zones }: { equipment: Equipment[]; zones: FactoryZone[] }) {
  const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;

  const rows = equipment
    .filter((e) => e.lastInspectionAt)
    .sort((a, b) => new Date(b.lastInspectionAt!).getTime() - new Date(a.lastInspectionAt!).getTime())
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="mb-3 text-sm font-bold text-[#111827]">최근 품질점검</h2>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-500">점검 이력이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[#f1f5f9]">
          {rows.map((e) => {
            const badge = RESULT_BADGE[e.lastQualityResult ?? "unchecked"];
            return (
              <li key={e.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#111827]">{zoneName(e.zoneId)}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {e.currentProduct ?? "제품 미확인"} · {formatDateTime(e.lastInspectionAt!)}
                  </p>
                </div>
                <span className={clsx("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold", badge.className)}>
                  {badge.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
