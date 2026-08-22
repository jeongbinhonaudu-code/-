import { FactoryMap } from "@/components/factory/FactoryMap";
import { factory2Zones } from "@/data/zones";

export default function Factory2Page() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="mb-1 text-xl font-bold text-slate-900">2공장</h1>
      <p className="mb-4 text-sm text-slate-500">3단계 구현 예정 항목입니다.</p>
      <FactoryMap factoryId="factory2" zones={factory2Zones} />
    </div>
  );
}
