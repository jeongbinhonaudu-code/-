import { CustomerCategory } from "@/types";

/**
 * 고객사 자동분류 (요구사항 10번)
 * 순서가 중요: H+숫자 → 현대, 그 외 영문시작 → OEM, 8로 시작하는 숫자 → OEM,
 * 나머지 숫자 시작 → 미분류.
 * 예: H3240·H2533·H27DF·H32C·H32DF → 현대 / 8164 → OEM / DK20·KX1·DC17 → OEM
 */
export function classifyCustomer(productName: string | undefined | null): CustomerCategory {
  if (!productName) return "미분류";
  const trimmed = productName.trim().toUpperCase();
  if (trimmed.length === 0) return "미분류";

  if (/^H\d/.test(trimmed)) return "현대";
  if (/^[A-Z]/.test(trimmed)) return "OEM";
  if (/^8/.test(trimmed)) return "OEM";
  if (/^\d/.test(trimmed)) return "미분류";
  return "미분류";
}

export const CLASSIFICATION_RULES_TEXT = [
  "H 다음에 숫자가 나오면 → 현대 (예: H3240, H2533, H27DF, H32C, H32DF)",
  "숫자 8로 시작하면 → OEM (예: 8164)",
  "그 외 영문으로 시작하면 → OEM (예: DK20, KX1, DC17)",
  "추가 규칙을 받지 않은 숫자 시작 제품 → 미분류",
];
