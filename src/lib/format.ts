// 서버(Node ICU)와 브라우저의 Intl 로케일 데이터가 달라 toLocaleString("ko-KR")이
// 하이드레이션 불일치를 일으킬 수 있어, 직접 포맷팅해 서버/클라이언트 출력을 고정한다.
function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "확인 필요";
  const hours24 = d.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${period} ${hours12}:${pad(d.getMinutes())}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "확인 필요";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}
