"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Card ---------- */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card border border-line shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- StatCard ---------- */

const ACCENTS: Record<string, string> = {
  brand: "bg-brand/25 text-brand-ink",
  sky: "bg-sky-soft text-sky-700",
  sun: "bg-sun-soft text-amber-700",
  mint: "bg-mint-soft text-lime-800",
  coral: "bg-coral-soft text-rose-700",
};

export function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "sky",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: keyof typeof ACCENTS | string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl",
            ACCENTS[accent] ?? ACCENTS.sky,
          )}
        >
          {icon}
        </span>
        <span className="text-sm font-medium text-muted">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </Card>
  );
}

/* ---------- Badge ---------- */

const BADGE: Record<string, string> = {
  neutral: "bg-line text-muted",
  brand: "bg-brand/30 text-brand-ink",
  sky: "bg-sky-soft text-sky-700",
  sun: "bg-sun-soft text-amber-700",
  mint: "bg-mint-soft text-lime-800",
  coral: "bg-coral-soft text-rose-700",
};

export function Badge({
  children,
  color = "neutral",
  className,
}: {
  children: ReactNode;
  color?: keyof typeof BADGE;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        BADGE[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Button ---------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BTN: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand-strong border border-transparent",
  secondary: "bg-card text-ink border border-line hover:bg-page",
  ghost: "bg-transparent text-muted hover:bg-line border border-transparent",
  danger: "bg-coral-soft text-rose-700 hover:bg-coral hover:text-white border border-transparent",
};

const baseBtn =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cn(baseBtn, BTN[variant], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  children,
}: {
  variant?: ButtonVariant;
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(baseBtn, BTN[variant], className)}>
      {children}
    </Link>
  );
}

export function IconButton({
  className,
  title,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      title={title}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg border border-line bg-card text-muted transition-colors hover:bg-page hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- PageHeader ---------- */

export function PageHeader({
  title,
  subtitle,
  actions,
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-ink">{icon}</span>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- ChartCard ---------- */

export function ChartCard({
  title,
  action,
  children,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

/* ---------- EmptyState ---------- */

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-page/50 py-12 text-sm text-muted">
      {children}
    </div>
  );
}
