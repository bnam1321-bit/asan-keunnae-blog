import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import FloatingBar from "./components/FloatingBar";
import Footer from "./components/Footer";

// 구조화 데이터 (Schema.org JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "아산큰내과",
  "image": "https://asan-keunnae.co.kr/logo.png",
  "url": "https://asan-keunnae.co.kr",
  "telephone": "032-567-0750",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "인천 서구 검단로 469 4층, 5층",
    "addressLocality": "Incheon",
    "postalCode": "22724",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.537,
    "longitude": 126.676
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:30",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:30",
      "closes": "13:30"
    }
  ],
  "medicalSpecialty": "InternalMedicine"
};

// Noto Sans KR - 한글 최적화 웹폰트
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://asan-keunnae.co.kr'),
  title: "아산큰내과 | 인천 서구 소화기내과 전문",
  description: "인천 서구 아산큰내과, 여성소화기내과 및 신장내과 전문의 진료, 위대장내시경, 건강검진 안내.",
  keywords: "인천 서구 내과, 인천서구내과, 검단신도시내과, 검단내과, 아산큰내과, 건강검진, 위내시경, 대장내시경",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <FloatingBar />
      </body>
    </html>
  );
}
