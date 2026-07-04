import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RRG Group Dashboard',
  description: 'Weekly dealership performance dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
