import { AppUser, UserRole } from "@/types";

// 예시 데이터: 실제 로그인·권한 시스템은 2단계 구현 예정 (요구사항 19번)
export const sampleUsers: AppUser[] = [
  { id: "u1", name: "예시) 관리자", role: "admin" },
  { id: "u2", name: "예시) 김품질", role: "quality" },
  { id: "u3", name: "예시) 박생산", role: "production" },
  { id: "u4", name: "예시) 조회전용", role: "viewer" },
];

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "관리자",
  quality: "품질팀",
  production: "생산팀",
  viewer: "조회 사용자",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["공장배치 수정", "설비 등록", "사용자 관리", "모든 데이터 수정", "분류규칙 관리"],
  quality: ["점검결과 입력", "사진 등록", "트레블러 업로드", "품질이력 조회", "분석 확인"],
  production: ["현재제품 입력", "작업수량 입력", "공정상태 변경", "설비상태 등록"],
  viewer: ["지도와 현황 조회", "분석결과 조회"],
};
