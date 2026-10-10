import Image from "next/image";
import Link from "next/link";

type KramBrandProps = {
  locale?: string;
  compact?: boolean;
  href?: string;
  className?: string;
  logoClassName?: string;
};

export function KramBrand({ locale = "en", compact = false, href, className = "", logoClassName = "" }: KramBrandProps) {
  const destination = href ?? `/${locale}/ops`;
  return (
    <Link
      href={destination}
      className={`group inline-flex items-center ${className}`}
      aria-label="KRAM — Kore Remote Asset Management"
    >
      <Image
        src={compact ? "/brand/kram-mark.svg" : "/brand/kram-logo.svg"}
        alt="KRAM — Kore Remote Asset Management"
        width={compact ? 40 : 186}
        height={compact ? 10 : 57}
        priority
        className={`${compact ? "h-auto w-10 shrink-0" : "h-auto w-[186px] shrink-0"} ${logoClassName}`} style={{ width: compact ? 40 : 186, height: "auto", objectFit: "contain" }}
      />
    </Link>
  );
}
