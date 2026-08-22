"use client";

import { useMemo, useState } from "react";
import { useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { zones as allZones } from "@/data/zones";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QualityResultBadge } from "@/components/ui/QualityResultBadge";
import { downloadCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { Download, Search } from "lucide-react";

function zoneName(zoneId: string) {
  return allZones.find((z) => z.id === zoneId)?.name ?? zoneId;
}

export default function EquipmentPage() {
  const { equipment: equipmentList } = useEffectiveEquipment();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return equipmentList.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return e.name.toLowerCase().includes(q) || zoneName(e.zoneId).toLowerCase().includes(q);
    });
  }, [equipmentList, query, statusFilter]);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-100">설비현황</h1>
          <p className="mt-1 text-sm text-slate-400">등록된 설비 {equipmentList.length}대의 현재 상태를 한눈에 확인합니다.</p>
        </div>
        <button
          onClick={() =>
            downloadCsv(
              "설비현황.csv",
              filtered.map((e) => ({
                구역: zoneName(e.zoneId),
                설비명: e.name,
                대수: e.count,
                상태: e.status,
                현재제품: e.currentProduct ?? "",
                수량: e.currentQuantity ?? "",
                최근점검: e.lastInspectionAt ? formatDateTime(e.lastInspectionAt) : "",
                최근품질결과: e.lastQualityResult ?? "",
              }))
            )
          }
          className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#101c33] px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5"
        >
          <Download size={14} /> CSV 내보내기
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#101c33] p-3">
        <div className="flex flex-1 min-w-[180px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
          <Search size={14} className="text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="설비명·구역 검색" className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200">
          <option value="all">전체 상태</option>
          <option value="running">작업 중</option>
          <option value="quality_check">품질 확인/재확인</option>
          <option value="nonconforming">부적합</option>
          <option value="waiting">작업 대기</option>
          <option value="neutral">일반 구역</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#101c33]">
        <table className="w-full min-w-[900px] text-xs">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <Th>구역</Th>
              <Th>설비명</Th>
              <Th>대수</Th>
              <Th>상태</Th>
              <Th>현재 제품</Th>
              <Th>수량</Th>
              <Th>최근 점검</Th>
              <Th>최근 품질결과</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((e) => (
              <tr key={e.id}>
                <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-300">{zoneName(e.zoneId)}</td>
                <td className="whitespace-nowrap px-3 py-2">{e.name}</td>
                <td className="px-3 py-2">{e.count}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={e.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">{e.currentProduct ?? "-"}</td>
                <td className="px-3 py-2">{e.currentQuantity ?? "-"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                  {e.lastInspectionAt ? formatDateTime(e.lastInspectionAt) : "미점검"}
                </td>
                <td className="px-3 py-2">
                  <QualityResultBadge result={e.lastQualityResult ?? "unchecked"} />
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
