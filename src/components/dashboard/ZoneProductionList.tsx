"use client";

import { Equipment, FactoryZone } from "@/types";
import { ZONE_CATEGORY_STYLE } from "@/lib/zoneStyle";
import { DataBadge } from "@/components/ui/DataBadge";

// 참고 화면의 "Plant A/B/C/D" 진행률 목록을 우리 데이터(구역 카테고리별 진행 수량)로 재구성
export function ZoneProductionList({ equipment, zones }: { equipment: Equipment[]; zones: FactoryZone[] }) {
  const categoryById = new Map(zones.map((z) => [z.id, z.category]));

  const totals = new Map<string, number>();
  for (const e of equipment) {
    if (!e.currentQuantity) continue;
    const category = categoryById.get(e.zoneId);
    if (!category) continue;
    const label = ZONE_CATEGORY_STYLE[category].label;
    totals.set(label, (totals.get(label) ?? 0) + e.currentQuantity);
  }

  const rows = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = Math.max(...rows.map((r) => r[1]), 1);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-bold text-slate-500">구역별 진행 수량</h3>
        <DataBadge reliability="sample" />
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-400">진행 중인 수량 데이터가 없습니다.</p>
      ) : (
        rows.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">{label}</span>
              <span className="font-bold text-[#111827]">{value.toLocaleString()}개</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#2563eb]"
                style={{ width: `${Math.max(4, (value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
