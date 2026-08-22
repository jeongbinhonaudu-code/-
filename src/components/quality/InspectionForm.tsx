"use client";

import { useState } from "react";
import { QualityInspection } from "@/types";
import { zones } from "@/data/zones";
import { equipmentList } from "@/data/equipment";
import { INSPECTION_TYPE_OPTIONS } from "@/data/qualityInspections";
import { X } from "lucide-react";

const RESULT_OPTIONS: { value: QualityInspection["result"]; label: string; className: string }[] = [
  { value: "ok", label: "이상 없음", className: "border-emerald-400 bg-emerald-50 text-emerald-700" },
  { value: "recheck", label: "재확인 필요", className: "border-orange-400 bg-orange-50 text-orange-700" },
  { value: "nonconforming", label: "부적합", className: "border-red-400 bg-red-50 text-red-700" },
];

function nowLocalInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function InspectionForm({
  onSubmit,
  defaultZoneId,
  defaultEquipmentId,
  defaultProduct,
}: {
  onSubmit: (inspection: QualityInspection) => void;
  defaultZoneId?: string;
  defaultEquipmentId?: string;
  defaultProduct?: string;
}) {
  const [zoneId, setZoneId] = useState(defaultZoneId ?? "");
  const [equipmentId, setEquipmentId] = useState(defaultEquipmentId ?? "");
  const [product, setProduct] = useState(defaultProduct ?? "");
  const [travelerNo, setTravelerNo] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [result, setResult] = useState<QualityInspection["result"]>("ok");
  const [note, setNote] = useState("");
  const [inspector, setInspector] = useState("");
  const [inspectedAt, setInspectedAt] = useState(nowLocalInput());
  const [followUpAction, setFollowUpAction] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const zoneEquipment = equipmentList.filter((e) => e.zoneId === zoneId);

  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!zoneId) errs.push("점검구역을 선택하세요.");
    if (!inspector.trim()) errs.push("점검자를 입력하세요.");
    if (types.length === 0) errs.push("검사종류를 하나 이상 선택하세요.");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const inspection: QualityInspection = {
      id: `qi-${Date.now()}`,
      zoneId,
      equipmentId: equipmentId || undefined,
      product: product || undefined,
      travelerNo: travelerNo || undefined,
      inspectedQuantity: quantity ? Number(quantity) : undefined,
      inspectionType: types,
      result,
      note: note || undefined,
      inspector: inspector.trim(),
      inspectedAt: new Date(inspectedAt).toISOString(),
      followUpAction: followUpAction || undefined,
      reliability: "confirmed",
      createdAt: new Date().toISOString(),
    };
    onSubmit(inspection);

    setProduct("");
    setTravelerNo("");
    setQuantity("");
    setTypes([]);
    setResult("ok");
    setNote("");
    setFollowUpAction("");
    setInspectedAt(nowLocalInput());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-[#101c33] p-4">
      <h2 className="text-sm font-bold text-slate-200">품질 순회점검 입력</h2>

      {errors.length > 0 && (
        <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-300">
          {errors.map((e) => (
            <p key={e}>· {e}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="점검구역">
          <select
            className="input"
            value={zoneId}
            onChange={(e) => {
              setZoneId(e.target.value);
              setEquipmentId("");
            }}
          >
            <option value="">선택</option>
            {zones
              .filter((z) => z.category !== "corridor" && z.category !== "gate")
              .map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="설비">
          <select className="input" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)}>
            <option value="">해당없음</option>
            {zoneEquipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="제품">
          <input className="input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="예: H3240" />
        </Field>
        <Field label="트레블러/LOT">
          <input className="input" value={travelerNo} onChange={(e) => setTravelerNo(e.target.value)} />
        </Field>
        <Field label="검사수량">
          <input
            className="input"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
        <Field label="점검자">
          <input className="input" value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="이름" />
        </Field>
        <Field label="점검시간">
          <input
            className="input"
            type="datetime-local"
            value={inspectedAt}
            onChange={(e) => setInspectedAt(e.target.value)}
          />
        </Field>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-slate-400">검사종류</p>
        <div className="flex flex-wrap gap-1.5">
          {INSPECTION_TYPE_OPTIONS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleType(t)}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium " +
                (types.includes(t)
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-white/15 bg-white/5 text-slate-400 hover:bg-white/10")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-slate-400">점검결과</p>
        <div className="flex gap-2">
          {RESULT_OPTIONS.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setResult(r.value)}
              className={
                "flex-1 rounded-lg border px-3 py-2 text-xs font-bold " +
                (result === r.value ? r.className : "border-white/10 bg-white/5 text-slate-500")
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="특이사항">
        <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <Field label="후속조치">
        <textarea
          className="input"
          rows={2}
          value={followUpAction}
          onChange={(e) => setFollowUpAction(e.target.value)}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setProduct("");
            setTravelerNo("");
            setQuantity("");
            setTypes([]);
            setResult("ok");
            setNote("");
            setFollowUpAction("");
          }}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/5"
        >
          <X size={13} /> 초기화
        </button>
        <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500">
          점검결과 저장
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.5rem;
          padding: 0.4rem 0.6rem;
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
        }
        .input::placeholder {
          color: #64748b;
        }
        .input:focus {
          outline: 2px solid #38bdf8;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-400">{label}</span>
      {children}
    </label>
  );
}
