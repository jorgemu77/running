"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  Route,
  Trophy,
  Footprints,
  Menu,
  X,
  ChevronDown,
  CircleUser,
} from "lucide-react";
import { cn } from "./ui";

type NavChild = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { label: "Kilómetros", href: "/kilometros", icon: <Route size={19} /> },
  {
    label: "Carreras",
    href: "/carreras",
    icon: <Trophy size={19} />,
    children: [
      { label: "Todas", href: "/carreras" },
      { label: "Populares", href: "/carreras/populares" },
      { label: "Medias", href: "/carreras/medias" },
      { label: "Maratones", href: "/carreras/maratones" },
    ],
  },
  { label: "Zapatillas", href: "/zapatillas", icon: <Footprints size={19} /> },
];

function esActiva(pathname: string, href: string): boolean {
  if (href === "/carreras") return pathname === "/carreras";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const seccionActiva = pathname.startsWith(item.href);
        const directaActiva = esActiva(pathname, item.href);
        return (
          <div key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                directaActiva || (item.children && seccionActiva)
                  ? "bg-brand text-brand-ink"
                  : "text-muted hover:bg-line hover:text-ink",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.children && (
                <ChevronDown
                  size={15}
                  className={cn("ml-auto transition-transform", seccionActiva && "rotate-180")}
                />
              )}
            </Link>

            {item.children && seccionActiva && (
              <div className="mt-1 ml-5 flex flex-col gap-0.5 border-l border-line pl-3">
                {item.children.map((child) => {
                  const activa = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm transition-colors",
                        activa
                          ? "font-semibold text-ink"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-ink">
        <Activity size={20} strokeWidth={2.5} />
      </span>
      <span className="text-[15px] font-bold leading-tight tracking-tight">
        Running <span className="font-extrabold">TRACKER</span>
      </span>
    </div>
  );
}

function UserChip() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-page/60 p-3">
      <CircleUser size={32} className="text-muted" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">jorgemu77</div>
        <div className="truncate text-xs text-muted">Sesión iniciada</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar el drawer al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-line bg-card p-5 lg:flex">
        <Logo />
        <NavContent />
        <UserChip />
      </aside>

      {/* Barra superior (móvil) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Drawer (móvil) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col gap-6 bg-card p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-line text-ink"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>
            <NavContent onNavigate={() => setOpen(false)} />
            <UserChip />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
