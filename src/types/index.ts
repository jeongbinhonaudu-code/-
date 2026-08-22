// 공장 공정·품질 통합 관리 시스템 - 공통 타입 정의

/** 데이터 신뢰성 구분 (요구사항 17번) */
export type DataReliability =
  | "confirmed" // 실제 확인값
  | "estimated" // 현장 추정값
  | "simulated" // 시뮬레이션값 (가정 결과)
  | "missing" // 미입력값 (입력 필요)
  | "unverified" // OCR 미검증값 (검증 필요)
  | "sample"; // 예시 데이터

export type EquipmentStatus =
  | "running" // 작업 중 (녹색)
  | "quality_check" // 품질 확인/재확인 (주황색)
  | "nonconforming" // 부적합 (빨간색)
  | "waiting" // 작업 대기 (회색)
  | "neutral"; // 일반 구역 (파란색/중립)

export type FactoryId = "factory1" | "factory2";

export interface EquipmentPhoto {
  id: string;
  url: string;
  caption?: string;
  takenAt?: string; // 촬영일
  isRepresentative?: boolean;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface Equipment {
  id: string;
  zoneId: string;
  name: string;
  count: number; // 대수
  status: EquipmentStatus;
  currentProduct?: string;
  currentTravelerNo?: string;
  currentQuantity?: number;
  quantityReliability?: DataReliability;
  lastQualityResult?: "ok" | "recheck" | "nonconforming" | "unchecked";
  lastInspectionAt?: string;
  photos: EquipmentPhoto[];
  photosPending?: boolean; // 사진 등록 예정
  note?: string;
}

/** 생산팀이 입력한 설비 상태 변경분 (기준 설비 데이터 위에 덮어씀) */
export interface EquipmentOverride {
  equipmentId: string;
  status: EquipmentStatus;
  currentProduct?: string;
  currentTravelerNo?: string;
  currentQuantity?: number;
  updatedBy: string;
  updatedAt: string;
}

export interface FactoryZone {
  id: string;
  factoryId: FactoryId;
  name: string;
  category:
    | "warehouse" // 창고
    | "inspection" // 검사/UT/PT/MT
    | "marking"
    | "grinding" // 연마 라인
    | "packaging"
    | "quality" // QA 품질팀
    | "end_process" // 단부
    | "sheet_grinding" // 시트연마
    | "pt_buffing"
    | "correction" // 교정·미깎기
    | "auto_robot"
    | "sample_reagent" // 시편·시약
    | "mt" // 자분탐상
    | "corridor" // 통로
    | "gate"; // 출입구
  // CSS grid 기반 좌표 (12 컬럼 x 10 로우 스키마 형식 배치도)
  gridColumn: string; // e.g. "1 / 3"
  gridRow: string; // e.g. "1 / 4"
  statusColorHint?: EquipmentStatus;
  description?: string;
  linkedLine?: string; // 연결된 설비라인 그룹 id (예: 원통연마 라인)
}

export interface QualityInspection {
  id: string;
  factoryId: FactoryId;
  zoneId: string;
  equipmentId?: string;
  product?: string;
  travelerNo?: string;
  inspectedQuantity?: number;
  inspectionType: string[]; // 치수/외관/조도/흔들림/경도/UT/PT/MT/마킹/포장상태
  result: "ok" | "recheck" | "nonconforming";
  note?: string;
  inspector: string;
  inspectedAt: string; // ISO
  photoUrls?: string[];
  followUpAction?: string;
  reliability: DataReliability;
  createdAt: string;
}

export type CustomerCategory = "현대" | "OEM" | "미분류";

export interface Traveler {
  id: string;
  fileName: string;
  travelerNo: string; // 트레블러 번호
  productName?: string;
  material?: string;
  quantityMin?: number;
  quantityMax?: number;
  startDate?: string; // OCR 인식 (손글씨 검증 전 미확정)
  endDate?: string;
  customer: CustomerCategory;
  customerManuallySet?: boolean;
  customerChangeHistory?: { from: CustomerCategory; to: CustomerCategory; by: string; at: string }[];
  pageCount?: number;
  mergedFileIds?: string[]; // 동일번호 분할 PDF 병합
  ocrVerified: boolean;
  includedInAnalysis: boolean;
  uploadedBy?: string;
  uploadedAt: string;
  reliability: DataReliability;
}

export interface MonthlyProductionPoint {
  month: string; // YYYY-MM
  quantity: number;
  reliability: DataReliability;
}

export type UserRole = "admin" | "quality" | "production" | "viewer";

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface SimulationInputs {
  workingDays: number; // 15~26, 기본 22
  avgLeadTimeDays: number; // 6~16, 기본 10
  defectReworkImpactPct: number; // 0~15, 기본 5
  equipmentUtilizationPct: number; // 60~100, 기본 85
}

export const SIMULATION_DEFAULTS: SimulationInputs = {
  workingDays: 22,
  avgLeadTimeDays: 10,
  defectReworkImpactPct: 5,
  equipmentUtilizationPct: 85,
};

export const BASE_MONTHLY_QUANTITY = 3500;
export const PAST_REFERENCE_QUANTITY = 4000;
