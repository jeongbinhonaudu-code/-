"use client";

import { useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { DataBadge } from "@/components/ui/DataBadge";
import { formatDateTime } from "@/lib/format";
import { Boxes, PackageSearch, AlertTriangle, ShieldAlert, ClipboardCheck, Clock } from "lucide-react";
import clsx from "clsx";

export function SummaryBar({ compact = false }: { compact?: boolean }) {
  const { equipment: equipmentList, overrides } = useEffectiveEquipment();

  const registeredEquipment = equipmentList.length;
  const inProgressProducts = new Set(
    equipmentList.filter((e) => e.currentProduct).map((e) => e.currentProduct)
  ).size;
  const needsRecheck = equipmentList.filter((e) => e.lastQualityResult === "recheck").length;
  const nonconforming = equipmentList.filter(
    (e) => e.lastQualityResult === "nonconforming" || e.status === "nonconforming"
  ).length;
  const notYetInspected = equipmentList.filter((e) => !e.lastInspectionAt).length;
  const lastUpdated = [
    ...equipmentList.map((e) => e.lastInspectionAt),
    ...overrides.map((o) => o.updatedAt),
  ]
    .filter((v): v is string => !!v)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  const cards = [
    { icon: Boxes, label: "등록설비 수", value: `${registeredEquipment}대` },
    { icon: PackageSearch, label: "현재 진행제품 수", value: `${inProgressProducts}종` },
    { icon: ClipboardCheck, label: "품질 확인 필요", value: `${needsRecheck}건`, warn: needsRecheck > 0 },
    { icon: ShieldAlert, label: "부적합 건수", value: `${nonconforming}건`, danger: nonconforming > 0 },
    { icon: AlertTriangle, label: "점검 예정 설비", value: `${notYetInspected}대`, warn: notYetInspected > 0 },
  ];

  return (
    <div className={clsx("grid gap-2", compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
      {cards.map((c) => (
        <div
          key={c.label}
          className={clsx(
            "flex items-center gap-2 rounded-xl border border-white/10 bg-[#101c33] shadow-sm",
            compact ? "px-2.5 py-1.5" : "gap-3 px-3 py-3"
          )}
        >
          <span
            className={clsx(
              "flex shrink-0 items-center justify-center rounded-lg",
              compact ? "h-7 w-7" : "h-9 w-9",
              c.danger ? "bg-red-500/15 text-red-300" : c.warn ? "bg-orange-500/15 text-orange-300" : "bg-sky-500/15 text-sky-300"
            )}
          >
            <c.icon size={compact ? 14 : 18} />
          </span>
          <div className="min-w-0">
            <p className={clsx("truncate text-slate-400", compact ? "text-[10px]" : "text-[11px]")}>{c.label}</p>
            <p className={clsx("font-bold leading-tight text-slate-100", compact ? "text-sm" : "text-lg")}>{c.value}</p>
          </div>
        </div>
      ))}
      <div
        className={clsx(
          "flex items-center gap-2 rounded-xl border border-white/10 bg-[#101c33] shadow-sm",
          compact ? "px-2.5 py-1.5" : "gap-3 px-3 py-3"
        )}
      >
        <span
          className={clsx(
            "flex shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400",
            compact ? "h-7 w-7" : "h-9 w-9"
          )}
        >
          <Clock size={compact ? 14 : 18} />
        </span>
        <div className="min-w-0">
          <p className={clsx("truncate text-slate-400", compact ? "text-[10px]" : "text-[11px]")}>마지막 데이터 갱신</p>
          {!compact && (
            <p className="text-xs font-bold leading-tight text-slate-100">
              {lastUpdated ? formatDateTime(lastUpdated) : "확인 필요"}
            </p>
          )}
          <DataBadge reliability={overrides.length > 0 ? "confirmed" : "sample"} className="mt-1" />
        </div>
      </div>
    </div>
  );
}
