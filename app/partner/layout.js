"use client";

import { PartnerAuthProvider } from "@/contexts/PartnerAuthContext";

export default function PartnerLayout({ children }) {
  return <PartnerAuthProvider>{children}</PartnerAuthProvider>;
}
