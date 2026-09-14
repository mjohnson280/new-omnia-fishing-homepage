import type { Metadata } from 'next';
import './globals.css';

// Site-wide defaults only. Every prototype route sets its own metadata.
export const metadata: Metadata = {
  title: 'Never9 Test Site',
  description: 'A test environment for Never9.ai prototypes.',
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
