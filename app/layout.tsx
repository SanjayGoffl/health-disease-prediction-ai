import type { Metadata } from "next";
import { Outfit, Urbanist } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthPredict | Pro Max",
  description: "Predict health risks using daily lifestyle data with AI-powered analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${urbanist.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
