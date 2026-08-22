"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyProductionReference, MONTHLY_PRODUCTION_NOTE } from "@/data/monthlyProduction";
import { DataBadge } from "@/components/ui/DataBadge";

export function MonthlyProductionChart() {
  const data = monthlyProductionReference.map((p) => ({ name: p.month, quantity: p.quantity }));
  const decreasePct =
    (((data[1]?.quantity ?? 0) - (data[0]?.quantity ?? 0)) / (data[0]?.quantity || 1)) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-800">월 생산수량 변화</h2>
        <DataBadge reliability="estimated" />
      </div>
      <p className="mb-3 text-[11px] text-slate-400">{MONTHLY_PRODUCTION_NOTE}</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}개`, "생산수량(추정)"]} />
            <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={idx === 0 ? "#94a3b8" : "#f59e0b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        추정 변화: {Math.round((data[1]?.quantity ?? 0) - (data[0]?.quantity ?? 0))}개 ({decreasePct.toFixed(1)}%) · 두
        기준점 사이의 월별 상세 추이는 <b>확인 필요</b>합니다.
      </p>
    </div>
  );
}
