import { FactoryMap } from "@/components/factory/FactoryMap";
import { zones } from "@/data/zones";
import { SummaryBar } from "@/components/layout/SummaryBar";

export default function FactoryPage() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-56px)] max-w-[1600px] flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
      <h1 className="shrink-0 text-xl font-bold text-slate-100">공장 조감도</h1>
      <div className="mt-2 shrink-0">
        <SummaryBar compact />
      </div>
      <div className="mt-3 min-h-0 flex-1">
        <FactoryMap zones={zones} fitViewport />
      </div>
    </div>
  );
}
