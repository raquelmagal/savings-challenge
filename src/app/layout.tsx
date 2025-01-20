import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/contexts/AuthContext";
import vaultIcon from '@/assets/icons/favicon.ico';

import "./globals.scss";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Desafio Depósitos",
  description: "Desafio Depósitos",
  icons: {
    icon: vaultIcon.src,
    shortcut: vaultIcon.src,
    apple: vaultIcon.src,
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: vaultIcon.src,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
