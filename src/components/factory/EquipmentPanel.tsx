"use client";

import { useState } from "react";
import Link from "next/link";
import { Equipment, EquipmentOverride, EquipmentStatus, FactoryZone } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QualityResultBadge } from "@/components/ui/QualityResultBadge";
import { DataBadge } from "@/components/ui/DataBadge";
import { PhotoGallery } from "@/components/factory/PhotoGallery";
import { STATUS_LABEL } from "@/lib/labels";
import { formatDateTime } from "@/lib/format";
import { X, ClipboardList, Pencil, Check } from "lucide-react";

export function EquipmentPanel({
  zone,
  equipmentList,
  onUpdateEquipment,
  onClose,
}: {
  zone: FactoryZone;
  equipmentList: Equipment[];
  onUpdateEquipment: (equipmentId: string, patch: Omit<EquipmentOverride, "equipmentId">) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e5e7eb] bg-white px-4 py-3">
          <div>
            <h2 className="text-base font-bold text-[#111827]">{zone.name}</h2>
            {zone.description && <p className="mt-0.5 text-xs text-slate-500">{zone.description}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 divide-y divide-[#e5e7eb]">
          {equipmentList.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-500">등록된 설비 정보가 없습니다. (입력 필요)</p>
          )}
          {equipmentList.map((eq) => (
            <EquipmentCard key={eq.id} eq={eq} zone={zone} onUpdateEquipment={onUpdateEquipment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipmentCard({
  eq,
  zone,
  onUpdateEquipment,
}: {
  eq: Equipment;
  zone: FactoryZone;
  onUpdateEquipment: (equipmentId: string, patch: Omit<EquipmentOverride, "equipmentId">) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-3 px-4 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#111827]">{eq.name}</h3>
        <StatusBadge status={eq.status} />
      </div>

      <PhotoGallery equipmentId={eq.id} equipmentName={eq.name} />

      {editing ? (
        <EditForm
          eq={eq}
          onCancel={() => setEditing(false)}
          onSave={(patch) => {
            onUpdateEquipment(eq.id, patch);
            setEditing(false);
          }}
        />
      ) : (
        <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 rounded-lg bg-slate-50 border border-[#e5e7eb] p-3 text-xs">
          <Row label="현재 제품" value={eq.currentProduct ?? "확인 필요"} />
          <Row label="트레블러 번호" value={eq.currentTravelerNo ?? "확인 필요"} />
          <Row
            label="생산 수량"
            value={eq.currentQuantity != null ? `${eq.currentQuantity}개` : "확인 필요"}
            extra={eq.quantityReliability ? <DataBadge reliability={eq.quantityReliability} /> : undefined}
          />
          <Row
            label="최근 품질결과"
            value={undefined}
            extra={<QualityResultBadge result={eq.lastQualityResult ?? "unchecked"} />}
          />
          <Row
            label="최근 점검시각"
            value={eq.lastInspectionAt ? formatDateTime(eq.lastInspectionAt) : "점검이력 없음"}
          />
          {eq.note && <Row label="비고" value={eq.note} />}
        </dl>
      )}

      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <Pencil size={13} /> 현재제품·수량·상태 수정 (생산팀)
        </button>
      )}

      <Link
        href={`/quality?zoneId=${zone.id}&equipmentId=${eq.id}&product=${encodeURIComponent(eq.currentProduct ?? "")}`}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
      >
        <ClipboardList size={14} /> 품질점검 입력
      </Link>
    </div>
  );
}

function EditForm({
  eq,
  onSave,
  onCancel,
}: {
  eq: Equipment;
  onSave: (patch: Omit<EquipmentOverride, "equipmentId">) => void;
  onCancel: () => void;
}) {
  const [product, setProduct] = useState(eq.currentProduct ?? "");
  const [travelerNo, setTravelerNo] = useState(eq.currentTravelerNo ?? "");
  const [quantity, setQuantity] = useState(eq.currentQuantity?.toString() ?? "");
  const [status, setStatus] = useState<EquipmentStatus>(eq.status);
  const [updatedBy, setUpdatedBy] = useState("");

  function handleSave() {
    if (!updatedBy.trim()) {
      window.alert("입력자 이름을 입력하세요.");
      return;
    }
    onSave({
      status,
      currentProduct: product || undefined,
      currentTravelerNo: travelerNo || undefined,
      currentQuantity: quantity ? Number(quantity) : undefined,
      updatedBy: updatedBy.trim(),
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/60 p-3">
      <div className="grid grid-cols-2 gap-2">
        <EditField label="현재 제품">
          <input className="input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="예: H3240" />
        </EditField>
        <EditField label="트레블러 번호">
          <input className="input" value={travelerNo} onChange={(e) => setTravelerNo(e.target.value)} />
        </EditField>
        <EditField label="생산 수량">
          <input className="input" type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </EditField>
        <EditField label="공정상태">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus)}>
            {(Object.keys(STATUS_LABEL) as EquipmentStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s].text}
              </option>
            ))}
          </select>
        </EditField>
        <EditField label="입력자">
          <input className="input" value={updatedBy} onChange={(e) => setUpdatedBy(e.target.value)} placeholder="이름" />
        </EditField>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
          취소
        </button>
        <button onClick={handleSave} className="flex items-center gap-1 rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
          <Check size={13} /> 저장
        </button>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.35rem 0.5rem;
          font-size: 0.75rem;
          background: #ffffff;
          color: #111827;
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

function Row({ label, value, extra }: { label: string; value?: string; extra?: React.ReactNode }) {
  return (
    <>
      <dt className="text-slate-500">{label}</dt>
      <dd className="flex items-center justify-end gap-1 text-right font-medium text-slate-700">
        {value}
        {extra}
      </dd>
    </>
  );
}
