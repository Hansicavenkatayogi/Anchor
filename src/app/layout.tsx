import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anchor',
  description: 'A support system for children from single-parent or no-parent families.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
