import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AUTOCHORD — Intelligent Guitar Chords & Lyrics Engine",
    template: "%s | AutoChord",
  },
  description:
    "AutoChord is a premium music-tech platform that generates perfectly aligned chords and lyrics with instant transposition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen bg-[#08090f] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,231,255,0.18),transparent_45%),radial-gradient(circle_at_20%_35%,rgba(184,255,62,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,223,108,0.08),transparent_45%)]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
