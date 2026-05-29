import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Virtual Piano',
  description: 'Virtual piano / synthesizer powered by Tone.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
