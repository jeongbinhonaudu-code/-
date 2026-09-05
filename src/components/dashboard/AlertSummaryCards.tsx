"use client";

import { Equipment } from "@/types";
import { formatDateTime } from "@/lib/format";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import clsx from "clsx";

// 참고 화면의 "Energy Alert" 3카드 구성을 우리 품질 이상 3단계(부적합/재확인/미점검)로 재구성
export function AlertSummaryCards({ equipment }: { equipment: Equipment[] }) {
  const critical = equipment.filter((e) => e.lastQualityResult === "nonconforming" || e.status === "nonconforming");
  const warning = equipment.filter((e) => e.lastQualityResult === "recheck");
  const info = equipment.filter((e) => !e.lastInspectionAt);

  const withTimes = (list: Equipment[]) => {
    const times = list.map((e) => e.lastInspectionAt).filter((v): v is string => !!v);
    if (times.length === 0) return null;
    const sorted = [...times].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return { start: sorted[0], end: sorted[sorted.length - 1] };
  };

  const cards = [
    {
      icon: AlertOctagon,
      label: "부적합",
      sub: "발생 이력",
      count: critical.length,
      className: "text-red-600 bg-red-50",
      times: withTimes(critical),
    },
    {
      icon: AlertTriangle,
      label: "재확인 필요",
      sub: "발생 이력",
      count: warning.length,
      className: "text-amber-600 bg-amber-50",
      times: withTimes(warning),
    },
    {
      icon: Info,
      label: "미점검",
      sub: "현재 상태",
      count: info.length,
      className: "text-blue-600 bg-blue-50",
      times: null,
    },
  ];

  return (
    <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <span className={clsx("flex h-8 w-8 items-center justify-center rounded-lg", c.className)}>
            <c.icon size={16} />
          </span>
          <p className="mt-2 text-sm font-bold text-[#111827]">{c.label}</p>
          <p className="text-[11px] text-slate-500">{c.sub}</p>
          <p className="mt-1 text-2xl font-extrabold text-[#111827]">{c.count}건</p>
          <div className="mt-auto space-y-1 pt-2 text-[10px]">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> 최초
              </span>
              <span className="font-medium text-slate-700">{c.times ? formatDateTime(c.times.start) : "-"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" /> 최근
              </span>
              <span className="font-medium text-slate-700">{c.times ? formatDateTime(c.times.end) : "-"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
