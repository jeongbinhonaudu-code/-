"use client";

import { usePersistedList } from "@/lib/storage";
import { sampleTravelers } from "@/data/travelers";
import { Traveler } from "@/types";
import { MonthlyProductionChart } from "@/components/analysis/MonthlyProductionChart";
import { CustomerBreakdownChart } from "@/components/analysis/CustomerBreakdownChart";
import { ProductMaterialChart } from "@/components/analysis/ProductMaterialChart";
import { DataStatusCard } from "@/components/analysis/DataStatusCard";
import { LeadTimeAnalysis } from "@/components/analysis/LeadTimeAnalysis";
import { CauseCandidates } from "@/components/analysis/CauseCandidates";

export function AnalysisPageClient() {
  const { items } = usePersistedList<Traveler>("travelers", sampleTravelers);
  const travelers = items;

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-900">생산 분석</h1>
      <p className="mt-1 text-sm text-slate-500">
        실제값·현장 추정값·시뮬레이션값을 구분하여 표시합니다. 표본이 적은 항목은 표본 부족 경고가 함께 표시됩니다.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MonthlyProductionChart />
        <DataStatusCard travelers={travelers} />
        <CustomerBreakdownChart travelers={travelers} />
        <ProductMaterialChart travelers={travelers} />
      </div>

      <div className="mt-4">
        <LeadTimeAnalysis travelers={travelers} />
      </div>

      <div className="mt-4">
        <CauseCandidates />
      </div>
    </div>
  );
}
