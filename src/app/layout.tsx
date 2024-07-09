import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";
import { InstallmentsProvider } from "@/context/InstallmentsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sábio Financeiro",
  description: "Cuidando do seu dinheiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InstallmentsProvider>
          <ClientLayout>{children}</ClientLayout>
        </InstallmentsProvider>
      </body>
    </html>
  );
}
