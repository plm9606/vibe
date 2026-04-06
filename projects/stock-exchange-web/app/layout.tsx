import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL('https://mijang.vercel.app'),
  title: {
    default: "미장 환율 계산기 - 환율 고려 미국 주식 손익분기 계산",
    template: "%s | 미장 환율 계산기",
  },
  description: "환율이 높을 때 미국 주식을 사면 손해일까? 실시간 환율과 주가 데이터로 손익분기 주가를 계산해보세요. 한국 투자자를 위한 무료 환율 손익분기 계산기.",
  keywords: ["미국 주식", "환율 계산기", "손익분기", "달러 환율", "미장", "해외 주식 투자", "환율 손익", "주식 계산기"],
  authors: [{ name: "미장 환율 계산기" }],
  creator: "미장 환율 계산기",
  publisher: "미장 환율 계산기",
  alternates: {
    canonical: "https://mijang.vercel.app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "미장 환율 계산기",
  url: "https://mijang.vercel.app",
  description: "환율이 높을 때 미국 주식을 사면 손해일까? 실시간 환율과 주가 데이터로 손익분기 주가를 계산해보세요.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9703211255586228"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
