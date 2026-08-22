"use client";

import { Traveler } from "@/types";
import { getVerifiedLeadTimeRecords, summarizeLeadTimes, groupByProduct, MIN_SAMPLE_FOR_STATS } from "@/lib/analysis";
import { DataBadge } from "@/components/ui/DataBadge";
import { AlertTriangle } from "lucide-react";

export function LeadTimeAnalysis({ travelers }: { travelers: Traveler[] }) {
  const records = getVerifiedLeadTimeRecords(travelers);
  const stats = summarizeLeadTimes(records);
  const byProduct = groupByProduct(records);

  const longest = [...records].sort((a, b) => b.leadTimeDays - a.leadTimeDays).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200">제작기간 분석</h2>
          <DataBadge reliability="confirmed" />
        </div>
        <p className="mb-3 text-[11px] text-slate-400">
          OCR 검증완료 + 분석포함으로 표시된 트레블러의 시작일~완료일 차이만 사용합니다. (표본 {stats.count}건)
        </p>

        {stats.sampleWarning && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
            <AlertTriangle size={14} /> 표본 부족 (최소 {MIN_SAMPLE_FOR_STATS}건 권장, 현재 {stats.count}건) — 통계적
            신뢰도가 낮습니다.
          </div>
        )}

        {stats.count === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            검증완료된 트레블러가 없어 제작기간을 계산할 수 없습니다. 트레블러 관리 화면에서 시작일·완료일을 원본과
            대조하여 검증완료로 표시하세요.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="평균 제작기간" value={`${stats.avg}일`} />
            <Stat label="중앙값" value={`${stats.median}일`} />
            <Stat label="최단" value={`${stats.min}일`} />
            <Stat label="최장" value={`${stats.max}일`} />
          </div>
        )}
      </div>

      {longest.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
          <h3 className="mb-2 text-sm font-bold text-slate-200">장기지연 트레블러 (제작기간 상위)</h3>
          <table className="w-full text-xs">
            <thead className="text-slate-400">
              <tr>
                <th className="px-2 py-1 text-left">트레블러</th>
                <th className="px-2 py-1 text-left">제품</th>
                <th className="px-2 py-1 text-left">고객사</th>
                <th className="px-2 py-1 text-right">제작기간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {longest.map((r) => (
                <tr key={r.traveler.id}>
                  <td className="px-2 py-1.5">{r.traveler.travelerNo}</td>
                  <td className="px-2 py-1.5">{r.traveler.productName}</td>
                  <td className="px-2 py-1.5">{r.traveler.customer}</td>
                  <td className="px-2 py-1.5 text-right font-bold text-orange-600">{r.leadTimeDays}일</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#101c33] p-4">
        <h3 className="mb-2 text-sm font-bold text-slate-200">제품별 과거·현재 비교</h3>
        {byProduct.size === 0 ? (
          <p className="text-xs text-slate-400">비교 가능한 검증 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {[...byProduct.entries()].map(([product, recs]) => {
              const sorted = [...recs].sort(
                (a, b) => new Date(a.traveler.startDate!).getTime() - new Date(b.traveler.startDate!).getTime()
              );
              const first = sorted[0];
              const last = sorted[sorted.length - 1];
              return (
                <div key={product} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs">
                  <span className="font-semibold text-slate-300">{product}</span>
                  {sorted.length < 2 ? (
                    <span className="text-slate-400">표본 부족 (1건) — 비교 불가</span>
                  ) : (
                    <span className="text-slate-400">
                      과거 {first.leadTimeDays}일 → 최근 {last.leadTimeDays}일 (표본 {sorted.length}건)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-base font-bold text-slate-200">{value}</p>
    </div>
  );
}
