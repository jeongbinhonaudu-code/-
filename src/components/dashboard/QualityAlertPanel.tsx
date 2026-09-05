"use client";

import Link from "next/link";
import { Equipment, FactoryZone } from "@/types";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import clsx from "clsx";

type Tier = "critical" | "warning" | "info";

interface AlertItem {
  tier: Tier;
  zoneName: string;
  zoneId: string;
  title: string;
  detail: string;
}

const TIER_STYLE: Record<Tier, { label: string; icon: typeof AlertOctagon; className: string; iconClass: string }> = {
  critical: {
    label: "CRITICAL",
    icon: AlertOctagon,
    className: "border-red-200 bg-red-50",
    iconClass: "bg-red-100 text-red-600",
  },
  warning: {
    label: "WARNING",
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50",
    iconClass: "bg-amber-100 text-amber-600",
  },
  info: {
    label: "INFO",
    icon: Info,
    className: "border-blue-200 bg-blue-50",
    iconClass: "bg-blue-100 text-blue-600",
  },
};

// 부적합=CRITICAL, 재확인 필요=WARNING, 점검 이력 없음=INFO 로 3단계 분류
export function QualityAlertPanel({ equipment, zones }: { equipment: Equipment[]; zones: FactoryZone[] }) {
  const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;

  const critical: AlertItem[] = equipment
    .filter((e) => e.lastQualityResult === "nonconforming" || e.status === "nonconforming")
    .map((e) => ({
      tier: "critical",
      zoneName: zoneName(e.zoneId),
      zoneId: e.zoneId,
      title: `${zoneName(e.zoneId)} · ${e.currentProduct ?? "제품 미확인"}`,
      detail: e.note ?? "부적합 판정 — 원인 확인 필요",
    }));

  const warning: AlertItem[] = equipment
    .filter((e) => e.lastQualityResult === "recheck")
    .map((e) => ({
      tier: "warning",
      zoneName: zoneName(e.zoneId),
      zoneId: e.zoneId,
      title: `${zoneName(e.zoneId)} · ${e.currentProduct ?? "제품 미확인"}`,
      detail: "재확인 필요 판정",
    }));

  const info: AlertItem[] = equipment
    .filter((e) => !e.lastInspectionAt)
    .map((e) => ({
      tier: "info",
      zoneName: zoneName(e.zoneId),
      zoneId: e.zoneId,
      title: zoneName(e.zoneId),
      detail: "순회점검 이력 없음",
    }));

  const items = [...critical, ...warning, ...info].slice(0, 6);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111827]">품질 ALERT</h2>
        <span className="text-[11px] text-slate-400">중요도 순</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500">현재 확인이 필요한 이상 항목이 없습니다.</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto">
          {items.map((it, i) => {
            const cfg = TIER_STYLE[it.tier];
            return (
              <li key={i} className={clsx("rounded-lg border p-2.5", cfg.className)}>
                <div className="flex items-start gap-2">
                  <span className={clsx("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md", cfg.iconClass)}>
                    <cfg.icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-wide text-slate-500">{cfg.label}</p>
                    <p className="truncate text-xs font-semibold text-[#111827]">{it.title}</p>
                    <p className="truncate text-[11px] text-slate-500">{it.detail}</p>
                  </div>
                  <Link
                    href={`/quality?zoneId=${it.zoneId}`}
                    className="shrink-0 self-center text-[11px] font-semibold text-[#2563eb] hover:underline"
                  >
                    확인하기 &gt;
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
