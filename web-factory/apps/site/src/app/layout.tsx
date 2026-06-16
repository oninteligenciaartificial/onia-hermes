import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hermes ONIA Automation",
  description: "Panel web para la automatizacion n8n de ONIA, Telegram, Hermes y Video Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={readexPro.variable}>{children}</body>
    </html>
  );
}
