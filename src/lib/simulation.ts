import { BASE_MONTHLY_QUANTITY, PAST_REFERENCE_QUANTITY, SimulationInputs } from "@/types";

export const SIMULATION_RANGES = {
  workingDays: { min: 15, max: 26, default: 22, step: 1, unit: "일" },
  avgLeadTimeDays: { min: 6, max: 16, default: 10, step: 1, unit: "일" },
  defectReworkImpactPct: { min: 0, max: 15, default: 5, step: 1, unit: "%" },
  equipmentUtilizationPct: { min: 60, max: 100, default: 85, step: 1, unit: "%" },
} as const;

export interface SimulationResult {
  expectedQuantity: number;
  vsCurrentDiff: number; // 현재 3,500개 대비
  vsPastDiff: number; // 과거 4,000개 대비
  progressTowardPastPct: number; // 목표(과거 4,000개) 달성률
  reachedPastTarget: boolean;
  mostInfluentialFactor: keyof SimulationInputs;
}

/**
 * 생산 시뮬레이션 계산 (요구사항 13번)
 * 예상 생산수량 = 3,500 × (가동일/22) × (10/평균제작기간) × (설비가동률/85) × ((100-불량재작업영향)/95)
 * 기본값 입력 시 반드시 3,500이 나와야 한다.
 */
export function calculateSimulation(inputs: SimulationInputs): SimulationResult {
  const raw =
    BASE_MONTHLY_QUANTITY *
    (inputs.workingDays / 22) *
    (10 / inputs.avgLeadTimeDays) *
    (inputs.equipmentUtilizationPct / 85) *
    ((100 - inputs.defectReworkImpactPct) / 95);

  const expectedQuantity = Math.round(raw);
  const vsCurrentDiff = expectedQuantity - BASE_MONTHLY_QUANTITY;
  const vsPastDiff = expectedQuantity - PAST_REFERENCE_QUANTITY;
  const progressTowardPastPct = Math.round((expectedQuantity / PAST_REFERENCE_QUANTITY) * 1000) / 10;
  const reachedPastTarget = expectedQuantity >= PAST_REFERENCE_QUANTITY;

  // 각 조건을 기본값 대비 편차 비율로 정규화해 가장 영향이 큰 조건 추정
  const deviations: Record<keyof SimulationInputs, number> = {
    workingDays: Math.abs(inputs.workingDays / 22 - 1),
    avgLeadTimeDays: Math.abs(10 / inputs.avgLeadTimeDays - 1),
    equipmentUtilizationPct: Math.abs(inputs.equipmentUtilizationPct / 85 - 1),
    defectReworkImpactPct: Math.abs((100 - inputs.defectReworkImpactPct) / 95 - 1),
  };
  const mostInfluentialFactor = (Object.keys(deviations) as (keyof SimulationInputs)[]).reduce((a, b) =>
    deviations[a] >= deviations[b] ? a : b
  );

  return {
    expectedQuantity,
    vsCurrentDiff,
    vsPastDiff,
    progressTowardPastPct,
    reachedPastTarget,
    mostInfluentialFactor,
  };
}

export const SIMULATION_FACTOR_LABELS: Record<keyof SimulationInputs, string> = {
  workingDays: "월 가동일",
  avgLeadTimeDays: "평균 제작기간",
  defectReworkImpactPct: "불량·재작업 영향",
  equipmentUtilizationPct: "설비 실가동률",
};
