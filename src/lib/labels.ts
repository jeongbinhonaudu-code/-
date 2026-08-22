import { DataReliability, EquipmentStatus } from "@/types";

// 데이터 신뢰성 표시 (요구사항 17번) — 색상뿐 아니라 텍스트 라벨을 항상 병기
export const RELIABILITY_LABEL: Record<DataReliability, { text: string; className: string }> = {
  confirmed: { text: "확정", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  estimated: { text: "현장 추정", className: "bg-orange-100 text-orange-800 border-orange-300" },
  simulated: { text: "가정 결과", className: "bg-purple-100 text-purple-800 border-purple-300" },
  missing: { text: "입력 필요", className: "bg-slate-100 text-slate-600 border-slate-300" },
  unverified: { text: "검증 필요", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  sample: { text: "예시 데이터", className: "bg-sky-100 text-sky-800 border-sky-300" },
};

// 설비/구역 작업상태 색상 (요구사항 3번)
export const STATUS_LABEL: Record<EquipmentStatus, { text: string; dot: string; className: string }> = {
  running: { text: "작업 중", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  quality_check: { text: "품질 확인/재확인", dot: "bg-orange-500", className: "bg-orange-50 text-orange-800 border-orange-300" },
  nonconforming: { text: "부적합", dot: "bg-red-500", className: "bg-red-50 text-red-800 border-red-300" },
  waiting: { text: "작업 대기", dot: "bg-slate-400", className: "bg-slate-50 text-slate-700 border-slate-300" },
  neutral: { text: "일반 구역", dot: "bg-blue-400", className: "bg-blue-50 text-blue-800 border-blue-300" },
};

export const QUALITY_RESULT_LABEL: Record<string, { text: string; className: string }> = {
  ok: { text: "이상 없음", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  recheck: { text: "재확인 필요", className: "bg-orange-100 text-orange-800 border-orange-300" },
  nonconforming: { text: "부적합", className: "bg-red-100 text-red-800 border-red-300" },
  unchecked: { text: "점검 대기", className: "bg-slate-100 text-slate-600 border-slate-300" },
};
