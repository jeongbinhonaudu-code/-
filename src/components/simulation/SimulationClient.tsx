"use client";

import { useMemo, useState } from "react";
import { SIMULATION_DEFAULTS, SimulationInputs, BASE_MONTHLY_QUANTITY, PAST_REFERENCE_QUANTITY } from "@/types";
import { calculateSimulation, SIMULATION_RANGES, SIMULATION_FACTOR_LABELS } from "@/lib/simulation";
import { RotateCcw, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

export function SimulationClient() {
  const [inputs, setInputs] = useState<SimulationInputs>(SIMULATION_DEFAULTS);
  const result = useMemo(() => calculateSimulation(inputs), [inputs]);

  function setField<K extends keyof SimulationInputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">생산 시뮬레이션</h1>
          <p className="mt-1 text-sm text-slate-500">조건을 조절해 예상 월 생산수량 변화를 가늠해봅니다.</p>
        </div>
        <button
          onClick={() => setInputs(SIMULATION_DEFAULTS)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw size={14} /> 현재값 초기화
        </button>
      </div>

      <div className="rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-800">
        ⚠ 가정 실험입니다. 실제 원인을 확정하거나 생산량을 보장하는 예측이 아닙니다.
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
          <Slider
            label="월 가동일"
            unit={SIMULATION_RANGES.workingDays.unit}
            range={SIMULATION_RANGES.workingDays}
            value={inputs.workingDays}
            onChange={(v) => setField("workingDays", v)}
          />
          <Slider
            label="평균 제작기간"
            unit={SIMULATION_RANGES.avgLeadTimeDays.unit}
            range={SIMULATION_RANGES.avgLeadTimeDays}
            value={inputs.avgLeadTimeDays}
            onChange={(v) => setField("avgLeadTimeDays", v)}
          />
          <Slider
            label="불량·재작업 영향"
            unit={SIMULATION_RANGES.defectReworkImpactPct.unit}
            range={SIMULATION_RANGES.defectReworkImpactPct}
            value={inputs.defectReworkImpactPct}
            onChange={(v) => setField("defectReworkImpactPct", v)}
          />
          <Slider
            label="설비 실가동률"
            unit={SIMULATION_RANGES.equipmentUtilizationPct.unit}
            range={SIMULATION_RANGES.equipmentUtilizationPct}
            value={inputs.equipmentUtilizationPct}
            onChange={(v) => setField("equipmentUtilizationPct", v)}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-[#0b1a33] p-5 text-white">
            <p className="text-xs text-slate-300">예상 월 생산수량 (가정 결과)</p>
            <p className="mt-1 text-4xl font-black">{result.expectedQuantity.toLocaleString()}개</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <p className="text-slate-300">현재({BASE_MONTHLY_QUANTITY.toLocaleString()}개) 대비</p>
                <p className={"flex items-center gap-1 font-bold " + (result.vsCurrentDiff >= 0 ? "text-emerald-300" : "text-red-300")}>
                  {result.vsCurrentDiff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {result.vsCurrentDiff >= 0 ? "+" : ""}
                  {result.vsCurrentDiff.toLocaleString()}개
                </p>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <p className="text-slate-300">과거 기준(4,000개) 대비</p>
                <p className={"flex items-center gap-1 font-bold " + (result.vsPastDiff >= 0 ? "text-emerald-300" : "text-red-300")}>
                  {result.vsPastDiff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {result.vsPastDiff >= 0 ? "+" : ""}
                  {result.vsPastDiff.toLocaleString()}개
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              목표 진행률 (과거 참고기준 {PAST_REFERENCE_QUANTITY.toLocaleString()}개 대비)
            </p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={"h-full rounded-full " + (result.reachedPastTarget ? "bg-emerald-500" : "bg-orange-400")}
                style={{ width: `${Math.min(100, result.progressTowardPastPct)}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">{result.progressTowardPastPct}%</span>
              <span className={result.reachedPastTarget ? "font-semibold text-emerald-600" : "text-slate-400"}>
                {result.reachedPastTarget ? "목표 달성" : "목표 미달성"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <AlertTriangle size={13} className="text-orange-500" /> 가장 영향이 큰 조건 (기본값 대비 편차 기준)
            </p>
            <p className="text-lg font-bold text-slate-800">{SIMULATION_FACTOR_LABELS[result.mostInfluentialFactor]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  unit,
  range,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  range: { min: number; max: number; step: number; default: number };
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>
          {range.min}
          {unit}
        </span>
        <span>기본값 {range.default}{unit}</span>
        <span>
          {range.max}
          {unit}
        </span>
      </div>
    </div>
  );
}
