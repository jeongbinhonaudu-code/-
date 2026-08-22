import { FactoryZone } from "@/types";

// 1공장 배치 (요구사항 5·6번 기준)
// 12열 x 10행 그리드 스키마 배치도. 실제 CAD 도면 확보 전까지는
// 사용자가 설명한 위치관계(인접/연결/통로)를 최우선으로 반영한 1차 초안이며,
// 정밀 축척은 추후 실측 도면으로 보정이 필요하다.
export const factory1Zones: FactoryZone[] = [
  // ── 상단 설비라인 ──
  {
    id: "f1-warehouse",
    factoryId: "factory1",
    name: "완제품 창고",
    category: "warehouse",
    gridColumn: "1 / 3",
    gridRow: "1 / 5",
    description: "입출고 및 출하대기 · 왼쪽 여유공간 포함",
  },
  {
    id: "f1-auto-ut",
    factoryId: "factory1",
    name: "자동 UT",
    category: "inspection",
    gridColumn: "3 / 4",
    gridRow: "2 / 4",
    description: "자동 UT 1대",
  },
  {
    id: "f1-marking",
    factoryId: "factory1",
    name: "마킹기",
    category: "marking",
    gridColumn: "4 / 5",
    gridRow: "2 / 4",
    description: "마킹기 2대",
  },
  {
    id: "f1-gate-f2",
    factoryId: "factory1",
    name: "2공장 연결 출입구",
    category: "gate",
    gridColumn: "5 / 8",
    gridRow: "1 / 2",
    description: "2공장 연결 통로 (통로를 가리지 않도록 작게 표시)",
  },
  {
    id: "f1-semi-auto-grinding",
    factoryId: "factory1",
    name: "반자동 원통연마",
    category: "grinding",
    gridColumn: "5 / 8",
    gridRow: "2 / 4",
    description: "반자동 원통연마 4대",
    linkedLine: "grinding-line",
  },
  {
    id: "f1-lathe",
    factoryId: "factory1",
    name: "범용선반",
    category: "grinding",
    gridColumn: "5 / 7",
    gridRow: "4 / 5",
    description: "반자동 원통연마 뒤쪽 범용선반 1대",
  },
  {
    id: "f1-cnc-grinding",
    factoryId: "factory1",
    name: "CNC 원통연마",
    category: "grinding",
    gridColumn: "8 / 10",
    gridRow: "2 / 4",
    description: "CNC 원통연마 2대 (반자동 원통연마 옆)",
    linkedLine: "grinding-line",
  },
  {
    id: "f1-clg-centerless",
    factoryId: "factory1",
    name: "CLG 센터리스 연마",
    category: "grinding",
    gridColumn: "10 / 13",
    gridRow: "2 / 4",
    description: "CLG 센터리스 연마 1대",
    linkedLine: "grinding-line",
  },

  // ── 메인 통로 (노란 안전선) ──
  {
    id: "f1-main-corridor",
    factoryId: "factory1",
    name: "메인 통로",
    category: "corridor",
    gridColumn: "1 / 13",
    gridRow: "5 / 6",
  },

  // ── 중앙 및 하단 ──
  {
    id: "f1-packaging",
    factoryId: "factory1",
    name: "포장구역",
    category: "packaging",
    gridColumn: "1 / 3",
    gridRow: "6 / 11",
    description: "방청·포장 및 출하대기",
  },
  {
    id: "f1-qa",
    factoryId: "factory1",
    name: "QA 품질팀",
    category: "quality",
    gridColumn: "3 / 7",
    gridRow: "6 / 11",
    description: "검사·판정·측정실 · 포장구역과의 여유공간 포함한 독립구역",
  },
  {
    id: "f1-qa-endprocess-corridor",
    factoryId: "factory1",
    name: "품질팀-단부 통로",
    category: "corridor",
    gridColumn: "7 / 8",
    gridRow: "6 / 11",
    description: "품질팀↔단부 직선통로. 중간에 시편·시약 구역으로 내려가는 분기통로 포함",
  },
  {
    id: "f1-end-process",
    factoryId: "factory1",
    name: "단부 공정",
    category: "end_process",
    gridColumn: "8 / 10",
    gridRow: "6 / 9",
    description: "황연마기 1대 · 정연마기 1대 · 고주파 열처리 자동화기 1대",
  },
  {
    id: "f1-sheet-grinding",
    factoryId: "factory1",
    name: "시트연마",
    category: "sheet_grinding",
    gridColumn: "10 / 11",
    gridRow: "6 / 9",
    description: "시트연마기 1대 · 컷팅기 1대",
  },
  {
    id: "f1-pt-buffing",
    factoryId: "factory1",
    name: "PT·버핑",
    category: "pt_buffing",
    gridColumn: "11 / 13",
    gridRow: "6 / 9",
    description: "PT 검사작업대와 버핑기",
  },
  {
    id: "f1-sample-reagent",
    factoryId: "factory1",
    name: "시편·시약 구역",
    category: "sample_reagent",
    gridColumn: "7 / 8",
    gridRow: "9 / 11",
    description: "품질팀-단부 통로 분기 방향",
  },
  {
    id: "f1-mt",
    factoryId: "factory1",
    name: "MT 구역",
    category: "mt",
    gridColumn: "8 / 10",
    gridRow: "9 / 11",
    description: "자분탐상검사",
  },
  {
    id: "f1-correction",
    factoryId: "factory1",
    name: "교정·미깎기",
    category: "correction",
    gridColumn: "10 / 11",
    gridRow: "9 / 11",
    description: "교정기 2대 · 미깎기 2대",
  },
  {
    id: "f1-auto-robot",
    factoryId: "factory1",
    name: "자동 버핑·교정 로봇",
    category: "auto_robot",
    gridColumn: "11 / 13",
    gridRow: "9 / 11",
    description: "자동 버핑·교정 로봇 2대",
  },
];

// 2공장은 배치 정보 미확보 (입력 필요)
export const factory2Zones: FactoryZone[] = [];

export const GRINDING_LINE_IDS = [
  "f1-semi-auto-grinding",
  "f1-cnc-grinding",
  "f1-clg-centerless",
];

export function getZonesByFactory(factoryId: "factory1" | "factory2"): FactoryZone[] {
  return factoryId === "factory1" ? factory1Zones : factory2Zones;
}
