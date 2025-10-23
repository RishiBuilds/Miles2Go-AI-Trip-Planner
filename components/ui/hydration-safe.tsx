"use client";
import { useEffect, useState } from "react";

interface HydrationSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HydrationSafe component prevents hydration mismatches by only rendering
 * children after the component has mounted on the client side.
 * This is useful for components that use browser-specific APIs or
 * when browser extensions modify the DOM.
 */
export function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if component is mounted (client-side)
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
