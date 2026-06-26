import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "link-in-bio — SNSリンク集約ページ",
  description:
    "Linktreeの完全OSS代替。SNSプロフィールのリンクを一ページにまとめて、Vercel + Supabaseで自分のインフラに展開できます。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://link-in-bio-oss.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
