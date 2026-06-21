import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roshan Patil — AI Engineer & Full Stack Developer",
  description:
    "Salesforce Developer transitioning into AI Engineering. Building Web3, Full Stack, and AI-powered products.",
  keywords: ["AI Engineer", "Salesforce Developer", "Web3", "Solana", "Full Stack", "FDE"],
  authors: [{ name: "Roshan Patil" }],
  openGraph: {
    title: "Roshan Patil — AI Engineer & Full Stack Developer",
    description: "Building at the intersection of AI, Web3, and Salesforce.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="noise">{children}</body>
    </html>
  );
}
