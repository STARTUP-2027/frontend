import type { Metadata, Viewport } from "next";
import "../src/index.css";
import { Providers } from "./providers";
import AstraPlatformWidget from "../src/app/components/AstraPlatformWidget";

export const metadata: Metadata = {
  title: "Astra Academy | Engineering & AI Masterclasses",
  description:
    "Dynamic multi-modal course authoring, 620+ pattern DSA sheets, autonomous agent pipelines, and contest arenas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <Providers>
          {children}
          <AstraPlatformWidget />
        </Providers>
      </body>
    </html>
  );
}
