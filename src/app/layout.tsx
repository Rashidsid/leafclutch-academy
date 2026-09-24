import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Leafclutch Academy | AI, Data, Development & Design Training in Nepal",
    template: "%s | Leafclutch Academy",
  },
  description:
    "Three-month, project-based IT training in Nepal: Agentic AI, Generative AI, AI/ML, Data Science, Data Analytics, Python, MERN, Frontend, Backend, Ethical Hacking, UI/UX and Graphic Design. Online, Hybrid or Physical at the same fee.",
  keywords: [
    "IT training Nepal",
    "AI course Nepal",
    "Data Science course Nepal",
    "MERN stack training",
    "Python course Butwal",
    "Leafclutch Academy",
    "Siddharthanagar IT training",
  ],
  openGraph: {
    type: "website",
    siteName: "Leafclutch Academy",
    locale: "en_NP",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#072069",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
