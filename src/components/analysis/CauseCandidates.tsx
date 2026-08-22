import { DataBadge } from "@/components/ui/DataBadge";

const CANDIDATES = [
  "제품 구성 변화 (고난이도/장기제품 비중)",
  "수주량 변동",
  "LOT 크기 변화",
  "설비가동률",
  "불량·재작업 발생률",
  "자재 대기시간",
  "인력 구성 변화 (경력자 이동 등 여러 요인 중 하나)",
];

const REQUIRED_DATA = [
  "실제 월별 출하·완료 실적 (트레블러 완료일 기준 집계)",
  "설비별 가동시간 로그",
  "불량·재작업 이력 전산 기록 (건수·원인·재작업 시간)",
  "LOT/공정별 정확한 대기·가공 시간 구분 기록",
  "손글씨 시작일·완료일의 원본 대조 검증 완료",
  "인력 배치·숙련도 변화 이력",
];

export function CauseCandidates() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200">원인 후보 (확인 필요)</h2>
          <DataBadge reliability="missing" />
        </div>
        <p className="mb-2 text-[11px] text-slate-400">
          생산량 변화의 원인은 아래 여러 요인이 복합적으로 작용했을 수 있으며, 현재 데이터만으로는 특정 요인(예: 경력자
          퇴사)을 확정 원인으로 단정할 수 없습니다.
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-400">
          {CANDIDATES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200">추가 필요자료</h2>
          <DataBadge reliability="missing" />
        </div>
        <p className="mb-2 text-[11px] text-slate-400">아래 자료가 확보되면 추정값을 실제 확정값으로 교체할 수 있습니다.</p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-400">
          {REQUIRED_DATA.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
