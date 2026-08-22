"use client";

import { usePersistedList } from "@/lib/storage";
import { sampleQualityInspections } from "@/data/qualityInspections";
import { sampleTravelers } from "@/data/travelers";
import { QualityInspection, Traveler } from "@/types";
import { useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { zones as allZones } from "@/data/zones";
import { downloadCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { Download, Printer } from "lucide-react";

function zoneName(zoneId: string) {
  return allZones.find((z) => z.id === zoneId)?.name ?? zoneId;
}

export function ReportsPageClient() {
  const { items: inspections } = usePersistedList<QualityInspection>(
    "quality-inspections",
    sampleQualityInspections
  );
  const { items: travelers } = usePersistedList<Traveler>("travelers", sampleTravelers);
  const { equipment: equipmentList } = useEffectiveEquipment();

  const cards = [
    {
      title: "품질 순회점검 이력",
      desc: `현재 ${inspections.length}건`,
      onExport: () =>
        downloadCsv(
          "품질점검이력.csv",
          inspections.map((i) => ({
            점검시각: formatDateTime(i.inspectedAt),
            구역: zoneName(i.zoneId),
            제품: i.product ?? "",
            트레블러: i.travelerNo ?? "",
            검사종류: i.inspectionType.join("/"),
            수량: i.inspectedQuantity ?? "",
            결과: i.result,
            점검자: i.inspector,
            특이사항: i.note ?? "",
          }))
        ),
    },
    {
      title: "트레블러 목록",
      desc: `현재 ${travelers.length}건`,
      onExport: () =>
        downloadCsv(
          "트레블러목록.csv",
          travelers.map((t) => ({
            파일명: t.fileName,
            트레블러번호: t.travelerNo,
            제품명: t.productName ?? "",
            고객사: t.customer,
            재질: t.material ?? "",
            시작일: t.startDate ?? "",
            완료일: t.endDate ?? "",
            검증여부: t.ocrVerified ? "검증완료" : "검증필요",
          }))
        ),
    },
    {
      title: "설비현황",
      desc: `등록설비 ${equipmentList.length}대`,
      onExport: () =>
        downloadCsv(
          "설비현황.csv",
          equipmentList.map((e) => ({
            설비명: e.name,
            구역: zoneName(e.zoneId),
            상태: e.status,
            현재제품: e.currentProduct ?? "",
            수량: e.currentQuantity ?? "",
          }))
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-[1000px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-100">보고서</h1>
      <p className="mt-1 text-sm text-slate-400">현재 데이터를 CSV로 내보내거나 화면을 인쇄(PDF 저장)할 수 있습니다.</p>

      <div className="mt-4 space-y-3">
        {cards.map((c) => (
          <div key={c.title} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#101c33] p-4">
            <div>
              <p className="text-sm font-bold text-slate-200">{c.title}</p>
              <p className="text-xs text-slate-400">{c.desc}</p>
            </div>
            <button
              onClick={c.onExport}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-500"
            >
              <Download size={14} /> CSV 내보내기
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#101c33] p-4">
          <div>
            <p className="text-sm font-bold text-slate-200">현재 화면 인쇄 / PDF 저장</p>
            <p className="text-xs text-slate-400">브라우저 인쇄 기능으로 PDF 저장이 가능합니다.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#101c33] px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/5"
          >
            <Printer size={14} /> 인쇄
          </button>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        서식이 지정된 정식 PDF 보고서 자동생성 기능은 2단계(서버·DB 연동) 구현 예정입니다.
      </p>
    </div>
  );
}
