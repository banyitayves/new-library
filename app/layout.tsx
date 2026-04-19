import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GS Busanza - Library Management System',
  description: 'Advanced library management system for GS Busanza School',
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#1e3a8a',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="GS Busanza School Library Management System" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
