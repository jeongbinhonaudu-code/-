import { EquipmentStatus, FactoryZone } from "@/types";

// 라이트 테마 카드: 흰 배경 + 옅은 테두리 + 아주 약한 그림자가 기본이고,
// 상태 색상만 명확하게 구분한다 (정상=Blue 작업중, 주의=Amber, NG=Red, 대기=Gray).
export const STATUS_ZONE_STYLE: Record<EquipmentStatus, { bg: string; border: string; glow: string }> = {
  running: {
    bg: "bg-blue-50/60",
    border: "border-blue-300",
    glow: "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  },
  quality_check: {
    bg: "bg-amber-50/70",
    border: "border-amber-300",
    glow: "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  },
  nonconforming: {
    bg: "bg-red-50/80",
    border: "border-red-400",
    glow: "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  },
  waiting: {
    bg: "bg-white",
    border: "border-[#e5e7eb]",
    glow: "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  },
  neutral: {
    bg: "bg-white",
    border: "border-[#e5e7eb]",
    glow: "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  },
};

// accent: 카드 좌측 강조선(카테고리 구분용, 좁은 4px 스트라이프) 배경색
export const ZONE_CATEGORY_STYLE: Record<FactoryZone["category"], { accent: string; label: string }> = {
  warehouse: { accent: "bg-indigo-400", label: "창고" },
  inspection: { accent: "bg-cyan-500", label: "검사" },
  marking: { accent: "bg-teal-500", label: "마킹" },
  grinding: { accent: "bg-sky-500", label: "연마" },
  packaging: { accent: "bg-violet-400", label: "포장" },
  quality: { accent: "bg-orange-400", label: "품질" },
  end_process: { accent: "bg-blue-400", label: "단부" },
  sheet_grinding: { accent: "bg-sky-500", label: "시트연마" },
  pt_buffing: { accent: "bg-cyan-500", label: "PT·버핑" },
  correction: { accent: "bg-teal-500", label: "교정" },
  auto_robot: { accent: "bg-fuchsia-400", label: "자동화" },
  sample_reagent: { accent: "bg-emerald-500", label: "시편·시약" },
  mt: { accent: "bg-emerald-500", label: "MT" },
  corridor: { accent: "bg-transparent", label: "통로" },
  gate: { accent: "bg-transparent", label: "출입구" },
  material: { accent: "bg-amber-500", label: "소재" },
  forging: { accent: "bg-rose-400", label: "단조" },
  heat_treatment: { accent: "bg-red-400", label: "열처리" },
  welding: { accent: "bg-orange-400", label: "용접" },
  lathe: { accent: "bg-indigo-400", label: "선반" },
  machining: { accent: "bg-cyan-500", label: "가공" },
  logistics: { accent: "bg-stone-400", label: "물류" },
};
