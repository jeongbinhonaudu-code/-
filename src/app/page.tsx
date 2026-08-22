import Link from "next/link";
import { SummaryBar } from "@/components/layout/SummaryBar";
import { FactoryMap } from "@/components/factory/FactoryMap";
import { zones } from "@/data/zones";
import { DataBadge } from "@/components/ui/DataBadge";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">공장 실시간 조감도</h1>
          <p className="mt-1 text-sm text-slate-400">
            설비 위치·현재 작업제품·생산수량·설비상태·품질점검 결과를 하나의 화면에서 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/factory" label="공장 조감도" active />
          <QuickLink href="/analysis?tab=past" label="과거 기준" />
          <QuickLink href="/analysis" label="생산 분석" />
          <QuickLink href="/simulation" label="시뮬레이션" accent />
          <QuickLink href="/quality" label="품질점검" />
        </div>
      </div>

      <SummaryBar />

      <div className="mt-4 flex items-center gap-2">
        <DataBadge reliability="sample" />
        <p className="text-xs text-slate-400">
          현재 화면의 제품·수량·상태 값은 시연용 예시 데이터입니다. 실제 데이터 연동 전까지 실제값처럼 사용하지 마세요.
        </p>
      </div>

      <div className="mt-3">
        <FactoryMap zones={zones} />
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
          ? "bg-orange-500 text-white hover:bg-orange-600"
          : active
          ? "bg-sky-600 text-white"
          : "bg-[#101c33] text-slate-400 hover:bg-white/5 border border-white/10")
      }
    >
      {label}
    </Link>
  );
}
