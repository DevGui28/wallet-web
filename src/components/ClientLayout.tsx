"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noHeaderPaths = ["/sign-in", "/sign-up", "/auth"];

  const shouldRenderHeader = !noHeaderPaths.some((path) => pathname.includes(path));

  return (
    <>
      {shouldRenderHeader && <Header />}
      {children}
    </>
  );
}