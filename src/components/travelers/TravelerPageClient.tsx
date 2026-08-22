"use client";

import { usePersistedList } from "@/lib/storage";
import { sampleTravelers } from "@/data/travelers";
import { Traveler } from "@/types";
import { classifyCustomer, CLASSIFICATION_RULES_TEXT } from "@/lib/classify";
import { ArchiveSummary } from "@/components/travelers/ArchiveSummary";
import { TravelerUpload } from "@/components/travelers/TravelerUpload";
import { TravelerList } from "@/components/travelers/TravelerList";

export function TravelerPageClient() {
  const { items, add, update } = usePersistedList<Traveler>("travelers", sampleTravelers);

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

  const list = items;

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-900">트레블러 PDF 관리</h1>
      <p className="mt-1 text-sm text-slate-500">
        트레블러 PDF를 업로드·관리하고 고객사를 자동분류합니다. 동일 번호의 분할 PDF는 하나의 생산 건으로 취급해야 합니다.
      </p>

      <div className="mt-4 space-y-4">
        <ArchiveSummary />

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <TravelerUpload onFiles={handleFiles} />
        </div>

        <details className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <summary className="cursor-pointer text-sm font-bold text-slate-700">고객사 자동분류 규칙</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {CLASSIFICATION_RULES_TEXT.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-2">
            테스트: <code className="rounded bg-slate-100 px-1">classifyCustomer(&quot;H3240&quot;)</code> →{" "}
            <b>{classifyCustomer("H3240")}</b>
          </p>
        </details>

        <TravelerList travelers={list} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
