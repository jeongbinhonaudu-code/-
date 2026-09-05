"use client";

import { usePersistedList } from "@/lib/storage";
import { sampleTravelers } from "@/data/travelers";
import { Traveler } from "@/types";
import { classifyCustomer, CLASSIFICATION_RULES_TEXT } from "@/lib/classify";
import { ArchiveSummary } from "@/components/travelers/ArchiveSummary";
import { TravelerUpload } from "@/components/travelers/TravelerUpload";
import { TravelerList } from "@/components/travelers/TravelerList";

export function TravelerPageClient() {
  const { items, add, update, remove } = usePersistedList<Traveler>("travelers", sampleTravelers);

  function handleFiles(files: File[]) {
    files.forEach((file) => {
      const traveler: Traveler = {
        id: `trv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fileName: file.name,
        travelerNo: "",
        productName: "",
        customer: "미분류",
        ocrVerified: false,
        includedInAnalysis: false,
        uploadedBy: "현재 사용자",
        uploadedAt: new Date().toISOString(),
        reliability: "unverified",
      };
      add(traveler);
    });
  }

  function handleUpdate(id: string, updater: (t: Traveler) => Traveler) {
    update((t) => t.id === id, updater);
  }

  function handleMergeGroup(travelerNo: string) {
    const group = items
      .filter((t) => t.travelerNo === travelerNo)
      .sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());
    if (group.length < 2) return;
    const [primary, ...others] = group;

    if (
      !window.confirm(
        `트레블러 번호 "${travelerNo}" 파일 ${group.length}개를 하나의 생산 건으로 병합합니다.\n` +
          `- 대표 건: ${primary.fileName} (가장 먼저 업로드됨)\n` +
          `- 병합 대상: ${others.map((o) => o.fileName).join(", ")}\n` +
          `병합 후 병합된 개별 파일 항목은 목록에서 제거됩니다. 계속할까요?`
      )
    ) {
      return;
    }

    const mergedIds = [...(primary.mergedFileIds ?? []), ...others.flatMap((o) => [o.id, ...(o.mergedFileIds ?? [])])];
    const totalPages = [primary, ...others].reduce((sum, t) => sum + (t.pageCount ?? 0), 0);

    update((t) => t.id === primary.id, (t) => ({
      ...t,
      pageCount: totalPages || undefined,
      mergedFileIds: mergedIds,
      material: t.material ?? others.find((o) => o.material)?.material,
      startDate: t.startDate ?? others.find((o) => o.startDate)?.startDate,
      endDate: t.endDate ?? others.find((o) => o.endDate)?.endDate,
    }));
    remove((t) => others.some((o) => o.id === t.id));
  }

  const list = items;

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-[#111827]">트레블러 PDF 관리</h1>
      <p className="mt-1 text-sm text-slate-400">
        트레블러 PDF를 업로드·관리하고 고객사를 자동분류합니다. 동일 번호의 분할 PDF는 하나의 생산 건으로 취급해야 합니다.
      </p>

      <div className="mt-4 space-y-4">
        <ArchiveSummary />

        <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <TravelerUpload onFiles={handleFiles} />
        </div>

        <details className="rounded-xl border border-[#e5e7eb] bg-white p-4 text-xs text-slate-400">
          <summary className="cursor-pointer text-sm font-bold text-slate-600">고객사 자동분류 규칙</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {CLASSIFICATION_RULES_TEXT.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-2">
            테스트: <code className="rounded bg-slate-50 px-1">classifyCustomer(&quot;H3240&quot;)</code> →{" "}
            <b>{classifyCustomer("H3240")}</b>
          </p>
        </details>

        <TravelerList travelers={list} onUpdate={handleUpdate} onMergeGroup={handleMergeGroup} />
      </div>
    </div>
  );
}
