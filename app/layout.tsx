import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./study.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

export function generateMetadata(): Metadata {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  const description = "Seu espaço de revisão: resumos, flashcards e simulados de Engenharia da Computação.";

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
