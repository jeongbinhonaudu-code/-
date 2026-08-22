import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "공정·품질 통합 관리 시스템",
  description: "1공장 실시간 조감도 기반 제조공정·품질 통합 관리 웹 애플리케이션",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        <TopNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
