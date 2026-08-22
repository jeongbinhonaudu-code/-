import { FactoryZone } from "@/types";

// 통합 조감도 배치 (요구사항 5·6번 + 사용자 제공 통합 디지털트윈 도면 기준)
// 원래 공장을 1공장/2공장으로 구분하지 않고 하나의 완전체로 취급하기로 함(사용자 확인).
// 위쪽이 옛 "2공장" 영역(CNC·교정 라인 / 소재·단조·열처리), 아래쪽이 옛 "1공장" 영역이며
// 중간의 연결 통로로 이어져 있다. 도면 글씨가 흐려 확신이 낮은 구역명은
// needsVerification 플래그와 "(확인 필요)" 표기를 남겨두었다.
export const zones: FactoryZone[] = [
  // ── 상단 구역(옛 2공장) — CNC·교정 라인 ──
  {
    id: "f2-packaging-done",
    name: "완제품 포장 완료",
    category: "packaging",
    gridColumn: "1 / 3",
    gridRow: "1 / 4",
  },
  {
    id: "f2-sorting",
    name: "정렬(확인 필요)",
    category: "logistics",
    gridColumn: "3 / 4",
    gridRow: "1 / 4",
    needsVerification: true,
    description: "도면 글씨 판독 불확실 · 현장 확인 필요",
  },
  {
    id: "f2-metal-welder",
    name: "메탈용접기(확인 필요)",
    category: "welding",
    gridColumn: "4 / 6",
    gridRow: "1 / 4",
    needsVerification: true,
    description: "도면 글씨 판독 불확실 · 현장 확인 필요",
  },
  {
    id: "f2-centerless-grinding",
    name: "센터리스 연삭",
    category: "grinding",
    gridColumn: "6 / 8",
    gridRow: "1 / 4",
  },

  // ── 상단 구역(옛 2공장) — 소재·단조·열처리 ──
  {
    id: "f2-material-storage",
    name: "소재 보관 구역",
    category: "material",
    gridColumn: "9 / 11",
    gridRow: "1 / 4",
    description: "원자재 보관 (완제품 창고와 별도)",
  },
  {
    id: "f2-forge-800t",
    name: "800T 단조",
    category: "forging",
    gridColumn: "11 / 13",
    gridRow: "1 / 4",
  },

  {
    id: "f2-main-corridor",
    name: "메인 통로",
    category: "corridor",
    gridColumn: "1 / 13",
    gridRow: "4 / 5",
  },

  {
    id: "f2-product-wait",
    name: "제품 대기",
    category: "logistics",
    gridColumn: "1 / 2",
    gridRow: "5 / 8",
  },
  {
    id: "f2-correction",
    name: "교정기",
    category: "correction",
    gridColumn: "2 / 3",
    gridRow: "5 / 8",
  },
  {
    id: "f2-abm",
    name: "ABM 자동교정기",
    category: "correction",
    gridColumn: "3 / 5",
    gridRow: "5 / 8",
  },
  {
    id: "f2-pta-weld-room",
    name: "PTA 용접실",
    category: "welding",
    gridColumn: "5 / 10",
    gridRow: "5 / 8",
  },
  {
    id: "f2-forge-1500t",
    name: "1500T 단조",
    category: "forging",
    gridColumn: "10 / 13",
    gridRow: "5 / 7",
  },
  {
    id: "f2-heat-treatment",
    name: "열처리실",
    category: "heat_treatment",
    gridColumn: "10 / 13",
    gridRow: "7 / 9",
    description: "단부 공정 고주파 열처리와는 별도의 열처리 공정",
  },
  {
    id: "f2-cart-storage",
    name: "대차 보관",
    category: "logistics",
    gridColumn: "10 / 13",
    gridRow: "9 / 10",
  },
  {
    id: "f2-standard-storage",
    name: "기준 보관(확인 필요)",
    category: "logistics",
    gridColumn: "10 / 13",
    gridRow: "10 / 11",
    needsVerification: true,
    description: "도면 글씨 판독 불확실 · 현장 확인 필요",
  },

  // LH 선반 클러스터 (LH1, LH3~LH11 — 10대)
  { id: "f2-lathe-lh1", name: "LH1", category: "lathe", gridColumn: "1 / 2", gridRow: "8 / 9" },
  { id: "f2-lathe-lh3", name: "LH3", category: "lathe", gridColumn: "2 / 3", gridRow: "8 / 9" },
  { id: "f2-lathe-lh4", name: "LH4", category: "lathe", gridColumn: "3 / 4", gridRow: "8 / 9" },
  { id: "f2-lathe-lh5", name: "LH5", category: "lathe", gridColumn: "4 / 5", gridRow: "8 / 9" },
  { id: "f2-lathe-lh6", name: "LH6", category: "lathe", gridColumn: "5 / 6", gridRow: "8 / 9" },
  { id: "f2-lathe-lh7", name: "LH7", category: "lathe", gridColumn: "1 / 2", gridRow: "9 / 10" },
  { id: "f2-lathe-lh8", name: "LH8", category: "lathe", gridColumn: "2 / 3", gridRow: "9 / 10" },
  { id: "f2-lathe-lh9", name: "LH9", category: "lathe", gridColumn: "3 / 4", gridRow: "9 / 10" },
  { id: "f2-lathe-lh10", name: "LH10", category: "lathe", gridColumn: "4 / 5", gridRow: "9 / 10" },
  { id: "f2-lathe-lh11", name: "LH11", category: "lathe", gridColumn: "5 / 6", gridRow: "9 / 10" },

  {
    id: "f2-material-cutter",
    name: "소재 절단기",
    category: "machining",
    gridColumn: "6 / 8",
    gridRow: "8 / 9",
  },
  {
    id: "f2-material-setting",
    name: "소재 세팅(확인 필요)",
    category: "machining",
    gridColumn: "8 / 10",
    gridRow: "8 / 9",
    needsVerification: true,
    description: "도면 글씨 판독 불확실 · 현장 확인 필요",
  },
  {
    id: "f2-cnc",
    name: "CNC",
    category: "machining",
    gridColumn: "6 / 8",
    gridRow: "9 / 10",
  },
  {
    id: "f2-mct",
    name: "MCT",
    category: "machining",
    gridColumn: "8 / 10",
    gridRow: "9 / 10",
  },

  // ── 연결 통로 (옛 1·2공장 경계) ──
  {
    id: "gate-connector",
    name: "공장 간 연결 통로",
    category: "gate",
    gridColumn: "6 / 8",
    gridRow: "11 / 13",
  },

  // ── 하단 구역(옛 1공장) 상단 설비라인 ──
  {
    id: "f1-warehouse",
    name: "완제품 창고",
    category: "warehouse",
    gridColumn: "1 / 3",
    gridRow: "13 / 17",
    description: "입출고 및 출하대기 · 왼쪽 여유공간 포함",
  },
  {
    id: "f1-auto-ut",
    name: "자동 UT",
    category: "inspection",
    gridColumn: "3 / 4",
    gridRow: "14 / 16",
    description: "자동 UT 1대",
  },
  {
    id: "f1-marking",
    name: "마킹기",
    category: "marking",
    gridColumn: "4 / 5",
    gridRow: "14 / 16",
    description: "마킹기 2대",
  },
  {
    id: "f1-semi-auto-grinding",
    name: "반자동 원통연마",
    category: "grinding",
    gridColumn: "5 / 8",
    gridRow: "14 / 16",
    description: "반자동 원통연마 4대",
    linkedLine: "grinding-line",
  },
  {
    id: "f1-lathe",
    name: "범용선반",
    category: "grinding",
    gridColumn: "5 / 7",
    gridRow: "16 / 17",
    description: "반자동 원통연마 뒤쪽 범용선반 1대",
  },
  {
    id: "f1-cnc-grinding",
    name: "CNC 원통연마",
    category: "grinding",
    gridColumn: "8 / 10",
    gridRow: "14 / 16",
    description: "CNC 원통연마 2대 (반자동 원통연마 옆)",
    linkedLine: "grinding-line",
  },
  {
    id: "f1-clg-centerless",
    name: "CLG 센터리스 연마",
    category: "grinding",
    gridColumn: "10 / 13",
    gridRow: "14 / 16",
    description: "CLG 센터리스 연마 1대",
    linkedLine: "grinding-line",
  },

  {
    id: "f1-main-corridor",
    name: "메인 통로",
    category: "corridor",
    gridColumn: "1 / 13",
    gridRow: "17 / 18",
  },

  // ── 중앙 및 하단(옛 1공장) ──
  {
    id: "f1-packaging",
    name: "포장구역",
    category: "packaging",
    gridColumn: "1 / 3",
    gridRow: "18 / 23",
    description: "방청·포장 및 출하대기",
  },
  {
    id: "f1-qa",
    name: "QA 품질팀",
    category: "quality",
    gridColumn: "3 / 7",
    gridRow: "18 / 23",
    description: "검사·판정·측정실 · 포장구역과의 여유공간 포함한 독립구역",
  },
  {
    id: "f1-qa-endprocess-corridor",
    name: "품질팀-단부 통로",
    category: "corridor",
    gridColumn: "7 / 8",
    gridRow: "18 / 23",
    description: "품질팀↔단부 직선통로. 중간에 시편·시약 구역으로 내려가는 분기통로 포함",
  },
  {
    id: "f1-end-process",
    name: "단부 공정",
    category: "end_process",
    gridColumn: "8 / 10",
    gridRow: "18 / 21",
    description: "황연마기 1대 · 정연마기 1대 · 고주파 열처리 자동화기 1대",
  },
  {
    id: "f1-sheet-grinding",
    name: "시트연마",
    category: "sheet_grinding",
    gridColumn: "10 / 11",
    gridRow: "18 / 21",
    description: "시트연마기 1대 · 컷팅기 1대",
  },
  {
    id: "f1-pt-buffing",
    name: "PT·버핑",
    category: "pt_buffing",
    gridColumn: "11 / 13",
    gridRow: "18 / 21",
    description: "PT 검사작업대와 버핑기",
  },
  {
    id: "f1-sample-reagent",
    name: "시편·시약 구역",
    category: "sample_reagent",
    gridColumn: "7 / 8",
    gridRow: "21 / 23",
    description: "품질팀-단부 통로 분기 방향",
  },
  {
    id: "f1-mt",
    name: "MT 구역",
    category: "mt",
    gridColumn: "8 / 10",
    gridRow: "21 / 23",
    description: "자분탐상검사",
  },
  {
    id: "f1-correction",
    name: "교정·미깎기",
    category: "correction",
    gridColumn: "10 / 11",
    gridRow: "21 / 23",
    description: "교정기 3대 · 미깎기 2대",
  },
  {
    id: "f1-auto-robot",
    name: "자동 버핑·교정 로봇",
    category: "auto_robot",
    gridColumn: "11 / 13",
    gridRow: "21 / 23",
    description: "자동 버핑·교정 로봇 2대",
  },
  {
    id: "f1-pouch-material",
    name: "통합 파우치 자재(확인 필요)",
    category: "logistics",
    gridColumn: "9 / 13",
    gridRow: "23 / 24",
    needsVerification: true,
    description: "메인 동선과 분리된 독립 보관 구역 · 도면 판독 재확인 필요",
  },
];

export const GRINDING_LINE_IDS = ["f1-semi-auto-grinding", "f1-cnc-grinding", "f1-clg-centerless"];

export function getZones(): FactoryZone[] {
  return zones;
}
