// Root layout — required by Next.js App Router.
// Provides the <html> and <body> shell for ALL routes, including the 404 page.
// Sub-layouts (like app/(site)/layout.tsx) add their own wrappers on top of
// this WITHOUT repeating html/body — otherwise Next.js's DefaultLayout takes
// over and causes hydration mismatches.
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
