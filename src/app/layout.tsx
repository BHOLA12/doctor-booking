import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ClinikBook — Book Doctors, Order Medicines & Lab Tests",
    template: "%s | ClinikBook",
  },
  description:
    "India's smartest healthcare platform. Book verified doctors, order medicines in 30 mins, upload prescriptions, and track your health — all in one place.",
  keywords: [
    "doctor appointment booking",
    "online doctor consultation",
    "order medicines online",
    "book lab tests",
    "find specialist doctor",
    "healthcare platform India",
    "telemedicine",
    "ClinikBook",
  ],
  authors: [{ name: "ClinikBook Health" }],
  creator: "ClinikBook Health",
  metadataBase: new URL("https://clinikbook.health"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://clinikbook.health",
    siteName: "ClinikBook",
    title: "ClinikBook — Book Doctors, Order Medicines & Lab Tests",
    description:
      "India's smartest healthcare platform. Book verified doctors, order medicines in 30 mins, upload prescriptions, and track your health.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClinikBook — Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClinikBook — Book Doctors, Order Medicines & Lab Tests",
    description: "India's smartest healthcare platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
