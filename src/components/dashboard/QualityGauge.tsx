"use client";

// 삼각함수 계산 결과는 서버(Node)와 브라우저(V8)에서 마지막 소수 자리가 미세하게
// 달라질 수 있어(하이드레이션 불일치 원인) 고정 자리수로 반올림해 값을 통일한다.
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

// 참고 화면의 "Capacity Overview" 원형 게이지(눈금+핸들 포함)를 우리 데이터(품질 합격률)로 재구성
export function QualityGauge({ passPct, total }: { passPct: number; total: number }) {
  const clamped = Math.max(0, Math.min(100, passPct));
  const radius = 74;
  const circumference = round(2 * Math.PI * radius);
  const offset = round(circumference * (1 - clamped / 100));
  const handleAngle = (clamped / 100) * 360 - 90;
  const handleX = round(90 + radius * Math.cos((handleAngle * Math.PI) / 180));
  const handleY = round(90 + radius * Math.sin((handleAngle * Math.PI) / 180));

  const ticks = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="relative mx-auto flex h-[230px] w-[230px] items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-full w-full">
        {/* 눈금 */}
        <g>
          {ticks.map((i) => {
            const angle = (i / ticks.length) * 360;
            const isMajor = i % 5 === 0;
            const r1 = 88;
            const r2 = isMajor ? 82 : 85;
            const rad = (angle * Math.PI) / 180;
            const x1 = round(90 + r1 * Math.sin(rad));
            const y1 = round(90 - r1 * Math.cos(rad));
            const x2 = round(90 + r2 * Math.sin(rad));
            const y2 = round(90 - r2 * Math.cos(rad));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? "#cbd5e1" : "#e2e8f0"}
                strokeWidth={isMajor ? 1.4 : 1}
              />
            );
          })}
        </g>
        <g transform="rotate(-90 90 90)">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#eef2f7" strokeWidth="12" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </g>
        <circle cx={handleX} cy={handleY} r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-[#111827]">{clamped.toFixed(0)}%</span>
        <span className="text-xs font-medium text-slate-500">합격 (표본 {total}건)</span>
      </div>
    </div>
  );
}
