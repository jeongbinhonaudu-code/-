"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  Factory,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  Map,
  ShieldCheck,
  FileStack,
  BarChart3,
  Sparkles,
  Bell,
  Settings,
} from "lucide-react";

const primaryLinks = [
  { href: "/", label: "대시보드", icon: LayoutGrid },
  { href: "/factory", label: "공장 조감도", icon: Map },
  { href: "/quality", label: "품질 순회점검", icon: ShieldCheck },
  { href: "/travelers", label: "트레블러 관리", icon: FileStack },
  { href: "/analysis", label: "생산 분석", icon: BarChart3 },
];

const moreLinks = [
  { href: "/simulation", label: "시뮬레이션" },
  { href: "/equipment", label: "설비현황" },
  { href: "/products", label: "진행제품" },
  { href: "/defects", label: "불량·재작업" },
  { href: "/reports", label: "보고서" },
  { href: "/master-data", label: "기준정보" },
  { href: "/users", label: "사용자·권한" },
  { href: "/settings", label: "시스템 설정" },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-white">
            <Factory size={18} />
          </span>
          <span className="hidden text-[15px] font-bold tracking-tight text-[#111827] sm:block">
            공정·품질 통합 관제
          </span>
        </Link>

        <nav className="ml-2 hidden flex-1 items-center gap-1 overflow-x-auto rounded-2xl bg-[#f1f3f5] p-1 lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-all",
                isActive(l.href)
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#64748b] hover:bg-white/60 hover:text-[#111827]"
              )}
            >
              <l.icon size={15} />
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold text-[#64748b] hover:bg-white/60 hover:text-[#111827]"
            >
              더보기 <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg">
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <IconButton active title="AI 인사이트">
            <Sparkles size={16} />
          </IconButton>
          <IconButton title="알림">
            <Bell size={16} />
          </IconButton>
          <IconButton title="설정">
            <Settings size={16} />
          </IconButton>
          <UserMenu />
          <button
            className="rounded-xl p-2 text-[#334155] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[#e5e7eb] bg-white px-3 py-2 lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {[...primaryLinks.map((l) => ({ href: l.href, label: l.label })), ...moreLinks].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-xl px-3 py-2 text-sm font-medium",
                  isActive(l.href) ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#334155] hover:bg-[#f1f5f9]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function IconButton({
  children,
  title,
  active,
}: {
  children: React.ReactNode;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      className={clsx(
        "hidden h-9 w-9 items-center justify-center rounded-xl border transition-colors sm:flex",
        active
          ? "border-[#111827] bg-[#111827] text-white"
          : "border-[#e5e7eb] bg-white text-[#64748b] hover:bg-[#f1f5f9]"
      )}
    >
      {children}
    </button>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const roles = ["관리자", "품질팀", "생산팀", "조회 사용자"];
  const [role, setRole] = useState(roles[0]);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 rounded-2xl border border-[#e5e7eb] bg-white py-1 pl-1 pr-2.5 text-xs font-medium text-[#334155] hover:bg-[#f8fafc]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2563eb] text-[11px] font-bold text-white">
          {role[0]}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[13px] font-semibold text-[#111827]">{role}</span>
        </span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg">
          <div className="px-3 py-1 text-[10px] text-[#94a3b8]">권한 미리보기 (예시)</div>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={clsx(
                "block w-full px-3 py-1.5 text-left text-sm hover:bg-[#f1f5f9]",
                r === role ? "font-semibold text-[#2563eb]" : "text-[#334155]"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
