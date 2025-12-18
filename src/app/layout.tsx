import type { Metadata } from 'next';
import './globals.scss';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
