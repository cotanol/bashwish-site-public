interface TrackableContactLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Simple contact link for email and phone
 * Usage: <TrackableContactLink href="mailto:...">...</>
 */
export default function TrackableContactLink({
  href,
  children,
  className = "",
}: TrackableContactLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
