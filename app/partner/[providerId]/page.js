"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Redirect /partner/[providerId] to /partner/[providerId]/editor
export default function PartnerProviderRedirect() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId;

  useEffect(() => {
    router.replace(`/partner/${providerId}/editor`);
  }, [providerId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
    </div>
  );
}
