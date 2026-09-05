"use client";

import { useSearchParams } from "next/navigation";
import { usePersistedList } from "@/lib/storage";
import { sampleQualityInspections } from "@/data/qualityInspections";
import { QualityInspection } from "@/types";
import { InspectionForm } from "@/components/quality/InspectionForm";
import { InspectionList } from "@/components/quality/InspectionList";
import { NextInspectionPanel } from "@/components/quality/NextInspectionPanel";
import { DataBadge } from "@/components/ui/DataBadge";

export function QualityPageClient() {
  const params = useSearchParams();
  const { items, add } = usePersistedList<QualityInspection>("quality-inspections", sampleQualityInspections);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-[#111827]">품질 순회점검</h1>
      <p className="mt-1 text-sm text-slate-400">
        현장 순회점검 결과를 기록하고 재확인·부적합 설비를 확인합니다. 입력한 점검 결과는{" "}
        <DataBadge reliability="confirmed" className="align-middle" /> 로 표시되며 이 브라우저에 저장됩니다.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InspectionForm
            onSubmit={add}
            defaultZoneId={params.get("zoneId") ?? undefined}
            defaultEquipmentId={params.get("equipmentId") ?? undefined}
            defaultProduct={params.get("product") ?? undefined}
          />
        </div>
        <div>
          <NextInspectionPanel inspections={items} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-slate-700">점검이력</h2>
        <InspectionList inspections={items} />
      </div>
    </div>
  );
}
