import { EquipmentStatus, FactoryZone } from "@/types";

// 카드 배경은 거의 바닥과 같은 톤으로 통일하고(칸마다 색이 다르면 "네모가 가득한"
// 느낌이 커짐), 테두리 색으로만 "현재 작업 상태"를 표시한다. 부적합만 예외적으로
// 살짝 더 진하게 표시해 눈에 띄게 한다.
// glow: 상태별로 은은하게 색이 도는 그림자 (검정 그림자 대신 배경색과 어울리는
// 톤을 써서 카드가 유리판처럼 살짝 떠 보이게 함 — "고급스러운" 재질감의 핵심)
export const STATUS_ZONE_STYLE: Record<EquipmentStatus, { bg: string; border: string; glow: string }> = {
  running: {
    bg: "bg-white/[0.025]",
    border: "border-emerald-400/50",
    glow: "shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_10px_24px_-16px_rgba(16,185,129,0.5)]",
  },
  quality_check: {
    bg: "bg-white/[0.025]",
    border: "border-orange-400/60",
    glow: "shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_10px_24px_-16px_rgba(251,146,60,0.5)]",
  },
  nonconforming: {
    bg: "bg-red-500/[0.07]",
    border: "border-red-500/70",
    glow: "shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_10px_26px_-14px_rgba(239,68,68,0.6)]",
  },
  waiting: {
    bg: "bg-white/[0.02]",
    border: "border-slate-500/30",
    glow: "shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_8px_20px_-16px_rgba(0,0,0,0.6)]",
  },
  neutral: {
    bg: "bg-white/[0.02]",
    border: "border-sky-400/20",
    glow: "shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_20px_-16px_rgba(56,189,248,0.35)]",
  },
};

// accent: 카드 좌측 강조선(카테고리 구분용, 좁은 4px 스트라이프) 배경색
export const ZONE_CATEGORY_STYLE: Record<FactoryZone["category"], { accent: string; label: string }> = {
  warehouse: { accent: "bg-indigo-400/70", label: "창고" },
  inspection: { accent: "bg-cyan-400/70", label: "검사" },
  marking: { accent: "bg-teal-400/70", label: "마킹" },
  grinding: { accent: "bg-sky-400/70", label: "연마" },
  packaging: { accent: "bg-violet-400/70", label: "포장" },
  quality: { accent: "bg-orange-400/70", label: "품질" },
  end_process: { accent: "bg-blue-400/70", label: "단부" },
  sheet_grinding: { accent: "bg-sky-400/70", label: "시트연마" },
  pt_buffing: { accent: "bg-cyan-400/70", label: "PT·버핑" },
  correction: { accent: "bg-teal-400/70", label: "교정" },
  auto_robot: { accent: "bg-fuchsia-400/70", label: "자동화" },
  sample_reagent: { accent: "bg-emerald-400/70", label: "시편·시약" },
  mt: { accent: "bg-emerald-400/70", label: "MT" },
  corridor: { accent: "bg-transparent", label: "통로" },
  gate: { accent: "bg-transparent", label: "출입구" },
  material: { accent: "bg-amber-400/70", label: "소재" },
  forging: { accent: "bg-rose-400/70", label: "단조" },
  heat_treatment: { accent: "bg-red-400/70", label: "열처리" },
  welding: { accent: "bg-orange-400/70", label: "용접" },
  lathe: { accent: "bg-indigo-400/60", label: "선반" },
  machining: { accent: "bg-cyan-400/60", label: "가공" },
  logistics: { accent: "bg-stone-400/60", label: "물류" },
};
