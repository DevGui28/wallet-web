"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { AuthProvider } from "@/hooks/useAuth";
import { InstallmentsProvider } from "@/context/InstallmentsContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noHeaderPaths = ["/login", "/sign-up"];

  const shouldRenderHeader = !noHeaderPaths.some((path) =>
    pathname.includes(path),
  );

  return (
    <AuthProvider>
      <InstallmentsProvider>
        {shouldRenderHeader && <Header />}
        {children}
      </InstallmentsProvider>
    </AuthProvider>
  );
}
