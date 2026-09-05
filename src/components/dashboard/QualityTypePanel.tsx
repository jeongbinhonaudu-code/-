"use client";

import { useState } from "react";
import { QualityInspection } from "@/types";
import { DataBadge } from "@/components/ui/DataBadge";
import { RefreshCw } from "lucide-react";
import clsx from "clsx";

const TABS = ["전체", "주간", "월간"] as const;
const DOT_COLORS = ["#2563eb", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

// 참고 화면의 "Pollution Monitoring" 탭+목록 패널을 우리 데이터(검사종류별 발생 현황)로 재구성
export function QualityTypePanel({ inspections }: { inspections: QualityInspection[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("전체");
  const [now] = useState(() => Date.now());

  const withinDays = (iso: string, days: number) => now - new Date(iso).getTime() <= days * 86400000;

  const counts = new Map<string, { all: number; weekly: number; monthly: number }>();
  for (const insp of inspections) {
    for (const type of insp.inspectionType) {
      const c = counts.get(type) ?? { all: 0, weekly: 0, monthly: 0 };
      c.all += 1;
      if (withinDays(insp.inspectedAt, 7)) c.weekly += 1;
      if (withinDays(insp.inspectedAt, 30)) c.monthly += 1;
      counts.set(type, c);
    }
  }

  const rows = Array.from(counts.entries()).sort((a, b) => b[1].all - a[1].all);
  const valueKey = tab === "전체" ? "all" : tab === "주간" ? "weekly" : "monthly";
  const max = Math.max(...rows.map((r) => r[1][valueKey]), 1);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-[#111827]">검사종류별 발생 현황</h2>
          <DataBadge reliability="sample" />
        </div>
        <RefreshCw size={14} className="text-slate-400" />
      </div>

      <div className="mb-3 flex gap-1 rounded-lg bg-slate-50 p-1 text-xs">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "flex-1 rounded-md py-1.5 font-semibold transition-colors",
              tab === t ? "bg-white text-[#111827] shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-slate-500">점검 이력이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(([type, c], i) => (
            <li key={type}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full" style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                  {type}
                </span>
                <span className="font-bold text-[#111827]">{c[valueKey]}건</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(4, (c[valueKey] / max) * 100)}%`,
                    background: DOT_COLORS[i % DOT_COLORS.length],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
