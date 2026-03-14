import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";

const manrope = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "DigitalPylot RBAC",
  description: "Production-ready RBAC platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="page-gradient grid-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
