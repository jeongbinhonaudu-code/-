"use client";

import { Traveler } from "@/types";
import { DataBadge } from "@/components/ui/DataBadge";

export function DataStatusCard({ travelers }: { travelers: Traveler[] }) {
  const total = travelers.length;
  const verified = travelers.filter((t) => t.ocrVerified).length;
  const included = travelers.filter((t) => t.includedInAnalysis).length;
  const missingDates = travelers.filter((t) => !t.startDate || !t.endDate).length;

  return (
    <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
      <h2 className="mb-1 text-sm font-bold text-slate-200">등록자료 현황 · 데이터 검증상태</h2>
      <p className="mb-3 text-[11px] text-slate-400">시스템에 업로드된 트레블러 기준 (예시 데이터 포함)</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="업로드 건수" value={`${total}건`} />
        <Stat label="검증완료" value={`${verified}건`} badge={<DataBadge reliability="confirmed" />} />
        <Stat label="검증 필요" value={`${total - verified}건`} badge={<DataBadge reliability="unverified" />} />
        <Stat label="분석대상 포함" value={`${included}건`} />
      </div>
      {missingDates > 0 && (
        <p className="mt-2 text-[11px] text-orange-600">시작일 또는 완료일이 입력되지 않은 트레블러 {missingDates}건 — 입력 필요</p>
      )}
    </div>
  );
}

function Stat({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <div className="flex items-center gap-1.5">
        <p className="text-base font-bold text-slate-200">{value}</p>
        {badge}
      </div>
    </div>
  );
}
