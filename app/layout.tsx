import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/contexts/AuthContext";
import DesktopHeader from "@/components/DesktopHeader";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neswear",
  description: "Men's fashion e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <DesktopHeader />
          <MobileHeader />

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
