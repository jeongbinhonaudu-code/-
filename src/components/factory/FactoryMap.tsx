"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Equipment, FactoryZone } from "@/types";
import { getByZone, getZoneStatus, useEffectiveEquipment } from "@/lib/equipmentOverrides";
import { GRINDING_LINE_IDS, ZoneCluster, corridorSignage, mapSectionLabels, routeWaypoints, zoneClusters } from "@/data/zones";
import { STATUS_ZONE_STYLE, ZONE_CATEGORY_STYLE } from "@/lib/zoneStyle";
import { ZONE_CATEGORY_ICON } from "@/lib/zoneIcons";
import { QUALITY_RESULT_LABEL, STATUS_LABEL } from "@/lib/labels";
import { GRID_COLS, GRID_ROWS, linePct, parseSpan, zoneTopCenterPct } from "@/lib/gridGeometry";
import { StatusDot } from "@/components/ui/StatusBadge";
import { EquipmentPanel } from "@/components/factory/EquipmentPanel";
import { ArrowRight, ArrowUpDown, Camera, ChevronDown, HelpCircle, Milestone } from "lucide-react";
import clsx from "clsx";

export function FactoryMap({ zones, fitViewport = false }: { zones: FactoryZone[]; fitViewport?: boolean }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const { equipment, updateEquipment } = useEffectiveEquipment();

  const grindingArrowPath = useMemo(() => {
    const line = GRINDING_LINE_IDS.map((id) => zones.find((z) => z.id === id)).filter(
      (z): z is FactoryZone => !!z
    );
    if (line.length < 2) return null;
    return line.map((z) => zoneTopCenterPct(z.gridColumn, z.gridRow));
  }, [zones]);

  const routePoints = useMemo(() => routeWaypoints.map((p) => linePct(p.col, p.row)), []);

  const clusteredZoneIds = useMemo(
    () => new Set(zoneClusters.flatMap((c) => c.memberZoneIds)),
    []
  );

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;

  const mapBody = (
    <>
      {/* 상단 구역 안내판 — 입구에서 바로 보이는 첫 표지. 아래 지도와 같은 열 폭을 써서 정확히 정렬한다 */}
      <div
        className="mb-1.5 grid gap-2 px-2 sm:gap-2.5 sm:px-3"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
      >
        {mapSectionLabels.map((sec) => (
          <div
            key={sec.id}
            style={{ gridColumn: sec.gridColumn }}
            className="flex items-center gap-1.5 truncate rounded-full border border-amber-400/40 bg-[#0c1c3a] px-2.5 py-1 text-[9px] font-bold tracking-wide text-amber-200 shadow-lg sm:text-[10px]"
          >
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[8px] text-[#0c1c3a]">
              {sec.order}
            </span>
            <span className="truncate">{sec.label}</span>
          </div>
        ))}
      </div>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-[#0c1f3f] to-[#0a1730] shadow-2xl"
        style={{ aspectRatio: `${GRID_COLS} / ${GRID_ROWS}` }}
      >
        {/* 바닥 비네트(격자무늬 대신 은은한 명암으로 "도면"보다는 "실내 바닥" 느낌) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.25), transparent 60%)",
          }}
        />

        <div
          className="relative grid h-full w-full gap-2.5 p-2.5 sm:gap-3 sm:p-3.5"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
        >
          {zones
            .filter((zone) => !clusteredZoneIds.has(zone.id))
            .map((zone) => (
              <ZoneCard key={zone.id} zone={zone} equipmentList={equipment} onSelect={() => setSelectedZoneId(zone.id)} />
            ))}
          {zoneClusters.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              zones={zones}
              equipmentList={equipment}
              onSelect={setSelectedZoneId}
            />
          ))}
        </div>

        {/* 전체 동선 안내선 — 입구부터 마지막 구역까지, 참고 도면의 노란 경로선처럼
            지도 바깥 벽과 3개 통로를 따라 하나로 이어 그린다 */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <marker id="route-arrow" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#fbbf24" />
            </marker>
            <marker id="route-turn" markerWidth="3" markerHeight="3" refX="1.5" refY="1.5">
              <circle cx="1.5" cy="1.5" r="1.3" fill="#fde68a" stroke="#0c1c3a" strokeWidth="0.4" />
            </marker>
          </defs>
          {/* 은은한 글로우 레이어 */}
          <polyline
            points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.35"
            strokeWidth="1.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* 선명한 경로선 */}
          <polyline
            points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#facc15"
            strokeWidth="0.5"
            strokeLinejoin="round"
            markerMid="url(#route-turn)"
            markerEnd="url(#route-arrow)"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={routePoints[0].x} cy={routePoints[0].y} r="1.1" fill="#22c55e" stroke="#0c1c3a" strokeWidth="0.4" />
        </svg>

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
    </>
  );

  return (
    <div className={clsx("relative", fitViewport && "flex h-full flex-col")}>
      {fitViewport ? (
        <div className="min-h-0 flex-1">
          <FitToViewport>{mapBody}</FitToViewport>
        </div>
      ) : (
        <>
          {/* 좁은 화면에서는 칸이 다 찌그러지는 대신 실제 크기를 유지하고 가로로 스크롤한다 */}
          <div className="-mx-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
            <div className="min-w-[860px] sm:min-w-0">{mapBody}</div>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-500 sm:hidden">
            ← 좌우로 밀어서 전체 구역을 확인하세요 →
          </p>
        </>
      )}

      <MapLegend collapsible={fitViewport} />

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

// 컨테이너 크기에 맞춰 내용 전체를 축소/확대해 스크롤 없이 한 화면에 보이게 한다
function FitToViewport({ children }: { children: React.ReactNode }) {
  const BASE_WIDTH = 900;
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (contentRef.current) setNaturalHeight(contentRef.current.offsetHeight);
  }, [children]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el || !naturalHeight) return;
    const compute = () => {
      const s = Math.min(el.clientWidth / BASE_WIDTH, el.clientHeight / naturalHeight);
      setScale(Number.isFinite(s) && s > 0 ? Math.min(s, 1.4) : 1);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalHeight]);

  return (
    <div ref={outerRef} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-0"
        style={{ width: BASE_WIDTH * scale, height: naturalHeight * scale, transform: "translateX(-50%)" }}
      >
        <div ref={contentRef} style={{ width: BASE_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
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
    const signage = corridorSignage[zone.id];
    const [c1, c2] = parseSpan(zone.gridColumn);
    const [r1, r2] = parseSpan(zone.gridRow);
    const isVertical = r2 - r1 > c2 - c1;

    if (isVertical) {
      return (
        <div
          style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
          className="relative flex flex-col items-center overflow-hidden rounded-md border-x border-amber-400/30 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 py-2"
        >
          <div className="flex h-full flex-col items-center justify-evenly">
            {Array.from({ length: 6 }).map((_, i) => (
              <ChevronDown key={i} size={11} className="shrink-0 text-amber-300/40" />
            ))}
          </div>
          {signage && (
            <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0c1c3a]/90 px-1.5 py-0.5 text-[8px] font-semibold text-amber-200 [writing-mode:vertical-rl]">
              다음: {signage.next}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
        className="relative flex items-center gap-1 overflow-hidden rounded-md border-y border-amber-400/30 bg-gradient-to-b from-amber-400/10 via-transparent to-amber-400/10"
      >
        <div className="flex w-full items-center justify-evenly">
          {Array.from({ length: 10 }).map((_, i) => (
            <ChevronDown key={i} size={11} className="shrink-0 text-amber-300/40" />
          ))}
        </div>
        {signage && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#0c1c3a]/90 px-2 py-0.5 text-[8px] font-semibold text-amber-200 sm:text-[9px]">
            다음: {signage.next} ↓
          </span>
        )}
      </div>
    );
  }

  if (zone.category === "gate") {
    return (
      <div
        style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
        className="relative flex flex-col items-center justify-center gap-1 rounded-md border-x border-amber-400/40 bg-amber-400/5"
      >
        <ArrowUpDown size={14} className="text-amber-300/80" />
        <span className="rotate-90 whitespace-nowrap text-[9px] font-semibold tracking-wide text-amber-200/70 sm:rotate-0">
          {zone.name}
        </span>
      </div>
    );
  }

  const isProblem = status === "nonconforming";
  const Icon = ZONE_CATEGORY_ICON[zone.category];
  const statusStyle = STATUS_ZONE_STYLE[status];

  return (
    <button
      onClick={onSelect}
      style={{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }}
      className={clsx(
        "group relative flex flex-col justify-between overflow-hidden rounded-md border p-1.5 pl-2.5 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.05] sm:p-2 sm:pl-3",
        statusStyle.bg,
        statusStyle.border,
        isProblem && "ring-2 ring-red-500 animate-pulse"
      )}
    >
      <span className={clsx("absolute inset-y-0 left-0 w-1", style.accent)} />
      <div className="flex items-start justify-between gap-1">
        <span className="flex items-start gap-1 text-[10px] font-bold leading-tight text-white sm:text-[11px]">
          {Icon && <Icon size={11} className="mt-[1px] shrink-0 text-white/50" />}
          {zone.name}
        </span>
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

// 동일 설비가 여러 대 반복되는 구역을 카드 하나로 묶어서 표시 — 개별 카드를 다
// 그리면 "네모만 가득한" 느낌이 커지므로, 방 하나 안에 작은 태그들만 모아둔다
function ClusterCard({
  cluster,
  zones,
  equipmentList,
  onSelect,
}: {
  cluster: ZoneCluster;
  zones: FactoryZone[];
  equipmentList: Equipment[];
  onSelect: (zoneId: string) => void;
}) {
  const members = cluster.memberZoneIds
    .map((id) => zones.find((z) => z.id === id))
    .filter((z): z is FactoryZone => !!z);
  const hasProblem = members.some((z) => getZoneStatus(equipmentList, z.id) === "nonconforming");
  const HeaderIcon = ZONE_CATEGORY_ICON.lathe;

  return (
    <div
      style={{ gridColumn: cluster.gridColumn, gridRow: cluster.gridRow }}
      className={clsx(
        "relative flex flex-col rounded-lg border border-sky-400/15 bg-[#0e1c38]/50 p-2",
        hasProblem && "ring-2 ring-red-500"
      )}
    >
      <p className="mb-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
        {HeaderIcon && <HeaderIcon size={10} className="text-slate-500" />} {cluster.name}
      </p>
      <div className="grid flex-1 grid-cols-5 gap-1 sm:gap-1.5">
        {members.map((z) => {
          const status = getZoneStatus(equipmentList, z.id);
          const statusStyle = STATUS_ZONE_STYLE[status];
          return (
            <button
              key={z.id}
              onClick={() => onSelect(z.id)}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 truncate rounded-md border px-1 py-1.5 text-center transition-transform hover:-translate-y-0.5",
                statusStyle.bg,
                statusStyle.border,
                status === "nonconforming" && "ring-1 ring-red-500"
              )}
            >
              <span className="truncate text-[8px] font-bold leading-tight text-white sm:text-[9px]">{z.name}</span>
              <StatusDot status={status} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapLegend({ collapsible = false }: { collapsible?: boolean }) {
  const items: { status: keyof typeof STATUS_LABEL }[] = [
    { status: "running" },
    { status: "quality_check" },
    { status: "nonconforming" },
    { status: "waiting" },
    { status: "neutral" },
  ];

  const body = (
    <div className="space-y-2 text-xs">
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-slate-300">
        <Milestone size={12} className="shrink-0 text-amber-400" />
        <span className="font-semibold text-amber-200">동선 순서</span>
        {ROUTE_ORDER.map((label, i) => (
          <span key={label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-500">→</span>}
            <span>
              {i + 1}.{label}
            </span>
          </span>
        ))}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
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
        <span className="flex items-center gap-1.5 text-amber-300">
          <span className="h-0.5 w-4 rounded-full bg-amber-400" /> 이동 경로 (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          입구 → 화살표: 진행 방향)
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <ArrowRight size={12} /> 연결 설비라인: 반자동 원통연마 → CNC 원통연마 → CLG 센터리스
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="h-1.5 w-4 rounded-full border-b-2 border-dashed border-amber-400" /> 안전선·통로
        </span>
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <details className="mt-2 shrink-0 rounded-xl border border-white/10 bg-[#101c33] px-4 py-2 text-xs shadow-sm">
        <summary className="cursor-pointer select-none font-semibold text-amber-200">
          범례·동선 안내 보기
        </summary>
        <div className="mt-2">{body}</div>
      </details>
    );
  }

  return <div className="mt-3 rounded-xl border border-white/10 bg-[#101c33] px-4 py-2.5 shadow-sm">{body}</div>;
}

const ROUTE_ORDER = [
  "완제품 포장 · CNC/교정 라인",
  "소재 보관 · 단조 구역",
  "교정 · PTA 용접 · 단조/열처리",
  "LH 선반 · 가공 구역",
  "완제품 창고 · 원통연마 라인",
  "QA 품질 · 마무리 공정",
];
