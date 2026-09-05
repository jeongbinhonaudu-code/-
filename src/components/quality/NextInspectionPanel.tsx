"use client";

import { useMemo, useState } from "react";
import { QualityInspection } from "@/types";
import { equipmentList } from "@/data/equipment";
import { zones } from "@/data/zones";
import { AlertCircle, Clock3 } from "lucide-react";

const STALE_DAYS = 3;

function zoneName(zoneId: string) {
  return zones.find((z) => z.id === zoneId)?.name ?? zoneId;
}

export function NextInspectionPanel({ inspections }: { inspections: QualityInspection[] }) {
  // 설비별 최근 점검시각만 메모이즈(순수 계산). 현재시각 기준 경과일수는
  // Date.now()가 렌더마다 달라질 수 있어 useMemo 밖에서 별도로 계산한다.
  const latestByEquipment = useMemo(() => {
    return equipmentList.map((eq) => {
      const liveTimes = inspections.filter((i) => i.equipmentId === eq.id).map((i) => i.inspectedAt);
      const latest = [eq.lastInspectionAt, ...liveTimes]
        .filter((v): v is string => !!v)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
      return { eq, latest };
    });
  }, [inspections]);

  // 지연 초기화(lazy initializer)로 "현재 시각"을 한 번만 고정해 렌더 순수성을 유지한다.
  const [now] = useState(() => Date.now());
  const rows = latestByEquipment.map(({ eq, latest }) => ({
    eq,
    latest,
    daysSince: latest ? (now - new Date(latest).getTime()) / 86400000 : null,
  }));

  const neverInspected = rows.filter((r) => !r.latest);
  const stale = rows
    .filter((r) => r.latest && r.daysSince != null && r.daysSince >= STALE_DAYS)
    .sort((a, b) => (b.daysSince ?? 0) - (a.daysSince ?? 0));

  const recommended = [...neverInspected, ...stale].slice(0, 6);

  return (
    <div className="space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-4">
      <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
        <Clock3 size={16} className="text-orange-500" /> 다음 순회점검 추천 대상
      </h2>
      {recommended.length === 0 ? (
        <p className="text-xs text-slate-400">모든 설비가 최근 점검되었습니다.</p>
      ) : (
        <ul className="space-y-1.5">
          {recommended.map(({ eq, latest, daysSince }) => (
            <li
              key={eq.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
            >
              <div>
                <p className="font-semibold text-slate-600">{eq.name}</p>
                <p className="text-[11px] text-slate-400">{zoneName(eq.zoneId)}</p>
              </div>
              {!latest ? (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  <AlertCircle size={11} /> 미점검
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                  {Math.floor(daysSince ?? 0)}일 경과
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="border-t border-[#f1f5f9] pt-2 text-[11px] text-slate-400">
        전체 {equipmentList.length}대 중 미점검 {neverInspected.length}대 · {STALE_DAYS}일 이상 경과 {stale.length}대
      </p>
    </div>
  );
}
