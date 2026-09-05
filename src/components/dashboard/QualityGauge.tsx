"use client";

// 참고 화면의 "Capacity Overview" 원형 게이지를 우리 데이터(품질 합격률)로 재구성
export function QualityGauge({ passPct, total }: { passPct: number; total: number }) {
  const clamped = Math.max(0, Math.min(100, passPct));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#eef2f7" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-[#111827]">{clamped.toFixed(0)}%</span>
        <span className="text-xs font-medium text-slate-500">합격 (표본 {total}건)</span>
      </div>
    </div>
  );
}
