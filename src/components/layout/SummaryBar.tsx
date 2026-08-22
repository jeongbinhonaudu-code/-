import { equipmentList } from "@/data/equipment";
import { DataBadge } from "@/components/ui/DataBadge";
import { formatDateTime } from "@/lib/format";
import { Boxes, PackageSearch, AlertTriangle, ShieldAlert, ClipboardCheck, Clock } from "lucide-react";

export function SummaryBar() {
  const registeredEquipment = equipmentList.length;
  const inProgressProducts = new Set(
    equipmentList.filter((e) => e.currentProduct).map((e) => e.currentProduct)
  ).size;
  const needsRecheck = equipmentList.filter((e) => e.lastQualityResult === "recheck").length;
  const nonconforming = equipmentList.filter(
    (e) => e.lastQualityResult === "nonconforming" || e.status === "nonconforming"
  ).length;
  const notYetInspected = equipmentList.filter((e) => !e.lastInspectionAt).length;
  const lastUpdated = equipmentList
    .map((e) => e.lastInspectionAt)
    .filter((v): v is string => !!v)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  const cards = [
    { icon: Boxes, label: "등록설비 수", value: `${registeredEquipment}대` },
    { icon: PackageSearch, label: "현재 진행제품 수", value: `${inProgressProducts}종` },
    { icon: ClipboardCheck, label: "품질 확인 필요", value: `${needsRecheck}건`, warn: needsRecheck > 0 },
    { icon: ShieldAlert, label: "부적합 건수", value: `${nonconforming}건`, danger: nonconforming > 0 },
    { icon: AlertTriangle, label: "점검 예정 설비", value: `${notYetInspected}대`, warn: notYetInspected > 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
        >
          <span
            className={
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
              (c.danger ? "bg-red-100 text-red-600" : c.warn ? "bg-orange-100 text-orange-600" : "bg-sky-100 text-sky-600")
            }
          >
            <c.icon size={18} />
          </span>
          <div>
            <p className="text-[11px] text-slate-400">{c.label}</p>
            <p className="text-lg font-bold leading-tight text-slate-900">{c.value}</p>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Clock size={18} />
        </span>
        <div>
          <p className="text-[11px] text-slate-400">마지막 데이터 갱신</p>
          <p className="text-xs font-bold leading-tight text-slate-900">
            {lastUpdated ? formatDateTime(lastUpdated) : "확인 필요"}
          </p>
          <DataBadge reliability="sample" className="mt-1" />
        </div>
      </div>
    </div>
  );
}
