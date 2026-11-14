
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

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
    default: "Salon & Clinic Booking | Book Appointments Online",
    template: "%s | Salon & Clinic Booking",
  },
  description:
    "Discover salon and beauty clinic services and book your appointment online in Rawalpindi, Pakistan.",
  applicationName: "Salon & Clinic Booking",
  keywords: [
    "salon booking",
    "online salon appointments",
    "beauty clinic booking",
    "salon Rawalpindi",
    "beauty services Rawalpindi",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Salon & Clinic Booking",
    title: "Salon & Clinic Booking",
    description:
      "Book salon and beauty clinic appointments online in Rawalpindi, Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salon & Clinic Booking",
    description:
      "Book salon and beauty clinic appointments online in Rawalpindi, Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
