import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://es-3890-website.vercel.app"),
  title: "Mingyang Jiang | Research Portfolio",
  description: "Research portfolio of Mingyang Jiang, focused on EEG / NeuroAI, clinical NLP, and reliable evaluation of AI systems.",
  openGraph: {
    title: "Mingyang Jiang | Research Portfolio",
    description: "Research portfolio of Mingyang Jiang, focused on EEG / NeuroAI, clinical NLP, and reliable evaluation of AI systems.",
    url: "https://es-3890-website.vercel.app",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
