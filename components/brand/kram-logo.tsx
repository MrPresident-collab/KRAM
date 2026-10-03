import { type SVGProps } from "react";

export function KramLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 236 56" role="img" aria-label="KRAM — Kore Remote Asset Management" className={className} {...props}>
      <rect x="2" y="7" width="42" height="42" rx="11" fill="var(--kram-charcoal)" />
      <path d="M13 17h5v22h-5z" fill="var(--kram-orange)" />
      <path d="M18 28 31 17h7L24 28l14 11h-7L18 31z" fill="var(--kram-orange)" />
      <text x="55" y="39" fill="var(--kram-charcoal)" fontFamily="Trebuchet MS, Arial Narrow, Arial, sans-serif" fontSize="34" fontWeight="900" letterSpacing="1.5">KRAM</text>
    </svg>
  );
}
