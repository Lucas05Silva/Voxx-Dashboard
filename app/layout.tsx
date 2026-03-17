import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'VOXX AI ANALYTICS',
  description: 'Plataforma de análise executiva e inteligência artificial para provedores de internet.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="font-sans">
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
