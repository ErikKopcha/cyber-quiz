import { AuthProvider } from '@/presentation/components/providers/AuthProvider';
import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.scss';

// Cyberpunk fonts
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CyberQuiz - IT Technical Interview Platform',
  description: 'Master Senior Frontend interviews with our cyberpunk-themed quiz platform',
  keywords: ['React', 'TypeScript', 'Frontend', 'Interview', 'Quiz', 'Next.js'],
  authors: [{ name: 'Quiz-It Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#06b6d4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable}`}>
      <body className={rajdhani.className} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
