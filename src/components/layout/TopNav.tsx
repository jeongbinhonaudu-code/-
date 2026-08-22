"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Factory, Menu, X, ChevronDown } from "lucide-react";

const primaryLinks = [
  { href: "/", label: "대시보드" },
  { href: "/factory/1", label: "1공장" },
  { href: "/factory/2", label: "2공장" },
  { href: "/quality", label: "품질 순회점검" },
  { href: "/travelers", label: "트레블러 관리" },
  { href: "/analysis", label: "생산 분석" },
  { href: "/simulation", label: "시뮬레이션" },
];

const moreLinks = [
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
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b1a33]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b1a33]/90">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/20 text-sky-400">
            <Factory size={18} />
          </span>
          <span className="hidden text-sm font-bold tracking-tight text-white sm:block">
            공정·품질 통합 관제
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
            >
              더보기 <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-700 bg-[#0f2244] py-1 shadow-xl">
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <UserMenu />
          <button
            className="rounded-md p-2 text-slate-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-800 bg-[#0b1a33] px-3 py-2 lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {[...primaryLinks, ...moreLinks].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  isActive(l.href) ? "bg-sky-500/20 text-sky-300" : "text-slate-300 hover:bg-white/5"
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

function UserMenu() {
  const [open, setOpen] = useState(false);
  const roles = ["관리자", "품질팀", "생산팀", "조회 사용자"];
  const [role, setRole] = useState(roles[0]);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
          {role[0]}
        </span>
        <span className="hidden sm:inline">{role}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-slate-700 bg-[#0f2244] py-1 shadow-xl">
          <div className="px-3 py-1 text-[10px] text-slate-400">권한 미리보기 (예시)</div>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={clsx(
                "block w-full px-3 py-1.5 text-left text-sm hover:bg-white/5",
                r === role ? "text-sky-300" : "text-slate-200"
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
