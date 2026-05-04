import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "LumeScan | Professional Code Security Audits",
  description: "Secure your codebase with LumeScan. Friendly, professional security audits for GitHub repositories. Detect vulnerabilities and remediate risks with AI-powered insights.",
  keywords: ["security audit", "vulnerability scanner", "github security", "code analysis", "cybersecurity"],
  authors: [{ name: "LumeScan Team" }],
  openGraph: {
    title: "LumeScan | Professional Code Security Audits",
    description: "Automated Deep-Cycle Security Audits for Modern Infrastructure.",
    url: "https://lumescan.ai",
    siteName: "LumeScan",
    images: [
      {
        url: "/images/hero-illustration.png",
        width: 1200,
        height: 630,
        alt: "LumeScan Security Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        {children}
      </body>
    </html>
  );
}
