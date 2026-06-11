"use client";

import { ReactNode } from "react";

interface TrackableLinkProps {
  href: string;
  targetId: string;
  targetType: "VENUE" | "SERVICE";
  vendorId?: string | null;
  children: ReactNode;
  className?: string;
}

/**
 * TrackableLink - Registra clicks antes de redirigir al sitio externo
 *
 * Uso:
 * <TrackableLink
 *   href={venue.website}
 *   targetId={venue.id}
 *   targetType="VENUE"
 *   vendorId={venue.vendorId}
 * >
 *   <Button>Visit Website</Button>
 * </TrackableLink>
 */
export default function TrackableLink({
  href,
  targetId,
  targetType,
  vendorId,
  children,
  className,
}: TrackableLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const endpoint = `${apiUrl}/api/track-click`;

    // Prepare the data
    const data = {
      targetId,
      targetType,
      vendorId: vendorId || null,
    };

    console.log("🎯 Click tracking:", { targetId, targetType, vendorId });

    // DEFINITIVE SOLUTION: Use fetch with keepalive + small delay
    // The delay ensures the POST is sent before the redirect
    const trackingPromise = fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
      mode: "cors",
    })
      .then((res) => {
        if (res.ok) {
          console.log("✅ Click tracked successfully");
        } else {
          console.warn("⚠️ Click tracking failed:", res.status);
        }
      })
      .catch((err) => {
        console.error("❌ Click tracking error:", err);
      });

    // Small delay (50ms) to ensure the POST is sent
    // It's imperceptible to the user but sufficient for the browser
    await Promise.race([
      trackingPromise,
      new Promise((resolve) => setTimeout(resolve, 50)),
    ]);

    // Redirect after the minimal delay
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{ cursor: "pointer" }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
    >
      {children}
    </div>
  );
}
