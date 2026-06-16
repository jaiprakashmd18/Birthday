import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Happy 20th Birthday Meenu ✨',
  description: 'A cinematic birthday experience for Meenu\'s 20th birthday - August 9, 2026',
  openGraph: {
    title: 'Happy 20th Birthday Meenu ✨',
    description: 'A cinematic birthday experience celebrating Meenu\'s 20th birthday',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#030014" />
      </head>
      <body className="bg-[#030014] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
