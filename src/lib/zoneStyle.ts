import { FactoryZone } from "@/types";

export const ZONE_CATEGORY_STYLE: Record<FactoryZone["category"], { bg: string; accent: string; label: string }> = {
  warehouse: { bg: "bg-indigo-950/40", accent: "border-indigo-400/60", label: "창고" },
  inspection: { bg: "bg-cyan-950/40", accent: "border-cyan-400/60", label: "검사" },
  marking: { bg: "bg-teal-950/40", accent: "border-teal-400/60", label: "마킹" },
  grinding: { bg: "bg-sky-950/40", accent: "border-sky-400/60", label: "연마" },
  packaging: { bg: "bg-violet-950/40", accent: "border-violet-400/60", label: "포장" },
  quality: { bg: "bg-orange-950/40", accent: "border-orange-400/70", label: "품질" },
  end_process: { bg: "bg-blue-950/40", accent: "border-blue-400/60", label: "단부" },
  sheet_grinding: { bg: "bg-sky-950/40", accent: "border-sky-400/60", label: "시트연마" },
  pt_buffing: { bg: "bg-cyan-950/40", accent: "border-cyan-400/60", label: "PT·버핑" },
  correction: { bg: "bg-teal-950/40", accent: "border-teal-400/60", label: "교정" },
  auto_robot: { bg: "bg-fuchsia-950/40", accent: "border-fuchsia-400/60", label: "자동화" },
  sample_reagent: { bg: "bg-emerald-950/40", accent: "border-emerald-400/60", label: "시편·시약" },
  mt: { bg: "bg-emerald-950/40", accent: "border-emerald-400/60", label: "MT" },
  corridor: { bg: "bg-slate-800/30", accent: "border-transparent", label: "통로" },
  gate: { bg: "bg-slate-800/20", accent: "border-transparent", label: "출입구" },
};
