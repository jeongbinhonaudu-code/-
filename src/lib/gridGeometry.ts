export const GRID_COLS = 12;
export const GRID_ROWS = 23;

export function parseSpan(span: string): [number, number] {
  const [a, b] = span.split("/").map((s) => parseInt(s.trim(), 10));
  return [a, b];
}

export function zoneCenterPct(gridColumn: string, gridRow: string) {
  const [c1, c2] = parseSpan(gridColumn);
  const [r1, r2] = parseSpan(gridRow);
  const x = (((c1 + c2) / 2 - 1) / GRID_COLS) * 100;
  const y = (((r1 + r2) / 2 - 1) / GRID_ROWS) * 100;
  return { x, y };
}

export function zoneBottomCenterPct(gridColumn: string, gridRow: string) {
  const [c1, c2] = parseSpan(gridColumn);
  const [, r2] = parseSpan(gridRow);
  const x = (((c1 + c2) / 2 - 1) / GRID_COLS) * 100;
  const y = ((r2 - 1) / GRID_ROWS) * 100;
  return { x, y };
}

export function zoneTopCenterPct(gridColumn: string, gridRow: string) {
  const [c1, c2] = parseSpan(gridColumn);
  const [r1] = parseSpan(gridRow);
  const x = (((c1 + c2) / 2 - 1) / GRID_COLS) * 100;
  const y = ((r1 - 1) / GRID_ROWS) * 100;
  return { x, y };
}

export function colCenterPct(gridColumn: string) {
  const [c1, c2] = parseSpan(gridColumn);
  return (((c1 + c2) / 2 - 1) / GRID_COLS) * 100;
}

// 격자 선(grid line) 좌표를 퍼센트로 변환 — 동선 안내선을 구역 테두리를 따라 그릴 때 사용
export function linePct(col: number, row: number) {
  return { x: ((col - 1) / GRID_COLS) * 100, y: ((row - 1) / GRID_ROWS) * 100 };
}
