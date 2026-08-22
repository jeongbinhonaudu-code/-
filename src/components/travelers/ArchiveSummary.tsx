import { TRAVELER_ARCHIVE_SUMMARY } from "@/data/travelers";
import { DataBadge } from "@/components/ui/DataBadge";

export function ArchiveSummary() {
  const s = TRAVELER_ARCHIVE_SUMMARY;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-800">보유 자료 현황 (제공 자료 기준)</h2>
        <DataBadge reliability="confirmed" />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <Stat label="PDF 파일 수" value={`${s.totalPdfFiles}개`} />
        <Stat label="전체 페이지" value={`${s.totalPages}p`} />
        <Stat label="생산 건 (트레블러 기준)" value={`${s.totalProductionCases}건`} />
        <Stat label="자료 기간" value={`${s.periodStart} ~ ${s.periodEnd}`} />
        <Stat label="제품 종류" value={`${s.productTypeCount}종`} />
        <Stat label="재질·구분" value={`${s.materialTypeCount}종`} />
        <Stat label="현대 / OEM / 미분류" value={`${s.customerBreakdown["현대"]} / ${s.customerBreakdown.OEM} / ${s.customerBreakdown["미분류"]}`} />
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        위 수치는 사용자가 보유한 원본 PDF 자료의 집계값이며, 개별 34개 PDF 원본은 아직 시스템에 업로드되지 않았습니다.
        아래 목록은 업로드·시연용 예시이며 위 집계와 별도로 관리됩니다.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}
