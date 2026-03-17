import type {Metadata} from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'VOXX AI ANALYTICS',
  description: 'Plataforma de análise executiva e inteligência artificial para provedores de internet.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} font-sans`}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
