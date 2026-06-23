import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hermes OS Control Center",
  description: "Panel operativo de ONIA para servicios self-hosted, migracion, requisitos y control de riesgos.",
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
