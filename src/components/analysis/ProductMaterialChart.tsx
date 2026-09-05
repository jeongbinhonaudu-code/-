"use client";

import { Traveler } from "@/types";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataBadge } from "@/components/ui/DataBadge";

export function ProductMaterialChart({ travelers }: { travelers: Traveler[] }) {
  const productCounts = new Map<string, number>();
  travelers.forEach((t) => {
    const key = t.productName || "미확인";
    productCounts.set(key, (productCounts.get(key) ?? 0) + 1);
  });
  const data = [...productCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const materialCounts = new Map<string, number>();
  travelers.forEach((t) => {
    const key = t.material || "미확인";
    materialCounts.set(key, (materialCounts.get(key) ?? 0) + 1);
  });

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-700">제품·재질별 구성</h2>
        <DataBadge reliability="unverified" />
      </div>
      <p className="mb-3 text-[11px] text-slate-400">등록 트레블러 기준 제품 종류 {productCounts.size}종 · 재질 {materialCounts.size}종</p>
      {data.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400">등록된 트레블러가 없습니다.</p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }}
                labelStyle={{ color: "#111827" }}
                itemStyle={{ color: "#111827" }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
