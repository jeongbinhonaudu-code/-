"use client";

import { useMemo, useState } from "react";
import { Equipment, FactoryZone } from "@/types";
import { getByZone, getZoneStatus, useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { GRINDING_LINE_IDS } from "@/data/zones";
import { ZONE_CATEGORY_STYLE } from "@/lib/zoneStyle";
import { QUALITY_RESULT_LABEL, STATUS_LABEL } from "@/lib/labels";
import { GRID_COLS, GRID_ROWS, zoneTopCenterPct } from "@/lib/gridGeometry";
import { StatusDot } from "@/components/ui/StatusBadge";
import { EquipmentPanel } from "@/components/factory/EquipmentPanel";
import { ArrowRight, ArrowUpDown, Camera, HelpCircle } from "lucide-react";
import clsx from "clsx";

export function FactoryMap({ zones }: { zones: FactoryZone[] }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const { equipment, updateEquipment } = useEffectiveEquipment();

  const grindingArrowPath = useMemo(() => {
    const line = GRINDING_LINE_IDS.map((id) => zones.find((z) => z.id === id)).filter(
      (z): z is FactoryZone => !!z
    );
    if (line.length < 2) return null;
    return line.map((z) => zoneTopCenterPct(z.gridColumn, z.gridRow));
  }, [zones]);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;

  return (
    <div className="relative">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-[#0c1f3f] to-[#0a1730] shadow-2xl"
        style={{ aspectRatio: `${GRID_COLS} / ${GRID_ROWS}` }}
      >
        {/* 격자 바닥 텍스처 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: `${100 / GRID_COLS}% ${100 / GRID_ROWS}%`,
          }}
        />

        <div
          className="relative grid h-full w-full gap-1.5 p-2 sm:gap-2 sm:p-3"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
        >
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} equipmentList={equipment} onSelect={() => setSelectedZoneId(zone.id)} />
          ))}
        </div>

        {/* 연마라인 연결선 (반자동 원통연마 → CNC 원통연마 → CLG 센터리스) */}
        {grindingArrowPath && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill="#fbbf24" />
              </marker>
            </defs>
            <polyline
              points={grindingArrowPath.map((p) => `${p.x},${p.y - 0.3}`).join(" ")}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.35"
              strokeDasharray="1.4 1"
              markerEnd="url(#arrowhead)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>

      <MapLegend />

      {selectedZone && (
        <EquipmentPanel
          zone={selectedZone}
          equipmentList={getByZone(equipment, selectedZone.id)}
          onUpdateEquipment={updateEquipment}
          onClose={() => setSelectedZoneId(null)}
        />
      )}
    </div>
  );
}

function ZoneCard({
  zone,
  equipmentList,
  onSelect,
}: {
  zone: FactoryZone;
  equipmentList: Equipment[];
  onSelect: () => void;
}) {
  const style = ZONE_CATEGORY_STYLE[zone.category];
  const equipment = getByZone(equipmentList, zone.id);
  const status = getZoneStatus(equipmentList, zone.id);
  const statusCfg = STATUS_LABEL[status];

  if (zone.category === "corridor") {
    return (
      <div
        style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
        className="relative rounded-md border-y-2 border-dashed border-amber-400/70 bg-slate-700/20"
      />
    );
  }

  if (zone.category === "gate") {
    return (
      <div
        style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
        className="relative flex flex-col items-center justify-center gap-1 rounded-md border-x-2 border-dashed border-amber-400/70 bg-slate-700/20"
      >
        <ArrowUpDown size={14} className="text-amber-300/80" />
        <span className="rotate-90 whitespace-nowrap text-[9px] font-semibold tracking-wide text-amber-200/70 sm:rotate-0">
          {zone.name}
        </span>
      </div>
    );
  }

  const isProblem = status === "nonconforming";

  return (
    <button
      onClick={onSelect}
      style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
      className={clsx(
        "group relative flex flex-col justify-between rounded-lg border p-1.5 text-left shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-2",
        style.bg,
        style.accent,
        isProblem && "ring-2 ring-red-500 animate-pulse"
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[10px] font-bold leading-tight text-white sm:text-[11px]">{zone.name}</span>
        <div className="flex shrink-0 items-center gap-1">
          {zone.needsVerification && (
            <HelpCircle size={11} className="text-yellow-400" aria-label="확인 필요" />
          )}
          <StatusDot status={status} />
        </div>
      </div>
      {equipment.length > 0 && (
        <span className="hidden text-[10px] text-slate-300 sm:block">{equipment.length}개 설비</span>
      )}

      {/* 호버 미리보기 (터치기기는 클릭으로 동일 정보 확인) */}
      <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-56 -translate-x-1/2 rounded-lg border border-slate-700 bg-[#0f2244] p-3 text-left opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 lg:block">
        <p className="text-sm font-bold text-white">{zone.name}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
          <Camera size={12} /> 대표사진: 등록 예정
        </p>
        {equipment[0] && (
          <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-300">
            <p>현재 제품: {equipment[0].currentProduct ?? "확인 필요"}</p>
            <p>작업 수량: {equipment[0].currentQuantity ?? "확인 필요"}</p>
            <p>최근 품질결과: {QUALITY_RESULT_LABEL[equipment[0].lastQualityResult ?? "unchecked"].text}</p>
          </div>
        )}
        <p className={clsx("mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold", statusCfg.className)}>
          {statusCfg.text}
        </p>
      </div>
    </button>
  );
}

function MapLegend() {
  const items: { status: keyof typeof STATUS_LABEL }[] = [
    { status: "running" },
    { status: "quality_check" },
    { status: "nonconforming" },
    { status: "waiting" },
    { status: "neutral" },
  ];
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-white/10 bg-[#101c33] px-4 py-2.5 text-xs shadow-sm">
      {items.map((it) => (
        <span key={it.status} className="flex items-center gap-1.5 text-slate-300">
          <StatusDot status={it.status} /> {STATUS_LABEL[it.status].text}
        </span>
      ))}
      <span className="flex items-center gap-1.5 text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full ring-2 ring-red-500" /> 문제 설비 강조
      </span>
      <span className="flex items-center gap-1 text-yellow-400">
        <HelpCircle size={12} /> 도면 판독 확인 필요
      </span>
      <span className="flex items-center gap-1 text-amber-400">
        <ArrowRight size={12} /> 연결 설비라인: 반자동 원통연마 → CNC 원통연마 → CLG 센터리스
      </span>
      <span className="flex items-center gap-1.5 text-slate-400">
        <span className="h-1.5 w-4 rounded-full border-b-2 border-dashed border-amber-400" /> 안전선·통로
      </span>
    </div>
  );
}
