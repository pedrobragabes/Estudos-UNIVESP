import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const description = "Disciplinas, prazos, notas e progresso em um só lugar.";

  return {
    metadataBase,
    title: "Estudos UNIVESP",
    description,
    applicationName: "Estudos UNIVESP",
    openGraph: {
      title: "Estudos UNIVESP",
      description,
      type: "website",
      locale: "pt_BR",
      images: [{ url: "/og.png", width: 1744, height: 907, alt: "Estudos UNIVESP — organizador acadêmico" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Estudos UNIVESP",
      description,
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
