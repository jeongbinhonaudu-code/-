"use client";

import { useMemo, useState } from "react";
import { QualityInspection } from "@/types";
import { zones } from "@/data/zones";
import { QualityResultBadge } from "@/components/ui/QualityResultBadge";
import { DataBadge } from "@/components/ui/DataBadge";
import { Search } from "lucide-react";
import { formatDateTime } from "@/lib/format";

function zoneName(zoneId: string) {
  return zones.find((z) => z.id === zoneId)?.name ?? zoneId;
}

export function InspectionList({ inspections }: { inspections: QualityInspection[] }) {
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return inspections
      .filter((i) => (resultFilter === "all" ? true : i.result === resultFilter))
      .filter((i) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          (i.product ?? "").toLowerCase().includes(q) ||
          (i.travelerNo ?? "").toLowerCase().includes(q) ||
          i.inspector.toLowerCase().includes(q) ||
          zoneName(i.zoneId).toLowerCase().includes(q)
        );
      })
      .filter((i) => (from ? i.inspectedAt >= from : true))
      .filter((i) => (to ? i.inspectedAt <= to + "T23:59:59" : true))
      .sort((a, b) => new Date(b.inspectedAt).getTime() - new Date(a.inspectedAt).getTime());
  }, [inspections, query, resultFilter, from, to]);

  // 동일 불량 반복 확인: 같은 설비에서 부적합/재확인이 2회 이상
  const repeatIssueZones = useMemo(() => {
    const counts = new Map<string, number>();
    inspections
      .filter((i) => i.result !== "ok")
      .forEach((i) => counts.set(i.zoneId, (counts.get(i.zoneId) ?? 0) + 1));
    return [...counts.entries()].filter(([, c]) => c >= 2);
  }, [inspections]);

  return (
    <div className="space-y-3">
      {repeatIssueZones.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <p className="font-bold">동일 구역 반복 이상 감지</p>
          <p className="mt-1">
            {repeatIssueZones.map(([zoneId, c]) => `${zoneName(zoneId)}(${c}회)`).join(", ")} — 원인 확인이 필요합니다.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-1 min-w-[180px] items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1.5">
          <Search size={14} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제품·트레블러·점검자·구역 검색"
            className="w-full text-xs outline-none"
          />
        </div>
        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
        >
          <option value="all">전체 결과</option>
          <option value="ok">이상 없음</option>
          <option value="recheck">재확인 필요</option>
          <option value="nonconforming">부적합</option>
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs" />
        <span className="text-xs text-slate-400">~</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-xs">
          <thead className="sticky top-0 bg-slate-50 text-slate-500">
            <tr>
              <Th>점검시각</Th>
              <Th>구역</Th>
              <Th>제품</Th>
              <Th>트레블러/LOT</Th>
              <Th>검사종류</Th>
              <Th>수량</Th>
              <Th>결과</Th>
              <Th>점검자</Th>
              <Th>특이사항</Th>
              <Th>신뢰성</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-slate-400">
                  조건에 맞는 점검 이력이 없습니다.
                </td>
              </tr>
            )}
            {filtered.map((i) => (
              <tr key={i.id} className={i.result === "nonconforming" ? "bg-red-50/60" : i.result === "recheck" ? "bg-orange-50/60" : ""}>
                <td className="whitespace-nowrap px-3 py-2 text-slate-500">{formatDateTime(i.inspectedAt)}</td>
                <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-700">{zoneName(i.zoneId)}</td>
                <td className="whitespace-nowrap px-3 py-2">{i.product ?? "-"}</td>
                <td className="whitespace-nowrap px-3 py-2">{i.travelerNo ?? "-"}</td>
                <td className="px-3 py-2">{i.inspectionType.join(", ")}</td>
                <td className="px-3 py-2">{i.inspectedQuantity ?? "-"}</td>
                <td className="px-3 py-2">
                  <QualityResultBadge result={i.result} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">{i.inspector}</td>
                <td className="max-w-[180px] truncate px-3 py-2 text-slate-500" title={i.note}>
                  {i.note ?? "-"}
                </td>
                <td className="px-3 py-2">
                  <DataBadge reliability={i.reliability} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">{children}</th>;
}
