import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Omnia Fishing | Plan smarter. Fish better.',
  description:
    'Map-based fishing planning, local fishing reports, and contextual tackle shopping in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
