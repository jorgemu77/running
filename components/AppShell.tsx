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
  LogOut,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn, Button } from "./ui";
import { useAppStore } from "@/lib/store/AppStore";

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

function Avatar({ email, className }: { email: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand font-bold text-ink",
        className,
      )}
    >
      {(email?.[0] ?? "?").toUpperCase()}
    </span>
  );
}

function NavContent({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const seccionActiva = pathname.startsWith(item.href);
          const activa = esActiva(pathname, item.href) || (item.children && seccionActiva);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                "flex h-11 items-center justify-center rounded-2xl transition-colors",
                activa ? "bg-brand text-brand-ink" : "text-muted hover:bg-line hover:text-ink",
              )}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>
    );
  }

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
                        activa ? "font-semibold text-ink" : "text-muted hover:text-ink",
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

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link
      href="/kilometros"
      className={cn("flex items-center gap-2.5", collapsed ? "justify-center" : "px-1")}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink">
        <Activity size={20} strokeWidth={2.5} />
      </span>
      {!collapsed && (
        <span className="text-[15px] font-bold leading-tight tracking-tight">
          Running <span className="font-extrabold">TRACKER</span>
        </span>
      )}
    </Link>
  );
}

function UserChip({
  email,
  onSignOut,
  collapsed,
}: {
  email: string | null;
  onSignOut: () => void;
  collapsed?: boolean;
}) {
  const logoutBtn = (
    <button
      onClick={onSignOut}
      title="Cerrar sesión"
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-page hover:text-ink"
      aria-label="Cerrar sesión"
    >
      <LogOut size={16} />
    </button>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Avatar email={email} className="h-9 w-9 text-sm" />
        {logoutBtn}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-page/60 p-3">
      <Avatar email={email} className="h-9 w-9 text-sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{email ? email.split("@")[0] : "—"}</div>
        <div className="truncate text-xs text-muted">Sesión iniciada</div>
      </div>
      {logoutBtn}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { loading, userEmail, signOut } = useAppStore();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Cerrar el drawer al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Recordar el estado compacto del menú.
  useEffect(() => {
    if (localStorage.getItem("sidebar-collapsed") === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
      } catch {
        // ignorar
      }
      return next;
    });
  }

  // La página de login se muestra sin el armazón (sidebar, etc.).
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen">
      {/* Sidebar fijo (desktop) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col gap-6 border-r border-line bg-card transition-[width] lg:flex",
          collapsed ? "w-24 p-2.5" : "w-64 p-5",
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <Logo collapsed={collapsed} />
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menú" : "Compactar menú"}
            aria-label={collapsed ? "Expandir menú" : "Compactar menú"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-page hover:text-ink"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <NavContent collapsed={collapsed} />
        <UserChip email={userEmail} collapsed={collapsed} onSignOut={() => setConfirmLogout(true)} />
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
            <UserChip email={userEmail} onSignOut={() => setConfirmLogout(true)} />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <main className={cn("transition-[padding]", collapsed ? "lg:pl-24" : "lg:pl-64")}>
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center text-muted">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Popup de confirmación de cierre de sesión */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setConfirmLogout(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold tracking-tight">¿Estás seguro de cerrar la sesión?</h2>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={signOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
