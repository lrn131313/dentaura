import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "DentAura | Clinica Dentara Premium in Bucuresti",
    template: "%s | DentAura",
  },
  description:
    "DentAura - clinica dentara moderna in Bucuresti. Oferim servicii de implantologie, ortodontie, estetica dentara si protetica cu tehnologie de ultima generatie. Programeaza-te online acum!",
  keywords: [
    "clinica dentara",
    "dentist Bucuresti",
    "implant dentar",
    "ortodontie",
    "estetica dentara",
    "protetica dentara",
    "albire dinti",
    "consultatie dentara",
    "stomatologie",
    "DentAura",
  ],
  authors: [{ name: "DentAura" }],
  creator: "DentAura",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://dentaura.ro",
    siteName: "DentAura",
    title: "DentAura | Clinica Dentara Premium in Bucuresti",
    description:
      "Clinica dentara moderna cu servicii complete: implantologie, ortodontie, estetica dentara si protetica. Programeaza-te online!",
  },
  twitter: {
    card: "summary_large_image",
    title: "DentAura | Clinica Dentara Premium in Bucuresti",
    description:
      "Clinica dentara moderna cu servicii complete: implantologie, ortodontie, estetica dentara si protetica.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
