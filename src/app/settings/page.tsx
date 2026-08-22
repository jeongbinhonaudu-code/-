import { DataBadge } from "@/components/ui/DataBadge";
import { DataReliability } from "@/types";

const RELIABILITY_ITEMS: { key: DataReliability; desc: string }[] = [
  { key: "confirmed", desc: "실제 확인값 — 현장에서 직접 입력·검증된 값" },
  { key: "estimated", desc: "현장 추정값 — 담당자 체감/구두 추정 기준" },
  { key: "simulated", desc: "가정 결과 — 시뮬레이션 계산값, 실제 예측 아님" },
  { key: "missing", desc: "입력 필요 — 아직 등록되지 않은 값" },
  { key: "unverified", desc: "검증 필요 — OCR/자동인식 후 원본 대조 전" },
  { key: "sample", desc: "예시 데이터 — 화면 시연을 위한 데모 값" },
];

const ROADMAP = [
  { phase: "1단계 (현재)", items: ["통합 공장 조감도", "설비사진 업로드", "품질 순회점검", "트레블러 목록/수동입력", "생산 분석", "시뮬레이션"] },
  { phase: "2단계", items: ["로그인·권한 서버 연동", "PostgreSQL 등 DB 연동", "사진·PDF 서버 저장소", "트레블러 OCR 자동인식", "실제 생산실적 입력", "정식 PDF 보고서"] },
  { phase: "3단계", items: ["도면 판독 확인 필요 구역명 현장 검증", "일일검사현황 연동", "설비가동 데이터 연동", "불량·재작업 상세분석", "모바일 현장점검 고도화", "자동 알림"] },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="text-xl font-bold text-slate-100">시스템 설정</h1>
      <p className="mt-1 text-sm text-slate-400">현재 시스템 단계와 데이터 신뢰성 표시 기준입니다.</p>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#101c33] p-4">
        <h2 className="mb-2 text-sm font-bold text-slate-200">데이터 신뢰성 표시 기준</h2>
        <ul className="space-y-2">
          {RELIABILITY_ITEMS.map((it) => (
            <li key={it.key} className="flex items-center gap-3 text-xs text-slate-400">
              <DataBadge reliability={it.key} />
              {it.desc}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ROADMAP.map((r) => (
          <div key={r.phase} className="rounded-xl border border-white/10 bg-[#101c33] p-4">
            <h3 className="mb-2 text-sm font-bold text-slate-200">{r.phase}</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-slate-400">
              {r.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#101c33] p-4 text-xs text-slate-400">
        <h2 className="mb-1 text-sm font-bold text-slate-200">기술 스택 (1단계)</h2>
        <p>Next.js (App Router) · React · TypeScript · Tailwind CSS · Recharts · 브라우저 localStorage 임시 저장</p>
        <p className="mt-1">
          2단계부터 PostgreSQL 등 관계형 DB, 서버 인증, 파일 저장소(사진·PDF)를 연동해 사내 서버 또는 클라우드에
          배포합니다.
        </p>
      </div>
    </div>
  );
}
