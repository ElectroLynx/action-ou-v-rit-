import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Action ou Vérité - Jeu d\'Ambiance Glow',
  description: 'Un jeu d\'ambiance interactif, moderne et haut en couleur pour des soirées mémorables en famille ou entre amis.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className={`${plusJakarta.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-[#0b0c1b] text-slate-100 antialiased font-sans min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
