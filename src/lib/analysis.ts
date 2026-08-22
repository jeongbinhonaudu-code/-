import { Traveler } from "@/types";

export interface LeadTimeRecord {
  traveler: Traveler;
  leadTimeDays: number;
}

const MIN_SAMPLE_FOR_STATS = 5;

/** 시작일·완료일이 모두 있고 OCR 검증 및 분석포함 표시된 트레블러만 제작기간 계산에 사용한다. */
export function getVerifiedLeadTimeRecords(travelers: Traveler[]): LeadTimeRecord[] {
  return travelers
    .filter((t) => t.ocrVerified && t.includedInAnalysis && t.startDate && t.endDate)
    .map((t) => {
      const start = new Date(t.startDate as string).getTime();
      const end = new Date(t.endDate as string).getTime();
      const leadTimeDays = Math.round(((end - start) / 86400000) * 10) / 10;
      return { traveler: t, leadTimeDays };
    })
    .filter((r) => Number.isFinite(r.leadTimeDays) && r.leadTimeDays >= 0);
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export interface LeadTimeStats {
  count: number;
  avg: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  sampleWarning: boolean;
}

export function summarizeLeadTimes(records: LeadTimeRecord[]): LeadTimeStats {
  const values = records.map((r) => r.leadTimeDays);
  const count = values.length;
  return {
    count,
    avg: count > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / count) * 10) / 10 : null,
    median: median(values),
    min: count > 0 ? Math.min(...values) : null,
    max: count > 0 ? Math.max(...values) : null,
    sampleWarning: count < MIN_SAMPLE_FOR_STATS,
  };
}

export function groupByProduct(records: LeadTimeRecord[]): Map<string, LeadTimeRecord[]> {
  const map = new Map<string, LeadTimeRecord[]>();
  records.forEach((r) => {
    const key = r.traveler.productName || "미확인 제품";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  });
  return map;
}

export { MIN_SAMPLE_FOR_STATS };
