import { MonthlyProductionPoint, PAST_REFERENCE_QUANTITY, BASE_MONTHLY_QUANTITY } from "@/types";

/**
 * 월 생산수량 (요구사항 12번) — 현장 추정 기준 · 실제 생산실적 확인 전.
 * 실제 트레블러/출하실적을 기반으로 한 월별 상세 추이 데이터는 아직 없으므로
 * 두 개의 기준점(약 2년 전 / 현재)만 "현장 추정"으로 제공한다.
 * 임의로 중간 월 데이터를 만들어내지 않는다.
 */
export const monthlyProductionReference: MonthlyProductionPoint[] = [
  { month: "2024-08(약 2년 전)", quantity: PAST_REFERENCE_QUANTITY, reliability: "estimated" },
  { month: "2026-08(현재)", quantity: BASE_MONTHLY_QUANTITY, reliability: "estimated" },
];

export const MONTHLY_PRODUCTION_NOTE =
  "현장 추정 기준 · 실제 생산실적 확인 전 (월별 상세 추이는 실제 출하·완료 실적 입력 후 제공)";
