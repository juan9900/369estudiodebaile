import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

type Variant = "primary" | "outline";
type Size = "md" | "sm";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-vino text-white hover:bg-vino-hover disabled:bg-line-2 disabled:text-muted2-2",
  outline:
    "border border-line-2 text-ink hover:border-vino hover:text-vino disabled:border-line-2 disabled:text-muted2-2",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-6 py-[15px] text-[15px] md:px-8 md:py-[18px] md:text-base",
  sm: "px-4 py-2.5 text-[13px]",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-sm font-bold transition-colors disabled:pointer-events-none";

interface LinkButtonProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Shared CTA element for the redesigned public pages: renders as a Next.js
 * Link for internal routes, a plain <a> for external/mailto/wa.me links, or
 * a <button> when `onClick` is passed instead of `href`.
 */
export function LinkButton({
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled = false,
  ariaLabel,
}: LinkButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (!href) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </button>
    );
  }

  const isExternal =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (disabled) {
    return (
      <span aria-disabled="true" className={classes}>
        {children}
      </span>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      {children}
    </Link>
  );
}
