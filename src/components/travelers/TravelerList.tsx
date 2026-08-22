"use client";

import { Fragment, useMemo, useState } from "react";
import { CustomerCategory, Traveler } from "@/types";
import { classifyCustomer } from "@/lib/classify";
import { DataBadge } from "@/components/ui/DataBadge";
import { Check, ChevronDown, ChevronUp, Combine, Search } from "lucide-react";

const CUSTOMER_BADGE: Record<CustomerCategory, string> = {
  "현대": "bg-blue-100 text-blue-700 border-blue-300",
  OEM: "bg-cyan-100 text-cyan-700 border-cyan-300",
  "미분류": "bg-slate-100 text-slate-500 border-slate-300",
};

export function TravelerList({
  travelers,
  onUpdate,
  onMergeGroup,
}: {
  travelers: Traveler[];
  onUpdate: (id: string, updater: (t: Traveler) => Traveler) => void;
  onMergeGroup: (travelerNo: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [includedFilter, setIncludedFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const duplicateNos = useMemo(() => {
    const counts = new Map<string, number>();
    travelers.forEach((t) => counts.set(t.travelerNo, (counts.get(t.travelerNo) ?? 0) + 1));
    return new Set([...counts.entries()].filter(([, c]) => c > 1).map(([no]) => no));
  }, [travelers]);

  const filtered = travelers.filter((t) => {
    if (customerFilter !== "all" && t.customer !== customerFilter) return false;
    if (includedFilter === "included" && !t.includedInAnalysis) return false;
    if (includedFilter === "excluded" && t.includedInAnalysis) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.travelerNo.toLowerCase().includes(q) ||
      (t.productName ?? "").toLowerCase().includes(q) ||
      t.fileName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-1 min-w-[180px] items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1.5">
          <Search size={14} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="트레블러 번호·제품명·파일명 검색"
            className="w-full text-xs outline-none"
          />
        </div>
        <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs">
          <option value="all">전체 고객사</option>
          <option value="현대">현대</option>
          <option value="OEM">OEM</option>
          <option value="미분류">미분류</option>
        </select>
        <select value={includedFilter} onChange={(e) => setIncludedFilter(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs">
          <option value="all">분석포함 전체</option>
          <option value="included">분석대상 포함</option>
          <option value="excluded">분석대상 제외</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1000px] text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <Th></Th>
              <Th>파일명</Th>
              <Th>트레블러 번호</Th>
              <Th>제품명</Th>
              <Th>고객사</Th>
              <Th>재질</Th>
              <Th>수량범위</Th>
              <Th>시작일~완료일</Th>
              <Th>검증</Th>
              <Th>분석포함</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-slate-400">
                  등록된 트레블러가 없습니다. 위 업로드 영역에서 PDF를 추가하세요.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <Fragment key={t.id}>
                <tr className={duplicateNos.has(t.travelerNo) ? "bg-yellow-50" : ""}>
                  <td className="px-2 py-2">
                    <button onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} className="text-slate-400">
                      {expandedId === t.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-2" title={t.fileName}>
                    {t.fileName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium">
                    {t.travelerNo || <span className="text-slate-300">입력 필요</span>}
                    {duplicateNos.has(t.travelerNo) && t.travelerNo && (
                      <>
                        <span className="ml-1 rounded bg-yellow-200 px-1 text-[10px] text-yellow-800">중복 의심</span>
                        <button
                          onClick={() => onMergeGroup(t.travelerNo)}
                          className="ml-1 inline-flex items-center gap-0.5 rounded border border-sky-300 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 hover:bg-sky-100"
                          title="동일 번호 분할 PDF를 하나의 생산 건으로 병합"
                        >
                          <Combine size={9} /> 분할 PDF 병합
                        </button>
                      </>
                    )}
                    {t.mergedFileIds && t.mergedFileIds.length > 0 && (
                      <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-slate-200 px-1 text-[10px] text-slate-600">
                        <Combine size={9} /> 병합됨
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{t.productName || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={"rounded-full border px-2 py-0.5 text-[11px] font-semibold " + CUSTOMER_BADGE[t.customer]}>
                      {t.customer}
                    </span>
                    {t.customerManuallySet && <span className="ml-1 text-[10px] text-slate-400">(수동)</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{t.material || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {t.quantityMin != null ? `${t.quantityMin}${t.quantityMax && t.quantityMax !== t.quantityMin ? `~${t.quantityMax}` : ""}` : "확인 필요"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {t.startDate ?? "확인 필요"} ~ {t.endDate ?? "확인 필요"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <DataBadge reliability={t.ocrVerified ? "confirmed" : "unverified"} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={t.includedInAnalysis}
                        onChange={(e) => onUpdate(t.id, (old) => ({ ...old, includedInAnalysis: e.target.checked }))}
                      />
                    </label>
                  </td>
                </tr>
                {expandedId === t.id && (
                  <tr>
                    <td colSpan={10} className="bg-slate-50 px-4 py-3">
                      <EditRow traveler={t} onUpdate={onUpdate} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditRow({ traveler, onUpdate }: { traveler: Traveler; onUpdate: (id: string, updater: (t: Traveler) => Traveler) => void }) {
  const [form, setForm] = useState({
    travelerNo: traveler.travelerNo,
    productName: traveler.productName ?? "",
    material: traveler.material ?? "",
    quantityMin: traveler.quantityMin?.toString() ?? "",
    quantityMax: traveler.quantityMax?.toString() ?? "",
    startDate: traveler.startDate ?? "",
    endDate: traveler.endDate ?? "",
  });
  const [customerOverride, setCustomerOverride] = useState<CustomerCategory | "">("");

  function save() {
    onUpdate(traveler.id, (old) => ({
      ...old,
      travelerNo: form.travelerNo,
      productName: form.productName || undefined,
      material: form.material || undefined,
      quantityMin: form.quantityMin ? Number(form.quantityMin) : undefined,
      quantityMax: form.quantityMax ? Number(form.quantityMax) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      customer: customerOverride || classifyCustomer(form.productName),
      customerManuallySet: !!customerOverride || old.customerManuallySet,
      reliability: "unverified",
    }));
  }

  function markVerified() {
    if (!form.startDate || !form.endDate) {
      window.alert("시작일과 완료일을 먼저 원본과 대조하여 입력해야 검증완료로 표시할 수 있습니다.");
      return;
    }
    save();
    onUpdate(traveler.id, (old) => ({ ...old, ocrVerified: true, reliability: "confirmed" }));
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <EditField label="트레블러 번호">
        <input className="input" value={form.travelerNo} onChange={(e) => setForm({ ...form, travelerNo: e.target.value })} />
      </EditField>
      <EditField label="제품명">
        <input className="input" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
      </EditField>
      <EditField label="재질">
        <input className="input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
      </EditField>
      <EditField label="고객사 (수동변경)">
        <select
          className="input"
          value={customerOverride}
          onChange={(e) => setCustomerOverride(e.target.value as CustomerCategory | "")}
        >
          <option value="">자동분류 유지 ({classifyCustomer(form.productName)})</option>
          <option value="현대">현대</option>
          <option value="OEM">OEM</option>
          <option value="미분류">미분류</option>
        </select>
      </EditField>
      <EditField label="수량 최소">
        <input className="input" type="number" value={form.quantityMin} onChange={(e) => setForm({ ...form, quantityMin: e.target.value })} />
      </EditField>
      <EditField label="수량 최대">
        <input className="input" type="number" value={form.quantityMax} onChange={(e) => setForm({ ...form, quantityMax: e.target.value })} />
      </EditField>
      <EditField label="시작일 (OCR/손글씨 대조)">
        <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
      </EditField>
      <EditField label="완료일 (OCR/손글씨 대조)">
        <input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </EditField>

      <div className="col-span-2 flex items-end gap-2 sm:col-span-4">
        <button onClick={save} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          변경사항 저장
        </button>
        <button onClick={markVerified} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
          <Check size={13} /> 원본 대조 검증완료
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.35rem 0.5rem;
          font-size: 0.75rem;
          background: white;
        }
      `}</style>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">{children}</th>;
}
