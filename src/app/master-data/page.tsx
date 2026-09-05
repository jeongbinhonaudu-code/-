import { zones } from "@/data/zones";
import { equipmentList } from "@/data/equipment";
import { INSPECTION_TYPE_OPTIONS } from "@/data/qualityInspections";
import { CLASSIFICATION_RULES_TEXT } from "@/lib/classify";

export default function MasterDataPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-[#111827]">기준정보</h1>
      <p className="mt-1 text-sm text-slate-400">구역·설비·검사종류·분류규칙 등 시스템 기준 데이터입니다. (관리자 권한 수정)</p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <h2 className="mb-2 text-sm font-bold text-slate-700">구역 목록 (전체 {zones.length}개)</h2>
          <ul className="max-h-72 space-y-1 overflow-y-auto text-xs text-slate-400">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5">
                <span>{z.name}</span>
                <span className="text-[10px] text-slate-400">{z.category}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <h2 className="mb-2 text-sm font-bold text-slate-700">설비 마스터 ({equipmentList.length}대)</h2>
          <ul className="max-h-72 space-y-1 overflow-y-auto text-xs text-slate-400">
            {equipmentList.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5">
                <span>{e.name}</span>
                <span className="text-[10px] text-slate-400">{e.count}대</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <h2 className="mb-2 text-sm font-bold text-slate-700">검사종류</h2>
          <div className="flex flex-wrap gap-1.5">
            {INSPECTION_TYPE_OPTIONS.map((t) => (
              <span key={t} className="rounded-full border border-[#e5e7eb] bg-slate-50 px-2.5 py-1 text-xs text-slate-400">
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <h2 className="mb-2 text-sm font-bold text-slate-700">고객사 자동분류 규칙</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-slate-400">
            {CLASSIFICATION_RULES_TEXT.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
