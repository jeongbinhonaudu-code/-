import { FactoryMap } from "@/components/factory/FactoryMap";
import { factory1Zones } from "@/data/zones";
import { SummaryBar } from "@/components/layout/SummaryBar";

export default function Factory1Page() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="mb-1 text-xl font-bold text-slate-900">1공장</h1>
      <p className="mb-4 text-sm text-slate-500">
        완제품 창고 · 자동 UT · 마킹기 · 반자동/CNC 원통연마 · CLG 센터리스 · 포장 · QA 품질팀 · 단부 · 시트연마 · PT·버핑 · 교정·미깎기 ·
        자동 버핑·교정 로봇 · 시편·시약 · MT
      </p>
      <SummaryBar />
      <div className="mt-3">
        <FactoryMap factoryId="factory1" zones={factory1Zones} />
      </div>
    </div>
  );
}
