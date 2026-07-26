import type { Metadata } from "next";
import { Geist, DM_Serif_Display } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { ConditionalFooter } from "@/components/shared/conditional-footer";
import { Toaster } from "sonner";
import { SidebarConfigProvider } from "@/hooks/sidebar-contex";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Catalogly",
  description: "Plataforma de catálogo online para vendedores y productos",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.className} ${dmSerif.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarConfigProvider>

          <Suspense>
            <Navbar />
          </Suspense>
          {children}
          <Suspense>
            <ConditionalFooter />
          </Suspense>
          <Toaster />
          </SidebarConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
