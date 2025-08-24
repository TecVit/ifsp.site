import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const fontCustom = Arimo({
  variable: "--font-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IFSP Araraquara",
  description: "Website criado por Vitor Silva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${fontCustom.variable}`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
