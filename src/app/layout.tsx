import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CMMC Genie - AI-Powered Compliance Tracking",
  description: "Your AI-powered companion for CMMC compliance journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
