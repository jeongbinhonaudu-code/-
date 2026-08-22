"use client";

import { equipmentList } from "@/data/equipment";
import { getZonesByFactory } from "@/data/zones";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataBadge } from "@/components/ui/DataBadge";
import { classifyCustomer } from "@/lib/classify";

const allZones = [...getZonesByFactory("factory1"), ...getZonesByFactory("factory2")];
function zoneName(zoneId: string) {
  return allZones.find((z) => z.id === zoneId)?.name ?? zoneId;
}

export default function ProductsPage() {
  const inProgress = equipmentList.filter((e) => e.currentProduct);
  const byProduct = new Map<string, typeof inProgress>();
  inProgress.forEach((e) => {
    const key = e.currentProduct!;
    if (!byProduct.has(key)) byProduct.set(key, []);
    byProduct.get(key)!.push(e);
  });

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-900">진행제품</h1>
      <p className="mt-1 text-sm text-slate-500">현재 공정에서 진행 중인 제품과 위치별 수량입니다.</p>
      <div className="mt-2">
        <DataBadge reliability="sample" />
        <span className="ml-2 text-xs text-slate-400">예시 데이터 — 실제 생산관리 입력 연동 전까지 시연용입니다.</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {[...byProduct.entries()].map(([product, items]) => {
          const totalQty = items.reduce((sum, i) => sum + (i.currentQuantity ?? 0), 0);
          return (
            <div key={product} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">{product.replace("예시) ", "")}</h2>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  {classifyCustomer(product.replace("예시) ", ""))}
                </span>
              </div>
              <p className="mb-2 text-xs text-slate-400">총 진행수량 {totalQty}개 (표본 {items.length}개 설비)</p>
              <ul className="space-y-1.5">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs">
                    <span>
                      {zoneName(i.zoneId)} · {i.name}
                    </span>
                    <span className="flex items-center gap-2">
                      {i.currentQuantity}개 <StatusBadge status={i.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
