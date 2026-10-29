/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { cn } from "@/lib/utils";

/* Logo oficial MAVA Studio:
   public/logo.svg       – siglă + text (fundal deschis)
   public/logo-white.svg – siglă + text alb (fundal închis)
   public/logo-mark.svg  – doar sigla */

export function LogoMark({ className }: { className?: string }) {
  return <img src="/logo-mark.svg" alt="" aria-hidden className={cn("h-10 w-auto", className)} />;
}

export function Logo({ href = "/", className, light = false }: { href?: string; className?: string; light?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center", className)} aria-label="MAVA Studio">
      <img src={light ? "/logo-white.svg" : "/logo.svg"} alt="MAVA Studio" className="h-10 w-auto" />
    </Link>
  );
}
