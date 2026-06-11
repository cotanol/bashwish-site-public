"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TrackableLinkProps {
  href: string;
  venueId?: string; // Keep for backward compatibility but not used
  clickType?: string; // Keep for backward compatibility but not used
  children: React.ReactNode;
  variant?:
    | "golden"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "golden" | "default" | "sm" | "lg" | "icon";
  className?: string;
  external?: boolean;
}

export default function TrackableLink({
  href,
  children,
  variant = "golden",
  size = "golden",
  className = "",
  external = false,
}: TrackableLinkProps) {
  if (external) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
