"use client";

import { Traveler } from "@/types";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CUSTOMER_COLORS } from "@/data/travelers";
import { DataBadge } from "@/components/ui/DataBadge";

export function CustomerBreakdownChart({ travelers }: { travelers: Traveler[] }) {
  const counts = { "현대": 0, OEM: 0, "미분류": 0 } as Record<string, number>;
  travelers.forEach((t) => {
    counts[t.customer] = (counts[t.customer] ?? 0) + 1;
  });
  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-800">고객사별 구성</h2>
        <DataBadge reliability={travelers.some((t) => t.reliability === "sample") ? "sample" : "unverified"} />
      </div>
      <p className="mb-3 text-[11px] text-slate-400">현재 등록된 트레블러 {travelers.length}건 기준 (표본 {travelers.length}건)</p>
      {data.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400">등록된 트레블러가 없습니다.</p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                {data.map((d) => (
                  <Cell key={d.name} fill={CUSTOMER_COLORS[d.name] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
