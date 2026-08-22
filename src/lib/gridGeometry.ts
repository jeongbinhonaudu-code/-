export const GRID_COLS = 12;
export const GRID_ROWS = 24;

function parseSpan(span: string): [number, number] {
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
