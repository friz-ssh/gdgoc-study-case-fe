import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "@fontsource-variable/google-sans-flex";
import "@fontsource-variable/inter";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar, NavbarFallback } from "@/components/layout/navbar";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: {
    default: "GDGoC UGM — Big ideas. Built together.",
    template: "%s — GDGoC UGM",
  },
  description:
    "Google Developer Groups on Campus, Universitas Gadjah Mada: a student community for curious minds to learn, connect, and build technology that matters.",
  applicationName: "GDGoC UGM",
  openGraph: {
    title: "GDGoC UGM — Big ideas. Built together.",
    description:
      "A place for curious minds at Universitas Gadjah Mada to learn, connect, and build technology that matters.",
    type: "website",
    locale: "en_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-3 focus:text-white"
          >
            Skip to content
          </a>
          <Suspense fallback={<NavbarFallback />}>
            <Navbar />
          </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
