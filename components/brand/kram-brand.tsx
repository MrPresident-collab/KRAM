import Link from "next/link";

type KramBrandProps = {
  locale?: string;
  compact?: boolean;
  href?: string;
};

export function KramBrand({ locale = "en", compact = false, href }: KramBrandProps) {
  const destination = href ?? `/${locale}/ops`;
  return (
    <Link href={destination} className={`group inline-flex items-center ${compact ? "gap-2" : "gap-3"}`} aria-label="KRAM — Kore Remote Asset Management">
      <span className={`${compact ? "h-9 w-9" : "h-10 w-10"} grid shrink-0 place-items-center rounded-xl bg-[var(--kram-deep)] text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5`}>
        <svg viewBox="0 0 40 40" className="h-full w-full p-2" aria-hidden="true">
          <path d="M7 8v24M7 20l14-12M7 20l14 12M24 8v24M24 20h9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </span>
      {!compact && (
        <span className="min-w-0">
          <span
            className="block text-[25px] font-black leading-none tracking-[-0.085em] text-[var(--kram-deep)]"
            style={{ fontFamily: '"Arial Black", "Trebuchet MS", ui-sans-serif, sans-serif' }}
          >
            KRAM
          </span>
          <span className="mt-1 block whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--kram-metal)]">
            Kore Remote Asset Management
          </span>
        </span>
      )}
    </Link>
  );
}
