import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
