"use client";

import { usePersistedList } from "@/lib/storage";
import { sampleQualityInspections } from "@/data/qualityInspections";
import { QualityInspection } from "@/types";
import { InspectionList } from "@/components/quality/InspectionList";
import { DataBadge } from "@/components/ui/DataBadge";

export function DefectsPageClient() {
  const { items } = usePersistedList<QualityInspection>("quality-inspections", sampleQualityInspections);
  const list = items;
  const issues = list.filter((i) => i.result !== "ok");
  const nonconformingCount = list.filter((i) => i.result === "nonconforming").length;
  const recheckCount = list.filter((i) => i.result === "recheck").length;
  const rate = list.length > 0 ? Math.round((issues.length / list.length) * 1000) / 10 : null;

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-900">불량·재작업</h1>
      <p className="mt-1 text-sm text-slate-500">
        품질 순회점검에서 기록된 재확인·부적합 이력을 모아 보여줍니다. 설비가동 로그·재작업 시간 연동 등 상세 분석은 3단계
        구현 예정입니다.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="전체 점검 건수" value={`${list.length}건`} />
        <Stat label="재확인 필요" value={`${recheckCount}건`} />
        <Stat label="부적합" value={`${nonconformingCount}건`} />
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
          <p className="text-[11px] text-slate-400">이상 발생률</p>
          <p className="text-lg font-bold text-slate-900">{rate != null ? `${rate}%` : "확인 필요"}</p>
          <DataBadge reliability={list.length < 20 ? "sample" : "confirmed"} className="mt-1" />
        </div>
      </div>

      <div className="mt-4">
        <InspectionList inspections={issues} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
