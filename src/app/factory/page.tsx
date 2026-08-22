import { FactoryMap } from "@/components/factory/FactoryMap";
import { zones } from "@/data/zones";
import { SummaryBar } from "@/components/layout/SummaryBar";

export default function FactoryPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="mb-1 text-xl font-bold text-slate-100">공장 조감도</h1>
      <p className="mb-4 text-sm text-slate-400">
        완제품 창고 · 자동 UT · 마킹기 · 반자동/CNC 원통연마 · CLG 센터리스 · 포장 · QA 품질팀 · 단부 · 시트연마 · PT·버핑 ·
        교정·미깎기 · 자동 버핑·교정 로봇 · 시편·시약 · MT · CNC/교정 라인 · 소재·단조·열처리 구역까지 하나의 통합 조감도로
        표시합니다.
      </p>
      <SummaryBar />
      <div className="mt-3">
        <FactoryMap zones={zones} />
      </div>
    </div>
  );
}
