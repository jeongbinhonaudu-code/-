"use client";

import Link from "next/link";
import { zones } from "@/data/zones";
import { useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { usePersistedList } from "@/lib/storage";
import { sampleQualityInspections } from "@/data/qualityInspections";
import { QualityInspection } from "@/types";
import { SummaryBar } from "@/components/layout/SummaryBar";
import { FactoryMap } from "@/components/factory/FactoryMap";
import { MonthlyProductionChart } from "@/components/analysis/MonthlyProductionChart";
import { QualityGauge } from "@/components/dashboard/QualityGauge";
import { ZoneProductionList } from "@/components/dashboard/ZoneProductionList";
import { QualityTypePanel } from "@/components/dashboard/QualityTypePanel";
import { AlertSummaryCards } from "@/components/dashboard/AlertSummaryCards";
import { RecentQualityChecks } from "@/components/dashboard/RecentQualityChecks";
import { DataBadge } from "@/components/ui/DataBadge";

export function DashboardHome() {
  const { equipment } = useEffectiveEquipment();
  const { items: inspections } = usePersistedList<QualityInspection>("quality-inspections", sampleQualityInspections);

  const judged = equipment.filter((e) => e.lastQualityResult && e.lastQualityResult !== "unchecked");
  const passCount = judged.filter((e) => e.lastQualityResult === "ok").length;
  const passPct = judged.length > 0 ? (passCount / judged.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111827]">
          <span className="mr-2 text-[#2563eb]">AI</span>공정·품질 통합 관제
        </h1>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/factory" label="공장 조감도" active />
          <QuickLink href="/quality" label="품질점검" />
          <QuickLink href="/travelers" label="트레블러" />
          <QuickLink href="/analysis" label="생산 분석" />
          <QuickLink href="/simulation" label="시뮬레이션" accent />
        </div>
      </div>

      <SummaryBar />

      <div className="mt-4 flex items-center gap-2">
        <DataBadge reliability="sample" />
        <p className="text-xs text-slate-500">
          현재 화면의 제품·수량·상태 값은 시연용 예시 데이터입니다. 실제 데이터 연동 전까지 실제값처럼 사용하지 마세요.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_320px]">
        {/* 좌측: 품질 합격률 게이지 + 구역별 진행 수량 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111827]">품질 합격률</h2>
              <DataBadge reliability="sample" />
            </div>
            <QualityGauge passPct={passPct} total={judged.length} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">판정 표본</p>
                <p className="text-sm font-bold text-[#111827]">{judged.length}건</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">합격 건수</p>
                <p className="text-sm font-bold text-[#111827]">{passCount}건</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <ZoneProductionList equipment={equipment} zones={zones} />
          </div>
        </div>

        {/* 중앙: 공장 조감도 */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <FactoryMap zones={zones} />
        </div>

        {/* 우측: 검사종류별 발생 현황 */}
        <QualityTypePanel inspections={inspections} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <MonthlyProductionChart />
        <AlertSummaryCards equipment={equipment} />
      </div>

      <div className="mt-4">
        <RecentQualityChecks equipment={equipment} zones={zones} />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  active,
  accent,
}: {
  href: string;
  label: string;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors " +
        (accent
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : active
          ? "bg-[#2563eb] text-white"
          : "border border-[#e5e7eb] bg-white text-slate-600 hover:bg-slate-50")
      }
    >
      {label}
    </Link>
  );
}
