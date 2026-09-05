import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "공정·품질 통합 관리 시스템",
  description: "공장 실시간 통합 조감도 기반 제조공정·품질 통합 관리 웹 애플리케이션",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f4f6f8] text-[#111827]">
        <TopNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
