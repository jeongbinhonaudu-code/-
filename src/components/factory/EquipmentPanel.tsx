"use client";

import Link from "next/link";
import { FactoryZone } from "@/types";
import { getEquipmentByZone } from "@/data/equipment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QualityResultBadge } from "@/components/ui/QualityResultBadge";
import { DataBadge } from "@/components/ui/DataBadge";
import { PhotoGallery } from "@/components/factory/PhotoGallery";
import { formatDateTime } from "@/lib/format";
import { X, ClipboardList } from "lucide-react";

export function EquipmentPanel({ zone, onClose }: { zone: FactoryZone; onClose: () => void }) {
  const equipment = getEquipmentByZone(zone.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{zone.name}</h2>
            {zone.description && <p className="mt-0.5 text-xs text-slate-500">{zone.description}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 divide-y divide-slate-100">
          {equipment.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-400">등록된 설비 정보가 없습니다. (입력 필요)</p>
          )}
          {equipment.map((eq) => (
            <div key={eq.id} className="space-y-3 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{eq.name}</h3>
                <StatusBadge status={eq.status} />
              </div>

              <PhotoGallery equipmentId={eq.id} equipmentName={eq.name} />

              <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 rounded-lg bg-slate-50 p-3 text-xs">
                <Row label="현재 제품" value={eq.currentProduct ?? "확인 필요"} />
                <Row label="트레블러 번호" value={eq.currentTravelerNo ?? "확인 필요"} />
                <Row
                  label="생산 수량"
                  value={eq.currentQuantity != null ? `${eq.currentQuantity}개` : "확인 필요"}
                  extra={eq.quantityReliability ? <DataBadge reliability={eq.quantityReliability} /> : undefined}
                />
                <Row
                  label="최근 품질결과"
                  value={undefined}
                  extra={<QualityResultBadge result={eq.lastQualityResult ?? "unchecked"} />}
                />
                <Row
                  label="최근 점검시각"
                  value={eq.lastInspectionAt ? formatDateTime(eq.lastInspectionAt) : "점검이력 없음"}
                />
                {eq.note && <Row label="비고" value={eq.note} />}
              </dl>

              <Link
                href={`/quality?zoneId=${zone.id}&equipmentId=${eq.id}&product=${encodeURIComponent(eq.currentProduct ?? "")}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
              >
                <ClipboardList size={14} /> 품질점검 입력
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, extra }: { label: string; value?: string; extra?: React.ReactNode }) {
  return (
    <>
      <dt className="text-slate-400">{label}</dt>
      <dd className="flex items-center justify-end gap-1 text-right font-medium text-slate-700">
        {value}
        {extra}
      </dd>
    </>
  );
}
